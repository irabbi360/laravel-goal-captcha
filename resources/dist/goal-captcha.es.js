import { ref as S, onMounted as H, onBeforeUnmount as F, watch as q, openBlock as k, createElementBlock as M, createElementVNode as g, unref as p, createVNode as V, Transition as ee, withCtx as te, Fragment as j, renderList as ae, createCommentVNode as x, computed as T, normalizeClass as I, normalizeStyle as $, createStaticVNode as oe, withModifiers as U, readonly as E, toDisplayString as Y, createBlock as ne } from "vue";
const L = /* @__PURE__ */ new Map();
async function se(i) {
  return L.has(i) ? L.get(i) : new Promise((l, o) => {
    const t = new Image();
    t.crossOrigin = "anonymous", t.onload = () => {
      L.set(i, t), l(t);
    }, t.onerror = () => o(new Error(`Failed to load image: ${i}`)), t.src = i;
  });
}
function N(i, l, o, t) {
  i.beginPath();
  for (let e = 0; e < 5; e++) {
    const n = (e * 72 - 90) * Math.PI / 180;
    e === 0 ? i.moveTo(l + t * Math.cos(n), o + t * Math.sin(n)) : i.lineTo(l + t * Math.cos(n), o + t * Math.sin(n));
  }
  i.closePath(), i.fill();
}
class le {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(l, o) {
    var t;
    this.canvas = l, this.ctx = l.getContext("2d"), this.data = o, this.ballX = o.ball_start_x, this.ballStartX = o.ball_start_x, this.keeperOffsetX = ((t = o.scene) == null ? void 0 : t.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1;
  }
  async preload() {
    const l = this.data.scene.assets ?? {}, o = await Promise.allSettled(
      Object.entries(l).map(async ([t, e]) => {
        const n = await se(e);
        return [t, n];
      })
    );
    for (const t of o)
      if (t.status === "fulfilled") {
        const [e, n] = t.value;
        this.images[e] = n;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(l) {
    this.ballX = Math.max(0, Math.min(l, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: l, canvas: o, data: t } = this, { width: e, height: n } = o;
    l.clearRect(0, 0, e, n), this._drawBackground(e, n), this._drawGoalPost(e, n), this._drawDecoys(t.scene.decoys ?? []), this._drawTargetRing(t.target_x, n), this._drawGoalkeeper(t.scene, e, n), this._drawBall(n);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(l, o) {
    const t = this.images.stadium;
    if (t) {
      this.ctx.drawImage(t, 0, 0, l, o);
      return;
    }
    const e = this.ctx, n = e.createLinearGradient(0, 0, 0, o * 0.72);
    n.addColorStop(0, "#4e9fc8"), n.addColorStop(0.55, "#6ab9de"), n.addColorStop(1, "#88ccec"), e.fillStyle = n, e.fillRect(0, 0, l, o * 0.72), e.fillStyle = "rgba(58,118,178,0.38)", e.strokeStyle = "rgba(38,98,158,0.28)", e.lineWidth = 1, e.beginPath(), e.moveTo(0, 0), e.lineTo(l * 0.42, 0), e.lineTo(l * 0.3, o * 0.2), e.lineTo(0, o * 0.24), e.closePath(), e.fill(), e.stroke(), e.beginPath(), e.moveTo(l * 0.58, 0), e.lineTo(l, 0), e.lineTo(l, o * 0.24), e.lineTo(l * 0.7, o * 0.2), e.closePath(), e.fill(), e.stroke();
    const s = e.createLinearGradient(0, o * 0.63, 0, o);
    s.addColorStop(0, "#52c148"), s.addColorStop(0.3, "#46b23c"), s.addColorStop(1, "#3aa030"), e.fillStyle = s, e.fillRect(0, o * 0.66, l, o);
    const u = e.createLinearGradient(0, o * 0.62, 0, o * 0.7);
    u.addColorStop(0, "rgba(80,185,70,0)"), u.addColorStop(1, "#52c148"), e.fillStyle = u, e.fillRect(0, o * 0.62, l, o * 0.1), e.fillStyle = "rgba(255,255,255,0.04)";
    for (let v = 0; v < l; v += 36)
      e.fillRect(v, o * 0.66, 18, o * 0.34);
  }
  _drawGoalPost(l, o) {
    const t = this.images.goal_post, e = Math.round(l * 0.07), n = Math.round(l * 0.93), s = Math.round(o * 0.09), u = Math.round(o * 0.88), v = 7, r = Math.round(l * 0.055), h = Math.round(o * 0.1);
    if (t) {
      this.ctx.drawImage(t, e, s, n - e, u - s);
      return;
    }
    const a = this.ctx, f = e + r, m = n - r, y = s - h;
    a.save(), a.save(), a.beginPath(), a.rect(e + v * 0.5, s + v * 0.5, n - e - v, u - s - v * 0.5), a.clip(), a.fillStyle = "rgba(160,200,230,0.07)", a.fillRect(e, s, n - e, u - s), a.strokeStyle = "rgba(170,205,235,0.42)", a.lineWidth = 0.8;
    for (let d = e; d <= n; d += 20)
      a.beginPath(), a.moveTo(d, s), a.lineTo(d, u), a.stroke();
    for (let d = s; d <= u; d += 15)
      a.beginPath(), a.moveTo(e, d), a.lineTo(n, d), a.stroke();
    a.restore(), a.strokeStyle = "rgba(210,225,240,0.72)", a.lineWidth = 3.5, a.lineCap = "round", a.beginPath(), a.moveTo(e, s), a.lineTo(f, y), a.stroke(), a.beginPath(), a.moveTo(n, s), a.lineTo(m, y), a.stroke(), a.beginPath(), a.moveTo(f, y), a.lineTo(m, y), a.stroke(), a.strokeStyle = "rgba(190,215,235,0.48)", a.lineWidth = 2.5, a.beginPath(), a.moveTo(f, y), a.lineTo(f, u), a.stroke(), a.beginPath(), a.moveTo(m, y), a.lineTo(m, u), a.stroke(), a.strokeStyle = "#ffffff", a.lineWidth = v, a.lineCap = "square", a.beginPath(), a.moveTo(e, s), a.lineTo(n, s), a.stroke(), a.beginPath(), a.moveTo(e, s), a.lineTo(e, u), a.stroke(), a.beginPath(), a.moveTo(n, s), a.lineTo(n, u), a.stroke(), a.restore();
  }
  _drawGoalkeeper(l, o, t) {
    const e = this.images.goalkeeper, n = Math.round(o * 0.4 + this.keeperOffsetX), s = Math.round(t * 0.16), v = Math.round(t * 0.89) - s;
    if (e) {
      const A = Math.round(v * 0.52);
      this.ctx.drawImage(e, n - A / 2, s, A, v);
      return;
    }
    const r = this.ctx;
    r.save();
    const h = Math.round(v * 0.09), a = s + h, f = a + h + Math.round(v * 0.025), m = Math.round(v * 0.3), y = Math.round(v * 0.16), d = Math.round(v * 0.21), c = Math.round(v * 0.21), _ = Math.round(v * 0.055), b = Math.round(v * 0.4), w = 40 * Math.PI / 180, P = f + m + y, G = Math.round(c * 0.44);
    r.fillStyle = "#111111", r.beginPath(), r.ellipse(n - c * 0.52, P + d + h * 0.35, h * 0.8, h * 0.35, 0, 0, Math.PI * 2), r.fill(), r.beginPath(), r.ellipse(n + c * 0.52, P + d + h * 0.35, h * 0.8, h * 0.35, 0, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1c1c2e", r.fillRect(n - c * 0.75, P, G, d), r.fillRect(n + c * 0.75 - G, P, G, d), r.fillStyle = "#1c1c2e", r.fillRect(n - c, f + m, c * 2, y), r.fillStyle = "#f2f2f2", r.fillRect(n - c, f, c * 2, m);
    const J = Math.round(m * 0.26), Q = f + Math.round(m * 0.38);
    r.fillStyle = "#e63946", r.fillRect(n - c, Q, c * 2, J);
    const C = f + Math.round(m * 0.1), B = n - c - Math.round(b * Math.cos(w)), D = C - Math.round(b * Math.sin(w)), R = n + c + Math.round(b * Math.cos(w)), W = C - Math.round(b * Math.sin(w));
    r.strokeStyle = "#f2f2f2", r.lineWidth = _, r.lineCap = "round", r.beginPath(), r.moveTo(n - c, C), r.lineTo(B, D), r.stroke(), r.beginPath(), r.moveTo(n + c, C), r.lineTo(R, W), r.stroke(), r.fillStyle = "#c8d5e2", r.beginPath(), r.arc(B, D, _ * 1.6, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(R, W, _ * 1.6, 0, Math.PI * 2), r.fill(), r.fillStyle = "#f0c090", r.beginPath(), r.arc(n, a, h, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(n, a, h, Math.PI, 0), r.closePath(), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(n - h * 0.28, a + h * 0.08, h * 0.09, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(n + h * 0.28, a + h * 0.08, h * 0.09, 0, Math.PI * 2), r.fill(), r.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(l, o) {
    const t = l, e = Math.round(o * 0.4), n = Math.round(o * 0.14), s = this.ctx;
    s.save(), s.shadowColor = "rgba(0,0,0,.55)", s.shadowBlur = 14, s.strokeStyle = "rgba(30,30,30,.6)", s.lineWidth = n * 0.58 + 2, s.beginPath(), s.arc(t, e, n, 0, Math.PI * 2), s.stroke(), s.shadowBlur = 0;
    const u = s.createLinearGradient(t - n, e - n, t + n, e + n);
    u.addColorStop(0, "#d4d4d4"), u.addColorStop(0.25, "#a0a0a0"), u.addColorStop(0.5, "#707070"), u.addColorStop(0.75, "#a8a8a8"), u.addColorStop(1, "#cecece"), s.strokeStyle = u, s.lineWidth = n * 0.55, s.beginPath(), s.arc(t, e, n, 0, Math.PI * 2), s.stroke(), s.strokeStyle = "rgba(255,255,255,.45)", s.lineWidth = 3, s.beginPath(), s.arc(t - n * 0.15, e - n * 0.15, n - n * 0.3, Math.PI * 1.05, Math.PI * 1.7), s.stroke(), s.strokeStyle = "rgba(0,0,0,.25)", s.lineWidth = 2, s.beginPath(), s.arc(t, e, n - n * 0.28, 0, Math.PI * 2), s.stroke(), s.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(l) {
    for (const o of l) {
      const t = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${o.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(o.x, t, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(l) {
    const o = this.images.ball, t = Math.round(l * 0.22), e = this.ballX, n = this.data.target_x, s = Math.abs(n - this.ballStartX) || 1, u = Math.max(0, Math.min(1, 1 - Math.abs(e - n) / s)), v = l * 0.82, r = l * 0.4, h = Math.round(v + u * (r - v));
    if (o) {
      this.ctx.drawImage(o, e - t, h - t, t * 2, t * 2);
      return;
    }
    const a = this.ctx;
    a.save(), a.beginPath(), a.rect(0, 0, this.canvas.width, this.canvas.height), a.clip(), a.fillStyle = "rgba(0,0,0,0.18)", a.beginPath(), a.ellipse(e + t * 0.04, h + t * 0.9, t * 0.78, t * 0.14, 0, 0, Math.PI * 2), a.fill();
    const f = a.createRadialGradient(e - t * 0.3, h - t * 0.3, t * 0.05, e, h, t);
    f.addColorStop(0, "#ffffff"), f.addColorStop(0.42, "#eeeeee"), f.addColorStop(1, "#c0c0c0"), a.fillStyle = f, a.beginPath(), a.arc(e, h, t, 0, Math.PI * 2), a.fill(), a.fillStyle = "#1a1a1a", N(a, e, h, t * 0.2);
    const m = t * 0.185, y = t * 0.47;
    for (let _ = 0; _ < 5; _++) {
      const b = (_ * 72 - 90) * Math.PI / 180;
      N(a, e + y * Math.cos(b), h + y * Math.sin(b), m);
    }
    a.strokeStyle = "#888888", a.lineWidth = 1.5, a.beginPath(), a.arc(e, h, t, 0, Math.PI * 2), a.stroke(), a.restore();
    const d = t, c = [
      [e, h],
      [e - d * 0.4, h - d * 0.5],
      [e + d * 0.4, h - d * 0.5],
      [e - d * 0.5, h + d * 0.3],
      [e + d * 0.5, h + d * 0.3]
    ];
    for (const [_, b] of c)
      this.ctx.beginPath(), this.ctx.arc(_, b, d * 0.2, 0, Math.PI * 2), this.ctx.fill();
    this.ctx.restore();
  }
  destroy() {
  }
}
function re(i, l, o, t) {
  let e = null, n = !0;
  function s(u) {
    if (!n) return;
    const v = u % o / o * Math.PI * 2, r = i + (l - i) * (0.5 + 0.5 * Math.sin(v));
    t(r), e = requestAnimationFrame(s);
  }
  return e = requestAnimationFrame(s), () => {
    n = !1, e !== null && cancelAnimationFrame(e);
  };
}
const X = (i, l) => {
  const o = i.__vccOpts || i;
  for (const [t, e] of l)
    o[t] = e;
  return o;
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
    var u, v, r, h;
    const l = i, o = S(null);
    let t = null, e = null;
    const n = ((v = (u = l.captchaData) == null ? void 0 : u.canvas) == null ? void 0 : v.width) ?? 400, s = ((h = (r = l.captchaData) == null ? void 0 : r.canvas) == null ? void 0 : h.height) ?? 220;
    return H(async () => {
      var f;
      t = new le(o.value, l.captchaData), await t.preload();
      const a = ((f = l.captchaData.scene) == null ? void 0 : f.keeper_offset_x) ?? 0;
      e = re(
        a - 8,
        a + 8,
        2400,
        (m) => {
          t && (t.keeperOffsetX = m, t.draw());
        }
      );
    }), F(() => {
      e == null || e(), t == null || t.destroy();
    }), q(
      () => l.ballX,
      (a) => {
        t && a !== null && t.setBallX(a);
      }
    ), (a, f) => (k(), M("div", ie, [
      g("canvas", {
        ref_key: "canvasEl",
        ref: o,
        width: p(n),
        height: p(s),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, ce),
      V(ee, { name: "gc-success" }, {
        default: te(() => [
          i.showSuccess ? (k(), M("div", de, [
            g("div", ue, [
              (k(), M(j, null, ae(24, (m) => g("span", {
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
  setup(i, { emit: l }) {
    const o = l, t = i, e = S(null), n = S(t.trackWidth / 2), s = S(!1), u = T(() => t.handleSize / 2), v = T(
      () => Math.max(0, Math.min(n.value - u.value, t.trackWidth - t.handleSize))
    ), r = T(() => {
      const d = t.trackWidth / 2, c = n.value - d, _ = d - t.handleSize / 2;
      if (_ <= 0) return t.ballStartX;
      if (c < 0) {
        const b = t.ballStartX / _;
        return Math.max(0, t.ballStartX + c * b);
      } else {
        const b = (t.trackWidth - t.ballStartX) / _;
        return Math.min(t.trackWidth, t.ballStartX + c * b);
      }
    }), h = T(() => {
      const d = t.trackWidth / 2, c = n.value;
      return c < d ? {
        left: `${c}px`,
        width: `${d - c}px`
      } : {
        left: `${d}px`,
        width: `${c - d}px`
      };
    });
    function a(d) {
      t.disabled || (s.value = !0, o("drag-start"), window.addEventListener("mousemove", f, { passive: !0 }), window.addEventListener("touchmove", f, { passive: !0 }), window.addEventListener("mouseup", m), window.addEventListener("touchend", m));
    }
    function f(d) {
      if (!s.value) return;
      const c = d.touches ? d.touches[0].clientX : d.clientX, _ = e.value.getBoundingClientRect(), b = Math.max(u.value, Math.min(c - _.left, t.trackWidth - u.value));
      n.value = b, o("drag-move", r.value);
    }
    function m() {
      s.value && (s.value = !1, window.removeEventListener("mousemove", f), window.removeEventListener("touchmove", f), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m), o("drag-end", r.value));
    }
    function y(d) {
      if (t.disabled) return;
      const c = 5;
      d.key === "ArrowRight" ? (s.value || (s.value = !0, o("drag-start")), n.value = Math.min(n.value + c, t.trackWidth - u.value), o("drag-move", r.value)) : d.key === "ArrowLeft" ? (s.value || (s.value = !0, o("drag-start")), n.value = Math.max(n.value - c, u.value), o("drag-move", r.value)) : (d.key === "Enter" || d.key === " ") && s.value && m();
    }
    return F(() => {
      window.removeEventListener("mousemove", f), window.removeEventListener("touchmove", f), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m);
    }), (d, c) => i.success ? (k(), M("div", ge, [...c[0] || (c[0] = [
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
    ])])) : (k(), M("div", {
      key: 1,
      class: I(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": s.value }]),
      ref_key: "trackEl",
      ref: e,
      role: "slider",
      "aria-valuenow": Math.round(n.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: y
    }, [
      g("div", {
        class: "gc-slider__fill",
        style: $(h.value)
      }, null, 4),
      c[2] || (c[2] = oe('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-b3854d8c><span class="gc-slider__chev" data-v-b3854d8c>❮</span><span class="gc-slider__chev" data-v-b3854d8c>❮</span><span class="gc-slider__chev" data-v-b3854d8c>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-b3854d8c><span class="gc-slider__chev" data-v-b3854d8c>❯</span><span class="gc-slider__chev" data-v-b3854d8c>❯</span><span class="gc-slider__chev" data-v-b3854d8c>❯</span></div>', 2)),
      g("div", {
        class: I(["gc-slider__handle", { "is-dragging": s.value }]),
        style: $({ left: v.value + "px" }),
        onMousedown: U(a, ["prevent"]),
        onTouchstart: U(a, ["prevent"]),
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
}, K = /* @__PURE__ */ X(me, [["__scopeId", "data-v-b3854d8c"]]);
function _e() {
  let i = [], l = null, o = !1;
  function t() {
    i = [], l = null, o = !1;
  }
  function e() {
    l = performance.now(), o = !0;
  }
  function n(r) {
    if (!o || l === null) return;
    const h = Math.round(performance.now() - l);
    i.length > 0 && h - i[i.length - 1].t < 8 || i.push({ x: Math.round(r), t: h });
  }
  function s() {
    o = !1;
  }
  function u() {
    return [...i];
  }
  function v() {
    return l === null ? 0 : Math.round(performance.now() - l);
  }
  return { reset: t, start: e, record: n, stop: s, getTrack: u, getElapsed: v };
}
function pe() {
  if (typeof document > "u") return null;
  const i = document.querySelector('meta[name="csrf-token"]');
  if (i != null && i.content) return i.content;
  const l = document.cookie.split("; ").find((o) => o.startsWith("XSRF-TOKEN="));
  return l ? decodeURIComponent(l.split("=")[1]) : null;
}
function O() {
  const i = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, l = pe();
  return l && (i["X-CSRF-TOKEN"] = l, i["X-XSRF-TOKEN"] = l), i;
}
function ye(i, l) {
  const o = S("idle"), t = S(null), e = S(null), n = S(null), s = _e();
  async function u() {
    o.value = "loading", e.value = null, t.value = null;
    try {
      const f = await fetch(i, {
        method: "POST",
        headers: O(),
        credentials: "same-origin"
      });
      if (!f.ok) throw new Error(`Server error: ${f.status}`);
      n.value = await f.json(), o.value = "ready";
    } catch (f) {
      o.value = "failed", e.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", f);
    }
  }
  function v() {
    o.value === "ready" && (o.value = "dragging", s.reset(), s.start());
  }
  function r(f) {
    o.value === "dragging" && s.record(f);
  }
  async function h(f) {
    if (o.value !== "dragging") return;
    s.stop(), o.value = "verifying";
    const m = s.getTrack(), y = s.getElapsed();
    try {
      const c = await (await fetch(l, {
        method: "POST",
        headers: O(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: n.value.captcha_id,
          final_x: Math.round(f),
          drag_time: y,
          movement_track: m
        })
      })).json();
      c.success ? (t.value = c.token, o.value = "success") : (e.value = c.message ?? "Verification failed.", o.value = "failed");
    } catch (d) {
      o.value = "failed", e.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", d);
    }
  }
  async function a() {
    s.reset(), await u();
  }
  return {
    state: E(o),
    token: E(t),
    errorMsg: E(e),
    captchaData: E(n),
    load: u,
    onDragStart: v,
    onDragMove: r,
    onDragEnd: h,
    retry: a
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
  setup(i, { emit: l }) {
    const o = i, t = l, {
      state: e,
      token: n,
      errorMsg: s,
      captchaData: u,
      load: v,
      onDragStart: r,
      onDragMove: h,
      onDragEnd: a,
      retry: f
    } = ye(o.generateUrl, o.verifyUrl), m = S(null);
    function y(c) {
      m.value = c, h(c);
    }
    function d(c) {
      m.value = c, a(c);
    }
    return q(e, (c) => {
      var _;
      c === "success" && (m.value = ((_ = u.value) == null ? void 0 : _.target_x) ?? m.value, t("verified", n.value)), c === "failed" && t("failed", s.value), c === "ready" && t("loaded", u.value);
    }), H(() => {
      o.autoLoad && v();
    }), (c, _) => {
      var b;
      return k(), M("div", {
        class: I(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
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
          i.closable ? (k(), M("button", {
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
          p(e) === "loading" ? (k(), M("div", we)) : p(u) ? (k(), M(j, { key: 1 }, [
            V(z, {
              "captcha-data": p(u),
              "ball-x": m.value,
              "show-success": p(e) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            p(e) === "verifying" ? (k(), M("div", Se, [..._[5] || (_[5] = [
              g("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              g("span", null, "Verifying…", -1)
            ])])) : x("", !0)
          ], 64)) : p(e) === "failed" ? (k(), M("div", xe, [
            _[6] || (_[6] = g("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            g("p", Pe, Y(p(s) ?? "Verification failed. Please try again."), 1)
          ])) : (k(), M("div", Ce, [
            g("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: _[1] || (_[1] = (...w) => p(v) && p(v)(...w))
            }, "Start Verification")
          ]))
        ]),
        g("div", Te, [
          p(u) ? (k(), ne(K, {
            key: 0,
            "ball-start-x": p(u).ball_start_x,
            "track-width": ((b = p(u).canvas) == null ? void 0 : b.width) ?? 400,
            success: p(e) === "success",
            disabled: p(e) === "verifying" || p(e) === "success",
            onDragStart: p(r),
            onDragMove: y,
            onDragEnd: d
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : p(e) === "loading" ? (k(), M("div", Ee)) : p(e) === "failed" ? (k(), M("div", Ge, [
            g("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: _[2] || (_[2] = (...w) => p(f) && p(f)(...w))
            }, "↺ Try again")
          ])) : x("", !0)
        ]),
        p(n) ? (k(), M("input", {
          key: 0,
          type: "hidden",
          name: i.fieldName,
          value: p(n)
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
    return (l, o) => (k(), M("div", Ie, [
      o[0] || (o[0] = g("div", { class: "goal-captcha__success-icon" }, [
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
      g("p", Xe, Y(i.message), 1)
    ]));
  }
}, De = /* @__PURE__ */ X(Be, [["__scopeId", "data-v-3f0157c9"]]), Re = (i, l = {}) => {
  (l.generateUrl || l.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: l.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: l.verifyUrl ?? "/_goal_captcha/verify",
    theme: l.theme ?? "football",
    difficulty: l.difficulty ?? "medium"
  }), i.component("GoalCaptcha", Z), i.component("GoalCanvas", z), i.component("GoalSlider", K), i.component("SuccessAnimation", De);
}, Ae = { install: Re };
function $e() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: i } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((l) => {
      const o = l.querySelector("#goal-captcha-app");
      if (!o) return;
      const t = l.querySelector('input[type="hidden"]'), e = {
        generateUrl: l.dataset.generateUrl,
        verifyUrl: l.dataset.verifyUrl,
        theme: l.dataset.theme ?? "football",
        difficulty: l.dataset.difficulty ?? "medium",
        fieldName: l.dataset.fieldName ?? "captcha_token"
      };
      i(Z, {
        ...e,
        onVerified: (s) => {
          t && (t.value = s);
        }
      }).mount(o);
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
