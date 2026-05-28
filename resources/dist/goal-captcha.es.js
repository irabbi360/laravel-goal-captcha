import { ref as S, onMounted as H, onBeforeUnmount as F, watch as q, openBlock as y, createElementBlock as k, createElementVNode as g, unref as p, createVNode as V, Transition as ee, withCtx as te, Fragment as j, renderList as ae, createCommentVNode as x, computed as T, normalizeClass as G, normalizeStyle as $, createStaticVNode as oe, withModifiers as U, readonly as E, toDisplayString as Y, createBlock as ne } from "vue";
const X = /* @__PURE__ */ new Map();
async function se(i) {
  return X.has(i) ? X.get(i) : new Promise((s, n) => {
    const a = new Image();
    a.crossOrigin = "anonymous", a.onload = () => {
      X.set(i, a), s(a);
    }, a.onerror = () => n(new Error(`Failed to load image: ${i}`)), a.src = i;
  });
}
function N(i, s, n, a) {
  i.beginPath();
  for (let e = 0; e < 5; e++) {
    const o = (e * 72 - 90) * Math.PI / 180;
    e === 0 ? i.moveTo(s + a * Math.cos(o), n + a * Math.sin(o)) : i.lineTo(s + a * Math.cos(o), n + a * Math.sin(o));
  }
  i.closePath(), i.fill();
}
class le {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(s, n) {
    var o;
    this.canvas = s, this.ctx = s.getContext("2d"), this.data = n, this.ballX = n.ball_start_x, this.ballStartX = n.ball_start_x, this.keeperOffsetX = ((o = n.scene) == null ? void 0 : o.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1;
    const a = s.width, e = n.target_x ?? a * 0.65;
    this.keeperBaseX = e >= a * 0.5 ? Math.round(a * 0.26) : Math.round(a * 0.74);
  }
  async preload() {
    const s = this.data.scene.assets ?? {}, n = await Promise.allSettled(
      Object.entries(s).map(async ([a, e]) => {
        const o = await se(e);
        return [a, o];
      })
    );
    for (const a of n)
      if (a.status === "fulfilled") {
        const [e, o] = a.value;
        this.images[e] = o;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(s) {
    this.ballX = Math.max(0, Math.min(s, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: s, canvas: n, data: a } = this, { width: e, height: o } = n;
    s.clearRect(0, 0, e, o), this._drawBackground(e, o), this._drawGoalPost(e, o), this._drawDecoys(a.scene.decoys ?? []), this._drawTargetRing(a.target_x, o), this._drawGoalkeeper(a.scene, e, o), this._drawBall(o);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(s, n) {
    const a = this.images.stadium;
    if (a) {
      this.ctx.drawImage(a, 0, 0, s, n);
      return;
    }
    const e = this.ctx, o = e.createLinearGradient(0, 0, 0, n * 0.72);
    o.addColorStop(0, "#4e9fc8"), o.addColorStop(0.55, "#6ab9de"), o.addColorStop(1, "#88ccec"), e.fillStyle = o, e.fillRect(0, 0, s, n * 0.72), e.fillStyle = "rgba(58,118,178,0.38)", e.strokeStyle = "rgba(38,98,158,0.28)", e.lineWidth = 1, e.beginPath(), e.moveTo(0, 0), e.lineTo(s * 0.42, 0), e.lineTo(s * 0.3, n * 0.2), e.lineTo(0, n * 0.24), e.closePath(), e.fill(), e.stroke(), e.beginPath(), e.moveTo(s * 0.58, 0), e.lineTo(s, 0), e.lineTo(s, n * 0.24), e.lineTo(s * 0.7, n * 0.2), e.closePath(), e.fill(), e.stroke();
    const l = e.createLinearGradient(0, n * 0.63, 0, n);
    l.addColorStop(0, "#52c148"), l.addColorStop(0.3, "#46b23c"), l.addColorStop(1, "#3aa030"), e.fillStyle = l, e.fillRect(0, n * 0.66, s, n);
    const d = e.createLinearGradient(0, n * 0.62, 0, n * 0.7);
    d.addColorStop(0, "rgba(80,185,70,0)"), d.addColorStop(1, "#52c148"), e.fillStyle = d, e.fillRect(0, n * 0.62, s, n * 0.1), e.fillStyle = "rgba(255,255,255,0.04)";
    for (let v = 0; v < s; v += 36)
      e.fillRect(v, n * 0.66, 18, n * 0.34);
  }
  _drawGoalPost(s, n) {
    const a = this.images.goal_post, e = Math.round(s * 0.07), o = Math.round(s * 0.93), l = Math.round(n * 0.09), d = Math.round(n * 0.88), v = 7, r = Math.round(s * 0.055), h = Math.round(n * 0.1);
    if (a) {
      this.ctx.drawImage(a, e, l, o - e, d - l);
      return;
    }
    const t = this.ctx, f = e + r, m = o - r, b = l - h;
    t.save(), t.save(), t.beginPath(), t.rect(e + v * 0.5, l + v * 0.5, o - e - v, d - l - v * 0.5), t.clip(), t.fillStyle = "rgba(160,200,230,0.07)", t.fillRect(e, l, o - e, d - l), t.strokeStyle = "rgba(170,205,235,0.42)", t.lineWidth = 0.8;
    for (let u = e; u <= o; u += 20)
      t.beginPath(), t.moveTo(u, l), t.lineTo(u, d), t.stroke();
    for (let u = l; u <= d; u += 15)
      t.beginPath(), t.moveTo(e, u), t.lineTo(o, u), t.stroke();
    t.restore(), t.strokeStyle = "rgba(210,225,240,0.72)", t.lineWidth = 3.5, t.lineCap = "round", t.beginPath(), t.moveTo(e, l), t.lineTo(f, b), t.stroke(), t.beginPath(), t.moveTo(o, l), t.lineTo(m, b), t.stroke(), t.beginPath(), t.moveTo(f, b), t.lineTo(m, b), t.stroke(), t.strokeStyle = "rgba(190,215,235,0.48)", t.lineWidth = 2.5, t.beginPath(), t.moveTo(f, b), t.lineTo(f, d), t.stroke(), t.beginPath(), t.moveTo(m, b), t.lineTo(m, d), t.stroke(), t.strokeStyle = "#ffffff", t.lineWidth = v, t.lineCap = "square", t.beginPath(), t.moveTo(e, l), t.lineTo(o, l), t.stroke(), t.beginPath(), t.moveTo(e, l), t.lineTo(e, d), t.stroke(), t.beginPath(), t.moveTo(o, l), t.lineTo(o, d), t.stroke(), t.restore();
  }
  _drawGoalkeeper(s, n, a) {
    const e = this.images.goalkeeper, o = Math.round(this.keeperBaseX + this.keeperOffsetX), l = Math.round(a * 0.16), v = Math.round(a * 0.89) - l;
    if (e) {
      const A = Math.round(v * 0.52);
      this.ctx.drawImage(e, o - A / 2, l, A, v);
      return;
    }
    const r = this.ctx;
    r.save();
    const h = Math.round(v * 0.09), t = l + h, f = t + h + Math.round(v * 0.025), m = Math.round(v * 0.3), b = Math.round(v * 0.16), u = Math.round(v * 0.21), c = Math.round(v * 0.21), _ = Math.round(v * 0.055), M = Math.round(v * 0.4), w = 40 * Math.PI / 180, P = f + m + b, I = Math.round(c * 0.44);
    r.fillStyle = "#111111", r.beginPath(), r.ellipse(o - c * 0.52, P + u + h * 0.35, h * 0.8, h * 0.35, 0, 0, Math.PI * 2), r.fill(), r.beginPath(), r.ellipse(o + c * 0.52, P + u + h * 0.35, h * 0.8, h * 0.35, 0, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1c1c2e", r.fillRect(o - c * 0.75, P, I, u), r.fillRect(o + c * 0.75 - I, P, I, u), r.fillStyle = "#1c1c2e", r.fillRect(o - c, f + m, c * 2, b), r.fillStyle = "#f2f2f2", r.fillRect(o - c, f, c * 2, m);
    const J = Math.round(m * 0.26), Q = f + Math.round(m * 0.38);
    r.fillStyle = "#e63946", r.fillRect(o - c, Q, c * 2, J);
    const C = f + Math.round(m * 0.1), B = o - c - Math.round(M * Math.cos(w)), D = C - Math.round(M * Math.sin(w)), R = o + c + Math.round(M * Math.cos(w)), W = C - Math.round(M * Math.sin(w));
    r.strokeStyle = "#f2f2f2", r.lineWidth = _, r.lineCap = "round", r.beginPath(), r.moveTo(o - c, C), r.lineTo(B, D), r.stroke(), r.beginPath(), r.moveTo(o + c, C), r.lineTo(R, W), r.stroke(), r.fillStyle = "#c8d5e2", r.beginPath(), r.arc(B, D, _ * 1.6, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(R, W, _ * 1.6, 0, Math.PI * 2), r.fill(), r.fillStyle = "#f0c090", r.beginPath(), r.arc(o, t, h, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(o, t, h, Math.PI, 0), r.closePath(), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(o - h * 0.28, t + h * 0.08, h * 0.09, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(o + h * 0.28, t + h * 0.08, h * 0.09, 0, Math.PI * 2), r.fill(), r.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(s, n) {
    const a = s, e = Math.round(n * 0.4), o = Math.round(n * 0.14), l = this.ctx;
    l.save(), l.shadowColor = "rgba(0,0,0,.55)", l.shadowBlur = 14, l.strokeStyle = "rgba(30,30,30,.6)", l.lineWidth = o * 0.58 + 2, l.beginPath(), l.arc(a, e, o, 0, Math.PI * 2), l.stroke(), l.shadowBlur = 0;
    const d = l.createLinearGradient(a - o, e - o, a + o, e + o);
    d.addColorStop(0, "#d4d4d4"), d.addColorStop(0.25, "#a0a0a0"), d.addColorStop(0.5, "#707070"), d.addColorStop(0.75, "#a8a8a8"), d.addColorStop(1, "#cecece"), l.strokeStyle = d, l.lineWidth = o * 0.55, l.beginPath(), l.arc(a, e, o, 0, Math.PI * 2), l.stroke(), l.strokeStyle = "rgba(255,255,255,.45)", l.lineWidth = 3, l.beginPath(), l.arc(a - o * 0.15, e - o * 0.15, o - o * 0.3, Math.PI * 1.05, Math.PI * 1.7), l.stroke(), l.strokeStyle = "rgba(0,0,0,.25)", l.lineWidth = 2, l.beginPath(), l.arc(a, e, o - o * 0.28, 0, Math.PI * 2), l.stroke(), l.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(s) {
    for (const n of s) {
      const a = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${n.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(n.x, a, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(s) {
    const n = this.images.ball, a = Math.round(s * 0.11), e = this.ballX, o = this.data.target_x, l = Math.abs(o - this.ballStartX) || 1, d = Math.max(0, Math.min(1, 1 - Math.abs(e - o) / l)), v = s * 0.82, r = s * 0.4, h = Math.round(v + d * (r - v));
    if (n) {
      this.ctx.drawImage(n, e - a, h - a, a * 2, a * 2);
      return;
    }
    const t = this.ctx;
    t.save(), t.beginPath(), t.rect(0, 0, this.canvas.width, this.canvas.height), t.clip(), t.fillStyle = "rgba(0,0,0,0.22)", t.beginPath(), t.ellipse(e + a * 0.05, h + a * 0.88, a * 0.75, a * 0.18, 0, 0, Math.PI * 2), t.fill();
    const f = t.createRadialGradient(e - a * 0.32, h - a * 0.32, a * 0.04, e, h, a);
    f.addColorStop(0, "#ffffff"), f.addColorStop(0.38, "#f0f0f0"), f.addColorStop(0.75, "#d4d4d4"), f.addColorStop(1, "#aaaaaa"), t.fillStyle = f, t.beginPath(), t.arc(e, h, a, 0, Math.PI * 2), t.fill(), t.save(), t.beginPath(), t.arc(e, h, a - 0.5, 0, Math.PI * 2), t.clip(), t.fillStyle = "#111111", N(t, e, h, a * 0.28);
    const m = a * 0.58, b = a * 0.23;
    for (let u = 0; u < 5; u++) {
      const c = (u * 72 - 90) * Math.PI / 180;
      N(t, e + m * Math.cos(c), h + m * Math.sin(c), b);
    }
    t.strokeStyle = "#333333", t.lineWidth = Math.max(0.8, a * 0.055), t.lineCap = "round";
    for (let u = 0; u < 5; u++) {
      const c = (u * 72 - 90) * Math.PI / 180;
      t.beginPath(), t.moveTo(e + a * 0.29 * Math.cos(c), h + a * 0.29 * Math.sin(c)), t.lineTo(e + m * 0.72 * Math.cos(c), h + m * 0.72 * Math.sin(c)), t.stroke();
    }
    t.restore(), t.strokeStyle = "#777777", t.lineWidth = 0.8, t.beginPath(), t.arc(e, h, a, 0, Math.PI * 2), t.stroke(), t.fillStyle = "rgba(255,255,255,0.55)", t.beginPath(), t.ellipse(e - a * 0.28, h - a * 0.3, a * 0.2, a * 0.13, -Math.PI / 5, 0, Math.PI * 2), t.fill(), t.restore();
  }
  destroy() {
  }
}
function re(i, s, n, a) {
  let e = null, o = !0;
  function l(d) {
    if (!o) return;
    const v = d % n / n * Math.PI * 2, r = i + (s - i) * (0.5 + 0.5 * Math.sin(v));
    a(r), e = requestAnimationFrame(l);
  }
  return e = requestAnimationFrame(l), () => {
    o = !1, e !== null && cancelAnimationFrame(e);
  };
}
const L = (i, s) => {
  const n = i.__vccOpts || i;
  for (const [a, e] of s)
    n[a] = e;
  return n;
}, ie = { class: "gc-canvas-wrap" }, ce = ["width", "height"], de = {
  key: 0,
  class: "gc-canvas__success-overlay",
  "aria-live": "polite"
}, ue = {
  class: "gc-confetti",
  "aria-hidden": "true"
}, he = ["data-i"], fe = {
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
    var d, v, r, h;
    const s = i, n = S(null);
    let a = null, e = null;
    const o = ((v = (d = s.captchaData) == null ? void 0 : d.canvas) == null ? void 0 : v.width) ?? 400, l = ((h = (r = s.captchaData) == null ? void 0 : r.canvas) == null ? void 0 : h.height) ?? 220;
    return H(async () => {
      var f;
      a = new le(n.value, s.captchaData), await a.preload();
      const t = ((f = s.captchaData.scene) == null ? void 0 : f.keeper_offset_x) ?? 0;
      e = re(
        t - 8,
        t + 8,
        2400,
        (m) => {
          a && (a.keeperOffsetX = m, a.draw());
        }
      );
    }), F(() => {
      e == null || e(), a == null || a.destroy();
    }), q(
      () => s.ballX,
      (t) => {
        a && t !== null && a.setBallX(t);
      }
    ), (t, f) => (y(), k("div", ie, [
      g("canvas", {
        ref_key: "canvasEl",
        ref: n,
        width: p(o),
        height: p(l),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, ce),
      V(ee, { name: "gc-success" }, {
        default: te(() => [
          i.showSuccess ? (y(), k("div", de, [
            g("div", ue, [
              (y(), k(j, null, ae(24, (m) => g("span", {
                key: m,
                class: "gc-confetti__piece",
                "data-i": m
              }, null, 8, he)), 64))
            ]),
            f[0] || (f[0] = g("div", { class: "gc-success-badge" }, [
              g("div", { class: "gc-success-badge__ball" }, "⚽"),
              g("div", { class: "gc-success-badge__banner" }, [
                g("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--left",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  g("path", {
                    d: "M20 0 L0 20 L20 40 Z",
                    fill: "#15803d"
                  })
                ]),
                g("span", { class: "gc-success-badge__text" }, "SUCCESS"),
                g("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--right",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  g("path", {
                    d: "M0 0 L20 20 L0 40 Z",
                    fill: "#15803d"
                  })
                ])
              ])
            ], -1))
          ])) : x("", !0)
        ]),
        _: 1
      })
    ]));
  }
}, z = /* @__PURE__ */ L(fe, [["__scopeId", "data-v-7d16f725"]]), ge = {
  key: 0,
  class: "gc-slider gc-slider--success",
  "aria-label": "Verification successful"
}, ve = ["aria-valuenow", "aria-valuemax", "tabindex"], me = {
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
    const n = s, a = i, e = S(null), o = S(a.trackWidth / 2), l = S(!1), d = T(() => a.handleSize / 2), v = T(
      () => Math.max(0, Math.min(o.value - d.value, a.trackWidth - a.handleSize))
    ), r = T(() => {
      const u = a.trackWidth / 2, c = o.value - u, _ = u - a.handleSize / 2;
      if (_ <= 0) return a.ballStartX;
      if (c < 0) {
        const M = a.ballStartX / _;
        return Math.max(0, a.ballStartX + c * M);
      } else {
        const M = (a.trackWidth - a.ballStartX) / _;
        return Math.min(a.trackWidth, a.ballStartX + c * M);
      }
    }), h = T(() => {
      const u = a.trackWidth / 2, c = o.value;
      return c < u ? {
        left: `${c}px`,
        width: `${u - c}px`
      } : {
        left: `${u}px`,
        width: `${c - u}px`
      };
    });
    function t(u) {
      a.disabled || (l.value = !0, n("drag-start"), window.addEventListener("mousemove", f, { passive: !0 }), window.addEventListener("touchmove", f, { passive: !0 }), window.addEventListener("mouseup", m), window.addEventListener("touchend", m));
    }
    function f(u) {
      if (!l.value) return;
      const c = u.touches ? u.touches[0].clientX : u.clientX, _ = e.value.getBoundingClientRect(), M = Math.max(d.value, Math.min(c - _.left, a.trackWidth - d.value));
      o.value = M, n("drag-move", r.value, M);
    }
    function m() {
      l.value && (l.value = !1, window.removeEventListener("mousemove", f), window.removeEventListener("touchmove", f), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m), n("drag-end", r.value));
    }
    function b(u) {
      if (a.disabled) return;
      const c = 5;
      u.key === "ArrowRight" ? (l.value || (l.value = !0, n("drag-start")), o.value = Math.min(o.value + c, a.trackWidth - d.value), n("drag-move", r.value)) : u.key === "ArrowLeft" ? (l.value || (l.value = !0, n("drag-start")), o.value = Math.max(o.value - c, d.value), n("drag-move", r.value)) : (u.key === "Enter" || u.key === " ") && l.value && m();
    }
    return F(() => {
      window.removeEventListener("mousemove", f), window.removeEventListener("touchmove", f), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m);
    }), (u, c) => i.success ? (y(), k("div", ge, [...c[0] || (c[0] = [
      g("div", { class: "gc-slider__success-check" }, [
        g("svg", {
          viewBox: "0 0 44 44",
          fill: "none",
          "aria-hidden": "true"
        }, [
          g("circle", {
            cx: "22",
            cy: "22",
            r: "20",
            fill: "#16a34a"
          }),
          g("path", {
            d: "M13 22.5l6.5 6.5 11-13",
            stroke: "#fff",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ])
      ], -1)
    ])])) : (y(), k("div", {
      key: 1,
      class: G(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": l.value }]),
      ref_key: "trackEl",
      ref: e,
      role: "slider",
      "aria-valuenow": Math.round(o.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: b
    }, [
      g("div", {
        class: "gc-slider__fill",
        style: $(h.value)
      }, null, 4),
      c[2] || (c[2] = oe('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-d4fd89b3><span class="gc-slider__chev" data-v-d4fd89b3>❮</span><span class="gc-slider__chev" data-v-d4fd89b3>❮</span><span class="gc-slider__chev" data-v-d4fd89b3>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-d4fd89b3><span class="gc-slider__chev" data-v-d4fd89b3>❯</span><span class="gc-slider__chev" data-v-d4fd89b3>❯</span><span class="gc-slider__chev" data-v-d4fd89b3>❯</span></div>', 2)),
      g("div", {
        class: G(["gc-slider__handle", { "is-dragging": l.value }]),
        style: $({ left: v.value + "px" }),
        onMousedown: U(t, ["prevent"]),
        onTouchstart: U(t, ["prevent"]),
        "aria-hidden": "true"
      }, [...c[1] || (c[1] = [
        g("svg", {
          class: "gc-slider__handle-icon",
          viewBox: "0 0 32 18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          g("path", {
            d: "M1 9h30M23 3l8 6-8 6M9 3L1 9l8 6",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])], 38)
    ], 42, ve));
  }
}, K = /* @__PURE__ */ L(me, [["__scopeId", "data-v-d4fd89b3"]]);
function _e() {
  let i = [], s = null, n = !1;
  function a() {
    i = [], s = null, n = !1;
  }
  function e() {
    s = performance.now(), n = !0;
  }
  function o(r) {
    if (!n || s === null) return;
    const h = Math.round(performance.now() - s);
    i.length > 0 && h - i[i.length - 1].t < 8 || i.push({ x: Math.round(r), t: h });
  }
  function l() {
    n = !1;
  }
  function d() {
    return [...i];
  }
  function v() {
    return s === null ? 0 : Math.round(performance.now() - s);
  }
  return { reset: a, start: e, record: o, stop: l, getTrack: d, getElapsed: v };
}
function pe() {
  if (typeof document > "u") return null;
  const i = document.querySelector('meta[name="csrf-token"]');
  if (i != null && i.content) return i.content;
  const s = document.cookie.split("; ").find((n) => n.startsWith("XSRF-TOKEN="));
  return s ? decodeURIComponent(s.split("=")[1]) : null;
}
function O() {
  const i = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, s = pe();
  return s && (i["X-CSRF-TOKEN"] = s, i["X-XSRF-TOKEN"] = s), i;
}
function ye(i, s) {
  const n = S("idle"), a = S(null), e = S(null), o = S(null), l = _e();
  async function d() {
    n.value = "loading", e.value = null, a.value = null;
    try {
      const f = await fetch(i, {
        method: "POST",
        headers: O(),
        credentials: "same-origin"
      });
      if (!f.ok) throw new Error(`Server error: ${f.status}`);
      o.value = await f.json(), n.value = "ready";
    } catch (f) {
      n.value = "failed", e.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", f);
    }
  }
  function v() {
    n.value === "ready" && (n.value = "dragging", l.reset(), l.start());
  }
  function r(f) {
    n.value === "dragging" && l.record(f);
  }
  async function h(f) {
    if (n.value !== "dragging") return;
    l.stop(), n.value = "verifying";
    const m = l.getTrack(), b = l.getElapsed();
    try {
      const c = await (await fetch(s, {
        method: "POST",
        headers: O(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: o.value.captcha_id,
          final_x: Math.round(f),
          drag_time: b,
          movement_track: m
        })
      })).json();
      c.success ? (a.value = c.token, n.value = "success") : (e.value = c.message ?? "Verification failed.", n.value = "failed");
    } catch (u) {
      n.value = "failed", e.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", u);
    }
  }
  async function t() {
    l.reset(), await d();
  }
  return {
    state: E(n),
    token: E(a),
    errorMsg: E(e),
    captchaData: E(o),
    load: d,
    onDragStart: v,
    onDragMove: r,
    onDragEnd: h,
    retry: t
  };
}
const be = ["data-state"], ke = { class: "gc-modal__header" }, Me = { class: "gc-modal__scene" }, we = {
  key: 0,
  class: "gc-modal__skeleton",
  "aria-busy": "true"
}, Se = {
  key: 0,
  class: "gc-modal__verifying",
  "aria-live": "polite"
}, xe = {
  key: 1,
  class: "gc-modal__verifying gc-modal__verifying--failed",
  "aria-live": "assertive"
}, Pe = {
  key: 2,
  class: "gc-modal__error-scene",
  role: "alert"
}, Ce = { class: "gc-modal__error-msg" }, Te = {
  key: 3,
  class: "gc-modal__idle"
}, Ee = { class: "gc-modal__slider-wrap" }, Ie = {
  key: 1,
  class: "gc-modal__slider-skeleton"
}, Xe = {
  key: 2,
  class: "gc-modal__error-actions"
}, Ge = ["name", "value"], Z = {
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
  setup(i, { emit: s }) {
    const n = i, a = s, {
      state: e,
      token: o,
      errorMsg: l,
      captchaData: d,
      load: v,
      onDragStart: r,
      onDragMove: h,
      onDragEnd: t,
      retry: f
    } = ye(n.generateUrl, n.verifyUrl), m = S(null);
    function b(c, _) {
      m.value = c, h(_ ?? c);
    }
    function u(c) {
      m.value = c, t(c);
    }
    return q(e, (c) => {
      var _;
      c === "success" && (m.value = ((_ = d.value) == null ? void 0 : _.target_x) ?? m.value, a("verified", o.value)), c === "failed" && (a("failed", l.value), d.value && setTimeout(() => {
        m.value = null, f();
      }, 1400)), c === "ready" && a("loaded", d.value);
    }), H(() => {
      n.autoLoad && v();
    }), (c, _) => {
      var M;
      return y(), k("div", {
        class: G(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
        "data-state": p(e),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        g("div", ke, [
          _[4] || (_[4] = g("div", { class: "gc-modal__header-text" }, [
            g("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
            g("p", { class: "gc-modal__subtitle" }, "Drag the slider left or right to score a goal")
          ], -1)),
          i.closable ? (y(), k("button", {
            key: 0,
            type: "button",
            class: "gc-modal__close",
            "aria-label": "Close",
            onClick: _[0] || (_[0] = (w) => c.$emit("close"))
          }, [..._[3] || (_[3] = [
            g("svg", {
              viewBox: "0 0 24 24",
              width: "18",
              height: "18",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round"
            }, [
              g("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
              }),
              g("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
              })
            ], -1)
          ])])) : x("", !0)
        ]),
        g("div", Me, [
          p(e) === "loading" ? (y(), k("div", we)) : p(d) ? (y(), k(j, { key: 1 }, [
            V(z, {
              "captcha-data": p(d),
              "ball-x": m.value,
              "show-success": p(e) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            p(e) === "verifying" ? (y(), k("div", Se, [..._[5] || (_[5] = [
              g("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              g("span", null, "Verifying…", -1)
            ])])) : x("", !0),
            p(e) === "failed" ? (y(), k("div", xe, [..._[6] || (_[6] = [
              g("span", {
                class: "gc-icon-miss",
                "aria-hidden": "true"
              }, "❌", -1),
              g("span", null, "Missed! Retrying…", -1)
            ])])) : x("", !0)
          ], 64)) : p(e) === "failed" ? (y(), k("div", Pe, [
            _[7] || (_[7] = g("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            g("p", Ce, Y(p(l) ?? "Verification failed. Please try again."), 1)
          ])) : (y(), k("div", Te, [
            g("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: _[1] || (_[1] = (...w) => p(v) && p(v)(...w))
            }, "Start Verification")
          ]))
        ]),
        g("div", Ee, [
          p(d) ? (y(), ne(K, {
            key: 0,
            "ball-start-x": p(d).ball_start_x,
            "track-width": ((M = p(d).canvas) == null ? void 0 : M.width) ?? 400,
            success: p(e) === "success",
            disabled: p(e) === "verifying" || p(e) === "success",
            onDragStart: p(r),
            onDragMove: b,
            onDragEnd: u
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : p(e) === "loading" ? (y(), k("div", Ie)) : p(e) === "failed" ? (y(), k("div", Xe, [
            g("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: _[2] || (_[2] = (...w) => p(f) && p(f)(...w))
            }, "↺ Try again")
          ])) : x("", !0)
        ]),
        p(o) ? (y(), k("input", {
          key: 0,
          type: "hidden",
          name: i.fieldName,
          value: p(o)
        }, null, 8, Ge)) : x("", !0)
      ], 10, be);
    };
  }
}, Le = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Be = { class: "goal-captcha__success-text" }, De = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(i) {
    return (s, n) => (y(), k("div", Le, [
      n[0] || (n[0] = g("div", { class: "goal-captcha__success-icon" }, [
        g("svg", {
          viewBox: "0 0 52 52",
          class: "goal-captcha__checkmark",
          "aria-hidden": "true"
        }, [
          g("circle", {
            cx: "26",
            cy: "26",
            r: "25",
            fill: "none",
            class: "goal-captcha__checkmark-circle"
          }),
          g("path", {
            fill: "none",
            d: "M14 27l8 8 16-16",
            class: "goal-captcha__checkmark-check"
          })
        ])
      ], -1)),
      g("p", Be, Y(i.message), 1)
    ]));
  }
}, Re = /* @__PURE__ */ L(De, [["__scopeId", "data-v-3f0157c9"]]), We = (i, s = {}) => {
  (s.generateUrl || s.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: s.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: s.verifyUrl ?? "/_goal_captcha/verify",
    theme: s.theme ?? "football",
    difficulty: s.difficulty ?? "medium"
  }), i.component("GoalCaptcha", Z), i.component("GoalCanvas", z), i.component("GoalSlider", K), i.component("SuccessAnimation", Re);
}, $e = { install: We };
function Ue() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: i } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((s) => {
      const n = s.querySelector("#goal-captcha-app");
      if (!n) return;
      const a = s.querySelector('input[type="hidden"]'), e = {
        generateUrl: s.dataset.generateUrl,
        verifyUrl: s.dataset.verifyUrl,
        theme: s.dataset.theme ?? "football",
        difficulty: s.dataset.difficulty ?? "medium",
        fieldName: s.dataset.fieldName ?? "captcha_token"
      };
      i(Z, {
        ...e,
        onVerified: (l) => {
          a && (a.value = l);
        }
      }).mount(n);
    });
  });
}
export {
  z as GoalCanvas,
  Z as GoalCaptcha,
  K as GoalSlider,
  Re as SuccessAnimation,
  $e as default,
  Ue as initBladeMount,
  We as install,
  ye as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
