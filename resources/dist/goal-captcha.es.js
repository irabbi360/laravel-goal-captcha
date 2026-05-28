import { ref as x, onMounted as G, onBeforeUnmount as I, watch as $, openBlock as m, createElementBlock as _, createElementVNode as l, unref as h, createVNode as A, Transition as F, withCtx as V, Fragment as W, renderList as q, createCommentVNode as M, computed as C, normalizeClass as L, normalizeStyle as D, createStaticVNode as H, withModifiers as B, readonly as E, toDisplayString as U, createBlock as j } from "vue";
const P = /* @__PURE__ */ new Map();
async function z(r) {
  return P.has(r) ? P.get(r) : new Promise((o, t) => {
    const e = new Image();
    e.crossOrigin = "anonymous", e.onload = () => {
      P.set(r, e), o(e);
    }, e.onerror = () => t(new Error(`Failed to load image: ${r}`)), e.src = r;
  });
}
class K {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(o, t) {
    var e;
    this.canvas = o, this.ctx = o.getContext("2d"), this.data = t, this.ballX = t.ball_start_x, this.keeperOffsetX = ((e = t.scene) == null ? void 0 : e.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1;
  }
  async preload() {
    const o = this.data.scene.assets ?? {}, t = await Promise.allSettled(
      Object.entries(o).map(async ([e, n]) => {
        const a = await z(n);
        return [e, a];
      })
    );
    for (const e of t)
      if (e.status === "fulfilled") {
        const [n, a] = e.value;
        this.images[n] = a;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(o) {
    this.ballX = Math.max(0, Math.min(o, this.canvas.width)), this.draw();
  }
  draw() {
    var s;
    const { ctx: o, canvas: t, data: e } = this, { width: n, height: a } = t;
    o.clearRect(0, 0, n, a), this._drawBackground(n, a), this._drawGoalPost(n, a), this._drawDecoys(e.scene.decoys ?? []), this._drawTargetRing(e.target_x, a), this._drawGoalkeeper(e.scene, n, a), this._drawBall(a, ((s = e.scene) == null ? void 0 : s.ball_radius) ?? 18);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(o, t) {
    const e = this.images.stadium;
    if (e)
      this.ctx.drawImage(e, 0, 0, o, t);
    else {
      const n = this.ctx.createLinearGradient(0, 0, 0, t);
      n.addColorStop(0, "#1a472a"), n.addColorStop(1, "#2d6a4f"), this.ctx.fillStyle = n, this.ctx.fillRect(0, 0, o, t), this.ctx.strokeStyle = "rgba(255,255,255,0.08)", this.ctx.lineWidth = 1;
      for (let a = 0; a <= o; a += 30)
        this.ctx.beginPath(), this.ctx.moveTo(a, 0), this.ctx.lineTo(a, t), this.ctx.stroke();
    }
  }
  _drawGoalPost(o, t) {
    const e = this.images.goal_post, n = Math.round(o * 0.35 * (this.data.scene.goal_width_scale ?? 1)), a = Math.round(t * 0.6), s = Math.round((o - n) / 2), i = Math.round(t * 0.05);
    if (e) {
      this.ctx.drawImage(e, s, i, n, a);
      return;
    }
    this.ctx.strokeStyle = "#ffffff", this.ctx.lineWidth = 4, this.ctx.strokeRect(s, i, n, a), this.ctx.strokeStyle = "rgba(255,255,255,0.2)", this.ctx.lineWidth = 1;
    for (let d = s; d <= s + n; d += 15)
      this.ctx.beginPath(), this.ctx.moveTo(d, i), this.ctx.lineTo(d, i + a), this.ctx.stroke();
    for (let d = i; d <= i + a; d += 12)
      this.ctx.beginPath(), this.ctx.moveTo(s, d), this.ctx.lineTo(s + n, d), this.ctx.stroke();
  }
  _drawGoalkeeper(o, t, e) {
    const n = this.images.goalkeeper, a = Math.round(e * 0.35), s = Math.round(e * 0.72), i = Math.round(t / 2 - a / 2 + this.keeperOffsetX), d = Math.round(e * 0.18);
    if (n) {
      this.ctx.drawImage(n, i, d, a, s);
      return;
    }
    this.ctx.fillStyle = "#e74c3c", this.ctx.fillRect(i + Math.round(a * 0.3), d + Math.round(s * 0.15), Math.round(a * 0.4), Math.round(s * 0.55)), this.ctx.beginPath(), this.ctx.arc(i + Math.round(a / 2), d + Math.round(s * 0.1), Math.round(a * 0.18), 0, Math.PI * 2), this.ctx.fill();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(o, t) {
    const e = o, n = Math.round(t * 0.38), a = Math.round(t * 0.14), s = this.ctx;
    s.save(), s.shadowColor = "rgba(0,0,0,.55)", s.shadowBlur = 14, s.strokeStyle = "rgba(30,30,30,.6)", s.lineWidth = a * 0.58 + 2, s.beginPath(), s.arc(e, n, a, 0, Math.PI * 2), s.stroke(), s.shadowBlur = 0;
    const i = s.createLinearGradient(e - a, n - a, e + a, n + a);
    i.addColorStop(0, "#d4d4d4"), i.addColorStop(0.25, "#a0a0a0"), i.addColorStop(0.5, "#707070"), i.addColorStop(0.75, "#a8a8a8"), i.addColorStop(1, "#cecece"), s.strokeStyle = i, s.lineWidth = a * 0.55, s.beginPath(), s.arc(e, n, a, 0, Math.PI * 2), s.stroke(), s.strokeStyle = "rgba(255,255,255,.45)", s.lineWidth = 3, s.beginPath(), s.arc(e - a * 0.15, n - a * 0.15, a - a * 0.3, Math.PI * 1.05, Math.PI * 1.7), s.stroke(), s.strokeStyle = "rgba(0,0,0,.25)", s.lineWidth = 2, s.beginPath(), s.arc(e, n, a - a * 0.28, 0, Math.PI * 2), s.stroke(), s.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(o) {
    for (const t of o) {
      const e = Math.round(this.canvas.height * 0.38);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${t.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(t.x, e, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(o, t) {
    const e = this.images.ball, n = this.ballX, a = Math.round(o * 0.76);
    if (e) {
      this.ctx.drawImage(e, n - t, a - t, t * 2, t * 2);
      return;
    }
    this.ctx.save(), this.ctx.fillStyle = "#f5f5f5", this.ctx.strokeStyle = "#333", this.ctx.lineWidth = 2, this.ctx.shadowColor = "rgba(0,0,0,0.4)", this.ctx.shadowBlur = 6, this.ctx.beginPath(), this.ctx.arc(n, a, t, 0, Math.PI * 2), this.ctx.fill(), this.ctx.stroke(), this.ctx.fillStyle = "#222";
    const s = [
      [n, a],
      [n - t * 0.4, a - t * 0.5],
      [n + t * 0.4, a - t * 0.5],
      [n - t * 0.5, a + t * 0.3],
      [n + t * 0.5, a + t * 0.3]
    ];
    for (const [i, d] of s)
      this.ctx.beginPath(), this.ctx.arc(i, d, t * 0.2, 0, Math.PI * 2), this.ctx.fill();
    this.ctx.restore();
  }
  destroy() {
  }
}
function Z(r, o, t, e) {
  let n = null, a = !0;
  function s(i) {
    if (!a) return;
    const d = i % t / t * Math.PI * 2, p = r + (o - r) * (0.5 + 0.5 * Math.sin(d));
    e(p), n = requestAnimationFrame(s);
  }
  return n = requestAnimationFrame(s), () => {
    a = !1, n !== null && cancelAnimationFrame(n);
  };
}
const X = (r, o) => {
  const t = r.__vccOpts || r;
  for (const [e, n] of o)
    t[e] = n;
  return t;
}, J = { class: "gc-canvas-wrap" }, Y = ["width", "height"], Q = {
  key: 0,
  class: "gc-canvas__success-overlay",
  "aria-live": "polite"
}, ee = {
  class: "gc-confetti",
  "aria-hidden": "true"
}, te = ["data-i"], ae = {
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
  setup(r) {
    var i, d, p, k;
    const o = r, t = x(null);
    let e = null, n = null;
    const a = ((d = (i = o.captchaData) == null ? void 0 : i.canvas) == null ? void 0 : d.width) ?? 400, s = ((k = (p = o.captchaData) == null ? void 0 : p.canvas) == null ? void 0 : k.height) ?? 220;
    return G(async () => {
      var u;
      e = new K(t.value, o.captchaData), await e.preload();
      const y = ((u = o.captchaData.scene) == null ? void 0 : u.keeper_offset_x) ?? 0;
      n = Z(
        y - 8,
        y + 8,
        2400,
        (v) => {
          e && (e.keeperOffsetX = v, e.draw());
        }
      );
    }), I(() => {
      n == null || n(), e == null || e.destroy();
    }), $(
      () => o.ballX,
      (y) => {
        e && y !== null && e.setBallX(y);
      }
    ), (y, u) => (m(), _("div", J, [
      l("canvas", {
        ref_key: "canvasEl",
        ref: t,
        width: h(a),
        height: h(s),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, Y),
      A(F, { name: "gc-success" }, {
        default: V(() => [
          r.showSuccess ? (m(), _("div", Q, [
            l("div", ee, [
              (m(), _(W, null, q(24, (v) => l("span", {
                key: v,
                class: "gc-confetti__piece",
                "data-i": v
              }, null, 8, te)), 64))
            ]),
            u[0] || (u[0] = l("div", { class: "gc-success-badge" }, [
              l("div", { class: "gc-success-badge__ball" }, "⚽"),
              l("div", { class: "gc-success-badge__banner" }, [
                l("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--left",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  l("path", {
                    d: "M20 0 L0 20 L20 40 Z",
                    fill: "#15803d"
                  })
                ]),
                l("span", { class: "gc-success-badge__text" }, "SUCCESS"),
                l("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--right",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  l("path", {
                    d: "M0 0 L20 20 L0 40 Z",
                    fill: "#15803d"
                  })
                ])
              ])
            ], -1))
          ])) : M("", !0)
        ]),
        _: 1
      })
    ]));
  }
}, N = /* @__PURE__ */ X(ae, [["__scopeId", "data-v-7d16f725"]]), se = {
  key: 0,
  class: "gc-slider gc-slider--success",
  "aria-label": "Verification successful"
}, ne = ["aria-valuenow", "aria-valuemax", "tabindex"], oe = {
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
  setup(r, { emit: o }) {
    const t = o, e = r, n = x(null), a = x(e.trackWidth / 2), s = x(!1), i = C(() => e.handleSize / 2), d = C(
      () => Math.max(0, Math.min(a.value - i.value, e.trackWidth - e.handleSize))
    ), p = C(() => {
      const f = e.trackWidth / 2, c = a.value - f, g = f - e.handleSize / 2;
      if (g <= 0) return e.ballStartX;
      if (c < 0) {
        const w = e.ballStartX / g;
        return Math.max(0, e.ballStartX + c * w);
      } else {
        const w = (e.trackWidth - e.ballStartX) / g;
        return Math.min(e.trackWidth, e.ballStartX + c * w);
      }
    }), k = C(() => {
      const f = e.trackWidth / 2, c = a.value;
      return c < f ? {
        left: `${c}px`,
        width: `${f - c}px`
      } : {
        left: `${f}px`,
        width: `${c - f}px`
      };
    });
    function y(f) {
      e.disabled || (s.value = !0, t("drag-start"), window.addEventListener("mousemove", u, { passive: !0 }), window.addEventListener("touchmove", u, { passive: !0 }), window.addEventListener("mouseup", v), window.addEventListener("touchend", v));
    }
    function u(f) {
      if (!s.value) return;
      const c = f.touches ? f.touches[0].clientX : f.clientX, g = n.value.getBoundingClientRect(), w = Math.max(i.value, Math.min(c - g.left, e.trackWidth - i.value));
      a.value = w, t("drag-move", p.value);
    }
    function v() {
      s.value && (s.value = !1, window.removeEventListener("mousemove", u), window.removeEventListener("touchmove", u), window.removeEventListener("mouseup", v), window.removeEventListener("touchend", v), t("drag-end", p.value));
    }
    function b(f) {
      if (e.disabled) return;
      const c = 5;
      f.key === "ArrowRight" ? (s.value || (s.value = !0, t("drag-start")), a.value = Math.min(a.value + c, e.trackWidth - i.value), t("drag-move", p.value)) : f.key === "ArrowLeft" ? (s.value || (s.value = !0, t("drag-start")), a.value = Math.max(a.value - c, i.value), t("drag-move", p.value)) : (f.key === "Enter" || f.key === " ") && s.value && v();
    }
    return I(() => {
      window.removeEventListener("mousemove", u), window.removeEventListener("touchmove", u), window.removeEventListener("mouseup", v), window.removeEventListener("touchend", v);
    }), (f, c) => r.success ? (m(), _("div", se, [...c[0] || (c[0] = [
      l("div", { class: "gc-slider__success-check" }, [
        l("svg", {
          viewBox: "0 0 44 44",
          fill: "none",
          "aria-hidden": "true"
        }, [
          l("circle", {
            cx: "22",
            cy: "22",
            r: "20",
            fill: "#16a34a"
          }),
          l("path", {
            d: "M13 22.5l6.5 6.5 11-13",
            stroke: "#fff",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ])
      ], -1)
    ])])) : (m(), _("div", {
      key: 1,
      class: L(["gc-slider", { "gc-slider--disabled": r.disabled, "gc-slider--dragging": s.value }]),
      ref_key: "trackEl",
      ref: n,
      role: "slider",
      "aria-valuenow": Math.round(a.value),
      "aria-valuemin": 0,
      "aria-valuemax": r.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: r.disabled ? -1 : 0,
      onKeydown: b
    }, [
      l("div", {
        class: "gc-slider__fill",
        style: D(k.value)
      }, null, 4),
      c[2] || (c[2] = H('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-b3854d8c><span class="gc-slider__chev" data-v-b3854d8c>❮</span><span class="gc-slider__chev" data-v-b3854d8c>❮</span><span class="gc-slider__chev" data-v-b3854d8c>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-b3854d8c><span class="gc-slider__chev" data-v-b3854d8c>❯</span><span class="gc-slider__chev" data-v-b3854d8c>❯</span><span class="gc-slider__chev" data-v-b3854d8c>❯</span></div>', 2)),
      l("div", {
        class: L(["gc-slider__handle", { "is-dragging": s.value }]),
        style: D({ left: d.value + "px" }),
        onMousedown: B(y, ["prevent"]),
        onTouchstart: B(y, ["prevent"]),
        "aria-hidden": "true"
      }, [...c[1] || (c[1] = [
        l("svg", {
          class: "gc-slider__handle-icon",
          viewBox: "0 0 32 18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          l("path", {
            d: "M1 9h30M23 3l8 6-8 6M9 3L1 9l8 6",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])], 38)
    ], 42, ne));
  }
}, O = /* @__PURE__ */ X(oe, [["__scopeId", "data-v-b3854d8c"]]);
function re() {
  let r = [], o = null, t = !1;
  function e() {
    r = [], o = null, t = !1;
  }
  function n() {
    o = performance.now(), t = !0;
  }
  function a(p) {
    if (!t || o === null) return;
    const k = Math.round(performance.now() - o);
    r.length > 0 && k - r[r.length - 1].t < 8 || r.push({ x: Math.round(p), t: k });
  }
  function s() {
    t = !1;
  }
  function i() {
    return [...r];
  }
  function d() {
    return o === null ? 0 : Math.round(performance.now() - o);
  }
  return { reset: e, start: n, record: a, stop: s, getTrack: i, getElapsed: d };
}
function ie() {
  if (typeof document > "u") return null;
  const r = document.querySelector('meta[name="csrf-token"]');
  if (r != null && r.content) return r.content;
  const o = document.cookie.split("; ").find((t) => t.startsWith("XSRF-TOKEN="));
  return o ? decodeURIComponent(o.split("=")[1]) : null;
}
function T() {
  const r = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, o = ie();
  return o && (r["X-CSRF-TOKEN"] = o, r["X-XSRF-TOKEN"] = o), r;
}
function le(r, o) {
  const t = x("idle"), e = x(null), n = x(null), a = x(null), s = re();
  async function i() {
    t.value = "loading", n.value = null, e.value = null;
    try {
      const u = await fetch(r, {
        method: "POST",
        headers: T(),
        credentials: "same-origin"
      });
      if (!u.ok) throw new Error(`Server error: ${u.status}`);
      a.value = await u.json(), t.value = "ready";
    } catch (u) {
      t.value = "failed", n.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", u);
    }
  }
  function d() {
    t.value === "ready" && (t.value = "dragging", s.reset(), s.start());
  }
  function p(u) {
    t.value === "dragging" && s.record(u);
  }
  async function k(u) {
    if (t.value !== "dragging") return;
    s.stop(), t.value = "verifying";
    const v = s.getTrack(), b = s.getElapsed();
    try {
      const c = await (await fetch(o, {
        method: "POST",
        headers: T(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: a.value.captcha_id,
          final_x: Math.round(u),
          drag_time: b,
          movement_track: v
        })
      })).json();
      c.success ? (e.value = c.token, t.value = "success") : (n.value = c.message ?? "Verification failed.", t.value = "failed");
    } catch (f) {
      t.value = "failed", n.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", f);
    }
  }
  async function y() {
    s.reset(), await i();
  }
  return {
    state: E(t),
    token: E(e),
    errorMsg: E(n),
    captchaData: E(a),
    load: i,
    onDragStart: d,
    onDragMove: p,
    onDragEnd: k,
    retry: y
  };
}
const ce = ["data-state"], de = { class: "gc-modal__header" }, ue = { class: "gc-modal__scene" }, he = {
  key: 0,
  class: "gc-modal__skeleton",
  "aria-busy": "true"
}, fe = {
  key: 0,
  class: "gc-modal__verifying",
  "aria-live": "polite"
}, ge = {
  key: 2,
  class: "gc-modal__error-scene",
  role: "alert"
}, ve = { class: "gc-modal__error-msg" }, me = {
  key: 3,
  class: "gc-modal__idle"
}, _e = { class: "gc-modal__slider-wrap" }, pe = {
  key: 1,
  class: "gc-modal__slider-skeleton"
}, ye = {
  key: 2,
  class: "gc-modal__error-actions"
}, ke = ["name", "value"], R = {
  __name: "GoalCaptcha",
  props: {
    generateUrl: {
      type: String,
      default: () => {
        var r;
        return ((r = window.__GoalCaptchaConfig) == null ? void 0 : r.generateUrl) ?? "/_goal_captcha/generate";
      }
    },
    verifyUrl: {
      type: String,
      default: () => {
        var r;
        return ((r = window.__GoalCaptchaConfig) == null ? void 0 : r.verifyUrl) ?? "/_goal_captcha/verify";
      }
    },
    fieldName: {
      type: String,
      default: "captcha_token"
    },
    theme: {
      type: String,
      default: () => {
        var r;
        return ((r = window.__GoalCaptchaConfig) == null ? void 0 : r.theme) ?? "football";
      }
    },
    difficulty: {
      type: String,
      default: () => {
        var r;
        return ((r = window.__GoalCaptchaConfig) == null ? void 0 : r.difficulty) ?? "medium";
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
  setup(r, { emit: o }) {
    const t = r, e = o, {
      state: n,
      token: a,
      errorMsg: s,
      captchaData: i,
      load: d,
      onDragStart: p,
      onDragMove: k,
      onDragEnd: y,
      retry: u
    } = le(t.generateUrl, t.verifyUrl), v = x(null);
    function b(c) {
      v.value = c, k(c);
    }
    function f(c) {
      v.value = c, y(c);
    }
    return $(n, (c) => {
      var g;
      c === "success" && (v.value = ((g = i.value) == null ? void 0 : g.target_x) ?? v.value, e("verified", a.value)), c === "failed" && e("failed", s.value), c === "ready" && e("loaded", i.value);
    }), G(() => {
      t.autoLoad && d();
    }), (c, g) => {
      var w;
      return m(), _("div", {
        class: L(["gc-modal", [`gc-modal--${r.theme}`, `gc-modal--${r.difficulty}`]]),
        "data-state": h(n),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        l("div", de, [
          g[4] || (g[4] = l("div", { class: "gc-modal__header-text" }, [
            l("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
            l("p", { class: "gc-modal__subtitle" }, "Drag the slider left or right to score a goal")
          ], -1)),
          r.closable ? (m(), _("button", {
            key: 0,
            type: "button",
            class: "gc-modal__close",
            "aria-label": "Close",
            onClick: g[0] || (g[0] = (S) => c.$emit("close"))
          }, [...g[3] || (g[3] = [
            l("svg", {
              viewBox: "0 0 24 24",
              width: "18",
              height: "18",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5",
              "stroke-linecap": "round"
            }, [
              l("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
              }),
              l("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
              })
            ], -1)
          ])])) : M("", !0)
        ]),
        l("div", ue, [
          h(n) === "loading" ? (m(), _("div", he)) : h(i) ? (m(), _(W, { key: 1 }, [
            A(N, {
              "captcha-data": h(i),
              "ball-x": v.value,
              "show-success": h(n) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            h(n) === "verifying" ? (m(), _("div", fe, [...g[5] || (g[5] = [
              l("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              l("span", null, "Verifying…", -1)
            ])])) : M("", !0)
          ], 64)) : h(n) === "failed" ? (m(), _("div", ge, [
            g[6] || (g[6] = l("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            l("p", ve, U(h(s) ?? "Verification failed. Please try again."), 1)
          ])) : (m(), _("div", me, [
            l("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: g[1] || (g[1] = (...S) => h(d) && h(d)(...S))
            }, "Start Verification")
          ]))
        ]),
        l("div", _e, [
          h(i) ? (m(), j(O, {
            key: 0,
            "ball-start-x": h(i).ball_start_x,
            "track-width": ((w = h(i).canvas) == null ? void 0 : w.width) ?? 400,
            success: h(n) === "success",
            disabled: h(n) === "verifying" || h(n) === "success",
            onDragStart: h(p),
            onDragMove: b,
            onDragEnd: f
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : h(n) === "loading" ? (m(), _("div", pe)) : h(n) === "failed" ? (m(), _("div", ye, [
            l("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: g[2] || (g[2] = (...S) => h(u) && h(u)(...S))
            }, "↺ Try again")
          ])) : M("", !0)
        ]),
        h(a) ? (m(), _("input", {
          key: 0,
          type: "hidden",
          name: r.fieldName,
          value: h(a)
        }, null, 8, ke)) : M("", !0)
      ], 10, ce);
    };
  }
}, xe = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, we = { class: "goal-captcha__success-text" }, be = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(r) {
    return (o, t) => (m(), _("div", xe, [
      t[0] || (t[0] = l("div", { class: "goal-captcha__success-icon" }, [
        l("svg", {
          viewBox: "0 0 52 52",
          class: "goal-captcha__checkmark",
          "aria-hidden": "true"
        }, [
          l("circle", {
            cx: "26",
            cy: "26",
            r: "25",
            fill: "none",
            class: "goal-captcha__checkmark-circle"
          }),
          l("path", {
            fill: "none",
            d: "M14 27l8 8 16-16",
            class: "goal-captcha__checkmark-check"
          })
        ])
      ], -1)),
      l("p", we, U(r.message), 1)
    ]));
  }
}, Me = /* @__PURE__ */ X(be, [["__scopeId", "data-v-3f0157c9"]]), Se = (r, o = {}) => {
  (o.generateUrl || o.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: o.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: o.verifyUrl ?? "/_goal_captcha/verify",
    theme: o.theme ?? "football",
    difficulty: o.difficulty ?? "medium"
  }), r.component("GoalCaptcha", R), r.component("GoalCanvas", N), r.component("GoalSlider", O), r.component("SuccessAnimation", Me);
}, Ee = { install: Se };
function Pe() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: r } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((o) => {
      const t = o.querySelector("#goal-captcha-app");
      if (!t) return;
      const e = o.querySelector('input[type="hidden"]'), n = {
        generateUrl: o.dataset.generateUrl,
        verifyUrl: o.dataset.verifyUrl,
        theme: o.dataset.theme ?? "football",
        difficulty: o.dataset.difficulty ?? "medium",
        fieldName: o.dataset.fieldName ?? "captcha_token"
      };
      r(R, {
        ...n,
        onVerified: (s) => {
          e && (e.value = s);
        }
      }).mount(t);
    });
  });
}
export {
  N as GoalCanvas,
  R as GoalCaptcha,
  O as GoalSlider,
  Me as SuccessAnimation,
  Ee as default,
  Pe as initBladeMount,
  Se as install,
  le as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
