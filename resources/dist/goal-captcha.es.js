import { ref as y, onMounted as L, onBeforeUnmount as A, watch as X, openBlock as p, createElementBlock as _, unref as d, computed as S, createElementVNode as g, normalizeStyle as D, withModifiers as P, normalizeClass as I, createCommentVNode as C, toDisplayString as U, readonly as b, createBlock as $, Fragment as F, createVNode as T } from "vue";
const M = /* @__PURE__ */ new Map();
async function O(s) {
  return M.has(s) ? M.get(s) : new Promise((e, t) => {
    const a = new Image();
    a.crossOrigin = "anonymous", a.onload = () => {
      M.set(s, a), e(a);
    }, a.onerror = () => t(new Error(`Failed to load image: ${s}`)), a.src = s;
  });
}
class q {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(e, t) {
    this.canvas = e, this.ctx = e.getContext("2d"), this.data = t, this.ballX = t.ball_start_x, this.images = {}, this.ready = !1;
  }
  async preload() {
    const e = this.data.scene.assets ?? {}, t = await Promise.allSettled(
      Object.entries(e).map(async ([a, n]) => {
        const o = await O(n);
        return [a, o];
      })
    );
    for (const a of t)
      if (a.status === "fulfilled") {
        const [n, o] = a.value;
        this.images[n] = o;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(e) {
    this.ballX = Math.max(0, Math.min(e, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: e, canvas: t, data: a } = this, { width: n, height: o } = t;
    e.clearRect(0, 0, n, o), this._drawBackground(n, o), this._drawGoalPost(n, o), this._drawDecoys(a.scene.decoys ?? []), this._drawTargetRing(a.target_x, o), this._drawGoalkeeper(a.scene, n, o), this._drawBall(o, a.scene.ball_radius ?? 16);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(e, t) {
    const a = this.images.stadium;
    if (a)
      this.ctx.drawImage(a, 0, 0, e, t);
    else {
      const n = this.ctx.createLinearGradient(0, 0, 0, t);
      n.addColorStop(0, "#1a472a"), n.addColorStop(1, "#2d6a4f"), this.ctx.fillStyle = n, this.ctx.fillRect(0, 0, e, t), this.ctx.strokeStyle = "rgba(255,255,255,0.08)", this.ctx.lineWidth = 1;
      for (let o = 0; o <= e; o += 30)
        this.ctx.beginPath(), this.ctx.moveTo(o, 0), this.ctx.lineTo(o, t), this.ctx.stroke();
    }
  }
  _drawGoalPost(e, t) {
    const a = this.images.goal_post, n = Math.round(e * 0.35 * (this.data.scene.goal_width_scale ?? 1)), o = Math.round(t * 0.6), r = Math.round((e - n) / 2), c = Math.round(t * 0.05);
    if (a) {
      this.ctx.drawImage(a, r, c, n, o);
      return;
    }
    this.ctx.strokeStyle = "#ffffff", this.ctx.lineWidth = 4, this.ctx.strokeRect(r, c, n, o), this.ctx.strokeStyle = "rgba(255,255,255,0.2)", this.ctx.lineWidth = 1;
    for (let i = r; i <= r + n; i += 15)
      this.ctx.beginPath(), this.ctx.moveTo(i, c), this.ctx.lineTo(i, c + o), this.ctx.stroke();
    for (let i = c; i <= c + o; i += 12)
      this.ctx.beginPath(), this.ctx.moveTo(r, i), this.ctx.lineTo(r + n, i), this.ctx.stroke();
  }
  _drawGoalkeeper(e, t, a) {
    const n = this.images.goalkeeper, o = 40, r = 80, c = Math.round(t / 2 - o / 2 + (e.keeper_offset_x ?? 0)), i = Math.round(a * 0.2);
    if (n) {
      this.ctx.drawImage(n, c, i, o, r);
      return;
    }
    this.ctx.fillStyle = "#e74c3c", this.ctx.fillRect(c + 12, i, 16, r), this.ctx.beginPath(), this.ctx.arc(c + 20, i - 10, 10, 0, Math.PI * 2), this.ctx.fill();
  }
  /** The real target ring (bright + solid). */
  _drawTargetRing(e, t) {
    const a = e, n = Math.round(t * 0.72), o = 14;
    this.ctx.save(), this.ctx.strokeStyle = "#f1c40f", this.ctx.lineWidth = 3, this.ctx.shadowColor = "#f39c12", this.ctx.shadowBlur = 8, this.ctx.beginPath(), this.ctx.arc(a, n, o, 0, Math.PI * 2), this.ctx.stroke(), this.ctx.fillStyle = "rgba(241,196,15,0.4)", this.ctx.beginPath(), this.ctx.arc(a, n, o * 0.4, 0, Math.PI * 2), this.ctx.fill(), this.ctx.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(e) {
    for (const t of e) {
      const a = Math.round(this.canvas.height * 0.72);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(241,196,15,${t.opacity})`, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.arc(t.x, a, 14, 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(e, t) {
    const a = this.images.ball, n = this.ballX, o = Math.round(e * 0.72);
    if (a) {
      this.ctx.drawImage(a, n - t, o - t, t * 2, t * 2);
      return;
    }
    this.ctx.save(), this.ctx.fillStyle = "#f5f5f5", this.ctx.strokeStyle = "#333", this.ctx.lineWidth = 2, this.ctx.shadowColor = "rgba(0,0,0,0.4)", this.ctx.shadowBlur = 6, this.ctx.beginPath(), this.ctx.arc(n, o, t, 0, Math.PI * 2), this.ctx.fill(), this.ctx.stroke(), this.ctx.fillStyle = "#222";
    const r = [
      [n, o],
      [n - t * 0.4, o - t * 0.5],
      [n + t * 0.4, o - t * 0.5],
      [n - t * 0.5, o + t * 0.3],
      [n + t * 0.5, o + t * 0.3]
    ];
    for (const [c, i] of r)
      this.ctx.beginPath(), this.ctx.arc(c, i, t * 0.2, 0, Math.PI * 2), this.ctx.fill();
    this.ctx.restore();
  }
  destroy() {
  }
}
function H(s, e, t, a) {
  let n = null, o = !0;
  function r(c) {
    if (!o) return;
    const i = c % t / t * Math.PI * 2, v = s + (e - s) * (0.5 + 0.5 * Math.sin(i));
    a(v), n = requestAnimationFrame(r);
  }
  return n = requestAnimationFrame(r), () => {
    o = !1, n !== null && cancelAnimationFrame(n);
  };
}
const E = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [a, n] of e)
    t[a] = n;
  return t;
}, V = ["width", "height"], j = {
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
    var c, i, v, m;
    const e = s, t = y(null);
    let a = null, n = null;
    const o = ((i = (c = e.captchaData) == null ? void 0 : c.canvas) == null ? void 0 : i.width) ?? 400, r = ((m = (v = e.captchaData) == null ? void 0 : v.canvas) == null ? void 0 : m.height) ?? 200;
    return L(async () => {
      var h, l;
      a = new q(t.value, e.captchaData), await a.preload(), n = H(
        (((h = e.captchaData.scene) == null ? void 0 : h.keeper_offset_x) ?? 0) - 8,
        (((l = e.captchaData.scene) == null ? void 0 : l.keeper_offset_x) ?? 0) + 8,
        2400,
        (w) => {
          a && (a.data.scene.keeper_offset_x = w, a.draw());
        }
      );
    }), A(() => {
      n == null || n(), a == null || a.destroy();
    }), X(
      () => e.ballX,
      (h) => {
        a && h !== null && a.setBallX(h);
      }
    ), (h, l) => (p(), _("canvas", {
      ref_key: "canvasEl",
      ref: t,
      width: d(o),
      height: d(r),
      class: "goal-captcha__canvas",
      "aria-label": "Football goal CAPTCHA scene",
      role: "img"
    }, null, 8, V));
  }
}, N = /* @__PURE__ */ E(j, [["__scopeId", "data-v-90a5144f"]]), z = ["aria-valuenow", "aria-valuemax"], K = {
  key: 0,
  class: "goal-captcha__slider-hint"
}, J = {
  __name: "GoalSlider",
  props: {
    ballStartX: { type: Number, default: 20 },
    trackWidth: { type: Number, default: 400 },
    handleSize: { type: Number, default: 44 }
  },
  emits: ["drag-start", "drag-move", "drag-end"],
  setup(s, { emit: e }) {
    const t = e, a = s, n = y(null), o = y(a.ballStartX), r = y(!1), c = S(() => a.handleSize / 2), i = S(
      () => Math.max(0, Math.min(o.value - c.value, a.trackWidth - a.handleSize))
    ), v = S(
      () => Math.round(o.value / a.trackWidth * 100)
    );
    function m(u) {
      r.value = !0, t("drag-start"), window.addEventListener("mousemove", h, { passive: !0 }), window.addEventListener("touchmove", h, { passive: !0 }), window.addEventListener("mouseup", l), window.addEventListener("touchend", l);
    }
    function h(u) {
      if (!r.value) return;
      const f = u.touches ? u.touches[0].clientX : u.clientX, x = n.value.getBoundingClientRect(), k = Math.max(0, Math.min(f - x.left, a.trackWidth));
      o.value = k, t("drag-move", k);
    }
    function l() {
      r.value && (r.value = !1, window.removeEventListener("mousemove", h), window.removeEventListener("touchmove", h), window.removeEventListener("mouseup", l), window.removeEventListener("touchend", l), t("drag-end", o.value));
    }
    function w(u) {
      u.key === "ArrowRight" ? (r.value || (r.value = !0, t("drag-start")), o.value = Math.min(o.value + 5, a.trackWidth), t("drag-move", o.value)) : u.key === "ArrowLeft" ? (o.value = Math.max(o.value - 5, 0), t("drag-move", o.value)) : (u.key === "Enter" || u.key === " ") && r.value && l();
    }
    return A(() => {
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
        class: I(["goal-captcha__slider-handle", { "is-dragging": r.value }]),
        style: D({ left: `${i.value}px` }),
        onMousedown: P(m, ["prevent"]),
        onTouchstart: P(m, ["prevent"])
      }, [...f[0] || (f[0] = [
        g("span", { class: "goal-captcha__slider-icon" }, "⚽", -1)
      ])], 38),
      r.value ? C("", !0) : (p(), _("span", K, " Drag to score → "))
    ], 40, z));
  }
}, B = /* @__PURE__ */ E(J, [["__scopeId", "data-v-5488c12b"]]), Y = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Q = { class: "goal-captcha__success-text" }, Z = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(s) {
    return (e, t) => (p(), _("div", Y, [
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
      g("p", Q, U(s.message), 1)
    ]));
  }
}, R = /* @__PURE__ */ E(Z, [["__scopeId", "data-v-3f0157c9"]]);
function tt() {
  let s = [], e = null, t = !1;
  function a() {
    s = [], e = null, t = !1;
  }
  function n() {
    e = performance.now(), t = !0;
  }
  function o(v) {
    if (!t || e === null) return;
    const m = Math.round(performance.now() - e);
    s.length > 0 && m - s[s.length - 1].t < 8 || s.push({ x: Math.round(v), t: m });
  }
  function r() {
    t = !1;
  }
  function c() {
    return [...s];
  }
  function i() {
    return e === null ? 0 : Math.round(performance.now() - e);
  }
  return { reset: a, start: n, record: o, stop: r, getTrack: c, getElapsed: i };
}
function et() {
  if (typeof document > "u") return null;
  const s = document.querySelector('meta[name="csrf-token"]');
  if (s != null && s.content) return s.content;
  const e = document.cookie.split("; ").find((t) => t.startsWith("XSRF-TOKEN="));
  return e ? decodeURIComponent(e.split("=")[1]) : null;
}
function G() {
  const s = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, e = et();
  return e && (s["X-CSRF-TOKEN"] = e, s["X-XSRF-TOKEN"] = e), s;
}
function at(s, e) {
  const t = y("idle"), a = y(null), n = y(null), o = y(null), r = tt();
  async function c() {
    t.value = "loading", n.value = null, a.value = null;
    try {
      const l = await fetch(s, {
        method: "POST",
        headers: G(),
        credentials: "same-origin"
      });
      if (!l.ok) throw new Error(`Server error: ${l.status}`);
      o.value = await l.json(), t.value = "ready";
    } catch (l) {
      t.value = "failed", n.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", l);
    }
  }
  function i() {
    t.value === "ready" && (t.value = "dragging", r.reset(), r.start());
  }
  function v(l) {
    t.value === "dragging" && r.record(l);
  }
  async function m(l) {
    if (t.value !== "dragging") return;
    r.stop(), t.value = "verifying";
    const w = r.getTrack(), u = r.getElapsed();
    try {
      const x = await (await fetch(e, {
        method: "POST",
        headers: G(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: o.value.captcha_id,
          final_x: Math.round(l),
          drag_time: u,
          movement_track: w
        })
      })).json();
      x.success ? (a.value = x.token, t.value = "success") : (n.value = x.message ?? "Verification failed.", t.value = "failed");
    } catch (f) {
      t.value = "failed", n.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", f);
    }
  }
  async function h() {
    r.reset(), await c();
  }
  return {
    state: b(t),
    token: b(a),
    errorMsg: b(n),
    captchaData: b(o),
    load: c,
    onDragStart: i,
    onDragMove: v,
    onDragEnd: m,
    retry: h
  };
}
const nt = ["data-state"], ot = {
  key: 0,
  class: "goal-captcha__skeleton",
  "aria-busy": "true"
}, st = {
  key: 2,
  class: "goal-captcha__error",
  role: "alert"
}, rt = { class: "goal-captcha__error-text" }, ct = ["disabled"], it = {
  key: 0,
  class: "goal-captcha__verifying",
  "aria-live": "polite"
}, lt = {
  key: 4,
  class: "goal-captcha__idle"
}, dt = ["name", "value"], W = {
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
  setup(s, { emit: e }) {
    const t = s, a = e, {
      state: n,
      token: o,
      errorMsg: r,
      captchaData: c,
      load: i,
      onDragStart: v,
      onDragMove: m,
      onDragEnd: h,
      retry: l
    } = at(t.generateUrl, t.verifyUrl), w = y(null);
    return X(n, (u) => {
      u === "success" && a("verified", o.value), u === "failed" && a("failed", r.value), u === "ready" && a("loaded", c.value);
    }), L(() => {
      t.autoLoad && i();
    }), (u, f) => {
      var x;
      return p(), _("div", {
        class: I(["goal-captcha", [`goal-captcha--${s.theme}`, `goal-captcha--${s.difficulty}`]]),
        "data-state": d(n),
        role: "group",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        d(n) === "loading" ? (p(), _("div", ot, [...f[2] || (f[2] = [
          g("div", { class: "goal-captcha__skeleton-canvas" }, null, -1),
          g("div", { class: "goal-captcha__skeleton-slider" }, null, -1),
          g("p", { class: "goal-captcha__skeleton-text" }, "Loading challenge…", -1)
        ])])) : d(n) === "success" ? (p(), $(R, { key: 1 })) : d(n) === "failed" ? (p(), _("div", st, [
          g("p", rt, U(d(r) ?? "Verification failed."), 1),
          g("button", {
            type: "button",
            class: "goal-captcha__retry-btn",
            onClick: f[0] || (f[0] = (...k) => d(l) && d(l)(...k)),
            disabled: d(n) === "loading"
          }, " Try again ", 8, ct)
        ])) : d(c) ? (p(), _(F, { key: 3 }, [
          T(N, {
            "captcha-data": d(c),
            "ball-x": w.value
          }, null, 8, ["captcha-data", "ball-x"]),
          T(B, {
            "ball-start-x": d(c).ball_start_x,
            "track-width": ((x = d(c).canvas) == null ? void 0 : x.width) ?? 400,
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
        ], 64)) : (p(), _("div", lt, [
          g("button", {
            type: "button",
            class: "goal-captcha__start-btn",
            onClick: f[1] || (f[1] = (...k) => d(i) && d(i)(...k))
          }, " Start Verification ")
        ])),
        d(o) ? (p(), _("input", {
          key: 5,
          type: "hidden",
          name: s.fieldName,
          value: d(o)
        }, null, 8, dt)) : C("", !0)
      ], 10, nt);
    };
  }
}, ht = (s, e = {}) => {
  (e.generateUrl || e.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: e.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: e.verifyUrl ?? "/_goal_captcha/verify",
    theme: e.theme ?? "football",
    difficulty: e.difficulty ?? "medium"
  }), s.component("GoalCaptcha", W), s.component("GoalCanvas", N), s.component("GoalSlider", B), s.component("SuccessAnimation", R);
}, ft = { install: ht };
function gt() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: s } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((e) => {
      const t = e.querySelector("#goal-captcha-app");
      if (!t) return;
      const a = e.querySelector('input[type="hidden"]'), n = {
        generateUrl: e.dataset.generateUrl,
        verifyUrl: e.dataset.verifyUrl,
        theme: e.dataset.theme ?? "football",
        difficulty: e.dataset.difficulty ?? "medium",
        fieldName: e.dataset.fieldName ?? "captcha_token"
      };
      s(W, {
        ...n,
        onVerified: (r) => {
          a && (a.value = r);
        }
      }).mount(t);
    });
  });
}
export {
  N as GoalCanvas,
  W as GoalCaptcha,
  B as GoalSlider,
  R as SuccessAnimation,
  ft as default,
  gt as initBladeMount,
  ht as install,
  at as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
