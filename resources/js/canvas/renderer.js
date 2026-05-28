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
    this.keeperOffsetX   = captchaData.scene?.keeper_offset_x ?? 0
    this.images          = {}
    this.ready           = false
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
    this._drawBall(height, data.scene?.ball_radius ?? 18)
  }

  // ─── Layer renderers ─────────────────────────────────────────────────────

  _drawBackground(w, h) {
    const img = this.images.stadium
    if (img) {
      this.ctx.drawImage(img, 0, 0, w, h)
    } else {
      // Fallback gradient
      const grad = this.ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, '#1a472a')
      grad.addColorStop(1, '#2d6a4f')
      this.ctx.fillStyle = grad
      this.ctx.fillRect(0, 0, w, h)

      // Simple grass lines
      this.ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      this.ctx.lineWidth   = 1
      for (let x = 0; x <= w; x += 30) {
        this.ctx.beginPath()
        this.ctx.moveTo(x, 0)
        this.ctx.lineTo(x, h)
        this.ctx.stroke()
      }
    }
  }

  _drawGoalPost(w, h) {
    const img = this.images.goal_post
    const goalW  = Math.round(w * 0.35 * (this.data.scene.goal_width_scale ?? 1))
    const goalH  = Math.round(h * 0.6)
    const goalX  = Math.round((w - goalW) / 2)
    const goalY  = Math.round(h * 0.05)

    if (img) {
      this.ctx.drawImage(img, goalX, goalY, goalW, goalH)
      return
    }

    // Fallback: draw a simple goal post
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.lineWidth   = 4
    this.ctx.strokeRect(goalX, goalY, goalW, goalH)

    // Net pattern
    this.ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    this.ctx.lineWidth   = 1
    for (let x = goalX; x <= goalX + goalW; x += 15) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, goalY)
      this.ctx.lineTo(x, goalY + goalH)
      this.ctx.stroke()
    }
    for (let y = goalY; y <= goalY + goalH; y += 12) {
      this.ctx.beginPath()
      this.ctx.moveTo(goalX, y)
      this.ctx.lineTo(goalX + goalW, y)
      this.ctx.stroke()
    }
  }

  _drawGoalkeeper(scene, w, h) {
    const img = this.images.goalkeeper
    const kw  = Math.round(h * 0.35)
    const kh  = Math.round(h * 0.72)
    const kx  = Math.round(w / 2 - kw / 2 + this.keeperOffsetX)
    const ky  = Math.round(h * 0.18)

    if (img) {
      this.ctx.drawImage(img, kx, ky, kw, kh)
      return
    }

    // Fallback: simple stick figure
    this.ctx.fillStyle = '#e74c3c'
    this.ctx.fillRect(kx + Math.round(kw * 0.3), ky + Math.round(kh * 0.15), Math.round(kw * 0.4), Math.round(kh * 0.55))
    this.ctx.beginPath()
    this.ctx.arc(kx + Math.round(kw / 2), ky + Math.round(kh * 0.1), Math.round(kw * 0.18), 0, Math.PI * 2)
    this.ctx.fill()
  }

  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(targetX, h) {
    const cx  = targetX
    const cy  = Math.round(h * 0.38)   // inside goal post area
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
      const cy = Math.round(this.canvas.height * 0.38)
      this.ctx.save()
      this.ctx.strokeStyle = `rgba(180,180,180,${decoy.opacity})`
      this.ctx.lineWidth   = 4
      this.ctx.beginPath()
      this.ctx.arc(decoy.x, cy, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2)
      this.ctx.stroke()
      this.ctx.restore()
    }
  }

  _drawBall(h, radius) {
    const img = this.images.ball
    const cx  = this.ballX
    const cy  = Math.round(h * 0.76)   // ground level

    if (img) {
      this.ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2)
      return
    }

    // Fallback: simple football circle
    this.ctx.save()
    this.ctx.fillStyle   = '#f5f5f5'
    this.ctx.strokeStyle = '#333'
    this.ctx.lineWidth   = 2
    this.ctx.shadowColor = 'rgba(0,0,0,0.4)'
    this.ctx.shadowBlur  = 6

    this.ctx.beginPath()
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.stroke()

    // Pentagon patches
    this.ctx.fillStyle = '#222'
    const patches = [
      [cx, cy],
      [cx - radius * 0.4, cy - radius * 0.5],
      [cx + radius * 0.4, cy - radius * 0.5],
      [cx - radius * 0.5, cy + radius * 0.3],
      [cx + radius * 0.5, cy + radius * 0.3],
    ]
    for (const [px, py] of patches) {
      this.ctx.beginPath()
      this.ctx.arc(px, py, radius * 0.2, 0, Math.PI * 2)
      this.ctx.fill()
    }

    this.ctx.restore()
  }

  destroy() {
    // No active animation frames to cancel — drawing is imperative/on-demand
  }
}
