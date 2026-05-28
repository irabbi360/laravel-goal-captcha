import { ref as S, onMounted as O, onBeforeUnmount as H, watch as F, openBlock as y, createElementBlock as b, createElementVNode as h, unref as p, createVNode as q, Transition as Q, withCtx as ee, Fragment as V, renderList as te, createCommentVNode as x, computed as T, normalizeClass as B, normalizeStyle as $, createStaticVNode as ae, withModifiers as U, readonly as E, toDisplayString as j, createBlock as ne } from "vue";
const L = /* @__PURE__ */ new Map();
async function oe(i) {
  return L.has(i) ? L.get(i) : new Promise((l, t) => {
    const o = new Image();
    o.crossOrigin = "anonymous", o.onload = () => {
      L.set(i, o), l(o);
    }, o.onerror = () => t(new Error(`Failed to load image: ${i}`)), o.src = i;
  });
}
class se {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(l, t) {
    var a;
    this.canvas = l, this.ctx = l.getContext("2d"), this.data = t, this.ballX = t.ball_start_x, this.ballStartX = t.ball_start_x, this.keeperOffsetX = ((a = t.scene) == null ? void 0 : a.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1;
    const o = l.width, e = t.target_x ?? o * 0.65;
    this.keeperBaseX = e >= o * 0.5 ? Math.round(o * 0.26) : Math.round(o * 0.74);
  }
  async preload() {
    const l = this.data.scene.assets ?? {}, t = await Promise.allSettled(
      Object.entries(l).map(async ([o, e]) => {
        const a = await oe(e);
        return [o, a];
      })
    );
    for (const o of t)
      if (o.status === "fulfilled") {
        const [e, a] = o.value;
        this.images[e] = a;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(l) {
    this.ballX = Math.max(0, Math.min(l, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: l, canvas: t, data: o } = this, { width: e, height: a } = t;
    l.clearRect(0, 0, e, a), this._drawBackground(e, a), this._drawGoalPost(e, a), this._drawDecoys(o.scene.decoys ?? []), this._drawTargetRing(o.target_x, a), this._drawGoalkeeper(o.scene, e, a), this._drawBall(a);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(l, t) {
    const o = this.images.stadium;
    if (o) {
      this.ctx.drawImage(o, 0, 0, l, t);
      return;
    }
    const e = this.ctx, a = e.createLinearGradient(0, 0, 0, t * 0.72);
    a.addColorStop(0, "#4e9fc8"), a.addColorStop(0.55, "#6ab9de"), a.addColorStop(1, "#88ccec"), e.fillStyle = a, e.fillRect(0, 0, l, t * 0.72), e.fillStyle = "rgba(58,118,178,0.38)", e.strokeStyle = "rgba(38,98,158,0.28)", e.lineWidth = 1, e.beginPath(), e.moveTo(0, 0), e.lineTo(l * 0.42, 0), e.lineTo(l * 0.3, t * 0.2), e.lineTo(0, t * 0.24), e.closePath(), e.fill(), e.stroke(), e.beginPath(), e.moveTo(l * 0.58, 0), e.lineTo(l, 0), e.lineTo(l, t * 0.24), e.lineTo(l * 0.7, t * 0.2), e.closePath(), e.fill(), e.stroke();
    const s = e.createLinearGradient(0, t * 0.63, 0, t);
    s.addColorStop(0, "#52c148"), s.addColorStop(0.3, "#46b23c"), s.addColorStop(1, "#3aa030"), e.fillStyle = s, e.fillRect(0, t * 0.66, l, t);
    const d = e.createLinearGradient(0, t * 0.62, 0, t * 0.7);
    d.addColorStop(0, "rgba(80,185,70,0)"), d.addColorStop(1, "#52c148"), e.fillStyle = d, e.fillRect(0, t * 0.62, l, t * 0.1), e.fillStyle = "rgba(255,255,255,0.04)";
    for (let f = 0; f < l; f += 36)
      e.fillRect(f, t * 0.66, 18, t * 0.34);
  }
  _drawGoalPost(l, t) {
    const o = this.images.goal_post, e = Math.round(l * 0.07), a = Math.round(l * 0.93), s = Math.round(t * 0.09), d = Math.round(t * 0.88), f = 7, r = Math.round(l * 0.055), m = Math.round(t * 0.1);
    if (o) {
      this.ctx.drawImage(o, e, s, a - e, d - s);
      return;
    }
    const n = this.ctx, u = e + r, v = a - r, k = s - m;
    n.save(), n.save(), n.beginPath(), n.rect(e + f * 0.5, s + f * 0.5, a - e - f, d - s - f * 0.5), n.clip(), n.fillStyle = "rgba(160,200,230,0.07)", n.fillRect(e, s, a - e, d - s), n.strokeStyle = "rgba(170,205,235,0.42)", n.lineWidth = 0.8;
    for (let g = e; g <= a; g += 20)
      n.beginPath(), n.moveTo(g, s), n.lineTo(g, d), n.stroke();
    for (let g = s; g <= d; g += 15)
      n.beginPath(), n.moveTo(e, g), n.lineTo(a, g), n.stroke();
    n.restore(), n.strokeStyle = "rgba(210,225,240,0.72)", n.lineWidth = 3.5, n.lineCap = "round", n.beginPath(), n.moveTo(e, s), n.lineTo(u, k), n.stroke(), n.beginPath(), n.moveTo(a, s), n.lineTo(v, k), n.stroke(), n.beginPath(), n.moveTo(u, k), n.lineTo(v, k), n.stroke(), n.strokeStyle = "rgba(190,215,235,0.48)", n.lineWidth = 2.5, n.beginPath(), n.moveTo(u, k), n.lineTo(u, d), n.stroke(), n.beginPath(), n.moveTo(v, k), n.lineTo(v, d), n.stroke(), n.strokeStyle = "#ffffff", n.lineWidth = f, n.lineCap = "square", n.beginPath(), n.moveTo(e, s), n.lineTo(a, s), n.stroke(), n.beginPath(), n.moveTo(e, s), n.lineTo(e, d), n.stroke(), n.beginPath(), n.moveTo(a, s), n.lineTo(a, d), n.stroke(), n.restore();
  }
  _drawGoalkeeper(l, t, o) {
    const e = this.images.goalkeeper, a = Math.round(this.keeperBaseX + this.keeperOffsetX), s = Math.round(o * 0.16), f = Math.round(o * 0.89) - s;
    if (e) {
      const A = Math.round(f * 0.52);
      this.ctx.drawImage(e, a - A / 2, s, A, f);
      return;
    }
    const r = this.ctx;
    r.save();
    const m = Math.round(f * 0.09), n = s + m, u = n + m + Math.round(f * 0.025), v = Math.round(f * 0.3), k = Math.round(f * 0.16), g = Math.round(f * 0.21), c = Math.round(f * 0.21), _ = Math.round(f * 0.055), w = Math.round(f * 0.4), M = 40 * Math.PI / 180, C = u + v + k, X = Math.round(c * 0.44);
    r.fillStyle = "#111111", r.beginPath(), r.ellipse(a - c * 0.52, C + g + m * 0.35, m * 0.8, m * 0.35, 0, 0, Math.PI * 2), r.fill(), r.beginPath(), r.ellipse(a + c * 0.52, C + g + m * 0.35, m * 0.8, m * 0.35, 0, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1c1c2e", r.fillRect(a - c * 0.75, C, X, g), r.fillRect(a + c * 0.75 - X, C, X, g), r.fillStyle = "#1c1c2e", r.fillRect(a - c, u + v, c * 2, k), r.fillStyle = "#f2f2f2", r.fillRect(a - c, u, c * 2, v);
    const Z = Math.round(v * 0.26), J = u + Math.round(v * 0.38);
    r.fillStyle = "#e63946", r.fillRect(a - c, J, c * 2, Z);
    const P = u + Math.round(v * 0.1), I = a - c - Math.round(w * Math.cos(M)), D = P - Math.round(w * Math.sin(M)), R = a + c + Math.round(w * Math.cos(M)), W = P - Math.round(w * Math.sin(M));
    r.strokeStyle = "#f2f2f2", r.lineWidth = _, r.lineCap = "round", r.beginPath(), r.moveTo(a - c, P), r.lineTo(I, D), r.stroke(), r.beginPath(), r.moveTo(a + c, P), r.lineTo(R, W), r.stroke(), r.fillStyle = "#c8d5e2", r.beginPath(), r.arc(I, D, _ * 1.6, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(R, W, _ * 1.6, 0, Math.PI * 2), r.fill(), r.fillStyle = "#f0c090", r.beginPath(), r.arc(a, n, m, 0, Math.PI * 2), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(a, n, m, Math.PI, 0), r.closePath(), r.fill(), r.fillStyle = "#1a0f08", r.beginPath(), r.arc(a - m * 0.28, n + m * 0.08, m * 0.09, 0, Math.PI * 2), r.fill(), r.beginPath(), r.arc(a + m * 0.28, n + m * 0.08, m * 0.09, 0, Math.PI * 2), r.fill(), r.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(l, t) {
    const o = l, e = Math.round(t * 0.4), a = Math.round(t * 0.14), s = this.ctx;
    s.save(), s.shadowColor = "rgba(0,0,0,.55)", s.shadowBlur = 14, s.strokeStyle = "rgba(30,30,30,.6)", s.lineWidth = a * 0.58 + 2, s.beginPath(), s.arc(o, e, a, 0, Math.PI * 2), s.stroke(), s.shadowBlur = 0;
    const d = s.createLinearGradient(o - a, e - a, o + a, e + a);
    d.addColorStop(0, "#d4d4d4"), d.addColorStop(0.25, "#a0a0a0"), d.addColorStop(0.5, "#707070"), d.addColorStop(0.75, "#a8a8a8"), d.addColorStop(1, "#cecece"), s.strokeStyle = d, s.lineWidth = a * 0.55, s.beginPath(), s.arc(o, e, a, 0, Math.PI * 2), s.stroke(), s.strokeStyle = "rgba(255,255,255,.45)", s.lineWidth = 3, s.beginPath(), s.arc(o - a * 0.15, e - a * 0.15, a - a * 0.3, Math.PI * 1.05, Math.PI * 1.7), s.stroke(), s.strokeStyle = "rgba(0,0,0,.25)", s.lineWidth = 2, s.beginPath(), s.arc(o, e, a - a * 0.28, 0, Math.PI * 2), s.stroke(), s.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(l) {
    for (const t of l) {
      const o = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${t.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(t.x, o, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(l) {
    const t = this.images.ball, o = Math.round(l * 0.11), e = this.ballX, a = this.data.target_x, s = Math.abs(a - this.ballStartX) || 1, d = Math.max(0, Math.min(1, 1 - Math.abs(e - a) / s)), f = l * 0.82, r = l * 0.4, m = Math.round(f + d * (r - f)), n = this.ctx, u = o * 2, v = Math.round(u * 0.92);
    n.save(), n.beginPath(), n.rect(0, 0, this.canvas.width, this.canvas.height), n.clip(), t ? n.drawImage(t, e - o, m - o, u, u) : (n.font = `${v}px serif`, n.textAlign = "center", n.textBaseline = "middle", n.fillText("⚽", e, m)), n.restore();
  }
  destroy() {
  }
}
function le(i, l, t, o) {
  let e = null, a = !0;
  function s(d) {
    if (!a) return;
    const f = d % t / t * Math.PI * 2, r = i + (l - i) * (0.5 + 0.5 * Math.sin(f));
    o(r), e = requestAnimationFrame(s);
  }
  return e = requestAnimationFrame(s), () => {
    a = !1, e !== null && cancelAnimationFrame(e);
  };
}
const G = (i, l) => {
  const t = i.__vccOpts || i;
  for (const [o, e] of l)
    t[o] = e;
  return t;
}, re = { class: "gc-canvas-wrap" }, ie = ["width", "height"], ce = {
  key: 0,
  class: "gc-canvas__success-overlay",
  "aria-live": "polite"
}, de = {
  class: "gc-confetti",
  "aria-hidden": "true"
}, ue = ["data-i"], he = {
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
    var d, f, r, m;
    const l = i, t = S(null);
    let o = null, e = null;
    const a = ((f = (d = l.captchaData) == null ? void 0 : d.canvas) == null ? void 0 : f.width) ?? 400, s = ((m = (r = l.captchaData) == null ? void 0 : r.canvas) == null ? void 0 : m.height) ?? 220;
    return O(async () => {
      var u;
      o = new se(t.value, l.captchaData), await o.preload();
      const n = ((u = l.captchaData.scene) == null ? void 0 : u.keeper_offset_x) ?? 0;
      e = le(
        n - 8,
        n + 8,
        2400,
        (v) => {
          o && (o.keeperOffsetX = v, o.draw());
        }
      );
    }), H(() => {
      e == null || e(), o == null || o.destroy();
    }), F(
      () => l.ballX,
      (n) => {
        o && n !== null && o.setBallX(n);
      }
    ), (n, u) => (y(), b("div", re, [
      h("canvas", {
        ref_key: "canvasEl",
        ref: t,
        width: p(a),
        height: p(s),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, ie),
      q(Q, { name: "gc-success" }, {
        default: ee(() => [
          i.showSuccess ? (y(), b("div", ce, [
            h("div", de, [
              (y(), b(V, null, te(24, (v) => h("span", {
                key: v,
                class: "gc-confetti__piece",
                "data-i": v
              }, null, 8, ue)), 64))
            ]),
            u[0] || (u[0] = h("div", { class: "gc-success-badge" }, [
              h("div", { class: "gc-success-badge__ball" }, "⚽"),
              h("div", { class: "gc-success-badge__banner" }, [
                h("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--left",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  h("path", {
                    d: "M20 0 L0 20 L20 40 Z",
                    fill: "#15803d"
                  })
                ]),
                h("span", { class: "gc-success-badge__text" }, "SUCCESS"),
                h("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--right",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  h("path", {
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
}, Y = /* @__PURE__ */ G(he, [["__scopeId", "data-v-7d16f725"]]), fe = {
  key: 0,
  class: "gc-slider gc-slider--success",
  "aria-label": "Verification successful"
}, ge = ["aria-valuenow", "aria-valuemax", "tabindex"], ve = {
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
    const t = l, o = i, e = S(null), a = S(o.trackWidth / 2), s = S(!1), d = T(() => o.handleSize / 2), f = T(
      () => Math.max(0, Math.min(a.value - d.value, o.trackWidth - o.handleSize))
    ), r = T(() => {
      const g = o.trackWidth / 2, c = a.value - g, _ = g - o.handleSize / 2;
      if (_ <= 0) return o.ballStartX;
      if (c < 0) {
        const w = o.ballStartX / _;
        return Math.max(0, o.ballStartX + c * w);
      } else {
        const w = (o.trackWidth - o.ballStartX) / _;
        return Math.min(o.trackWidth, o.ballStartX + c * w);
      }
    }), m = T(() => {
      const g = o.trackWidth / 2, c = a.value;
      return c < g ? {
        left: `${c}px`,
        width: `${g - c}px`
      } : {
        left: `${g}px`,
        width: `${c - g}px`
      };
    });
    function n(g) {
      o.disabled || (s.value = !0, t("drag-start"), window.addEventListener("mousemove", u, { passive: !0 }), window.addEventListener("touchmove", u, { passive: !0 }), window.addEventListener("mouseup", v), window.addEventListener("touchend", v));
    }
    function u(g) {
      if (!s.value) return;
      const c = g.touches ? g.touches[0].clientX : g.clientX, _ = e.value.getBoundingClientRect(), w = Math.max(d.value, Math.min(c - _.left, o.trackWidth - d.value));
      a.value = w, t("drag-move", r.value, w);
    }
    function v() {
      s.value && (s.value = !1, window.removeEventListener("mousemove", u), window.removeEventListener("touchmove", u), window.removeEventListener("mouseup", v), window.removeEventListener("touchend", v), t("drag-end", r.value));
    }
    function k(g) {
      if (o.disabled) return;
      const c = 5;
      g.key === "ArrowRight" ? (s.value || (s.value = !0, t("drag-start")), a.value = Math.min(a.value + c, o.trackWidth - d.value), t("drag-move", r.value)) : g.key === "ArrowLeft" ? (s.value || (s.value = !0, t("drag-start")), a.value = Math.max(a.value - c, d.value), t("drag-move", r.value)) : (g.key === "Enter" || g.key === " ") && s.value && v();
    }
    return H(() => {
      window.removeEventListener("mousemove", u), window.removeEventListener("touchmove", u), window.removeEventListener("mouseup", v), window.removeEventListener("touchend", v);
    }), (g, c) => i.success ? (y(), b("div", fe, [...c[0] || (c[0] = [
      h("div", { class: "gc-slider__success-check" }, [
        h("svg", {
          viewBox: "0 0 44 44",
          fill: "none",
          "aria-hidden": "true"
        }, [
          h("circle", {
            cx: "22",
            cy: "22",
            r: "20",
            fill: "#16a34a"
          }),
          h("path", {
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
      class: B(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": s.value }]),
      ref_key: "trackEl",
      ref: e,
      role: "slider",
      "aria-valuenow": Math.round(a.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: k
    }, [
      h("div", {
        class: "gc-slider__fill",
        style: $(m.value)
      }, null, 4),
      c[2] || (c[2] = ae('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-d4fd89b3><span class="gc-slider__chev" data-v-d4fd89b3>❮</span><span class="gc-slider__chev" data-v-d4fd89b3>❮</span><span class="gc-slider__chev" data-v-d4fd89b3>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-d4fd89b3><span class="gc-slider__chev" data-v-d4fd89b3>❯</span><span class="gc-slider__chev" data-v-d4fd89b3>❯</span><span class="gc-slider__chev" data-v-d4fd89b3>❯</span></div>', 2)),
      h("div", {
        class: B(["gc-slider__handle", { "is-dragging": s.value }]),
        style: $({ left: f.value + "px" }),
        onMousedown: U(n, ["prevent"]),
        onTouchstart: U(n, ["prevent"]),
        "aria-hidden": "true"
      }, [...c[1] || (c[1] = [
        h("svg", {
          class: "gc-slider__handle-icon",
          viewBox: "0 0 32 18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          h("path", {
            d: "M1 9h30M23 3l8 6-8 6M9 3L1 9l8 6",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])], 38)
    ], 42, ge));
  }
}, z = /* @__PURE__ */ G(ve, [["__scopeId", "data-v-d4fd89b3"]]);
function me() {
  let i = [], l = null, t = !1;
  function o() {
    i = [], l = null, t = !1;
  }
  function e() {
    l = performance.now(), t = !0;
  }
  function a(r) {
    if (!t || l === null) return;
    const m = Math.round(performance.now() - l);
    i.length > 0 && m - i[i.length - 1].t < 8 || i.push({ x: Math.round(r), t: m });
  }
  function s() {
    t = !1;
  }
  function d() {
    return [...i];
  }
  function f() {
    return l === null ? 0 : Math.round(performance.now() - l);
  }
  return { reset: o, start: e, record: a, stop: s, getTrack: d, getElapsed: f };
}
function _e() {
  if (typeof document > "u") return null;
  const i = document.querySelector('meta[name="csrf-token"]');
  if (i != null && i.content) return i.content;
  const l = document.cookie.split("; ").find((t) => t.startsWith("XSRF-TOKEN="));
  return l ? decodeURIComponent(l.split("=")[1]) : null;
}
function N() {
  const i = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, l = _e();
  return l && (i["X-CSRF-TOKEN"] = l, i["X-XSRF-TOKEN"] = l), i;
}
function pe(i, l) {
  const t = S("idle"), o = S(null), e = S(null), a = S(null), s = me();
  async function d() {
    t.value = "loading", e.value = null, o.value = null;
    try {
      const u = await fetch(i, {
        method: "POST",
        headers: N(),
        credentials: "same-origin"
      });
      if (!u.ok) throw new Error(`Server error: ${u.status}`);
      a.value = await u.json(), t.value = "ready";
    } catch (u) {
      t.value = "failed", e.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", u);
    }
  }
  function f() {
    t.value === "ready" && (t.value = "dragging", s.reset(), s.start());
  }
  function r(u) {
    t.value === "dragging" && s.record(u);
  }
  async function m(u) {
    if (t.value !== "dragging") return;
    s.stop(), t.value = "verifying";
    const v = s.getTrack(), k = s.getElapsed();
    try {
      const c = await (await fetch(l, {
        method: "POST",
        headers: N(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: a.value.captcha_id,
          final_x: Math.round(u),
          drag_time: k,
          movement_track: v
        })
      })).json();
      c.success ? (o.value = c.token, t.value = "success") : (e.value = c.message ?? "Verification failed.", t.value = "failed");
    } catch (g) {
      t.value = "failed", e.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", g);
    }
  }
  async function n() {
    s.reset(), await d();
  }
  return {
    state: E(t),
    token: E(o),
    errorMsg: E(e),
    captchaData: E(a),
    load: d,
    onDragStart: f,
    onDragMove: r,
    onDragEnd: m,
    retry: n
  };
}
const ye = ["data-state"], be = { class: "gc-modal__header" }, ke = { class: "gc-modal__scene" }, we = {
  key: 0,
  class: "gc-modal__skeleton",
  "aria-busy": "true"
}, Me = {
  key: 0,
  class: "gc-modal__verifying",
  "aria-live": "polite"
}, Se = {
  key: 1,
  class: "gc-modal__verifying gc-modal__verifying--failed",
  "aria-live": "assertive"
}, xe = {
  key: 2,
  class: "gc-modal__error-scene",
  role: "alert"
}, Ce = { class: "gc-modal__error-msg" }, Pe = {
  key: 3,
  class: "gc-modal__idle"
}, Te = { class: "gc-modal__slider-wrap" }, Ee = {
  key: 1,
  class: "gc-modal__slider-skeleton"
}, Xe = {
  key: 2,
  class: "gc-modal__error-actions"
}, Le = ["name", "value"], K = {
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
    const t = i, o = l, {
      state: e,
      token: a,
      errorMsg: s,
      captchaData: d,
      load: f,
      onDragStart: r,
      onDragMove: m,
      onDragEnd: n,
      retry: u
    } = pe(t.generateUrl, t.verifyUrl), v = S(null);
    function k(c, _) {
      v.value = c, m(_ ?? c);
    }
    function g(c) {
      v.value = c, n(c);
    }
    return F(e, (c) => {
      var _;
      c === "success" && (v.value = ((_ = d.value) == null ? void 0 : _.target_x) ?? v.value, o("verified", a.value)), c === "failed" && (o("failed", s.value), d.value && setTimeout(() => {
        v.value = null, u();
      }, 1400)), c === "ready" && o("loaded", d.value);
    }), O(() => {
      t.autoLoad && f();
    }), (c, _) => {
      var w;
      return y(), b("div", {
        class: B(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
        "data-state": p(e),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        h("div", be, [
          _[4] || (_[4] = h("div", { class: "gc-modal__header-text" }, [
            h("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
            h("p", { class: "gc-modal__subtitle" }, "Drag the slider left or right to score a goal")
          ], -1)),
          i.closable ? (y(), b("button", {
            key: 0,
            type: "button",
            class: "gc-modal__close",
            "aria-label": "Close",
            onClick: _[0] || (_[0] = (M) => c.$emit("close"))
          }, [..._[3] || (_[3] = [
            h("svg", {
              viewBox: "0 0 24 24",
              width: "18",
              height: "18",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round"
            }, [
              h("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
              }),
              h("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
              })
            ], -1)
          ])])) : x("", !0)
        ]),
        h("div", ke, [
          p(e) === "loading" ? (y(), b("div", we)) : p(d) ? (y(), b(V, { key: 1 }, [
            q(Y, {
              "captcha-data": p(d),
              "ball-x": v.value,
              "show-success": p(e) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            p(e) === "verifying" ? (y(), b("div", Me, [..._[5] || (_[5] = [
              h("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              h("span", null, "Verifying…", -1)
            ])])) : x("", !0),
            p(e) === "failed" ? (y(), b("div", Se, [..._[6] || (_[6] = [
              h("span", {
                class: "gc-icon-miss",
                "aria-hidden": "true"
              }, "❌", -1),
              h("span", null, "Missed! Retrying…", -1)
            ])])) : x("", !0)
          ], 64)) : p(e) === "failed" ? (y(), b("div", xe, [
            _[7] || (_[7] = h("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            h("p", Ce, j(p(s) ?? "Verification failed. Please try again."), 1)
          ])) : (y(), b("div", Pe, [
            h("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: _[1] || (_[1] = (...M) => p(f) && p(f)(...M))
            }, "Start Verification")
          ]))
        ]),
        h("div", Te, [
          p(d) ? (y(), ne(z, {
            key: 0,
            "ball-start-x": p(d).ball_start_x,
            "track-width": ((w = p(d).canvas) == null ? void 0 : w.width) ?? 400,
            success: p(e) === "success",
            disabled: p(e) === "verifying" || p(e) === "success",
            onDragStart: p(r),
            onDragMove: k,
            onDragEnd: g
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : p(e) === "loading" ? (y(), b("div", Ee)) : p(e) === "failed" ? (y(), b("div", Xe, [
            h("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: _[2] || (_[2] = (...M) => p(u) && p(u)(...M))
            }, "↺ Try again")
          ])) : x("", !0)
        ]),
        p(a) ? (y(), b("input", {
          key: 0,
          type: "hidden",
          name: i.fieldName,
          value: p(a)
        }, null, 8, Le)) : x("", !0)
      ], 10, ye);
    };
  }
}, Be = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Ge = { class: "goal-captcha__success-text" }, Ie = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(i) {
    return (l, t) => (y(), b("div", Be, [
      t[0] || (t[0] = h("div", { class: "goal-captcha__success-icon" }, [
        h("svg", {
          viewBox: "0 0 52 52",
          class: "goal-captcha__checkmark",
          "aria-hidden": "true"
        }, [
          h("circle", {
            cx: "26",
            cy: "26",
            r: "25",
            fill: "none",
            class: "goal-captcha__checkmark-circle"
          }),
          h("path", {
            fill: "none",
            d: "M14 27l8 8 16-16",
            class: "goal-captcha__checkmark-check"
          })
        ])
      ], -1)),
      h("p", Ge, j(i.message), 1)
    ]));
  }
}, De = /* @__PURE__ */ G(Ie, [["__scopeId", "data-v-3f0157c9"]]), Re = (i, l = {}) => {
  (l.generateUrl || l.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: l.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: l.verifyUrl ?? "/_goal_captcha/verify",
    theme: l.theme ?? "football",
    difficulty: l.difficulty ?? "medium"
  }), i.component("GoalCaptcha", K), i.component("GoalCanvas", Y), i.component("GoalSlider", z), i.component("SuccessAnimation", De);
}, Ae = { install: Re };
function $e() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: i } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((l) => {
      const t = l.querySelector("#goal-captcha-app");
      if (!t) return;
      const o = l.querySelector('input[type="hidden"]'), e = {
        generateUrl: l.dataset.generateUrl,
        verifyUrl: l.dataset.verifyUrl,
        theme: l.dataset.theme ?? "football",
        difficulty: l.dataset.difficulty ?? "medium",
        fieldName: l.dataset.fieldName ?? "captcha_token"
      };
      i(K, {
        ...e,
        onVerified: (s) => {
          o && (o.value = s);
        }
      }).mount(t);
    });
  });
}
export {
  Y as GoalCanvas,
  K as GoalCaptcha,
  z as GoalSlider,
  De as SuccessAnimation,
  Ae as default,
  $e as initBladeMount,
  Re as install,
  pe as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
