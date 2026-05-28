/**
 * GoalCaptcha Canvas Renderer
 *
 * Draws the CAPTCHA scene layer-by-layer:
 *  1. Background (stadium)
 *  2. Goal post
 *  3. Target ring
 *  4. Goalkeeper
 *  5. Ball (draggable)
 *  6. Decoy rings
 *  7. Overlay effects
 */

const IMAGE_CACHE = new Map()

/** Load an image and cache it. Returns a Promise<HTMLImageElement>. */
async function loadImage(src) {
  if (IMAGE_CACHE.has(src)) return IMAGE_CACHE.get(src)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => { IMAGE_CACHE.set(src, img); resolve(img) }
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/** Draw a filled regular pentagon centred at (cx, cy) with circumradius r. */
function _drawPentagon(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 90) * Math.PI / 180
    if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
    else         ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
  }
  ctx.closePath()
  ctx.fill()
}

export class SceneRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(canvas, captchaData) {
    this.canvas          = canvas
    this.ctx             = canvas.getContext('2d')
    this.data            = captchaData
    this.ballX           = captchaData.ball_start_x
    this.ballStartX      = captchaData.ball_start_x   // reference for arc interpolation
    this.keeperOffsetX   = captchaData.scene?.keeper_offset_x ?? 0
    this.images          = {}
    this.ready           = false

    // Place keeper on the opposite side of the goal from the target ring
    const cw = canvas.width
    const tX = captchaData.target_x ?? (cw * 0.65)
    this.keeperBaseX = tX >= cw * 0.50
      ? Math.round(cw * 0.26)   // target on right → keeper on left
      : Math.round(cw * 0.74)   // target on left  → keeper on right
  }

  async preload() {
    const assets = this.data.scene.assets ?? {}

    const entries = await Promise.allSettled(
      Object.entries(assets).map(async ([key, url]) => {
        const img = await loadImage(url)
        return [key, img]
      })
    )

    for (const result of entries) {
      if (result.status === 'fulfilled') {
        const [key, img] = result.value
        this.images[key] = img
      }
    }

    this.ready = true
    this.draw()
  }

  /** Update ball X position and redraw. Called during drag. */
  setBallX(x) {
    this.ballX = Math.max(0, Math.min(x, this.canvas.width))
    this.draw()
  }

  draw() {
    const { ctx, canvas, data } = this
    const { width, height }     = canvas

    ctx.clearRect(0, 0, width, height)

    this._drawBackground(width, height)
    this._drawGoalPost(width, height)
    this._drawDecoys(data.scene.decoys ?? [])
    this._drawTargetRing(data.target_x, height)
    this._drawGoalkeeper(data.scene, width, height)
    this._drawBall(height)
  }

  // ─── Layer renderers ─────────────────────────────────────────────────────

  _drawBackground(w, h) {
    const img = this.images.stadium
    if (img) {
      this.ctx.drawImage(img, 0, 0, w, h)
      return
    }
    const ctx = this.ctx

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.72)
    skyGrad.addColorStop(0,    '#4e9fc8')
    skyGrad.addColorStop(0.55, '#6ab9de')
    skyGrad.addColorStop(1,    '#88ccec')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, w, h * 0.72)

    // Stadium stand — left corner
    ctx.fillStyle   = 'rgba(58,118,178,0.38)'
    ctx.strokeStyle = 'rgba(38,98,158,0.28)'
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(w * 0.42, 0)
    ctx.lineTo(w * 0.30, h * 0.20)
    ctx.lineTo(0, h * 0.24)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Stadium stand — right corner
    ctx.beginPath()
    ctx.moveTo(w * 0.58, 0)
    ctx.lineTo(w, 0)
    ctx.lineTo(w, h * 0.24)
    ctx.lineTo(w * 0.70, h * 0.20)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Grass
    const grassGrad = ctx.createLinearGradient(0, h * 0.63, 0, h)
    grassGrad.addColorStop(0,   '#52c148')
    grassGrad.addColorStop(0.3, '#46b23c')
    grassGrad.addColorStop(1,   '#3aa030')
    ctx.fillStyle = grassGrad
    ctx.fillRect(0, h * 0.66, w, h)

    // Soft sky→grass fade
    const blendGrad = ctx.createLinearGradient(0, h * 0.62, 0, h * 0.70)
    blendGrad.addColorStop(0, 'rgba(80,185,70,0)')
    blendGrad.addColorStop(1, '#52c148')
    ctx.fillStyle = blendGrad
    ctx.fillRect(0, h * 0.62, w, h * 0.10)

    // Alternating stripe texture on grass
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    for (let sx = 0; sx < w; sx += 36) {
      ctx.fillRect(sx, h * 0.66, 18, h * 0.34)
    }
  }

  _drawGoalPost(w, h) {
    const img = this.images.goal_post

    // Goal frame bounds
    const GL  = Math.round(w * 0.07)    // left post x
    const GR  = Math.round(w * 0.93)    // right post x
    const GT  = Math.round(h * 0.09)    // crossbar y
    const GB  = Math.round(h * 0.88)    // bottom (grass) y
    const PW  = 7                       // post stroke width
    const DX  = Math.round(w * 0.055)   // 3-D depth x offset
    const DY  = Math.round(h * 0.10)    // 3-D depth y offset (upward)

    if (img) {
      this.ctx.drawImage(img, GL, GT, GR - GL, GB - GT)
      return
    }

    const ctx = this.ctx
    const BL  = GL + DX   // back-left corner x
    const BR  = GR - DX   // back-right corner x
    const BT  = GT - DY   // back crossbar y

    ctx.save()

    // ── Net (clipped to goal interior) ─────────────────────────────
    ctx.save()
    ctx.beginPath()
    ctx.rect(GL + PW * 0.5, GT + PW * 0.5, GR - GL - PW, GB - GT - PW * 0.5)
    ctx.clip()

    ctx.fillStyle = 'rgba(160,200,230,0.07)'
    ctx.fillRect(GL, GT, GR - GL, GB - GT)

    ctx.strokeStyle = 'rgba(170,205,235,0.42)'
    ctx.lineWidth   = 0.8
    for (let nx = GL; nx <= GR; nx += 20) {
      ctx.beginPath(); ctx.moveTo(nx, GT); ctx.lineTo(nx, GB); ctx.stroke()
    }
    for (let ny = GT; ny <= GB; ny += 15) {
      ctx.beginPath(); ctx.moveTo(GL, ny); ctx.lineTo(GR, ny); ctx.stroke()
    }
    ctx.restore()

    // ── 3-D back structure ─────────────────────────────────────────
    ctx.strokeStyle = 'rgba(210,225,240,0.72)'
    ctx.lineWidth   = 3.5
    ctx.lineCap     = 'round'

    // Angled depth lines from front corners to back corners
    ctx.beginPath(); ctx.moveTo(GL, GT); ctx.lineTo(BL, BT); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(GR, GT); ctx.lineTo(BR, BT); ctx.stroke()

    // Back crossbar
    ctx.beginPath(); ctx.moveTo(BL, BT); ctx.lineTo(BR, BT); ctx.stroke()

    // Back vertical posts
    ctx.strokeStyle = 'rgba(190,215,235,0.48)'
    ctx.lineWidth   = 2.5
    ctx.beginPath(); ctx.moveTo(BL, BT); ctx.lineTo(BL, GB); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(BR, BT); ctx.lineTo(BR, GB); ctx.stroke()

    // ── Front white posts ──────────────────────────────────────────
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth   = PW
    ctx.lineCap     = 'square'

    ctx.beginPath(); ctx.moveTo(GL, GT); ctx.lineTo(GR, GT); ctx.stroke() // crossbar
    ctx.beginPath(); ctx.moveTo(GL, GT); ctx.lineTo(GL, GB); ctx.stroke() // left post
    ctx.beginPath(); ctx.moveTo(GR, GT); ctx.lineTo(GR, GB); ctx.stroke() // right post

    ctx.restore()
  }

  _drawGoalkeeper(scene, w, h) {
    const img  = this.images.goalkeeper
    const kcx  = Math.round(this.keeperBaseX + this.keeperOffsetX)
    const kTop = Math.round(h * 0.16)
    const kBot = Math.round(h * 0.89)
    const kH   = kBot - kTop

    if (img) {
      const iw = Math.round(kH * 0.52)
      this.ctx.drawImage(img, kcx - iw / 2, kTop, iw, kH)
      return
    }

    const ctx = this.ctx
    ctx.save()

    // ─── Proportions (all relative to kH) ──────────────────────────
    const headR     = Math.round(kH * 0.09)
    const headCy    = kTop + headR
    const neckH     = Math.round(kH * 0.035)
    const neckTop   = headCy + headR
    const shoulderY = neckTop + neckH
    const torsoH    = Math.round(kH * 0.27)
    const shortsH   = Math.round(kH * 0.13)
    const thighH    = Math.round(kH * 0.12)
    const sockH     = Math.round(kH * 0.14)
    const bw        = Math.round(kH * 0.22)   // half-torso width
    const armAngle  = 22 * Math.PI / 180      // nearly horizontal arms
    const armLen    = Math.round(kH * 0.43)
    const armW      = Math.round(kH * 0.058)
    const shortsY   = shoulderY + torsoH
    const thighY    = shortsY + shortsH
    const sockY     = thighY + thighH
    const legSpread = Math.round(bw * 1.05)   // foot x-offset from kcx
    const legW      = Math.round(bw * 0.48)   // width of each leg/sock

    // ── Shoes ───────────────────────────────────────────────────
    ctx.fillStyle = '#111111'
    ctx.beginPath()
    ctx.ellipse(kcx - legSpread, sockY + sockH + headR * 0.30, headR * 0.90, headR * 0.34, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(kcx + legSpread, sockY + sockH + headR * 0.30, headR * 0.90, headR * 0.34, 0, 0, Math.PI * 2)
    ctx.fill()

    // ── Socks (white with red stripe near bottom) ─────────────────────
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(kcx - legSpread - legW / 2, sockY, legW, sockH)
    ctx.fillRect(kcx + legSpread - legW / 2, sockY, legW, sockH)
    // Red stripe ~70% down the sock
    const sockStripeH = Math.round(sockH * 0.20)
    ctx.fillStyle = '#e63946'
    ctx.fillRect(kcx - legSpread - legW / 2, sockY + sockH * 0.68, legW, sockStripeH)
    ctx.fillRect(kcx + legSpread - legW / 2, sockY + sockH * 0.68, legW, sockStripeH)

    // ── Thighs (skin-toned, between shorts and socks) ────────────────
    ctx.fillStyle = '#f0c090'
    ctx.fillRect(kcx - legSpread - legW / 2, thighY, legW, thighH)
    ctx.fillRect(kcx + legSpread - legW / 2, thighY, legW, thighH)

    // ── Shorts (dark, trapezoid wider at bottom — spread stance) ───────
    ctx.fillStyle = '#1a1a2e'
    ctx.beginPath()
    ctx.moveTo(kcx - bw,                         shortsY)
    ctx.lineTo(kcx + bw,                         shortsY)
    ctx.lineTo(kcx + legSpread + legW / 2,       thighY)
    ctx.lineTo(kcx - legSpread - legW / 2,       thighY)
    ctx.closePath()
    ctx.fill()

    // ── Jersey body (white) ───────────────────────────────────────
    ctx.fillStyle = '#f4f4f4'
    ctx.fillRect(kcx - bw, shoulderY, bw * 2, torsoH)

    // Black collar band at top of jersey
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(kcx - bw * 0.45, shoulderY, bw * 0.90, Math.round(kH * 0.025))

    // Red rectangular chest patch
    const patchW = Math.round(bw * 1.30)
    const patchH = Math.round(torsoH * 0.27)
    const patchY = shoulderY + Math.round(torsoH * 0.36)
    ctx.fillStyle = '#e63946'
    ctx.fillRect(kcx - patchW / 2, patchY, patchW, patchH)

    // ── Arms (long white sleeves) ───────────────────────────────
    const shoulderMidY = shoulderY + Math.round(torsoH * 0.06)
    const lArmEndX = kcx - bw - Math.round(armLen * Math.cos(armAngle))
    const lArmEndY = shoulderMidY - Math.round(armLen * Math.sin(armAngle))
    const rArmEndX = kcx + bw + Math.round(armLen * Math.cos(armAngle))
    const rArmEndY = shoulderMidY - Math.round(armLen * Math.sin(armAngle))

    ctx.strokeStyle = '#f4f4f4'
    ctx.lineWidth   = armW
    ctx.lineCap     = 'round'
    ctx.beginPath(); ctx.moveTo(kcx - bw, shoulderMidY); ctx.lineTo(lArmEndX, lArmEndY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(kcx + bw, shoulderMidY); ctx.lineTo(rArmEndX, rArmEndY); ctx.stroke()

    // Black wristbands (thick band near end of sleeve)
    const wbLen  = Math.round(armLen * 0.14)
    const lWbX   = lArmEndX + Math.round(wbLen * Math.cos(armAngle))
    const lWbY   = lArmEndY + Math.round(wbLen * Math.sin(armAngle))
    const rWbX   = rArmEndX - Math.round(wbLen * Math.cos(armAngle))
    const rWbY   = rArmEndY + Math.round(wbLen * Math.sin(armAngle))
    ctx.strokeStyle = '#111111'
    ctx.lineWidth   = armW + 2
    ctx.beginPath(); ctx.moveTo(lWbX, lWbY); ctx.lineTo(lArmEndX, lArmEndY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(rWbX, rWbY); ctx.lineTo(rArmEndX, rArmEndY); ctx.stroke()

    // White gloves
    const gloveR = Math.round(armW * 1.9)
    ctx.fillStyle = '#e6e6e6'
    ctx.beginPath(); ctx.arc(lArmEndX, lArmEndY, gloveR, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(rArmEndX, rArmEndY, gloveR, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#aaaaaa'
    ctx.lineWidth   = 1
    ctx.beginPath(); ctx.arc(lArmEndX, lArmEndY, gloveR, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(rArmEndX, rArmEndY, gloveR, 0, Math.PI * 2); ctx.stroke()

    // ── Neck ──────────────────────────────────────────────────────
    const neckW = Math.round(headR * 0.55)
    ctx.fillStyle = '#f0c090'
    ctx.fillRect(kcx - neckW / 2, neckTop, neckW, neckH + 2)

    // ── Head / Face ─────────────────────────────────────────────
    // Skin
    ctx.fillStyle = '#f0c090'
    ctx.beginPath(); ctx.arc(kcx, headCy, headR, 0, Math.PI * 2); ctx.fill()

    // Dark hair cap (top half)
    ctx.fillStyle = '#1a0f08'
    ctx.beginPath()
    ctx.arc(kcx, headCy, headR, Math.PI * 1.05, Math.PI * 1.95)
    ctx.lineTo(kcx, headCy)
    ctx.closePath()
    ctx.fill()

    // Ears
    ctx.fillStyle = '#e8b07a'
    ctx.beginPath(); ctx.ellipse(kcx - headR * 0.95, headCy + headR * 0.10, headR * 0.13, headR * 0.20, 0, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(kcx + headR * 0.95, headCy + headR * 0.10, headR * 0.13, headR * 0.20, 0, 0, Math.PI * 2); ctx.fill()

    // Eyes
    ctx.fillStyle = '#1a0f08'
    ctx.beginPath(); ctx.arc(kcx - headR * 0.28, headCy + headR * 0.08, headR * 0.09, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(kcx + headR * 0.28, headCy + headR * 0.08, headR * 0.09, 0, Math.PI * 2); ctx.fill()

    ctx.restore()
  }

  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(targetX, h) {
    const cx  = targetX
    const cy  = Math.round(h * 0.40)   // inside goal post area
    const r   = Math.round(h * 0.14)   // ~14% of canvas height
    const ctx = this.ctx

    ctx.save()

    // Outer dark shadow ring
    ctx.shadowColor = 'rgba(0,0,0,.55)'
    ctx.shadowBlur  = 14
    ctx.strokeStyle = 'rgba(30,30,30,.6)'
    ctx.lineWidth   = r * 0.58 + 2
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Metallic gradient ring (main)
    const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
    grad.addColorStop(0,   '#d4d4d4')
    grad.addColorStop(0.25,'#a0a0a0')
    grad.addColorStop(0.5, '#707070')
    grad.addColorStop(0.75,'#a8a8a8')
    grad.addColorStop(1,   '#cecece')
    ctx.strokeStyle = grad
    ctx.lineWidth   = r * 0.55
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()

    // Inner highlight arc (top-left glint)
    ctx.strokeStyle = 'rgba(255,255,255,.45)'
    ctx.lineWidth   = 3
    ctx.beginPath()
    ctx.arc(cx - r * 0.15, cy - r * 0.15, r - r * 0.3, Math.PI * 1.05, Math.PI * 1.7)
    ctx.stroke()

    // Inner dark edge
    ctx.strokeStyle = 'rgba(0,0,0,.25)'
    ctx.lineWidth   = 2
    ctx.beginPath()
    ctx.arc(cx, cy, r - r * 0.28, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(decoys) {
    for (const decoy of decoys) {
      const cy = Math.round(this.canvas.height * 0.40)
      this.ctx.save()
      this.ctx.strokeStyle = `rgba(180,180,180,${decoy.opacity})`
      this.ctx.lineWidth   = 4
      this.ctx.beginPath()
      this.ctx.arc(decoy.x, cy, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2)
      this.ctx.stroke()
      this.ctx.restore()
    }
  }

  _drawBall(h) {
    const img = this.images.ball
    const r   = Math.round(h * 0.11)   // ~11 % of canvas height — compact real-football size
    const cx  = this.ballX

    // Interpolate cy: ball arcs upward from ground → target ring as cx → targetX
    const targetX = this.data.target_x
    const dist    = Math.abs(targetX - this.ballStartX) || 1
    const prog    = Math.max(0, Math.min(1, 1 - Math.abs(cx - targetX) / dist))
    const groundY = h * 0.82
    const ringY   = h * 0.40
    const cy      = Math.round(groundY + prog * (ringY - groundY))

    if (img) {
      this.ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2)
      return
    }

    const ctx = this.ctx
    ctx.save()

    // Clip to canvas bounds
    ctx.beginPath()
    ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    ctx.clip()

    // Drop shadow ellipse
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.beginPath()
    ctx.ellipse(cx + r * 0.05, cy + r * 0.88, r * 0.75, r * 0.18, 0, 0, Math.PI * 2)
    ctx.fill()

    // Sphere base — radial gradient for 3-D sheen
    const sGrad = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.32, r * 0.04, cx, cy, r)
    sGrad.addColorStop(0,    '#ffffff')
    sGrad.addColorStop(0.38, '#f0f0f0')
    sGrad.addColorStop(0.75, '#d4d4d4')
    sGrad.addColorStop(1,    '#aaaaaa')
    ctx.fillStyle = sGrad
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()

    // ── Classic Telstar-style patches (clipped to sphere) ──
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2)
    ctx.clip()

    ctx.fillStyle = '#111111'

    // Centre pentagon
    _drawPentagon(ctx, cx, cy, r * 0.28)

    // 5 surrounding pentagons at 72° steps (top = −90°)
    const pDist  = r * 0.58
    const patchR = r * 0.23
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180
      _drawPentagon(ctx, cx + pDist * Math.cos(a), cy + pDist * Math.sin(a), patchR)
    }

    // Seam lines from centre patch edge to each surrounding patch
    ctx.strokeStyle = '#333333'
    ctx.lineWidth   = Math.max(0.8, r * 0.055)
    ctx.lineCap     = 'round'
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180
      ctx.beginPath()
      ctx.moveTo(cx + r * 0.29 * Math.cos(a), cy + r * 0.29 * Math.sin(a))
      ctx.lineTo(cx + pDist * 0.72 * Math.cos(a), cy + pDist * 0.72 * Math.sin(a))
      ctx.stroke()
    }

    ctx.restore()

    // Sphere outline
    ctx.strokeStyle = '#777777'
    ctx.lineWidth   = 0.8
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()

    // Specular highlight (small glossy ellipse top-left)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.beginPath()
    ctx.ellipse(cx - r * 0.28, cy - r * 0.30, r * 0.20, r * 0.13, -Math.PI / 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  destroy() {
    // No active animation frames to cancel — drawing is imperative/on-demand
  }
}