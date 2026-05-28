import { ref as E, onMounted as te, onBeforeUnmount as ae, watch as oe, openBlock as L, createElementBlock as D, createElementVNode as _, unref as w, createVNode as q, Transition as ne, withCtx as le, Fragment as me, renderList as pe, createCommentVNode as re, computed as A, normalizeClass as F, normalizeStyle as J, createStaticVNode as ye, withModifiers as V, readonly as H, defineComponent as be, h as y, createBlock as _e, Teleport as ke, toDisplayString as Me } from "vue";
const Y = /* @__PURE__ */ new Map();
async function Se(i) {
  return Y.has(i) ? Y.get(i) : new Promise((s, l) => {
    const t = new Image();
    t.crossOrigin = "anonymous", t.onload = () => {
      Y.set(i, t), s(t);
    }, t.onerror = () => l(new Error(`Failed to load image: ${i}`)), t.src = i;
  });
}
function Q(i, s, l, t) {
  i.beginPath();
  for (let o = 0; o < 5; o++) {
    const n = (o * 72 - 90) * Math.PI / 180;
    o === 0 ? i.moveTo(s + t * Math.cos(n), l + t * Math.sin(n)) : i.lineTo(s + t * Math.cos(n), l + t * Math.sin(n));
  }
  i.closePath(), i.fill();
}
class we {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(s, l) {
    var t;
    this.canvas = s, this.ctx = s.getContext("2d"), this.data = l, this.ballX = l.ball_start_x, this.ballStartX = l.ball_start_x, this.keeperOffsetX = ((t = l.scene) == null ? void 0 : t.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1, this.keeperBaseX = Math.round(s.width * 0.5);
  }
  async preload() {
    const s = this.data.scene.assets ?? {}, l = await Promise.allSettled(
      Object.entries(s).map(async ([t, o]) => {
        const n = await Se(o);
        return [t, n];
      })
    );
    for (const t of l)
      if (t.status === "fulfilled") {
        const [o, n] = t.value;
        this.images[o] = n;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(s) {
    this.ballX = Math.max(0, Math.min(s, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: s, canvas: l, data: t } = this, { width: o, height: n } = l;
    s.clearRect(0, 0, o, n), this._drawBackground(o, n), this._drawGoalPost(o, n), this._drawDecoys(t.scene.decoys ?? []), this._drawTargetRing(t.target_x, n), this._drawGoalkeeper(t.scene, o, n), this._drawBall(n);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(s, l) {
    const t = this.images.stadium;
    if (t) {
      this.ctx.drawImage(t, 0, 0, s, l);
      return;
    }
    const o = this.ctx, n = o.createLinearGradient(0, 0, 0, l * 0.72);
    n.addColorStop(0, "#4e9fc8"), n.addColorStop(0.55, "#6ab9de"), n.addColorStop(1, "#88ccec"), o.fillStyle = n, o.fillRect(0, 0, s, l * 0.72), o.fillStyle = "rgba(58,118,178,0.38)", o.strokeStyle = "rgba(38,98,158,0.28)", o.lineWidth = 1, o.beginPath(), o.moveTo(0, 0), o.lineTo(s * 0.42, 0), o.lineTo(s * 0.3, l * 0.2), o.lineTo(0, l * 0.24), o.closePath(), o.fill(), o.stroke(), o.beginPath(), o.moveTo(s * 0.58, 0), o.lineTo(s, 0), o.lineTo(s, l * 0.24), o.lineTo(s * 0.7, l * 0.2), o.closePath(), o.fill(), o.stroke();
    const r = o.createLinearGradient(0, l * 0.63, 0, l);
    r.addColorStop(0, "#52c148"), r.addColorStop(0.3, "#46b23c"), r.addColorStop(1, "#3aa030"), o.fillStyle = r, o.fillRect(0, l * 0.66, s, l);
    const u = o.createLinearGradient(0, l * 0.62, 0, l * 0.7);
    u.addColorStop(0, "rgba(80,185,70,0)"), u.addColorStop(1, "#52c148"), o.fillStyle = u, o.fillRect(0, l * 0.62, s, l * 0.1), o.fillStyle = "rgba(255,255,255,0.04)";
    for (let g = 0; g < s; g += 36)
      o.fillRect(g, l * 0.66, 18, l * 0.34);
  }
  _drawGoalPost(s, l) {
    const t = this.images.goal_post, o = Math.round(s * 0.07), n = Math.round(s * 0.93), r = Math.round(l * 0.09), u = Math.round(l * 0.88), g = 7, a = Math.round(s * 0.055), c = Math.round(l * 0.1);
    if (t) {
      this.ctx.drawImage(t, o, r, n - o, u - r);
      return;
    }
    const e = this.ctx, h = o + a, m = n - a, p = r - c;
    e.save(), e.save(), e.beginPath(), e.rect(o + g * 0.5, r + g * 0.5, n - o - g, u - r - g * 0.5), e.clip(), e.fillStyle = "rgba(160,200,230,0.07)", e.fillRect(o, r, n - o, u - r), e.strokeStyle = "rgba(170,205,235,0.42)", e.lineWidth = 0.8;
    for (let d = o; d <= n; d += 20)
      e.beginPath(), e.moveTo(d, r), e.lineTo(d, u), e.stroke();
    for (let d = r; d <= u; d += 15)
      e.beginPath(), e.moveTo(o, d), e.lineTo(n, d), e.stroke();
    e.restore(), e.strokeStyle = "rgba(210,225,240,0.72)", e.lineWidth = 3.5, e.lineCap = "round", e.beginPath(), e.moveTo(o, r), e.lineTo(h, p), e.stroke(), e.beginPath(), e.moveTo(n, r), e.lineTo(m, p), e.stroke(), e.beginPath(), e.moveTo(h, p), e.lineTo(m, p), e.stroke(), e.strokeStyle = "rgba(190,215,235,0.48)", e.lineWidth = 2.5, e.beginPath(), e.moveTo(h, p), e.lineTo(h, u), e.stroke(), e.beginPath(), e.moveTo(m, p), e.lineTo(m, u), e.stroke(), e.strokeStyle = "#ffffff", e.lineWidth = g, e.lineCap = "square", e.beginPath(), e.moveTo(o, r), e.lineTo(n, r), e.stroke(), e.beginPath(), e.moveTo(o, r), e.lineTo(o, u), e.stroke(), e.beginPath(), e.moveTo(n, r), e.lineTo(n, u), e.stroke(), e.restore();
  }
  _drawGoalkeeper(s, l, t) {
    const o = this.images.goalkeeper, n = Math.round(this.keeperBaseX + this.keeperOffsetX), r = Math.round(t * 0.16), g = Math.round(t * 0.89) - r;
    if (o) {
      const Z = Math.round(g * 0.52);
      this.ctx.drawImage(o, n - Z / 2, r, Z, g);
      return;
    }
    const a = this.ctx;
    a.save();
    const c = Math.round(g * 0.09), e = r + c, h = Math.round(g * 0.035), m = e + c, p = m + h, d = Math.round(g * 0.27), v = Math.round(g * 0.13), C = Math.round(g * 0.12), k = Math.round(g * 0.14), M = Math.round(g * 0.22), b = 22 * Math.PI / 180, T = Math.round(g * 0.43), X = Math.round(g * 0.058), I = p + d, f = I + v, P = f + C, S = Math.round(M * 1.05), x = Math.round(M * 0.48);
    a.fillStyle = "#111111", a.beginPath(), a.ellipse(n - S, P + k + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), a.fill(), a.beginPath(), a.ellipse(n + S, P + k + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), a.fill(), a.fillStyle = "#f0f0f0", a.fillRect(n - S - x / 2, P, x, k), a.fillRect(n + S - x / 2, P, x, k);
    const N = Math.round(k * 0.2);
    a.fillStyle = "#e63946", a.fillRect(n - S - x / 2, P + k * 0.68, x, N), a.fillRect(n + S - x / 2, P + k * 0.68, x, N), a.fillStyle = "#f0c090", a.fillRect(n - S - x / 2, f, x, C), a.fillRect(n + S - x / 2, f, x, C), a.fillStyle = "#1a1a2e", a.beginPath(), a.moveTo(n - M, I), a.lineTo(n + M, I), a.lineTo(n + S + x / 2, f), a.lineTo(n - S - x / 2, f), a.closePath(), a.fill(), a.fillStyle = "#f4f4f4", a.fillRect(n - M, p, M * 2, d), a.fillStyle = "#1a1a2e", a.fillRect(n - M * 0.45, p, M * 0.9, Math.round(g * 0.025));
    const z = Math.round(M * 1.3), de = Math.round(d * 0.27), ue = p + Math.round(d * 0.36);
    a.fillStyle = "#e63946", a.fillRect(n - z / 2, ue, z, de);
    const $ = p + Math.round(d * 0.06), R = n - M - Math.round(T * Math.cos(b)), B = $ - Math.round(T * Math.sin(b)), W = n + M + Math.round(T * Math.cos(b)), G = $ - Math.round(T * Math.sin(b));
    a.strokeStyle = "#f4f4f4", a.lineWidth = X, a.lineCap = "round", a.beginPath(), a.moveTo(n - M, $), a.lineTo(R, B), a.stroke(), a.beginPath(), a.moveTo(n + M, $), a.lineTo(W, G), a.stroke();
    const O = Math.round(T * 0.14), he = R + Math.round(O * Math.cos(b)), fe = B + Math.round(O * Math.sin(b)), ge = W - Math.round(O * Math.cos(b)), ve = G + Math.round(O * Math.sin(b));
    a.strokeStyle = "#111111", a.lineWidth = X + 2, a.beginPath(), a.moveTo(he, fe), a.lineTo(R, B), a.stroke(), a.beginPath(), a.moveTo(ge, ve), a.lineTo(W, G), a.stroke();
    const U = Math.round(X * 1.9);
    a.fillStyle = "#e6e6e6", a.beginPath(), a.arc(R, B, U, 0, Math.PI * 2), a.fill(), a.beginPath(), a.arc(W, G, U, 0, Math.PI * 2), a.fill(), a.strokeStyle = "#aaaaaa", a.lineWidth = 1, a.beginPath(), a.arc(R, B, U, 0, Math.PI * 2), a.stroke(), a.beginPath(), a.arc(W, G, U, 0, Math.PI * 2), a.stroke();
    const K = Math.round(c * 0.55);
    a.fillStyle = "#f0c090", a.fillRect(n - K / 2, m, K, h + 2), a.fillStyle = "#f0c090", a.beginPath(), a.arc(n, e, c, 0, Math.PI * 2), a.fill(), a.fillStyle = "#1a0f08", a.beginPath(), a.arc(n, e, c, Math.PI * 1.05, Math.PI * 1.95), a.lineTo(n, e), a.closePath(), a.fill(), a.fillStyle = "#e8b07a", a.beginPath(), a.ellipse(n - c * 0.95, e + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), a.fill(), a.beginPath(), a.ellipse(n + c * 0.95, e + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), a.fill(), a.fillStyle = "#1a0f08", a.beginPath(), a.arc(n - c * 0.28, e + c * 0.08, c * 0.09, 0, Math.PI * 2), a.fill(), a.beginPath(), a.arc(n + c * 0.28, e + c * 0.08, c * 0.09, 0, Math.PI * 2), a.fill(), a.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(s, l) {
    const t = s, o = Math.round(l * 0.4), n = Math.round(l * 0.14), r = this.ctx;
    r.save(), r.shadowColor = "rgba(0,0,0,.55)", r.shadowBlur = 14, r.strokeStyle = "rgba(30,30,30,.6)", r.lineWidth = n * 0.58 + 2, r.beginPath(), r.arc(t, o, n, 0, Math.PI * 2), r.stroke(), r.shadowBlur = 0;
    const u = r.createLinearGradient(t - n, o - n, t + n, o + n);
    u.addColorStop(0, "#d4d4d4"), u.addColorStop(0.25, "#a0a0a0"), u.addColorStop(0.5, "#707070"), u.addColorStop(0.75, "#a8a8a8"), u.addColorStop(1, "#cecece"), r.strokeStyle = u, r.lineWidth = n * 0.55, r.beginPath(), r.arc(t, o, n, 0, Math.PI * 2), r.stroke(), r.strokeStyle = "rgba(255,255,255,.45)", r.lineWidth = 3, r.beginPath(), r.arc(t - n * 0.15, o - n * 0.15, n - n * 0.3, Math.PI * 1.05, Math.PI * 1.7), r.stroke(), r.strokeStyle = "rgba(0,0,0,.25)", r.lineWidth = 2, r.beginPath(), r.arc(t, o, n - n * 0.28, 0, Math.PI * 2), r.stroke(), r.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(s) {
    for (const l of s) {
      const t = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${l.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(l.x, t, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(s) {
    const l = this.images.ball, t = Math.round(s * 0.11), o = this.ballX, n = this.data.target_x, r = Math.abs(n - this.ballStartX) || 1, u = Math.max(0, Math.min(1, 1 - Math.abs(o - n) / r)), g = s * 0.82, a = s * 0.4, c = Math.round(g + u * (a - g));
    if (l) {
      this.ctx.drawImage(l, o - t, c - t, t * 2, t * 2);
      return;
    }
    const e = this.ctx;
    e.save(), e.beginPath(), e.rect(0, 0, this.canvas.width, this.canvas.height), e.clip(), e.fillStyle = "rgba(0,0,0,0.22)", e.beginPath(), e.ellipse(o + t * 0.05, c + t * 0.88, t * 0.75, t * 0.18, 0, 0, Math.PI * 2), e.fill();
    const h = e.createRadialGradient(o - t * 0.32, c - t * 0.32, t * 0.04, o, c, t);
    h.addColorStop(0, "#ffffff"), h.addColorStop(0.38, "#f0f0f0"), h.addColorStop(0.75, "#d4d4d4"), h.addColorStop(1, "#aaaaaa"), e.fillStyle = h, e.beginPath(), e.arc(o, c, t, 0, Math.PI * 2), e.fill(), e.save(), e.beginPath(), e.arc(o, c, t - 0.5, 0, Math.PI * 2), e.clip(), e.fillStyle = "#111111", Q(e, o, c, t * 0.28);
    const m = t * 0.58, p = t * 0.23;
    for (let d = 0; d < 5; d++) {
      const v = (d * 72 - 90) * Math.PI / 180;
      Q(e, o + m * Math.cos(v), c + m * Math.sin(v), p);
    }
    e.strokeStyle = "#333333", e.lineWidth = Math.max(0.8, t * 0.055), e.lineCap = "round";
    for (let d = 0; d < 5; d++) {
      const v = (d * 72 - 90) * Math.PI / 180;
      e.beginPath(), e.moveTo(o + t * 0.29 * Math.cos(v), c + t * 0.29 * Math.sin(v)), e.lineTo(o + m * 0.72 * Math.cos(v), c + m * 0.72 * Math.sin(v)), e.stroke();
    }
    e.restore(), e.strokeStyle = "#777777", e.lineWidth = 0.8, e.beginPath(), e.arc(o, c, t, 0, Math.PI * 2), e.stroke(), e.fillStyle = "rgba(255,255,255,0.55)", e.beginPath(), e.ellipse(o - t * 0.28, c - t * 0.3, t * 0.2, t * 0.13, -Math.PI / 5, 0, Math.PI * 2), e.fill(), e.restore();
  }
  destroy() {
  }
}
function Pe(i) {
  return 1 - Math.pow(1 - i, 3);
}
function xe(i, s, l, t, o) {
  let n = null, r = null, u = !1;
  function g(a) {
    if (u) return;
    n === null && (n = a);
    const c = a - n, e = Math.min(c / l, 1), h = i + (s - i) * Pe(e);
    t(h), e < 1 ? r = requestAnimationFrame(g) : o == null || o();
  }
  return r = requestAnimationFrame(g), () => {
    u = !0, r !== null && cancelAnimationFrame(r);
  };
}
const j = (i, s) => {
  const l = i.__vccOpts || i;
  for (const [t, o] of s)
    l[t] = o;
  return l;
}, Ce = { class: "gc-canvas-wrap" }, Te = ["width", "height"], Xe = {
  key: 0,
  class: "gc-canvas__success-overlay",
  "aria-live": "polite"
}, Ee = {
  class: "gc-confetti",
  "aria-hidden": "true"
}, Le = ["data-i"], Ie = {
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
    var u, g, a, c;
    const s = i, l = E(null);
    let t = null, o = null;
    const n = ((g = (u = s.captchaData) == null ? void 0 : u.canvas) == null ? void 0 : g.width) ?? 400, r = ((c = (a = s.captchaData) == null ? void 0 : a.canvas) == null ? void 0 : c.height) ?? 220;
    return te(async () => {
      t = new we(l.value, s.captchaData), await t.preload();
      const e = n, h = s.captchaData.target_x ?? e * 0.65, m = e * 0.11, p = e * 0.89, d = h + 58, v = h - 58;
      function C() {
        const b = [];
        v - m > 30 && b.push([m, v]), p - d > 30 && b.push([d, p]), b.length || b.push([m, p]);
        const [T, X] = b[Math.floor(Math.random() * b.length)];
        return T + Math.random() * (X - T);
      }
      let k = null;
      function M() {
        if (!t) return;
        const b = C(), T = t.keeperBaseX + t.keeperOffsetX, X = 500 + Math.random() * 600, I = 700 + Math.random() * 1e3;
        k = xe(T, b, X, (f) => {
          t && (t.keeperOffsetX = f - t.keeperBaseX, t.draw());
        }, () => {
          t && setTimeout(M, I);
        });
      }
      M(), o = () => {
        k == null || k();
      };
    }), ae(() => {
      o == null || o(), t == null || t.destroy();
    }), oe(
      () => s.ballX,
      (e) => {
        t && e !== null && t.setBallX(e);
      }
    ), (e, h) => (L(), D("div", Ce, [
      _("canvas", {
        ref_key: "canvasEl",
        ref: l,
        width: w(n),
        height: w(r),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, Te),
      q(ne, { name: "gc-success" }, {
        default: le(() => [
          i.showSuccess ? (L(), D("div", Xe, [
            _("div", Ee, [
              (L(), D(me, null, pe(24, (m) => _("span", {
                key: m,
                class: "gc-confetti__piece",
                "data-i": m
              }, null, 8, Le)), 64))
            ]),
            h[0] || (h[0] = _("div", { class: "gc-success-badge" }, [
              _("div", { class: "gc-success-badge__ball" }, "⚽"),
              _("div", { class: "gc-success-badge__banner" }, [
                _("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--left",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  _("path", {
                    d: "M20 0 L0 20 L20 40 Z",
                    fill: "#15803d"
                  })
                ]),
                _("span", { class: "gc-success-badge__text" }, "SUCCESS"),
                _("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--right",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  _("path", {
                    d: "M0 0 L20 20 L0 40 Z",
                    fill: "#15803d"
                  })
                ])
              ])
            ], -1))
          ])) : re("", !0)
        ]),
        _: 1
      })
    ]));
  }
}, se = /* @__PURE__ */ j(Ie, [["__scopeId", "data-v-3a74f965"]]), De = {
  key: 0,
  class: "gc-slider gc-slider--success",
  "aria-label": "Verification successful"
}, Re = ["aria-valuenow", "aria-valuemax", "tabindex"], Be = {
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
  setup(i, { emit: s }) {
    const l = s, t = i, o = E(null), n = E(t.trackWidth / 2), r = E(!1), u = A(() => t.handleSize / 2), g = A(
      () => Math.max(0, Math.min(n.value - u.value, t.trackWidth - t.handleSize))
    ), a = A(() => {
      const d = t.trackWidth / 2, v = n.value - d, C = d - t.handleSize / 2;
      if (C <= 0) return t.ballStartX;
      if (v < 0) {
        const k = t.ballStartX / C;
        return Math.max(0, t.ballStartX + v * k);
      } else {
        const k = (t.trackWidth - t.ballStartX) / C;
        return Math.min(t.trackWidth, t.ballStartX + v * k);
      }
    }), c = A(() => {
      const d = t.trackWidth / 2, v = n.value;
      return v < d ? {
        left: `${v}px`,
        width: `${d - v}px`
      } : {
        left: `${d}px`,
        width: `${v - d}px`
      };
    });
    function e(d) {
      t.disabled || (r.value = !0, l("drag-start"), window.addEventListener("mousemove", h, { passive: !0 }), window.addEventListener("touchmove", h, { passive: !0 }), window.addEventListener("mouseup", m), window.addEventListener("touchend", m));
    }
    function h(d) {
      if (!r.value) return;
      const v = d.touches ? d.touches[0].clientX : d.clientX, C = o.value.getBoundingClientRect(), k = Math.max(u.value, Math.min(v - C.left, t.trackWidth - u.value));
      n.value = k, l("drag-move", a.value, k);
    }
    function m() {
      r.value && (r.value = !1, window.removeEventListener("mousemove", h), window.removeEventListener("touchmove", h), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m), l("drag-end", a.value));
    }
    function p(d) {
      if (t.disabled) return;
      const v = 5;
      d.key === "ArrowRight" ? (r.value || (r.value = !0, l("drag-start")), n.value = Math.min(n.value + v, t.trackWidth - u.value), l("drag-move", a.value)) : d.key === "ArrowLeft" ? (r.value || (r.value = !0, l("drag-start")), n.value = Math.max(n.value - v, u.value), l("drag-move", a.value)) : (d.key === "Enter" || d.key === " ") && r.value && m();
    }
    return ae(() => {
      window.removeEventListener("mousemove", h), window.removeEventListener("touchmove", h), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m);
    }), (d, v) => i.success ? (L(), D("div", De, [...v[0] || (v[0] = [
      _("div", { class: "gc-slider__success-check" }, [
        _("svg", {
          viewBox: "0 0 44 44",
          fill: "none",
          "aria-hidden": "true"
        }, [
          _("circle", {
            cx: "22",
            cy: "22",
            r: "20",
            fill: "#16a34a"
          }),
          _("path", {
            d: "M13 22.5l6.5 6.5 11-13",
            stroke: "#fff",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ])
      ], -1)
    ])])) : (L(), D("div", {
      key: 1,
      class: F(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": r.value }]),
      ref_key: "trackEl",
      ref: o,
      role: "slider",
      "aria-valuenow": Math.round(n.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: p
    }, [
      _("div", {
        class: "gc-slider__fill",
        style: J(c.value)
      }, null, 4),
      v[2] || (v[2] = ye('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span></div>', 2)),
      _("div", {
        class: F(["gc-slider__handle", { "is-dragging": r.value }]),
        style: J({ left: g.value + "px" }),
        onMousedown: V(e, ["prevent"]),
        onTouchstart: V(e, ["prevent"]),
        "aria-hidden": "true"
      }, [...v[1] || (v[1] = [
        _("svg", {
          class: "gc-slider__handle-icon",
          viewBox: "0 0 32 18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          _("path", {
            d: "M1 9h30M23 3l8 6-8 6M9 3L1 9l8 6",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])], 38)
    ], 42, Re));
  }
}, ie = /* @__PURE__ */ j(Be, [["__scopeId", "data-v-4210077b"]]);
function We() {
  let i = [], s = null, l = !1;
  function t() {
    i = [], s = null, l = !1;
  }
  function o() {
    s = performance.now(), l = !0;
  }
  function n(a) {
    if (!l || s === null) return;
    const c = Math.round(performance.now() - s);
    i.length > 0 && c - i[i.length - 1].t < 8 || i.push({ x: Math.round(a), t: c });
  }
  function r() {
    l = !1;
  }
  function u() {
    return [...i];
  }
  function g() {
    return s === null ? 0 : Math.round(performance.now() - s);
  }
  return { reset: t, start: o, record: n, stop: r, getTrack: u, getElapsed: g };
}
function Ge() {
  if (typeof document > "u") return null;
  const i = document.querySelector('meta[name="csrf-token"]');
  if (i != null && i.content) return i.content;
  const s = document.cookie.split("; ").find((l) => l.startsWith("XSRF-TOKEN="));
  return s ? decodeURIComponent(s.split("=")[1]) : null;
}
function ee() {
  const i = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, s = Ge();
  return s && (i["X-CSRF-TOKEN"] = s, i["X-XSRF-TOKEN"] = s), i;
}
function Ae(i, s) {
  const l = E("idle"), t = E(null), o = E(null), n = E(null), r = We();
  async function u() {
    l.value = "loading", o.value = null, t.value = null;
    try {
      const h = await fetch(i, {
        method: "POST",
        headers: ee(),
        credentials: "same-origin"
      });
      if (!h.ok) throw new Error(`Server error: ${h.status}`);
      n.value = await h.json(), l.value = "ready";
    } catch (h) {
      l.value = "failed", o.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", h);
    }
  }
  function g() {
    l.value === "ready" && (l.value = "dragging", r.reset(), r.start());
  }
  function a(h) {
    l.value === "dragging" && r.record(h);
  }
  async function c(h) {
    if (l.value !== "dragging") return;
    r.stop(), l.value = "verifying";
    const m = r.getTrack(), p = r.getElapsed();
    try {
      const v = await (await fetch(s, {
        method: "POST",
        headers: ee(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: n.value.captcha_id,
          final_x: Math.round(h),
          drag_time: p,
          movement_track: m
        })
      })).json();
      v.success ? (t.value = v.token, l.value = "success") : (o.value = v.message ?? "Verification failed.", l.value = "failed");
    } catch (d) {
      l.value = "failed", o.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", d);
    }
  }
  async function e() {
    r.reset(), await u();
  }
  return {
    state: H(l),
    token: H(t),
    errorMsg: H(o),
    captchaData: H(n),
    load: u,
    onDragStart: g,
    onDragMove: a,
    onDragEnd: c,
    retry: e
  };
}
const Ne = ["data-state"], $e = ["data-state"], ce = {
  __name: "GoalCaptcha",
  props: {
    /** 'inline' renders inside the page; 'modal' opens as an overlay. */
    mode: {
      type: String,
      default: "inline",
      validator: (i) => ["inline", "modal"].includes(i)
    },
    /**
     * Modal mode only: CSS selector or HTMLFormElement of the form to intercept.
     * When the form's submit event fires, the modal opens instead.
     * On successful verify, the form is submitted automatically.
     */
    form: {
      type: String,
      default: null
    },
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
  emits: ["verified", "failed", "loaded", "close", "open"],
  setup(i, { expose: s, emit: l }) {
    const t = i, o = l, n = A(() => t.mode === "modal"), r = E(!1);
    let u = null;
    function g() {
      r.value = !0, o("open"), !p.value || e.value === "failed" ? M() : e.value === "idle" && d();
    }
    function a() {
      r.value = !1, o("close");
    }
    function c() {
      t.closable && a();
    }
    const {
      state: e,
      token: h,
      errorMsg: m,
      captchaData: p,
      load: d,
      onDragStart: v,
      onDragMove: C,
      onDragEnd: k,
      retry: M
    } = Ae(t.generateUrl, t.verifyUrl), b = E(null);
    function T(f, P) {
      b.value = f, C(P ?? f);
    }
    function X(f) {
      b.value = f, k(f);
    }
    oe(e, (f) => {
      var P;
      if (f === "success" && (b.value = ((P = p.value) == null ? void 0 : P.target_x) ?? b.value, o("verified", h.value), n.value && u)) {
        a();
        let S = u.querySelector(`input[name="${t.fieldName}"]`);
        S || (S = document.createElement("input"), S.type = "hidden", S.name = t.fieldName, u.appendChild(S)), S.value = h.value, setTimeout(() => u.submit(), 600);
      }
      f === "failed" && (o("failed", m.value), p.value && setTimeout(() => {
        b.value = null, M();
      }, 1400)), f === "ready" && o("loaded", p.value);
    }), te(() => {
      n.value && t.form && (u = typeof t.form == "string" ? document.querySelector(t.form) : t.form, u && u.addEventListener("submit", (f) => {
        u.dataset.gcVerified !== "1" && (f.preventDefault(), g());
      })), t.autoLoad && d();
    }), s({ open: g, close: a });
    const I = be({
      name: "CaptchaCard",
      props: {
        state: String,
        captchaData: Object,
        currentBallX: Number,
        errorMsg: String,
        closable: Boolean,
        fieldName: String,
        token: String
      },
      emits: ["close", "load", "retry", "drag-start", "drag-move", "drag-end"],
      setup(f, { emit: P }) {
        return () => {
          var S;
          return [
            // ── Header
            y("div", { class: "gc-modal__header" }, [
              y("div", { class: "gc-modal__header-text" }, [
                y("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
                y("p", { class: "gc-modal__subtitle" }, "Drag the slider to score a goal")
              ]),
              f.closable ? y("button", {
                type: "button",
                class: "gc-modal__close",
                "aria-label": "Close",
                onClick: () => P("close")
              }, [
                y("svg", { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round" }, [
                  y("line", { x1: 18, y1: 6, x2: 6, y2: 18 }),
                  y("line", { x1: 6, y1: 6, x2: 18, y2: 18 })
                ])
              ]) : null
            ]),
            // ── Scene
            y("div", { class: "gc-modal__scene" }, [
              f.state === "loading" ? y("div", { class: "gc-modal__skeleton", "aria-busy": "true" }) : f.captchaData ? [
                y(se, {
                  captchaData: f.captchaData,
                  ballX: f.currentBallX,
                  showSuccess: f.state === "success"
                }),
                f.state === "verifying" ? y("div", { class: "gc-modal__verifying", "aria-live": "polite" }, [
                  y("span", { class: "gc-spinner", "aria-hidden": "true" }),
                  y("span", {}, "Verifying…")
                ]) : null,
                f.state === "failed" ? y("div", { class: "gc-modal__verifying gc-modal__verifying--failed", "aria-live": "assertive" }, [
                  y("span", { class: "gc-icon-miss", "aria-hidden": "true" }, "❌"),
                  y("span", {}, "Missed! Retrying…")
                ]) : null
              ] : f.state === "failed" ? y("div", { class: "gc-modal__error-scene", role: "alert" }, [
                y("div", { class: "gc-modal__error-icon", "aria-hidden": "true" }, "⚽"),
                y("p", { class: "gc-modal__error-msg" }, f.errorMsg ?? "Verification failed. Please try again.")
              ]) : y("div", { class: "gc-modal__idle" }, [
                y("button", { type: "button", class: "gc-btn-primary", onClick: () => P("load") }, "Start Verification")
              ])
            ]),
            // ── Slider
            y("div", { class: "gc-modal__slider-wrap" }, [
              f.captchaData ? y(ie, {
                ballStartX: f.captchaData.ball_start_x,
                trackWidth: ((S = f.captchaData.canvas) == null ? void 0 : S.width) ?? 400,
                success: f.state === "success",
                disabled: f.state === "verifying" || f.state === "success",
                onDragStart: () => P("drag-start"),
                onDragMove: (x, N) => P("drag-move", x, N),
                onDragEnd: (x) => P("drag-end", x)
              }) : f.state === "loading" ? y("div", { class: "gc-modal__slider-skeleton" }) : y("div", { class: "gc-modal__error-actions" }, [
                y("button", { type: "button", class: "gc-btn-primary", onClick: () => P("retry") }, "↺ Try again")
              ])
            ]),
            // ── Hidden token (inline mode — appended to surrounding form)
            f.token ? y("input", { type: "hidden", name: f.fieldName, value: f.token }) : null
          ];
        };
      }
    });
    return (f, P) => n.value ? (L(), _e(ke, {
      key: 0,
      to: "body"
    }, [
      q(ne, { name: "gc-backdrop" }, {
        default: le(() => [
          r.value ? (L(), D("div", {
            key: 0,
            class: "gc-backdrop",
            "aria-modal": "true",
            role: "dialog",
            "aria-label": "Football goal CAPTCHA verification",
            onClick: V(c, ["self"])
          }, [
            _("div", {
              class: F(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
              "data-state": w(e)
            }, [
              q(w(I), {
                state: w(e),
                "captcha-data": w(p),
                "current-ball-x": b.value,
                "error-msg": w(m),
                closable: i.closable,
                "field-name": i.fieldName,
                token: w(h),
                onClose: a,
                onLoad: w(d),
                onRetry: w(M),
                onDragStart: w(v),
                onDragMove: T,
                onDragEnd: X
              }, null, 8, ["state", "captcha-data", "current-ball-x", "error-msg", "closable", "field-name", "token", "onLoad", "onRetry", "onDragStart"])
            ], 10, Ne)
          ])) : re("", !0)
        ]),
        _: 1
      })
    ])) : (L(), D("div", {
      key: 1,
      class: F(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
      "data-state": w(e)
    }, [
      q(w(I), {
        state: w(e),
        "captcha-data": w(p),
        "current-ball-x": b.value,
        "error-msg": w(m),
        closable: !1,
        "field-name": i.fieldName,
        token: w(h),
        onLoad: w(d),
        onRetry: w(M),
        onDragStart: w(v),
        onDragMove: T,
        onDragEnd: X
      }, null, 8, ["state", "captcha-data", "current-ball-x", "error-msg", "field-name", "token", "onLoad", "onRetry", "onDragStart"])
    ], 10, $e));
  }
}, Oe = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Ue = { class: "goal-captcha__success-text" }, He = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(i) {
    return (s, l) => (L(), D("div", Oe, [
      l[0] || (l[0] = _("div", { class: "goal-captcha__success-icon" }, [
        _("svg", {
          viewBox: "0 0 52 52",
          class: "goal-captcha__checkmark",
          "aria-hidden": "true"
        }, [
          _("circle", {
            cx: "26",
            cy: "26",
            r: "25",
            fill: "none",
            class: "goal-captcha__checkmark-circle"
          }),
          _("path", {
            fill: "none",
            d: "M14 27l8 8 16-16",
            class: "goal-captcha__checkmark-check"
          })
        ])
      ], -1)),
      _("p", Ue, Me(i.message), 1)
    ]));
  }
}, qe = /* @__PURE__ */ j(He, [["__scopeId", "data-v-3f0157c9"]]), Fe = (i, s = {}) => {
  (s.generateUrl || s.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: s.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: s.verifyUrl ?? "/_goal_captcha/verify",
    theme: s.theme ?? "football",
    difficulty: s.difficulty ?? "medium"
  }), i.component("GoalCaptcha", ce), i.component("GoalCanvas", se), i.component("GoalSlider", ie), i.component("SuccessAnimation", qe);
}, Ve = { install: Fe };
function je() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: i } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((s) => {
      const l = s.querySelector("#goal-captcha-app");
      if (!l) return;
      const t = s.querySelector('input[type="hidden"]'), o = {
        generateUrl: s.dataset.generateUrl,
        verifyUrl: s.dataset.verifyUrl,
        theme: s.dataset.theme ?? "football",
        difficulty: s.dataset.difficulty ?? "medium",
        fieldName: s.dataset.fieldName ?? "captcha_token"
      };
      i(ce, {
        ...o,
        onVerified: (r) => {
          t && (t.value = r);
        }
      }).mount(l);
    });
  });
}
export {
  se as GoalCanvas,
  ce as GoalCaptcha,
  ie as GoalSlider,
  qe as SuccessAnimation,
  Ve as default,
  je as initBladeMount,
  Fe as install,
  Ae as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
