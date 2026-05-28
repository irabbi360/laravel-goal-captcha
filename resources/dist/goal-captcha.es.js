import { ref as y, onMounted as G, onBeforeUnmount as T, watch as A, openBlock as p, createElementBlock as _, unref as d, computed as M, createElementVNode as g, normalizeStyle as D, withModifiers as P, normalizeClass as X, createCommentVNode as C, toDisplayString as I, readonly as b, createBlock as N, Fragment as R, createVNode as L } from "vue";
const S = /* @__PURE__ */ new Map();
async function q(s) {
  return S.has(s) ? S.get(s) : new Promise((a, t) => {
    const e = new Image();
    e.crossOrigin = "anonymous", e.onload = () => {
      S.set(s, e), a(e);
    }, e.onerror = () => t(new Error(`Failed to load image: ${s}`)), e.src = s;
  });
}
class H {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(a, t) {
    this.canvas = a, this.ctx = a.getContext("2d"), this.data = t, this.ballX = t.ball_start_x, this.images = {}, this.ready = !1;
  }
  async preload() {
    const a = this.data.scene.assets ?? {}, t = await Promise.allSettled(
      Object.entries(a).map(async ([e, n]) => {
        const o = await q(n);
        return [e, o];
      })
    );
    for (const e of t)
      if (e.status === "fulfilled") {
        const [n, o] = e.value;
        this.images[n] = o;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(a) {
    this.ballX = Math.max(0, Math.min(a, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: a, canvas: t, data: e } = this, { width: n, height: o } = t;
    a.clearRect(0, 0, n, o), this._drawBackground(n, o), this._drawGoalPost(n, o), this._drawDecoys(e.scene.decoys ?? []), this._drawTargetRing(e.target_x, o), this._drawGoalkeeper(e.scene, n, o), this._drawBall(o, e.scene.ball_radius ?? 16);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(a, t) {
    const e = this.images.stadium;
    if (e)
      this.ctx.drawImage(e, 0, 0, a, t);
    else {
      const n = this.ctx.createLinearGradient(0, 0, 0, t);
      n.addColorStop(0, "#1a472a"), n.addColorStop(1, "#2d6a4f"), this.ctx.fillStyle = n, this.ctx.fillRect(0, 0, a, t), this.ctx.strokeStyle = "rgba(255,255,255,0.08)", this.ctx.lineWidth = 1;
      for (let o = 0; o <= a; o += 30)
        this.ctx.beginPath(), this.ctx.moveTo(o, 0), this.ctx.lineTo(o, t), this.ctx.stroke();
    }
  }
  _drawGoalPost(a, t) {
    const e = this.images.goal_post, n = Math.round(a * 0.35 * (this.data.scene.goal_width_scale ?? 1)), o = Math.round(t * 0.6), i = Math.round((a - n) / 2), r = Math.round(t * 0.05);
    if (e) {
      this.ctx.drawImage(e, i, r, n, o);
      return;
    }
    this.ctx.strokeStyle = "#ffffff", this.ctx.lineWidth = 4, this.ctx.strokeRect(i, r, n, o), this.ctx.strokeStyle = "rgba(255,255,255,0.2)", this.ctx.lineWidth = 1;
    for (let c = i; c <= i + n; c += 15)
      this.ctx.beginPath(), this.ctx.moveTo(c, r), this.ctx.lineTo(c, r + o), this.ctx.stroke();
    for (let c = r; c <= r + o; c += 12)
      this.ctx.beginPath(), this.ctx.moveTo(i, c), this.ctx.lineTo(i + n, c), this.ctx.stroke();
  }
  _drawGoalkeeper(a, t, e) {
    const n = this.images.goalkeeper, o = 40, i = 80, r = Math.round(t / 2 - o / 2 + (a.keeper_offset_x ?? 0)), c = Math.round(e * 0.2);
    if (n) {
      this.ctx.drawImage(n, r, c, o, i);
      return;
    }
    this.ctx.fillStyle = "#e74c3c", this.ctx.fillRect(r + 12, c, 16, i), this.ctx.beginPath(), this.ctx.arc(r + 20, c - 10, 10, 0, Math.PI * 2), this.ctx.fill();
  }
  /** The real target ring (bright + solid). */
  _drawTargetRing(a, t) {
    const e = a, n = Math.round(t * 0.72), o = 14;
    this.ctx.save(), this.ctx.strokeStyle = "#f1c40f", this.ctx.lineWidth = 3, this.ctx.shadowColor = "#f39c12", this.ctx.shadowBlur = 8, this.ctx.beginPath(), this.ctx.arc(e, n, o, 0, Math.PI * 2), this.ctx.stroke(), this.ctx.fillStyle = "rgba(241,196,15,0.4)", this.ctx.beginPath(), this.ctx.arc(e, n, o * 0.4, 0, Math.PI * 2), this.ctx.fill(), this.ctx.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(a) {
    for (const t of a) {
      const e = Math.round(this.canvas.height * 0.72);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(241,196,15,${t.opacity})`, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.arc(t.x, e, 14, 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(a, t) {
    const e = this.images.ball, n = this.ballX, o = Math.round(a * 0.72);
    if (e) {
      this.ctx.drawImage(e, n - t, o - t, t * 2, t * 2);
      return;
    }
    this.ctx.save(), this.ctx.fillStyle = "#f5f5f5", this.ctx.strokeStyle = "#333", this.ctx.lineWidth = 2, this.ctx.shadowColor = "rgba(0,0,0,0.4)", this.ctx.shadowBlur = 6, this.ctx.beginPath(), this.ctx.arc(n, o, t, 0, Math.PI * 2), this.ctx.fill(), this.ctx.stroke(), this.ctx.fillStyle = "#222";
    const i = [
      [n, o],
      [n - t * 0.4, o - t * 0.5],
      [n + t * 0.4, o - t * 0.5],
      [n - t * 0.5, o + t * 0.3],
      [n + t * 0.5, o + t * 0.3]
    ];
    for (const [r, c] of i)
      this.ctx.beginPath(), this.ctx.arc(r, c, t * 0.2, 0, Math.PI * 2), this.ctx.fill();
    this.ctx.restore();
  }
  destroy() {
  }
}
function F(s, a, t, e) {
  let n = null, o = !0;
  function i(r) {
    if (!o) return;
    const c = r % t / t * Math.PI * 2, v = s + (a - s) * (0.5 + 0.5 * Math.sin(c));
    e(v), n = requestAnimationFrame(i);
  }
  return n = requestAnimationFrame(i), () => {
    o = !1, n !== null && cancelAnimationFrame(n);
  };
}
const E = (s, a) => {
  const t = s.__vccOpts || s;
  for (const [e, n] of a)
    t[e] = n;
  return t;
}, O = ["width", "height"], V = {
  __name: "GoalCanvas",
  props: {
    captchaData: {
      type: Object,
      required: !0
    },
    ballX: {
      type: Number,
      default: null
    }
  },
  setup(s) {
    var r, c, v, m;
    const a = s, t = y(null);
    let e = null, n = null;
    const o = ((c = (r = a.captchaData) == null ? void 0 : r.canvas) == null ? void 0 : c.width) ?? 400, i = ((m = (v = a.captchaData) == null ? void 0 : v.canvas) == null ? void 0 : m.height) ?? 200;
    return G(async () => {
      var h, l;
      e = new H(t.value, a.captchaData), await e.preload(), n = F(
        (((h = a.captchaData.scene) == null ? void 0 : h.keeper_offset_x) ?? 0) - 8,
        (((l = a.captchaData.scene) == null ? void 0 : l.keeper_offset_x) ?? 0) + 8,
        2400,
        (w) => {
          e && (e.data.scene.keeper_offset_x = w, e.draw());
        }
      );
    }), T(() => {
      n == null || n(), e == null || e.destroy();
    }), A(
      () => a.ballX,
      (h) => {
        e && h !== null && e.setBallX(h);
      }
    ), (h, l) => (p(), _("canvas", {
      ref_key: "canvasEl",
      ref: t,
      width: d(o),
      height: d(i),
      class: "goal-captcha__canvas",
      "aria-label": "Football goal CAPTCHA scene",
      role: "img"
    }, null, 8, O));
  }
}, U = /* @__PURE__ */ E(V, [["__scopeId", "data-v-90a5144f"]]), j = ["aria-valuenow", "aria-valuemax"], z = {
  key: 0,
  class: "goal-captcha__slider-hint"
}, K = {
  __name: "GoalSlider",
  props: {
    ballStartX: { type: Number, default: 20 },
    trackWidth: { type: Number, default: 400 },
    handleSize: { type: Number, default: 44 }
  },
  emits: ["drag-start", "drag-move", "drag-end"],
  setup(s, { emit: a }) {
    const t = a, e = s, n = y(null), o = y(e.ballStartX), i = y(!1), r = M(() => e.handleSize / 2), c = M(
      () => Math.max(0, Math.min(o.value - r.value, e.trackWidth - e.handleSize))
    ), v = M(
      () => Math.round(o.value / e.trackWidth * 100)
    );
    function m(u) {
      i.value = !0, t("drag-start"), window.addEventListener("mousemove", h, { passive: !0 }), window.addEventListener("touchmove", h, { passive: !0 }), window.addEventListener("mouseup", l), window.addEventListener("touchend", l);
    }
    function h(u) {
      if (!i.value) return;
      const f = u.touches ? u.touches[0].clientX : u.clientX, x = n.value.getBoundingClientRect(), k = Math.max(0, Math.min(f - x.left, e.trackWidth));
      o.value = k, t("drag-move", k);
    }
    function l() {
      i.value && (i.value = !1, window.removeEventListener("mousemove", h), window.removeEventListener("touchmove", h), window.removeEventListener("mouseup", l), window.removeEventListener("touchend", l), t("drag-end", o.value));
    }
    function w(u) {
      u.key === "ArrowRight" ? (i.value || (i.value = !0, t("drag-start")), o.value = Math.min(o.value + 5, e.trackWidth), t("drag-move", o.value)) : u.key === "ArrowLeft" ? (o.value = Math.max(o.value - 5, 0), t("drag-move", o.value)) : (u.key === "Enter" || u.key === " ") && i.value && l();
    }
    return T(() => {
      window.removeEventListener("mousemove", h), window.removeEventListener("touchmove", h), window.removeEventListener("mouseup", l), window.removeEventListener("touchend", l);
    }), (u, f) => (p(), _("div", {
      class: "goal-captcha__slider-track",
      ref_key: "trackEl",
      ref: n,
      role: "slider",
      "aria-valuenow": Math.round(o.value),
      "aria-valuemin": 0,
      "aria-valuemax": s.trackWidth,
      "aria-label": "Drag the ball to the goal",
      tabindex: "0",
      onKeydown: w
    }, [
      g("div", {
        class: "goal-captcha__slider-fill",
        style: D({ width: `${v.value}%` })
      }, null, 4),
      g("div", {
        class: X(["goal-captcha__slider-handle", { "is-dragging": i.value }]),
        style: D({ left: `${c.value}px` }),
        onMousedown: P(m, ["prevent"]),
        onTouchstart: P(m, ["prevent"])
      }, [...f[0] || (f[0] = [
        g("span", { class: "goal-captcha__slider-icon" }, "⚽", -1)
      ])], 38),
      i.value ? C("", !0) : (p(), _("span", z, " Drag to score → "))
    ], 40, j));
  }
}, B = /* @__PURE__ */ E(K, [["__scopeId", "data-v-5488c12b"]]), J = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Y = { class: "goal-captcha__success-text" }, Q = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(s) {
    return (a, t) => (p(), _("div", J, [
      t[0] || (t[0] = g("div", { class: "goal-captcha__success-icon" }, [
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
      g("p", Y, I(s.message), 1)
    ]));
  }
}, W = /* @__PURE__ */ E(Q, [["__scopeId", "data-v-3f0157c9"]]);
function Z() {
  let s = [], a = null, t = !1;
  function e() {
    s = [], a = null, t = !1;
  }
  function n() {
    a = performance.now(), t = !0;
  }
  function o(v) {
    if (!t || a === null) return;
    const m = Math.round(performance.now() - a);
    s.length > 0 && m - s[s.length - 1].t < 8 || s.push({ x: Math.round(v), t: m });
  }
  function i() {
    t = !1;
  }
  function r() {
    return [...s];
  }
  function c() {
    return a === null ? 0 : Math.round(performance.now() - a);
  }
  return { reset: e, start: n, record: o, stop: i, getTrack: r, getElapsed: c };
}
function tt(s, a) {
  const t = y("idle"), e = y(null), n = y(null), o = y(null), i = Z();
  async function r() {
    t.value = "loading", n.value = null, e.value = null;
    try {
      const l = await fetch(s, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
        credentials: "same-origin"
      });
      if (!l.ok) throw new Error(`Server error: ${l.status}`);
      o.value = await l.json(), t.value = "ready";
    } catch (l) {
      t.value = "failed", n.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", l);
    }
  }
  function c() {
    t.value === "ready" && (t.value = "dragging", i.reset(), i.start());
  }
  function v(l) {
    t.value === "dragging" && i.record(l);
  }
  async function m(l) {
    if (t.value !== "dragging") return;
    i.stop(), t.value = "verifying";
    const w = i.getTrack(), u = i.getElapsed();
    try {
      const x = await (await fetch(a, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: o.value.captcha_id,
          final_x: Math.round(l),
          drag_time: u,
          movement_track: w
        })
      })).json();
      x.success ? (e.value = x.token, t.value = "success") : (n.value = x.message ?? "Verification failed.", t.value = "failed");
    } catch (f) {
      t.value = "failed", n.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", f);
    }
  }
  async function h() {
    i.reset(), await r();
  }
  return {
    state: b(t),
    token: b(e),
    errorMsg: b(n),
    captchaData: b(o),
    load: r,
    onDragStart: c,
    onDragMove: v,
    onDragEnd: m,
    retry: h
  };
}
const et = ["data-state"], at = {
  key: 0,
  class: "goal-captcha__skeleton",
  "aria-busy": "true"
}, nt = {
  key: 2,
  class: "goal-captcha__error",
  role: "alert"
}, ot = { class: "goal-captcha__error-text" }, st = ["disabled"], it = {
  key: 0,
  class: "goal-captcha__verifying",
  "aria-live": "polite"
}, rt = {
  key: 4,
  class: "goal-captcha__idle"
}, ct = ["name", "value"], $ = {
  __name: "GoalCaptcha",
  props: {
    /** POST URL of the generate endpoint */
    generateUrl: {
      type: String,
      default: () => {
        var s;
        return ((s = window.__GoalCaptchaConfig) == null ? void 0 : s.generateUrl) ?? "/_goal_captcha/generate";
      }
    },
    /** POST URL of the verify endpoint */
    verifyUrl: {
      type: String,
      default: () => {
        var s;
        return ((s = window.__GoalCaptchaConfig) == null ? void 0 : s.verifyUrl) ?? "/_goal_captcha/verify";
      }
    },
    /** Hidden input field name (attached to parent form) */
    fieldName: {
      type: String,
      default: "captcha_token"
    },
    /** Visual theme */
    theme: {
      type: String,
      default: () => {
        var s;
        return ((s = window.__GoalCaptchaConfig) == null ? void 0 : s.theme) ?? "football";
      }
    },
    /** Difficulty (informational — server controls actual tolerance) */
    difficulty: {
      type: String,
      default: () => {
        var s;
        return ((s = window.__GoalCaptchaConfig) == null ? void 0 : s.difficulty) ?? "medium";
      }
    },
    /** Auto-load on mount */
    autoLoad: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["verified", "failed", "loaded"],
  setup(s, { emit: a }) {
    const t = s, e = a, {
      state: n,
      token: o,
      errorMsg: i,
      captchaData: r,
      load: c,
      onDragStart: v,
      onDragMove: m,
      onDragEnd: h,
      retry: l
    } = tt(t.generateUrl, t.verifyUrl), w = y(null);
    return A(n, (u) => {
      u === "success" && e("verified", o.value), u === "failed" && e("failed", i.value), u === "ready" && e("loaded", r.value);
    }), G(() => {
      t.autoLoad && c();
    }), (u, f) => {
      var x;
      return p(), _("div", {
        class: X(["goal-captcha", [`goal-captcha--${s.theme}`, `goal-captcha--${s.difficulty}`]]),
        "data-state": d(n),
        role: "group",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        d(n) === "loading" ? (p(), _("div", at, [...f[2] || (f[2] = [
          g("div", { class: "goal-captcha__skeleton-canvas" }, null, -1),
          g("div", { class: "goal-captcha__skeleton-slider" }, null, -1),
          g("p", { class: "goal-captcha__skeleton-text" }, "Loading challenge…", -1)
        ])])) : d(n) === "success" ? (p(), N(W, { key: 1 })) : d(n) === "failed" ? (p(), _("div", nt, [
          g("p", ot, I(d(i) ?? "Verification failed."), 1),
          g("button", {
            type: "button",
            class: "goal-captcha__retry-btn",
            onClick: f[0] || (f[0] = (...k) => d(l) && d(l)(...k)),
            disabled: d(n) === "loading"
          }, " Try again ", 8, st)
        ])) : d(r) ? (p(), _(R, { key: 3 }, [
          L(U, {
            "captcha-data": d(r),
            "ball-x": w.value
          }, null, 8, ["captcha-data", "ball-x"]),
          L(B, {
            "ball-start-x": d(r).ball_start_x,
            "track-width": ((x = d(r).canvas) == null ? void 0 : x.width) ?? 400,
            onDragStart: d(v),
            onDragMove: d(m),
            onDragEnd: d(h)
          }, null, 8, ["ball-start-x", "track-width", "onDragStart", "onDragMove", "onDragEnd"]),
          d(n) === "verifying" ? (p(), _("div", it, [...f[3] || (f[3] = [
            g("span", {
              class: "goal-captcha__spinner",
              "aria-hidden": "true"
            }, null, -1),
            g("span", null, "Verifying…", -1)
          ])])) : C("", !0)
        ], 64)) : (p(), _("div", rt, [
          g("button", {
            type: "button",
            class: "goal-captcha__start-btn",
            onClick: f[1] || (f[1] = (...k) => d(c) && d(c)(...k))
          }, " Start Verification ")
        ])),
        d(o) ? (p(), _("input", {
          key: 5,
          type: "hidden",
          name: s.fieldName,
          value: d(o)
        }, null, 8, ct)) : C("", !0)
      ], 10, et);
    };
  }
}, lt = (s, a = {}) => {
  (a.generateUrl || a.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: a.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: a.verifyUrl ?? "/_goal_captcha/verify",
    theme: a.theme ?? "football",
    difficulty: a.difficulty ?? "medium"
  }), s.component("GoalCaptcha", $), s.component("GoalCanvas", U), s.component("GoalSlider", B), s.component("SuccessAnimation", W);
}, ht = { install: lt };
function ut() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: s } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((a) => {
      const t = a.querySelector("#goal-captcha-app");
      if (!t) return;
      const e = a.querySelector('input[type="hidden"]'), n = {
        generateUrl: a.dataset.generateUrl,
        verifyUrl: a.dataset.verifyUrl,
        theme: a.dataset.theme ?? "football",
        difficulty: a.dataset.difficulty ?? "medium",
        fieldName: a.dataset.fieldName ?? "captcha_token"
      };
      s($, {
        ...n,
        onVerified: (i) => {
          e && (e.value = i);
        }
      }).mount(t);
    });
  });
}
export {
  U as GoalCanvas,
  $ as GoalCaptcha,
  B as GoalSlider,
  W as SuccessAnimation,
  ht as default,
  ut as initBladeMount,
  lt as install,
  tt as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
