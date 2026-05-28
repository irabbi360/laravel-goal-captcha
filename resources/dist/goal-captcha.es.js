import { ref as C, onMounted as ee, onBeforeUnmount as te, watch as ae, openBlock as M, createElementBlock as w, createElementVNode as v, unref as _, createVNode as oe, Transition as ve, withCtx as me, Fragment as ne, renderList as pe, createCommentVNode as L, computed as N, normalizeClass as Y, normalizeStyle as K, createStaticVNode as _e, withModifiers as Z, readonly as O, toDisplayString as se, createBlock as ye } from "vue";
const H = /* @__PURE__ */ new Map();
async function be(i) {
  return H.has(i) ? H.get(i) : new Promise((r, s) => {
    const t = new Image();
    t.crossOrigin = "anonymous", t.onload = () => {
      H.set(i, t), r(t);
    }, t.onerror = () => s(new Error(`Failed to load image: ${i}`)), t.src = i;
  });
}
function J(i, r, s, t) {
  i.beginPath();
  for (let a = 0; a < 5; a++) {
    const n = (a * 72 - 90) * Math.PI / 180;
    a === 0 ? i.moveTo(r + t * Math.cos(n), s + t * Math.sin(n)) : i.lineTo(r + t * Math.cos(n), s + t * Math.sin(n));
  }
  i.closePath(), i.fill();
}
class ke {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(r, s) {
    var t;
    this.canvas = r, this.ctx = r.getContext("2d"), this.data = s, this.ballX = s.ball_start_x, this.ballStartX = s.ball_start_x, this.keeperOffsetX = ((t = s.scene) == null ? void 0 : t.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1, this.keeperBaseX = Math.round(r.width * 0.5);
  }
  async preload() {
    const r = this.data.scene.assets ?? {}, s = await Promise.allSettled(
      Object.entries(r).map(async ([t, a]) => {
        const n = await be(a);
        return [t, n];
      })
    );
    for (const t of s)
      if (t.status === "fulfilled") {
        const [a, n] = t.value;
        this.images[a] = n;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(r) {
    this.ballX = Math.max(0, Math.min(r, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: r, canvas: s, data: t } = this, { width: a, height: n } = s;
    r.clearRect(0, 0, a, n), this._drawBackground(a, n), this._drawGoalPost(a, n), this._drawDecoys(t.scene.decoys ?? []), this._drawTargetRing(t.target_x, n), this._drawGoalkeeper(t.scene, a, n), this._drawBall(n);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(r, s) {
    const t = this.images.stadium;
    if (t) {
      this.ctx.drawImage(t, 0, 0, r, s);
      return;
    }
    const a = this.ctx, n = a.createLinearGradient(0, 0, 0, s * 0.72);
    n.addColorStop(0, "#4e9fc8"), n.addColorStop(0.55, "#6ab9de"), n.addColorStop(1, "#88ccec"), a.fillStyle = n, a.fillRect(0, 0, r, s * 0.72), a.fillStyle = "rgba(58,118,178,0.38)", a.strokeStyle = "rgba(38,98,158,0.28)", a.lineWidth = 1, a.beginPath(), a.moveTo(0, 0), a.lineTo(r * 0.42, 0), a.lineTo(r * 0.3, s * 0.2), a.lineTo(0, s * 0.24), a.closePath(), a.fill(), a.stroke(), a.beginPath(), a.moveTo(r * 0.58, 0), a.lineTo(r, 0), a.lineTo(r, s * 0.24), a.lineTo(r * 0.7, s * 0.2), a.closePath(), a.fill(), a.stroke();
    const l = a.createLinearGradient(0, s * 0.63, 0, s);
    l.addColorStop(0, "#52c148"), l.addColorStop(0.3, "#46b23c"), l.addColorStop(1, "#3aa030"), a.fillStyle = l, a.fillRect(0, s * 0.66, r, s);
    const u = a.createLinearGradient(0, s * 0.62, 0, s * 0.7);
    u.addColorStop(0, "rgba(80,185,70,0)"), u.addColorStop(1, "#52c148"), a.fillStyle = u, a.fillRect(0, s * 0.62, r, s * 0.1), a.fillStyle = "rgba(255,255,255,0.04)";
    for (let g = 0; g < r; g += 36)
      a.fillRect(g, s * 0.66, 18, s * 0.34);
  }
  _drawGoalPost(r, s) {
    const t = this.images.goal_post, a = Math.round(r * 0.07), n = Math.round(r * 0.93), l = Math.round(s * 0.09), u = Math.round(s * 0.88), g = 7, o = Math.round(r * 0.055), c = Math.round(s * 0.1);
    if (t) {
      this.ctx.drawImage(t, a, l, n - a, u - l);
      return;
    }
    const e = this.ctx, f = a + o, m = n - o, y = l - c;
    e.save(), e.save(), e.beginPath(), e.rect(a + g * 0.5, l + g * 0.5, n - a - g, u - l - g * 0.5), e.clip(), e.fillStyle = "rgba(160,200,230,0.07)", e.fillRect(a, l, n - a, u - l), e.strokeStyle = "rgba(170,205,235,0.42)", e.lineWidth = 0.8;
    for (let d = a; d <= n; d += 20)
      e.beginPath(), e.moveTo(d, l), e.lineTo(d, u), e.stroke();
    for (let d = l; d <= u; d += 15)
      e.beginPath(), e.moveTo(a, d), e.lineTo(n, d), e.stroke();
    e.restore(), e.strokeStyle = "rgba(210,225,240,0.72)", e.lineWidth = 3.5, e.lineCap = "round", e.beginPath(), e.moveTo(a, l), e.lineTo(f, y), e.stroke(), e.beginPath(), e.moveTo(n, l), e.lineTo(m, y), e.stroke(), e.beginPath(), e.moveTo(f, y), e.lineTo(m, y), e.stroke(), e.strokeStyle = "rgba(190,215,235,0.48)", e.lineWidth = 2.5, e.beginPath(), e.moveTo(f, y), e.lineTo(f, u), e.stroke(), e.beginPath(), e.moveTo(m, y), e.lineTo(m, u), e.stroke(), e.strokeStyle = "#ffffff", e.lineWidth = g, e.lineCap = "square", e.beginPath(), e.moveTo(a, l), e.lineTo(n, l), e.stroke(), e.beginPath(), e.moveTo(a, l), e.lineTo(a, u), e.stroke(), e.beginPath(), e.moveTo(n, l), e.lineTo(n, u), e.stroke(), e.restore();
  }
  _drawGoalkeeper(r, s, t) {
    const a = this.images.goalkeeper, n = Math.round(this.keeperBaseX + this.keeperOffsetX), l = Math.round(t * 0.16), g = Math.round(t * 0.89) - l;
    if (a) {
      const z = Math.round(g * 0.52);
      this.ctx.drawImage(a, n - z / 2, l, z, g);
      return;
    }
    const o = this.ctx;
    o.save();
    const c = Math.round(g * 0.09), e = l + c, f = Math.round(g * 0.035), m = e + c, y = m + f, d = Math.round(g * 0.27), h = Math.round(g * 0.13), p = Math.round(g * 0.12), b = Math.round(g * 0.14), k = Math.round(g * 0.22), S = 22 * Math.PI / 180, x = Math.round(g * 0.43), X = Math.round(g * 0.058), R = y + d, I = R + h, E = I + p, T = Math.round(k * 1.05), P = Math.round(k * 0.48);
    o.fillStyle = "#111111", o.beginPath(), o.ellipse(n - T, E + b + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), o.fill(), o.beginPath(), o.ellipse(n + T, E + b + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), o.fill(), o.fillStyle = "#f0f0f0", o.fillRect(n - T - P / 2, E, P, b), o.fillRect(n + T - P / 2, E, P, b);
    const q = Math.round(b * 0.2);
    o.fillStyle = "#e63946", o.fillRect(n - T - P / 2, E + b * 0.68, P, q), o.fillRect(n + T - P / 2, E + b * 0.68, P, q), o.fillStyle = "#f0c090", o.fillRect(n - T - P / 2, I, P, p), o.fillRect(n + T - P / 2, I, P, p), o.fillStyle = "#1a1a2e", o.beginPath(), o.moveTo(n - k, R), o.lineTo(n + k, R), o.lineTo(n + T + P / 2, I), o.lineTo(n - T - P / 2, I), o.closePath(), o.fill(), o.fillStyle = "#f4f4f4", o.fillRect(n - k, y, k * 2, d), o.fillStyle = "#1a1a2e", o.fillRect(n - k * 0.45, y, k * 0.9, Math.round(g * 0.025));
    const V = Math.round(k * 1.3), ce = Math.round(d * 0.27), de = y + Math.round(d * 0.36);
    o.fillStyle = "#e63946", o.fillRect(n - V / 2, de, V, ce);
    const D = y + Math.round(d * 0.06), G = n - k - Math.round(x * Math.cos(S)), W = D - Math.round(x * Math.sin(S)), B = n + k + Math.round(x * Math.cos(S)), A = D - Math.round(x * Math.sin(S));
    o.strokeStyle = "#f4f4f4", o.lineWidth = X, o.lineCap = "round", o.beginPath(), o.moveTo(n - k, D), o.lineTo(G, W), o.stroke(), o.beginPath(), o.moveTo(n + k, D), o.lineTo(B, A), o.stroke();
    const $ = Math.round(x * 0.14), ue = G + Math.round($ * Math.cos(S)), he = W + Math.round($ * Math.sin(S)), fe = B - Math.round($ * Math.cos(S)), ge = A + Math.round($ * Math.sin(S));
    o.strokeStyle = "#111111", o.lineWidth = X + 2, o.beginPath(), o.moveTo(ue, he), o.lineTo(G, W), o.stroke(), o.beginPath(), o.moveTo(fe, ge), o.lineTo(B, A), o.stroke();
    const U = Math.round(X * 1.9);
    o.fillStyle = "#e6e6e6", o.beginPath(), o.arc(G, W, U, 0, Math.PI * 2), o.fill(), o.beginPath(), o.arc(B, A, U, 0, Math.PI * 2), o.fill(), o.strokeStyle = "#aaaaaa", o.lineWidth = 1, o.beginPath(), o.arc(G, W, U, 0, Math.PI * 2), o.stroke(), o.beginPath(), o.arc(B, A, U, 0, Math.PI * 2), o.stroke();
    const j = Math.round(c * 0.55);
    o.fillStyle = "#f0c090", o.fillRect(n - j / 2, m, j, f + 2), o.fillStyle = "#f0c090", o.beginPath(), o.arc(n, e, c, 0, Math.PI * 2), o.fill(), o.fillStyle = "#1a0f08", o.beginPath(), o.arc(n, e, c, Math.PI * 1.05, Math.PI * 1.95), o.lineTo(n, e), o.closePath(), o.fill(), o.fillStyle = "#e8b07a", o.beginPath(), o.ellipse(n - c * 0.95, e + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), o.fill(), o.beginPath(), o.ellipse(n + c * 0.95, e + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), o.fill(), o.fillStyle = "#1a0f08", o.beginPath(), o.arc(n - c * 0.28, e + c * 0.08, c * 0.09, 0, Math.PI * 2), o.fill(), o.beginPath(), o.arc(n + c * 0.28, e + c * 0.08, c * 0.09, 0, Math.PI * 2), o.fill(), o.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(r, s) {
    const t = r, a = Math.round(s * 0.4), n = Math.round(s * 0.14), l = this.ctx;
    l.save(), l.shadowColor = "rgba(0,0,0,.55)", l.shadowBlur = 14, l.strokeStyle = "rgba(30,30,30,.6)", l.lineWidth = n * 0.58 + 2, l.beginPath(), l.arc(t, a, n, 0, Math.PI * 2), l.stroke(), l.shadowBlur = 0;
    const u = l.createLinearGradient(t - n, a - n, t + n, a + n);
    u.addColorStop(0, "#d4d4d4"), u.addColorStop(0.25, "#a0a0a0"), u.addColorStop(0.5, "#707070"), u.addColorStop(0.75, "#a8a8a8"), u.addColorStop(1, "#cecece"), l.strokeStyle = u, l.lineWidth = n * 0.55, l.beginPath(), l.arc(t, a, n, 0, Math.PI * 2), l.stroke(), l.strokeStyle = "rgba(255,255,255,.45)", l.lineWidth = 3, l.beginPath(), l.arc(t - n * 0.15, a - n * 0.15, n - n * 0.3, Math.PI * 1.05, Math.PI * 1.7), l.stroke(), l.strokeStyle = "rgba(0,0,0,.25)", l.lineWidth = 2, l.beginPath(), l.arc(t, a, n - n * 0.28, 0, Math.PI * 2), l.stroke(), l.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(r) {
    for (const s of r) {
      const t = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${s.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(s.x, t, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(r) {
    const s = this.images.ball, t = Math.round(r * 0.11), a = this.ballX, n = this.data.target_x, l = Math.abs(n - this.ballStartX) || 1, u = Math.max(0, Math.min(1, 1 - Math.abs(a - n) / l)), g = r * 0.82, o = r * 0.4, c = Math.round(g + u * (o - g));
    if (s) {
      this.ctx.drawImage(s, a - t, c - t, t * 2, t * 2);
      return;
    }
    const e = this.ctx;
    e.save(), e.beginPath(), e.rect(0, 0, this.canvas.width, this.canvas.height), e.clip(), e.fillStyle = "rgba(0,0,0,0.22)", e.beginPath(), e.ellipse(a + t * 0.05, c + t * 0.88, t * 0.75, t * 0.18, 0, 0, Math.PI * 2), e.fill();
    const f = e.createRadialGradient(a - t * 0.32, c - t * 0.32, t * 0.04, a, c, t);
    f.addColorStop(0, "#ffffff"), f.addColorStop(0.38, "#f0f0f0"), f.addColorStop(0.75, "#d4d4d4"), f.addColorStop(1, "#aaaaaa"), e.fillStyle = f, e.beginPath(), e.arc(a, c, t, 0, Math.PI * 2), e.fill(), e.save(), e.beginPath(), e.arc(a, c, t - 0.5, 0, Math.PI * 2), e.clip(), e.fillStyle = "#111111", J(e, a, c, t * 0.28);
    const m = t * 0.58, y = t * 0.23;
    for (let d = 0; d < 5; d++) {
      const h = (d * 72 - 90) * Math.PI / 180;
      J(e, a + m * Math.cos(h), c + m * Math.sin(h), y);
    }
    e.strokeStyle = "#333333", e.lineWidth = Math.max(0.8, t * 0.055), e.lineCap = "round";
    for (let d = 0; d < 5; d++) {
      const h = (d * 72 - 90) * Math.PI / 180;
      e.beginPath(), e.moveTo(a + t * 0.29 * Math.cos(h), c + t * 0.29 * Math.sin(h)), e.lineTo(a + m * 0.72 * Math.cos(h), c + m * 0.72 * Math.sin(h)), e.stroke();
    }
    e.restore(), e.strokeStyle = "#777777", e.lineWidth = 0.8, e.beginPath(), e.arc(a, c, t, 0, Math.PI * 2), e.stroke(), e.fillStyle = "rgba(255,255,255,0.55)", e.beginPath(), e.ellipse(a - t * 0.28, c - t * 0.3, t * 0.2, t * 0.13, -Math.PI / 5, 0, Math.PI * 2), e.fill(), e.restore();
  }
  destroy() {
  }
}
function Me(i) {
  return 1 - Math.pow(1 - i, 3);
}
function Se(i, r, s, t, a) {
  let n = null, l = null, u = !1;
  function g(o) {
    if (u) return;
    n === null && (n = o);
    const c = o - n, e = Math.min(c / s, 1), f = i + (r - i) * Me(e);
    t(f), e < 1 ? l = requestAnimationFrame(g) : a == null || a();
  }
  return l = requestAnimationFrame(g), () => {
    u = !0, l !== null && cancelAnimationFrame(l);
  };
}
const F = (i, r) => {
  const s = i.__vccOpts || i;
  for (const [t, a] of r)
    s[t] = a;
  return s;
}, we = { class: "gc-canvas-wrap" }, Pe = ["width", "height"], xe = {
  key: 0,
  class: "gc-canvas__success-overlay",
  "aria-live": "polite"
}, Te = {
  class: "gc-confetti",
  "aria-hidden": "true"
}, Ce = ["data-i"], Xe = {
  __name: "GoalCanvas",
  props: {
    captchaData: {
      type: Object,
      required: !0
    },
    ballX: {
      type: Number,
      default: null
    },
    showSuccess: {
      type: Boolean,
      default: !1
    }
  },
  setup(i) {
    var u, g, o, c;
    const r = i, s = C(null);
    let t = null, a = null;
    const n = ((g = (u = r.captchaData) == null ? void 0 : u.canvas) == null ? void 0 : g.width) ?? 400, l = ((c = (o = r.captchaData) == null ? void 0 : o.canvas) == null ? void 0 : c.height) ?? 220;
    return ee(async () => {
      t = new ke(s.value, r.captchaData), await t.preload();
      const e = n, f = r.captchaData.target_x ?? e * 0.65, m = e * 0.11, y = e * 0.89, d = f + 58, h = f - 58;
      function p() {
        const S = [];
        h - m > 30 && S.push([m, h]), y - d > 30 && S.push([d, y]), S.length || S.push([m, y]);
        const [x, X] = S[Math.floor(Math.random() * S.length)];
        return x + Math.random() * (X - x);
      }
      let b = null;
      function k() {
        if (!t) return;
        const S = p(), x = t.keeperBaseX + t.keeperOffsetX, X = 500 + Math.random() * 600, R = 700 + Math.random() * 1e3;
        b = Se(x, S, X, (I) => {
          t && (t.keeperOffsetX = I - t.keeperBaseX, t.draw());
        }, () => {
          t && setTimeout(k, R);
        });
      }
      k(), a = () => {
        b == null || b();
      };
    }), te(() => {
      a == null || a(), t == null || t.destroy();
    }), ae(
      () => r.ballX,
      (e) => {
        t && e !== null && t.setBallX(e);
      }
    ), (e, f) => (M(), w("div", we, [
      v("canvas", {
        ref_key: "canvasEl",
        ref: s,
        width: _(n),
        height: _(l),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, Pe),
      oe(ve, { name: "gc-success" }, {
        default: me(() => [
          i.showSuccess ? (M(), w("div", xe, [
            v("div", Te, [
              (M(), w(ne, null, pe(24, (m) => v("span", {
                key: m,
                class: "gc-confetti__piece",
                "data-i": m
              }, null, 8, Ce)), 64))
            ]),
            f[0] || (f[0] = v("div", { class: "gc-success-badge" }, [
              v("div", { class: "gc-success-badge__ball" }, "⚽"),
              v("div", { class: "gc-success-badge__banner" }, [
                v("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--left",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  v("path", {
                    d: "M20 0 L0 20 L20 40 Z",
                    fill: "#15803d"
                  })
                ]),
                v("span", { class: "gc-success-badge__text" }, "SUCCESS"),
                v("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--right",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  v("path", {
                    d: "M0 0 L20 20 L0 40 Z",
                    fill: "#15803d"
                  })
                ])
              ])
            ], -1))
          ])) : L("", !0)
        ]),
        _: 1
      })
    ]));
  }
}, le = /* @__PURE__ */ F(Xe, [["__scopeId", "data-v-3a74f965"]]), Ie = {
  key: 0,
  class: "gc-slider gc-slider--success",
  "aria-label": "Verification successful"
}, Ee = ["aria-valuenow", "aria-valuemax", "tabindex"], Le = {
  __name: "GoalSlider",
  props: {
    ballStartX: { type: Number, default: 20 },
    trackWidth: { type: Number, default: 400 },
    handleSize: { type: Number, default: 72 },
    // matching the 72px pill width style
    success: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["drag-start", "drag-move", "drag-end"],
  setup(i, { emit: r }) {
    const s = r, t = i, a = C(null), n = C(t.trackWidth / 2), l = C(!1), u = N(() => t.handleSize / 2), g = N(
      () => Math.max(0, Math.min(n.value - u.value, t.trackWidth - t.handleSize))
    ), o = N(() => {
      const d = t.trackWidth / 2, h = n.value - d, p = d - t.handleSize / 2;
      if (p <= 0) return t.ballStartX;
      if (h < 0) {
        const b = t.ballStartX / p;
        return Math.max(0, t.ballStartX + h * b);
      } else {
        const b = (t.trackWidth - t.ballStartX) / p;
        return Math.min(t.trackWidth, t.ballStartX + h * b);
      }
    }), c = N(() => {
      const d = t.trackWidth / 2, h = n.value;
      return h < d ? {
        left: `${h}px`,
        width: `${d - h}px`
      } : {
        left: `${d}px`,
        width: `${h - d}px`
      };
    });
    function e(d) {
      t.disabled || (l.value = !0, s("drag-start"), window.addEventListener("mousemove", f, { passive: !0 }), window.addEventListener("touchmove", f, { passive: !0 }), window.addEventListener("mouseup", m), window.addEventListener("touchend", m));
    }
    function f(d) {
      if (!l.value) return;
      const h = d.touches ? d.touches[0].clientX : d.clientX, p = a.value.getBoundingClientRect(), b = Math.max(u.value, Math.min(h - p.left, t.trackWidth - u.value));
      n.value = b, s("drag-move", o.value, b);
    }
    function m() {
      l.value && (l.value = !1, window.removeEventListener("mousemove", f), window.removeEventListener("touchmove", f), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m), s("drag-end", o.value));
    }
    function y(d) {
      if (t.disabled) return;
      const h = 5;
      d.key === "ArrowRight" ? (l.value || (l.value = !0, s("drag-start")), n.value = Math.min(n.value + h, t.trackWidth - u.value), s("drag-move", o.value)) : d.key === "ArrowLeft" ? (l.value || (l.value = !0, s("drag-start")), n.value = Math.max(n.value - h, u.value), s("drag-move", o.value)) : (d.key === "Enter" || d.key === " ") && l.value && m();
    }
    return te(() => {
      window.removeEventListener("mousemove", f), window.removeEventListener("touchmove", f), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m);
    }), (d, h) => i.success ? (M(), w("div", Ie, [...h[0] || (h[0] = [
      v("div", { class: "gc-slider__success-check" }, [
        v("svg", {
          viewBox: "0 0 44 44",
          fill: "none",
          "aria-hidden": "true"
        }, [
          v("circle", {
            cx: "22",
            cy: "22",
            r: "20",
            fill: "#16a34a"
          }),
          v("path", {
            d: "M13 22.5l6.5 6.5 11-13",
            stroke: "#fff",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ])
      ], -1)
    ])])) : (M(), w("div", {
      key: 1,
      class: Y(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": l.value }]),
      ref_key: "trackEl",
      ref: a,
      role: "slider",
      "aria-valuenow": Math.round(n.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: y
    }, [
      v("div", {
        class: "gc-slider__fill",
        style: K(c.value)
      }, null, 4),
      h[2] || (h[2] = _e('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span></div>', 2)),
      v("div", {
        class: Y(["gc-slider__handle", { "is-dragging": l.value }]),
        style: K({ left: g.value + "px" }),
        onMousedown: Z(e, ["prevent"]),
        onTouchstart: Z(e, ["prevent"]),
        "aria-hidden": "true"
      }, [...h[1] || (h[1] = [
        v("svg", {
          class: "gc-slider__handle-icon",
          viewBox: "0 0 32 18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          v("path", {
            d: "M1 9h30M23 3l8 6-8 6M9 3L1 9l8 6",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])], 38)
    ], 42, Ee));
  }
}, re = /* @__PURE__ */ F(Le, [["__scopeId", "data-v-4210077b"]]);
function Re() {
  let i = [], r = null, s = !1;
  function t() {
    i = [], r = null, s = !1;
  }
  function a() {
    r = performance.now(), s = !0;
  }
  function n(o) {
    if (!s || r === null) return;
    const c = Math.round(performance.now() - r);
    i.length > 0 && c - i[i.length - 1].t < 8 || i.push({ x: Math.round(o), t: c });
  }
  function l() {
    s = !1;
  }
  function u() {
    return [...i];
  }
  function g() {
    return r === null ? 0 : Math.round(performance.now() - r);
  }
  return { reset: t, start: a, record: n, stop: l, getTrack: u, getElapsed: g };
}
function Ge() {
  if (typeof document > "u") return null;
  const i = document.querySelector('meta[name="csrf-token"]');
  if (i != null && i.content) return i.content;
  const r = document.cookie.split("; ").find((s) => s.startsWith("XSRF-TOKEN="));
  return r ? decodeURIComponent(r.split("=")[1]) : null;
}
function Q() {
  const i = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, r = Ge();
  return r && (i["X-CSRF-TOKEN"] = r, i["X-XSRF-TOKEN"] = r), i;
}
function We(i, r) {
  const s = C("idle"), t = C(null), a = C(null), n = C(null), l = Re();
  async function u() {
    s.value = "loading", a.value = null, t.value = null;
    try {
      const f = await fetch(i, {
        method: "POST",
        headers: Q(),
        credentials: "same-origin"
      });
      if (!f.ok) throw new Error(`Server error: ${f.status}`);
      n.value = await f.json(), s.value = "ready";
    } catch (f) {
      s.value = "failed", a.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", f);
    }
  }
  function g() {
    s.value === "ready" && (s.value = "dragging", l.reset(), l.start());
  }
  function o(f) {
    s.value === "dragging" && l.record(f);
  }
  async function c(f) {
    if (s.value !== "dragging") return;
    l.stop(), s.value = "verifying";
    const m = l.getTrack(), y = l.getElapsed();
    try {
      const h = await (await fetch(r, {
        method: "POST",
        headers: Q(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: n.value.captcha_id,
          final_x: Math.round(f),
          drag_time: y,
          movement_track: m
        })
      })).json();
      h.success ? (t.value = h.token, s.value = "success") : (a.value = h.message ?? "Verification failed.", s.value = "failed");
    } catch (d) {
      s.value = "failed", a.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", d);
    }
  }
  async function e() {
    l.reset(), await u();
  }
  return {
    state: O(s),
    token: O(t),
    errorMsg: O(a),
    captchaData: O(n),
    load: u,
    onDragStart: g,
    onDragMove: o,
    onDragEnd: c,
    retry: e
  };
}
const Be = ["data-state"], Ae = { class: "gc-modal__header" }, De = { class: "gc-modal__scene" }, $e = {
  key: 0,
  class: "gc-modal__skeleton",
  "aria-busy": "true"
}, Ue = {
  key: 0,
  class: "gc-modal__verifying",
  "aria-live": "polite"
}, Ne = {
  key: 1,
  class: "gc-modal__verifying gc-modal__verifying--failed",
  "aria-live": "assertive"
}, Oe = {
  key: 2,
  class: "gc-modal__error-scene",
  role: "alert"
}, He = { class: "gc-modal__error-msg" }, Ye = {
  key: 3,
  class: "gc-modal__idle"
}, Fe = { class: "gc-modal__slider-wrap" }, qe = {
  key: 1,
  class: "gc-modal__slider-skeleton"
}, Ve = {
  key: 2,
  class: "gc-modal__error-actions"
}, je = ["name", "value"], ie = {
  __name: "GoalCaptcha",
  props: {
    generateUrl: {
      type: String,
      default: () => {
        var i;
        return ((i = window.__GoalCaptchaConfig) == null ? void 0 : i.generateUrl) ?? "/_goal_captcha/generate";
      }
    },
    verifyUrl: {
      type: String,
      default: () => {
        var i;
        return ((i = window.__GoalCaptchaConfig) == null ? void 0 : i.verifyUrl) ?? "/_goal_captcha/verify";
      }
    },
    fieldName: {
      type: String,
      default: "captcha_token"
    },
    theme: {
      type: String,
      default: () => {
        var i;
        return ((i = window.__GoalCaptchaConfig) == null ? void 0 : i.theme) ?? "football";
      }
    },
    difficulty: {
      type: String,
      default: () => {
        var i;
        return ((i = window.__GoalCaptchaConfig) == null ? void 0 : i.difficulty) ?? "medium";
      }
    },
    autoLoad: {
      type: Boolean,
      default: !0
    },
    closable: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["verified", "failed", "loaded", "close"],
  setup(i, { emit: r }) {
    const s = i, t = r, {
      state: a,
      token: n,
      errorMsg: l,
      captchaData: u,
      load: g,
      onDragStart: o,
      onDragMove: c,
      onDragEnd: e,
      retry: f
    } = We(s.generateUrl, s.verifyUrl), m = C(null);
    function y(h, p) {
      m.value = h, c(p ?? h);
    }
    function d(h) {
      m.value = h, e(h);
    }
    return ae(a, (h) => {
      var p;
      h === "success" && (m.value = ((p = u.value) == null ? void 0 : p.target_x) ?? m.value, t("verified", n.value)), h === "failed" && (t("failed", l.value), u.value && setTimeout(() => {
        m.value = null, f();
      }, 1400)), h === "ready" && t("loaded", u.value);
    }), ee(() => {
      s.autoLoad && g();
    }), (h, p) => {
      var b;
      return M(), w("div", {
        class: Y(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
        "data-state": _(a),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        v("div", Ae, [
          p[4] || (p[4] = v("div", { class: "gc-modal__header-text" }, [
            v("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
            v("p", { class: "gc-modal__subtitle" }, "Drag the slider left or right to score a goal")
          ], -1)),
          i.closable ? (M(), w("button", {
            key: 0,
            type: "button",
            class: "gc-modal__close",
            "aria-label": "Close",
            onClick: p[0] || (p[0] = (k) => h.$emit("close"))
          }, [...p[3] || (p[3] = [
            v("svg", {
              viewBox: "0 0 24 24",
              width: "18",
              height: "18",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round"
            }, [
              v("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
              }),
              v("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
              })
            ], -1)
          ])])) : L("", !0)
        ]),
        v("div", De, [
          _(a) === "loading" ? (M(), w("div", $e)) : _(u) ? (M(), w(ne, { key: 1 }, [
            oe(le, {
              "captcha-data": _(u),
              "ball-x": m.value,
              "show-success": _(a) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            _(a) === "verifying" ? (M(), w("div", Ue, [...p[5] || (p[5] = [
              v("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              v("span", null, "Verifying…", -1)
            ])])) : L("", !0),
            _(a) === "failed" ? (M(), w("div", Ne, [...p[6] || (p[6] = [
              v("span", {
                class: "gc-icon-miss",
                "aria-hidden": "true"
              }, "❌", -1),
              v("span", null, "Missed! Retrying…", -1)
            ])])) : L("", !0)
          ], 64)) : _(a) === "failed" ? (M(), w("div", Oe, [
            p[7] || (p[7] = v("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            v("p", He, se(_(l) ?? "Verification failed. Please try again."), 1)
          ])) : (M(), w("div", Ye, [
            v("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: p[1] || (p[1] = (...k) => _(g) && _(g)(...k))
            }, "Start Verification")
          ]))
        ]),
        v("div", Fe, [
          _(u) ? (M(), ye(re, {
            key: 0,
            "ball-start-x": _(u).ball_start_x,
            "track-width": ((b = _(u).canvas) == null ? void 0 : b.width) ?? 400,
            success: _(a) === "success",
            disabled: _(a) === "verifying" || _(a) === "success",
            onDragStart: _(o),
            onDragMove: y,
            onDragEnd: d
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : _(a) === "loading" ? (M(), w("div", qe)) : _(a) === "failed" ? (M(), w("div", Ve, [
            v("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: p[2] || (p[2] = (...k) => _(f) && _(f)(...k))
            }, "↺ Try again")
          ])) : L("", !0)
        ]),
        _(n) ? (M(), w("input", {
          key: 0,
          type: "hidden",
          name: i.fieldName,
          value: _(n)
        }, null, 8, je)) : L("", !0)
      ], 10, Be);
    };
  }
}, ze = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Ke = { class: "goal-captcha__success-text" }, Ze = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(i) {
    return (r, s) => (M(), w("div", ze, [
      s[0] || (s[0] = v("div", { class: "goal-captcha__success-icon" }, [
        v("svg", {
          viewBox: "0 0 52 52",
          class: "goal-captcha__checkmark",
          "aria-hidden": "true"
        }, [
          v("circle", {
            cx: "26",
            cy: "26",
            r: "25",
            fill: "none",
            class: "goal-captcha__checkmark-circle"
          }),
          v("path", {
            fill: "none",
            d: "M14 27l8 8 16-16",
            class: "goal-captcha__checkmark-check"
          })
        ])
      ], -1)),
      v("p", Ke, se(i.message), 1)
    ]));
  }
}, Je = /* @__PURE__ */ F(Ze, [["__scopeId", "data-v-3f0157c9"]]), Qe = (i, r = {}) => {
  (r.generateUrl || r.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: r.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: r.verifyUrl ?? "/_goal_captcha/verify",
    theme: r.theme ?? "football",
    difficulty: r.difficulty ?? "medium"
  }), i.component("GoalCaptcha", ie), i.component("GoalCanvas", le), i.component("GoalSlider", re), i.component("SuccessAnimation", Je);
}, tt = { install: Qe };
function at() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: i } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((r) => {
      const s = r.querySelector("#goal-captcha-app");
      if (!s) return;
      const t = r.querySelector('input[type="hidden"]'), a = {
        generateUrl: r.dataset.generateUrl,
        verifyUrl: r.dataset.verifyUrl,
        theme: r.dataset.theme ?? "football",
        difficulty: r.dataset.difficulty ?? "medium",
        fieldName: r.dataset.fieldName ?? "captcha_token"
      };
      i(ie, {
        ...a,
        onVerified: (l) => {
          t && (t.value = l);
        }
      }).mount(s);
    });
  });
}
export {
  le as GoalCanvas,
  ie as GoalCaptcha,
  re as GoalSlider,
  Je as SuccessAnimation,
  tt as default,
  at as initBladeMount,
  Qe as install,
  We as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
