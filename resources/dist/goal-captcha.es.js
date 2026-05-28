import { ref as S, onMounted as H, onBeforeUnmount as F, watch as q, openBlock as y, createElementBlock as b, createElementVNode as f, unref as _, createVNode as V, Transition as ee, withCtx as te, Fragment as j, renderList as ae, createCommentVNode as x, computed as T, normalizeClass as I, normalizeStyle as $, createStaticVNode as oe, withModifiers as U, readonly as E, toDisplayString as Y, createBlock as ne } from "vue";
const L = /* @__PURE__ */ new Map();
async function se(i) {
  return L.has(i) ? L.get(i) : new Promise((s, n) => {
    const t = new Image();
    t.crossOrigin = "anonymous", t.onload = () => {
      L.set(i, t), s(t);
    }, t.onerror = () => n(new Error(`Failed to load image: ${i}`)), t.src = i;
  });
}
function N(i, s, n, t) {
  i.beginPath();
  for (let e = 0; e < 5; e++) {
    const o = (e * 72 - 90) * Math.PI / 180;
    e === 0 ? i.moveTo(s + t * Math.cos(o), n + t * Math.sin(o)) : i.lineTo(s + t * Math.cos(o), n + t * Math.sin(o));
  }
  i.closePath(), i.fill();
}
class le {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(s, n) {
    var t;
    this.canvas = s, this.ctx = s.getContext("2d"), this.data = n, this.ballX = n.ball_start_x, this.keeperOffsetX = ((t = n.scene) == null ? void 0 : t.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1;
  }
  async preload() {
    const s = this.data.scene.assets ?? {}, n = await Promise.allSettled(
      Object.entries(s).map(async ([t, e]) => {
        const o = await se(e);
        return [t, o];
      })
    );
    for (const t of n)
      if (t.status === "fulfilled") {
        const [e, o] = t.value;
        this.images[e] = o;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(s) {
    this.ballX = Math.max(0, Math.min(s, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: s, canvas: n, data: t } = this, { width: e, height: o } = n;
    s.clearRect(0, 0, e, o), this._drawBackground(e, o), this._drawGoalPost(e, o), this._drawDecoys(t.scene.decoys ?? []), this._drawTargetRing(t.target_x, o), this._drawGoalkeeper(t.scene, e, o), this._drawBall(o);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(s, n) {
    const t = this.images.stadium;
    if (t) {
      this.ctx.drawImage(t, 0, 0, s, n);
      return;
    }
    const e = this.ctx, o = e.createLinearGradient(0, 0, 0, n * 0.72);
    o.addColorStop(0, "#4e9fc8"), o.addColorStop(0.55, "#6ab9de"), o.addColorStop(1, "#88ccec"), e.fillStyle = o, e.fillRect(0, 0, s, n * 0.72), e.fillStyle = "rgba(58,118,178,0.38)", e.strokeStyle = "rgba(38,98,158,0.28)", e.lineWidth = 1, e.beginPath(), e.moveTo(0, 0), e.lineTo(s * 0.42, 0), e.lineTo(s * 0.3, n * 0.2), e.lineTo(0, n * 0.24), e.closePath(), e.fill(), e.stroke(), e.beginPath(), e.moveTo(s * 0.58, 0), e.lineTo(s, 0), e.lineTo(s, n * 0.24), e.lineTo(s * 0.7, n * 0.2), e.closePath(), e.fill(), e.stroke();
    const a = e.createLinearGradient(0, n * 0.63, 0, n);
    a.addColorStop(0, "#52c148"), a.addColorStop(0.3, "#46b23c"), a.addColorStop(1, "#3aa030"), e.fillStyle = a, e.fillRect(0, n * 0.66, s, n);
    const d = e.createLinearGradient(0, n * 0.62, 0, n * 0.7);
    d.addColorStop(0, "rgba(80,185,70,0)"), d.addColorStop(1, "#52c148"), e.fillStyle = d, e.fillRect(0, n * 0.62, s, n * 0.1), e.fillStyle = "rgba(255,255,255,0.04)";
    for (let v = 0; v < s; v += 36)
      e.fillRect(v, n * 0.66, 18, n * 0.34);
  }
  _drawGoalPost(s, n) {
    const t = this.images.goal_post, e = Math.round(s * 0.07), o = Math.round(s * 0.93), a = Math.round(n * 0.09), d = Math.round(n * 0.88), v = 7, r = Math.round(s * 0.055), h = Math.round(n * 0.1);
    if (t) {
      this.ctx.drawImage(t, e, a, o - e, d - a);
      return;
    }
    const l = this.ctx, u = e + r, m = o - r, k = a - h;
    l.save(), l.save(), l.beginPath(), l.rect(e + v * 0.5, a + v * 0.5, o - e - v, d - a - v * 0.5), l.clip(), l.fillStyle = "rgba(160,200,230,0.07)", l.fillRect(e, a, o - e, d - a), l.strokeStyle = "rgba(170,205,235,0.42)", l.lineWidth = 0.8;
    for (let g = e; g <= o; g += 20)
      l.beginPath(), l.moveTo(g, a), l.lineTo(g, d), l.stroke();
    for (let g = a; g <= d; g += 15)
      l.beginPath(), l.moveTo(e, g), l.lineTo(o, g), l.stroke();
    l.restore(), l.strokeStyle = "rgba(210,225,240,0.72)", l.lineWidth = 3.5, l.lineCap = "round", l.beginPath(), l.moveTo(e, a), l.lineTo(u, k), l.stroke(), l.beginPath(), l.moveTo(o, a), l.lineTo(m, k), l.stroke(), l.beginPath(), l.moveTo(u, k), l.lineTo(m, k), l.stroke(), l.strokeStyle = "rgba(190,215,235,0.48)", l.lineWidth = 2.5, l.beginPath(), l.moveTo(u, k), l.lineTo(u, d), l.stroke(), l.beginPath(), l.moveTo(m, k), l.lineTo(m, d), l.stroke(), l.strokeStyle = "#ffffff", l.lineWidth = v, l.lineCap = "square", l.beginPath(), l.moveTo(e, a), l.lineTo(o, a), l.stroke(), l.beginPath(), l.moveTo(e, a), l.lineTo(e, d), l.stroke(), l.beginPath(), l.moveTo(o, a), l.lineTo(o, d), l.stroke(), l.restore();
  }
  _drawGoalkeeper(s, n, t) {
    const e = this.images.goalkeeper, o = Math.round(n * 0.4 + this.keeperOffsetX), a = Math.round(t * 0.16), v = Math.round(t * 0.89) - a;
    if (e) {
      const A = Math.round(v * 0.52);
      this.ctx.drawImage(e, o - A / 2, a, A, v);
      return;
    }
    const r = this.ctx;
    r.save();
    const h = Math.round(v * 0.09), l = a + h, u = l + h + Math.round(v * 0.025), m = Math.round(v * 0.3), k = Math.round(v * 0.16), g = Math.round(v * 0.21), c = Math.round(v * 0.21), p = Math.round(v * 0.055), M = Math.round(v * 0.4), w = 40 * Math.PI / 180, P = u + m + k, G = Math.round(c * 0.44);
    r.fillStyle = "#111111", r.beginPath(), r.ellipse(o - c * 0.52, P + g + h * 0.35, h * 0.8, h * 0.35, 0, 0, Math.PI * 2), r.fill(), r.beginPath(), r.ellipse(o + c * 0.52, P + g + h * 0.35, h * 0.8, h * 0.35, 0, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1c1c2e", r.fillRect(o - c * 0.75, P, G, g), r.fillRect(o + c * 0.75 - G, P, G, g), r.fillStyle = "#1c1c2e", r.fillRect(o - c, u + m, c * 2, k), r.fillStyle = "#f2f2f2", r.fillRect(o - c, u, c * 2, m);
    const J = Math.round(m * 0.26), Q = u + Math.round(m * 0.38);
    r.fillStyle = "#e63946", r.fillRect(o - c, Q, c * 2, J);
    const C = u + Math.round(m * 0.1), B = o - c - Math.round(M * Math.cos(w)), D = C - Math.round(M * Math.sin(w)), R = o + c + Math.round(M * Math.cos(w)), W = C - Math.round(M * Math.sin(w));
    r.strokeStyle = "#f2f2f2", r.lineWidth = p, r.lineCap = "round", r.beginPath(), r.moveTo(o - c, C), r.lineTo(B, D), r.stroke(), r.beginPath(), r.moveTo(o + c, C), r.lineTo(R, W), r.stroke(), r.fillStyle = "#c8d5e2", r.beginPath(), r.arc(B, D, p * 1.6, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(R, W, p * 1.6, 0, Math.PI * 2), r.fill(), r.fillStyle = "#f0c090", r.beginPath(), r.arc(o, l, h, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(o, l, h, Math.PI, 0), r.closePath(), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(o - h * 0.28, l + h * 0.08, h * 0.09, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(o + h * 0.28, l + h * 0.08, h * 0.09, 0, Math.PI * 2), r.fill(), r.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(s, n) {
    const t = s, e = Math.round(n * 0.4), o = Math.round(n * 0.14), a = this.ctx;
    a.save(), a.shadowColor = "rgba(0,0,0,.55)", a.shadowBlur = 14, a.strokeStyle = "rgba(30,30,30,.6)", a.lineWidth = o * 0.58 + 2, a.beginPath(), a.arc(t, e, o, 0, Math.PI * 2), a.stroke(), a.shadowBlur = 0;
    const d = a.createLinearGradient(t - o, e - o, t + o, e + o);
    d.addColorStop(0, "#d4d4d4"), d.addColorStop(0.25, "#a0a0a0"), d.addColorStop(0.5, "#707070"), d.addColorStop(0.75, "#a8a8a8"), d.addColorStop(1, "#cecece"), a.strokeStyle = d, a.lineWidth = o * 0.55, a.beginPath(), a.arc(t, e, o, 0, Math.PI * 2), a.stroke(), a.strokeStyle = "rgba(255,255,255,.45)", a.lineWidth = 3, a.beginPath(), a.arc(t - o * 0.15, e - o * 0.15, o - o * 0.3, Math.PI * 1.05, Math.PI * 1.7), a.stroke(), a.strokeStyle = "rgba(0,0,0,.25)", a.lineWidth = 2, a.beginPath(), a.arc(t, e, o - o * 0.28, 0, Math.PI * 2), a.stroke(), a.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(s) {
    for (const n of s) {
      const t = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${n.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(n.x, t, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(s) {
    const n = this.images.ball, t = Math.round(s * 0.22), e = this.ballX, o = Math.round(s * 0.82);
    if (n) {
      this.ctx.drawImage(n, e - t, o - t, t * 2, t * 2);
      return;
    }
    const a = this.ctx;
    a.save(), a.beginPath(), a.rect(0, 0, this.canvas.width, this.canvas.height), a.clip(), a.fillStyle = "rgba(0,0,0,0.18)", a.beginPath(), a.ellipse(e + t * 0.04, o + t * 0.9, t * 0.78, t * 0.14, 0, 0, Math.PI * 2), a.fill();
    const d = a.createRadialGradient(e - t * 0.3, o - t * 0.3, t * 0.05, e, o, t);
    d.addColorStop(0, "#ffffff"), d.addColorStop(0.42, "#eeeeee"), d.addColorStop(1, "#c0c0c0"), a.fillStyle = d, a.beginPath(), a.arc(e, o, t, 0, Math.PI * 2), a.fill(), a.fillStyle = "#1a1a1a", N(a, e, o, t * 0.2);
    const v = t * 0.185, r = t * 0.47;
    for (let u = 0; u < 5; u++) {
      const m = (u * 72 - 90) * Math.PI / 180;
      N(a, e + r * Math.cos(m), o + r * Math.sin(m), v);
    }
    a.strokeStyle = "#888888", a.lineWidth = 1.5, a.beginPath(), a.arc(e, o, t, 0, Math.PI * 2), a.stroke(), a.restore();
    const h = t, l = [
      [e, o],
      [e - h * 0.4, o - h * 0.5],
      [e + h * 0.4, o - h * 0.5],
      [e - h * 0.5, o + h * 0.3],
      [e + h * 0.5, o + h * 0.3]
    ];
    for (const [u, m] of l)
      this.ctx.beginPath(), this.ctx.arc(u, m, h * 0.2, 0, Math.PI * 2), this.ctx.fill();
    this.ctx.restore();
  }
  destroy() {
  }
}
function re(i, s, n, t) {
  let e = null, o = !0;
  function a(d) {
    if (!o) return;
    const v = d % n / n * Math.PI * 2, r = i + (s - i) * (0.5 + 0.5 * Math.sin(v));
    t(r), e = requestAnimationFrame(a);
  }
  return e = requestAnimationFrame(a), () => {
    o = !1, e !== null && cancelAnimationFrame(e);
  };
}
const X = (i, s) => {
  const n = i.__vccOpts || i;
  for (const [t, e] of s)
    n[t] = e;
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
    let t = null, e = null;
    const o = ((v = (d = s.captchaData) == null ? void 0 : d.canvas) == null ? void 0 : v.width) ?? 400, a = ((h = (r = s.captchaData) == null ? void 0 : r.canvas) == null ? void 0 : h.height) ?? 220;
    return H(async () => {
      var u;
      t = new le(n.value, s.captchaData), await t.preload();
      const l = ((u = s.captchaData.scene) == null ? void 0 : u.keeper_offset_x) ?? 0;
      e = re(
        l - 8,
        l + 8,
        2400,
        (m) => {
          t && (t.keeperOffsetX = m, t.draw());
        }
      );
    }), F(() => {
      e == null || e(), t == null || t.destroy();
    }), q(
      () => s.ballX,
      (l) => {
        t && l !== null && t.setBallX(l);
      }
    ), (l, u) => (y(), b("div", ie, [
      f("canvas", {
        ref_key: "canvasEl",
        ref: n,
        width: _(o),
        height: _(a),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, ce),
      V(ee, { name: "gc-success" }, {
        default: te(() => [
          i.showSuccess ? (y(), b("div", de, [
            f("div", ue, [
              (y(), b(j, null, ae(24, (m) => f("span", {
                key: m,
                class: "gc-confetti__piece",
                "data-i": m
              }, null, 8, he)), 64))
            ]),
            u[0] || (u[0] = f("div", { class: "gc-success-badge" }, [
              f("div", { class: "gc-success-badge__ball" }, "⚽"),
              f("div", { class: "gc-success-badge__banner" }, [
                f("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--left",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  f("path", {
                    d: "M20 0 L0 20 L20 40 Z",
                    fill: "#15803d"
                  })
                ]),
                f("span", { class: "gc-success-badge__text" }, "SUCCESS"),
                f("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--right",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  f("path", {
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
}, z = /* @__PURE__ */ X(fe, [["__scopeId", "data-v-7d16f725"]]), ge = {
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
    const n = s, t = i, e = S(null), o = S(t.trackWidth / 2), a = S(!1), d = T(() => t.handleSize / 2), v = T(
      () => Math.max(0, Math.min(o.value - d.value, t.trackWidth - t.handleSize))
    ), r = T(() => {
      const g = t.trackWidth / 2, c = o.value - g, p = g - t.handleSize / 2;
      if (p <= 0) return t.ballStartX;
      if (c < 0) {
        const M = t.ballStartX / p;
        return Math.max(0, t.ballStartX + c * M);
      } else {
        const M = (t.trackWidth - t.ballStartX) / p;
        return Math.min(t.trackWidth, t.ballStartX + c * M);
      }
    }), h = T(() => {
      const g = t.trackWidth / 2, c = o.value;
      return c < g ? {
        left: `${c}px`,
        width: `${g - c}px`
      } : {
        left: `${g}px`,
        width: `${c - g}px`
      };
    });
    function l(g) {
      t.disabled || (a.value = !0, n("drag-start"), window.addEventListener("mousemove", u, { passive: !0 }), window.addEventListener("touchmove", u, { passive: !0 }), window.addEventListener("mouseup", m), window.addEventListener("touchend", m));
    }
    function u(g) {
      if (!a.value) return;
      const c = g.touches ? g.touches[0].clientX : g.clientX, p = e.value.getBoundingClientRect(), M = Math.max(d.value, Math.min(c - p.left, t.trackWidth - d.value));
      o.value = M, n("drag-move", r.value);
    }
    function m() {
      a.value && (a.value = !1, window.removeEventListener("mousemove", u), window.removeEventListener("touchmove", u), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m), n("drag-end", r.value));
    }
    function k(g) {
      if (t.disabled) return;
      const c = 5;
      g.key === "ArrowRight" ? (a.value || (a.value = !0, n("drag-start")), o.value = Math.min(o.value + c, t.trackWidth - d.value), n("drag-move", r.value)) : g.key === "ArrowLeft" ? (a.value || (a.value = !0, n("drag-start")), o.value = Math.max(o.value - c, d.value), n("drag-move", r.value)) : (g.key === "Enter" || g.key === " ") && a.value && m();
    }
    return F(() => {
      window.removeEventListener("mousemove", u), window.removeEventListener("touchmove", u), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m);
    }), (g, c) => i.success ? (y(), b("div", ge, [...c[0] || (c[0] = [
      f("div", { class: "gc-slider__success-check" }, [
        f("svg", {
          viewBox: "0 0 44 44",
          fill: "none",
          "aria-hidden": "true"
        }, [
          f("circle", {
            cx: "22",
            cy: "22",
            r: "20",
            fill: "#16a34a"
          }),
          f("path", {
            d: "M13 22.5l6.5 6.5 11-13",
            stroke: "#fff",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ])
      ], -1)
    ])])) : (y(), b("div", {
      key: 1,
      class: I(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": a.value }]),
      ref_key: "trackEl",
      ref: e,
      role: "slider",
      "aria-valuenow": Math.round(o.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: k
    }, [
      f("div", {
        class: "gc-slider__fill",
        style: $(h.value)
      }, null, 4),
      c[2] || (c[2] = oe('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-b3854d8c><span class="gc-slider__chev" data-v-b3854d8c>❮</span><span class="gc-slider__chev" data-v-b3854d8c>❮</span><span class="gc-slider__chev" data-v-b3854d8c>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-b3854d8c><span class="gc-slider__chev" data-v-b3854d8c>❯</span><span class="gc-slider__chev" data-v-b3854d8c>❯</span><span class="gc-slider__chev" data-v-b3854d8c>❯</span></div>', 2)),
      f("div", {
        class: I(["gc-slider__handle", { "is-dragging": a.value }]),
        style: $({ left: v.value + "px" }),
        onMousedown: U(l, ["prevent"]),
        onTouchstart: U(l, ["prevent"]),
        "aria-hidden": "true"
      }, [...c[1] || (c[1] = [
        f("svg", {
          class: "gc-slider__handle-icon",
          viewBox: "0 0 32 18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          f("path", {
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
}, K = /* @__PURE__ */ X(me, [["__scopeId", "data-v-b3854d8c"]]);
function pe() {
  let i = [], s = null, n = !1;
  function t() {
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
  function a() {
    n = !1;
  }
  function d() {
    return [...i];
  }
  function v() {
    return s === null ? 0 : Math.round(performance.now() - s);
  }
  return { reset: t, start: e, record: o, stop: a, getTrack: d, getElapsed: v };
}
function _e() {
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
  }, s = _e();
  return s && (i["X-CSRF-TOKEN"] = s, i["X-XSRF-TOKEN"] = s), i;
}
function ye(i, s) {
  const n = S("idle"), t = S(null), e = S(null), o = S(null), a = pe();
  async function d() {
    n.value = "loading", e.value = null, t.value = null;
    try {
      const u = await fetch(i, {
        method: "POST",
        headers: O(),
        credentials: "same-origin"
      });
      if (!u.ok) throw new Error(`Server error: ${u.status}`);
      o.value = await u.json(), n.value = "ready";
    } catch (u) {
      n.value = "failed", e.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", u);
    }
  }
  function v() {
    n.value === "ready" && (n.value = "dragging", a.reset(), a.start());
  }
  function r(u) {
    n.value === "dragging" && a.record(u);
  }
  async function h(u) {
    if (n.value !== "dragging") return;
    a.stop(), n.value = "verifying";
    const m = a.getTrack(), k = a.getElapsed();
    try {
      const c = await (await fetch(s, {
        method: "POST",
        headers: O(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: o.value.captcha_id,
          final_x: Math.round(u),
          drag_time: k,
          movement_track: m
        })
      })).json();
      c.success ? (t.value = c.token, n.value = "success") : (e.value = c.message ?? "Verification failed.", n.value = "failed");
    } catch (g) {
      n.value = "failed", e.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", g);
    }
  }
  async function l() {
    a.reset(), await d();
  }
  return {
    state: E(n),
    token: E(t),
    errorMsg: E(e),
    captchaData: E(o),
    load: d,
    onDragStart: v,
    onDragMove: r,
    onDragEnd: h,
    retry: l
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
  key: 2,
  class: "gc-modal__error-scene",
  role: "alert"
}, Pe = { class: "gc-modal__error-msg" }, Ce = {
  key: 3,
  class: "gc-modal__idle"
}, Te = { class: "gc-modal__slider-wrap" }, Ee = {
  key: 1,
  class: "gc-modal__slider-skeleton"
}, Ge = {
  key: 2,
  class: "gc-modal__error-actions"
}, Le = ["name", "value"], Z = {
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
    const n = i, t = s, {
      state: e,
      token: o,
      errorMsg: a,
      captchaData: d,
      load: v,
      onDragStart: r,
      onDragMove: h,
      onDragEnd: l,
      retry: u
    } = ye(n.generateUrl, n.verifyUrl), m = S(null);
    function k(c) {
      m.value = c, h(c);
    }
    function g(c) {
      m.value = c, l(c);
    }
    return q(e, (c) => {
      var p;
      c === "success" && (m.value = ((p = d.value) == null ? void 0 : p.target_x) ?? m.value, t("verified", o.value)), c === "failed" && t("failed", a.value), c === "ready" && t("loaded", d.value);
    }), H(() => {
      n.autoLoad && v();
    }), (c, p) => {
      var M;
      return y(), b("div", {
        class: I(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
        "data-state": _(e),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        f("div", ke, [
          p[4] || (p[4] = f("div", { class: "gc-modal__header-text" }, [
            f("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
            f("p", { class: "gc-modal__subtitle" }, "Drag the slider left or right to score a goal")
          ], -1)),
          i.closable ? (y(), b("button", {
            key: 0,
            type: "button",
            class: "gc-modal__close",
            "aria-label": "Close",
            onClick: p[0] || (p[0] = (w) => c.$emit("close"))
          }, [...p[3] || (p[3] = [
            f("svg", {
              viewBox: "0 0 24 24",
              width: "18",
              height: "18",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round"
            }, [
              f("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
              }),
              f("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
              })
            ], -1)
          ])])) : x("", !0)
        ]),
        f("div", Me, [
          _(e) === "loading" ? (y(), b("div", we)) : _(d) ? (y(), b(j, { key: 1 }, [
            V(z, {
              "captcha-data": _(d),
              "ball-x": m.value,
              "show-success": _(e) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            _(e) === "verifying" ? (y(), b("div", Se, [...p[5] || (p[5] = [
              f("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              f("span", null, "Verifying…", -1)
            ])])) : x("", !0)
          ], 64)) : _(e) === "failed" ? (y(), b("div", xe, [
            p[6] || (p[6] = f("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            f("p", Pe, Y(_(a) ?? "Verification failed. Please try again."), 1)
          ])) : (y(), b("div", Ce, [
            f("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: p[1] || (p[1] = (...w) => _(v) && _(v)(...w))
            }, "Start Verification")
          ]))
        ]),
        f("div", Te, [
          _(d) ? (y(), ne(K, {
            key: 0,
            "ball-start-x": _(d).ball_start_x,
            "track-width": ((M = _(d).canvas) == null ? void 0 : M.width) ?? 400,
            success: _(e) === "success",
            disabled: _(e) === "verifying" || _(e) === "success",
            onDragStart: _(r),
            onDragMove: k,
            onDragEnd: g
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : _(e) === "loading" ? (y(), b("div", Ee)) : _(e) === "failed" ? (y(), b("div", Ge, [
            f("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: p[2] || (p[2] = (...w) => _(u) && _(u)(...w))
            }, "↺ Try again")
          ])) : x("", !0)
        ]),
        _(o) ? (y(), b("input", {
          key: 0,
          type: "hidden",
          name: i.fieldName,
          value: _(o)
        }, null, 8, Le)) : x("", !0)
      ], 10, be);
    };
  }
}, Ie = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Xe = { class: "goal-captcha__success-text" }, Be = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(i) {
    return (s, n) => (y(), b("div", Ie, [
      n[0] || (n[0] = f("div", { class: "goal-captcha__success-icon" }, [
        f("svg", {
          viewBox: "0 0 52 52",
          class: "goal-captcha__checkmark",
          "aria-hidden": "true"
        }, [
          f("circle", {
            cx: "26",
            cy: "26",
            r: "25",
            fill: "none",
            class: "goal-captcha__checkmark-circle"
          }),
          f("path", {
            fill: "none",
            d: "M14 27l8 8 16-16",
            class: "goal-captcha__checkmark-check"
          })
        ])
      ], -1)),
      f("p", Xe, Y(i.message), 1)
    ]));
  }
}, De = /* @__PURE__ */ X(Be, [["__scopeId", "data-v-3f0157c9"]]), Re = (i, s = {}) => {
  (s.generateUrl || s.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: s.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: s.verifyUrl ?? "/_goal_captcha/verify",
    theme: s.theme ?? "football",
    difficulty: s.difficulty ?? "medium"
  }), i.component("GoalCaptcha", Z), i.component("GoalCanvas", z), i.component("GoalSlider", K), i.component("SuccessAnimation", De);
}, Ae = { install: Re };
function $e() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: i } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((s) => {
      const n = s.querySelector("#goal-captcha-app");
      if (!n) return;
      const t = s.querySelector('input[type="hidden"]'), e = {
        generateUrl: s.dataset.generateUrl,
        verifyUrl: s.dataset.verifyUrl,
        theme: s.dataset.theme ?? "football",
        difficulty: s.dataset.difficulty ?? "medium",
        fieldName: s.dataset.fieldName ?? "captcha_token"
      };
      i(Z, {
        ...e,
        onVerified: (a) => {
          t && (t.value = a);
        }
      }).mount(n);
    });
  });
}
export {
  z as GoalCanvas,
  Z as GoalCaptcha,
  K as GoalSlider,
  De as SuccessAnimation,
  Ae as default,
  $e as initBladeMount,
  Re as install,
  ye as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
