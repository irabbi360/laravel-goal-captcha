import { ref as x, onMounted as X, onBeforeUnmount as I, watch as A, openBlock as v, createElementBlock as _, createElementVNode as l, unref as u, createVNode as U, Transition as F, withCtx as V, Fragment as $, renderList as q, createCommentVNode as b, computed as C, normalizeClass as P, normalizeStyle as B, createStaticVNode as H, withModifiers as T, readonly as S, toDisplayString as N, createBlock as j } from "vue";
const E = /* @__PURE__ */ new Map();
async function z(r) {
  return E.has(r) ? E.get(r) : new Promise((o, e) => {
    const t = new Image();
    t.crossOrigin = "anonymous", t.onload = () => {
      E.set(r, t), o(t);
    }, t.onerror = () => e(new Error(`Failed to load image: ${r}`)), t.src = r;
  });
}
class K {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(o, e) {
    var t;
    this.canvas = o, this.ctx = o.getContext("2d"), this.data = e, this.ballX = e.ball_start_x, this.keeperOffsetX = ((t = e.scene) == null ? void 0 : t.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1;
  }
  async preload() {
    const o = this.data.scene.assets ?? {}, e = await Promise.allSettled(
      Object.entries(o).map(async ([t, s]) => {
        const a = await z(s);
        return [t, a];
      })
    );
    for (const t of e)
      if (t.status === "fulfilled") {
        const [s, a] = t.value;
        this.images[s] = a;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(o) {
    this.ballX = Math.max(0, Math.min(o, this.canvas.width)), this.draw();
  }
  draw() {
    var n;
    const { ctx: o, canvas: e, data: t } = this, { width: s, height: a } = e;
    o.clearRect(0, 0, s, a), this._drawBackground(s, a), this._drawGoalPost(s, a), this._drawDecoys(t.scene.decoys ?? []), this._drawTargetRing(t.target_x, a), this._drawGoalkeeper(t.scene, s, a), this._drawBall(a, ((n = t.scene) == null ? void 0 : n.ball_radius) ?? 18);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(o, e) {
    const t = this.images.stadium;
    if (t)
      this.ctx.drawImage(t, 0, 0, o, e);
    else {
      const s = this.ctx.createLinearGradient(0, 0, 0, e);
      s.addColorStop(0, "#1a472a"), s.addColorStop(1, "#2d6a4f"), this.ctx.fillStyle = s, this.ctx.fillRect(0, 0, o, e), this.ctx.strokeStyle = "rgba(255,255,255,0.08)", this.ctx.lineWidth = 1;
      for (let a = 0; a <= o; a += 30)
        this.ctx.beginPath(), this.ctx.moveTo(a, 0), this.ctx.lineTo(a, e), this.ctx.stroke();
    }
  }
  _drawGoalPost(o, e) {
    const t = this.images.goal_post, s = Math.round(o * 0.35 * (this.data.scene.goal_width_scale ?? 1)), a = Math.round(e * 0.6), n = Math.round((o - s) / 2), i = Math.round(e * 0.05);
    if (t) {
      this.ctx.drawImage(t, n, i, s, a);
      return;
    }
    this.ctx.strokeStyle = "#ffffff", this.ctx.lineWidth = 4, this.ctx.strokeRect(n, i, s, a), this.ctx.strokeStyle = "rgba(255,255,255,0.2)", this.ctx.lineWidth = 1;
    for (let c = n; c <= n + s; c += 15)
      this.ctx.beginPath(), this.ctx.moveTo(c, i), this.ctx.lineTo(c, i + a), this.ctx.stroke();
    for (let c = i; c <= i + a; c += 12)
      this.ctx.beginPath(), this.ctx.moveTo(n, c), this.ctx.lineTo(n + s, c), this.ctx.stroke();
  }
  _drawGoalkeeper(o, e, t) {
    const s = this.images.goalkeeper, a = Math.round(t * 0.35), n = Math.round(t * 0.72), i = Math.round(e / 2 - a / 2 + this.keeperOffsetX), c = Math.round(t * 0.18);
    if (s) {
      this.ctx.drawImage(s, i, c, a, n);
      return;
    }
    this.ctx.fillStyle = "#e74c3c", this.ctx.fillRect(i + Math.round(a * 0.3), c + Math.round(n * 0.15), Math.round(a * 0.4), Math.round(n * 0.55)), this.ctx.beginPath(), this.ctx.arc(i + Math.round(a / 2), c + Math.round(n * 0.1), Math.round(a * 0.18), 0, Math.PI * 2), this.ctx.fill();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(o, e) {
    const t = o, s = Math.round(e * 0.38), a = Math.round(e * 0.14), n = this.ctx;
    n.save(), n.shadowColor = "rgba(0,0,0,.55)", n.shadowBlur = 14, n.strokeStyle = "rgba(30,30,30,.6)", n.lineWidth = a * 0.58 + 2, n.beginPath(), n.arc(t, s, a, 0, Math.PI * 2), n.stroke(), n.shadowBlur = 0;
    const i = n.createLinearGradient(t - a, s - a, t + a, s + a);
    i.addColorStop(0, "#d4d4d4"), i.addColorStop(0.25, "#a0a0a0"), i.addColorStop(0.5, "#707070"), i.addColorStop(0.75, "#a8a8a8"), i.addColorStop(1, "#cecece"), n.strokeStyle = i, n.lineWidth = a * 0.55, n.beginPath(), n.arc(t, s, a, 0, Math.PI * 2), n.stroke(), n.strokeStyle = "rgba(255,255,255,.45)", n.lineWidth = 3, n.beginPath(), n.arc(t - a * 0.15, s - a * 0.15, a - a * 0.3, Math.PI * 1.05, Math.PI * 1.7), n.stroke(), n.strokeStyle = "rgba(0,0,0,.25)", n.lineWidth = 2, n.beginPath(), n.arc(t, s, a - a * 0.28, 0, Math.PI * 2), n.stroke(), n.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(o) {
    for (const e of o) {
      const t = Math.round(this.canvas.height * 0.38);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${e.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(e.x, t, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(o, e) {
    const t = this.images.ball, s = this.ballX, a = Math.round(o * 0.76);
    if (t) {
      this.ctx.drawImage(t, s - e, a - e, e * 2, e * 2);
      return;
    }
    this.ctx.save(), this.ctx.fillStyle = "#f5f5f5", this.ctx.strokeStyle = "#333", this.ctx.lineWidth = 2, this.ctx.shadowColor = "rgba(0,0,0,0.4)", this.ctx.shadowBlur = 6, this.ctx.beginPath(), this.ctx.arc(s, a, e, 0, Math.PI * 2), this.ctx.fill(), this.ctx.stroke(), this.ctx.fillStyle = "#222";
    const n = [
      [s, a],
      [s - e * 0.4, a - e * 0.5],
      [s + e * 0.4, a - e * 0.5],
      [s - e * 0.5, a + e * 0.3],
      [s + e * 0.5, a + e * 0.3]
    ];
    for (const [i, c] of n)
      this.ctx.beginPath(), this.ctx.arc(i, c, e * 0.2, 0, Math.PI * 2), this.ctx.fill();
    this.ctx.restore();
  }
  destroy() {
  }
}
function Z(r, o, e, t) {
  let s = null, a = !0;
  function n(i) {
    if (!a) return;
    const c = i % e / e * Math.PI * 2, k = r + (o - r) * (0.5 + 0.5 * Math.sin(c));
    t(k), s = requestAnimationFrame(n);
  }
  return s = requestAnimationFrame(n), () => {
    a = !1, s !== null && cancelAnimationFrame(s);
  };
}
const L = (r, o) => {
  const e = r.__vccOpts || r;
  for (const [t, s] of o)
    e[t] = s;
  return e;
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
    var i, c, k, w;
    const o = r, e = x(null);
    let t = null, s = null;
    const a = ((c = (i = o.captchaData) == null ? void 0 : i.canvas) == null ? void 0 : c.width) ?? 400, n = ((w = (k = o.captchaData) == null ? void 0 : k.canvas) == null ? void 0 : w.height) ?? 220;
    return X(async () => {
      var d;
      t = new K(e.value, o.captchaData), await t.preload();
      const g = ((d = o.captchaData.scene) == null ? void 0 : d.keeper_offset_x) ?? 0;
      s = Z(
        g - 8,
        g + 8,
        2400,
        (p) => {
          t && (t.keeperOffsetX = p, t.draw());
        }
      );
    }), I(() => {
      s == null || s(), t == null || t.destroy();
    }), A(
      () => o.ballX,
      (g) => {
        t && g !== null && t.setBallX(g);
      }
    ), (g, d) => (v(), _("div", J, [
      l("canvas", {
        ref_key: "canvasEl",
        ref: e,
        width: u(a),
        height: u(n),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, Y),
      U(F, { name: "gc-success" }, {
        default: V(() => [
          r.showSuccess ? (v(), _("div", Q, [
            l("div", ee, [
              (v(), _($, null, q(24, (p) => l("span", {
                key: p,
                class: "gc-confetti__piece",
                "data-i": p
              }, null, 8, te)), 64))
            ]),
            d[0] || (d[0] = l("div", { class: "gc-success-badge" }, [
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
          ])) : b("", !0)
        ]),
        _: 1
      })
    ]));
  }
}, W = /* @__PURE__ */ L(ae, [["__scopeId", "data-v-7d16f725"]]), se = {
  key: 0,
  class: "gc-slider gc-slider--success",
  "aria-label": "Verification successful"
}, ne = ["aria-valuenow", "aria-valuemax", "tabindex"], oe = {
  __name: "GoalSlider",
  props: {
    ballStartX: { type: Number, default: 20 },
    trackWidth: { type: Number, default: 400 },
    handleSize: { type: Number, default: 52 },
    success: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["drag-start", "drag-move", "drag-end"],
  setup(r, { emit: o }) {
    const e = o, t = r, s = x(null), a = x(t.ballStartX), n = x(!1), i = C(() => t.handleSize / 2), c = C(
      () => Math.max(0, Math.min(a.value - i.value, t.trackWidth - t.handleSize))
    ), k = C(
      () => Math.round(a.value / t.trackWidth * 100)
    );
    function w(y) {
      t.disabled || (n.value = !0, e("drag-start"), window.addEventListener("mousemove", g, { passive: !0 }), window.addEventListener("touchmove", g, { passive: !0 }), window.addEventListener("mouseup", d), window.addEventListener("touchend", d));
    }
    function g(y) {
      if (!n.value) return;
      const m = y.touches ? y.touches[0].clientX : y.clientX, f = s.value.getBoundingClientRect(), h = Math.max(0, Math.min(m - f.left, t.trackWidth));
      a.value = h, e("drag-move", h);
    }
    function d() {
      n.value && (n.value = !1, window.removeEventListener("mousemove", g), window.removeEventListener("touchmove", g), window.removeEventListener("mouseup", d), window.removeEventListener("touchend", d), e("drag-end", a.value));
    }
    function p(y) {
      if (t.disabled) return;
      const m = 5;
      y.key === "ArrowRight" ? (n.value || (n.value = !0, e("drag-start")), a.value = Math.min(a.value + m, t.trackWidth), e("drag-move", a.value)) : y.key === "ArrowLeft" ? (a.value = Math.max(a.value - m, 0), e("drag-move", a.value)) : (y.key === "Enter" || y.key === " ") && n.value && d();
    }
    return I(() => {
      window.removeEventListener("mousemove", g), window.removeEventListener("touchmove", g), window.removeEventListener("mouseup", d), window.removeEventListener("touchend", d);
    }), (y, m) => r.success ? (v(), _("div", se, [...m[0] || (m[0] = [
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
    ])])) : (v(), _("div", {
      key: 1,
      class: P(["gc-slider", { "gc-slider--disabled": r.disabled, "gc-slider--dragging": n.value }]),
      ref_key: "trackEl",
      ref: s,
      role: "slider",
      "aria-valuenow": Math.round(a.value),
      "aria-valuemin": 0,
      "aria-valuemax": r.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: r.disabled ? -1 : 0,
      onKeydown: p
    }, [
      l("div", {
        class: "gc-slider__fill",
        style: B({ width: k.value + "%" })
      }, null, 4),
      m[2] || (m[2] = H('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-41519849><span class="gc-slider__chev" data-v-41519849>❮</span><span class="gc-slider__chev" data-v-41519849>❮</span><span class="gc-slider__chev" data-v-41519849>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-41519849><span class="gc-slider__chev" data-v-41519849>❯</span><span class="gc-slider__chev" data-v-41519849>❯</span><span class="gc-slider__chev" data-v-41519849>❯</span></div>', 2)),
      l("div", {
        class: P(["gc-slider__handle", { "is-dragging": n.value }]),
        style: B({ left: c.value + "px" }),
        onMousedown: T(w, ["prevent"]),
        onTouchstart: T(w, ["prevent"]),
        "aria-hidden": "true"
      }, [...m[1] || (m[1] = [
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
}, O = /* @__PURE__ */ L(oe, [["__scopeId", "data-v-41519849"]]);
function re() {
  let r = [], o = null, e = !1;
  function t() {
    r = [], o = null, e = !1;
  }
  function s() {
    o = performance.now(), e = !0;
  }
  function a(k) {
    if (!e || o === null) return;
    const w = Math.round(performance.now() - o);
    r.length > 0 && w - r[r.length - 1].t < 8 || r.push({ x: Math.round(k), t: w });
  }
  function n() {
    e = !1;
  }
  function i() {
    return [...r];
  }
  function c() {
    return o === null ? 0 : Math.round(performance.now() - o);
  }
  return { reset: t, start: s, record: a, stop: n, getTrack: i, getElapsed: c };
}
function ie() {
  if (typeof document > "u") return null;
  const r = document.querySelector('meta[name="csrf-token"]');
  if (r != null && r.content) return r.content;
  const o = document.cookie.split("; ").find((e) => e.startsWith("XSRF-TOKEN="));
  return o ? decodeURIComponent(o.split("=")[1]) : null;
}
function G() {
  const r = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, o = ie();
  return o && (r["X-CSRF-TOKEN"] = o, r["X-XSRF-TOKEN"] = o), r;
}
function le(r, o) {
  const e = x("idle"), t = x(null), s = x(null), a = x(null), n = re();
  async function i() {
    e.value = "loading", s.value = null, t.value = null;
    try {
      const d = await fetch(r, {
        method: "POST",
        headers: G(),
        credentials: "same-origin"
      });
      if (!d.ok) throw new Error(`Server error: ${d.status}`);
      a.value = await d.json(), e.value = "ready";
    } catch (d) {
      e.value = "failed", s.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", d);
    }
  }
  function c() {
    e.value === "ready" && (e.value = "dragging", n.reset(), n.start());
  }
  function k(d) {
    e.value === "dragging" && n.record(d);
  }
  async function w(d) {
    if (e.value !== "dragging") return;
    n.stop(), e.value = "verifying";
    const p = n.getTrack(), y = n.getElapsed();
    try {
      const f = await (await fetch(o, {
        method: "POST",
        headers: G(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: a.value.captcha_id,
          final_x: Math.round(d),
          drag_time: y,
          movement_track: p
        })
      })).json();
      f.success ? (t.value = f.token, e.value = "success") : (s.value = f.message ?? "Verification failed.", e.value = "failed");
    } catch (m) {
      e.value = "failed", s.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", m);
    }
  }
  async function g() {
    n.reset(), await i();
  }
  return {
    state: S(e),
    token: S(t),
    errorMsg: S(s),
    captchaData: S(a),
    load: i,
    onDragStart: c,
    onDragMove: k,
    onDragEnd: w,
    retry: g
  };
}
const ce = ["data-state"], de = { class: "gc-modal__header" }, ue = { class: "gc-modal__scene" }, he = {
  key: 0,
  class: "gc-modal__skeleton",
  "aria-busy": "true"
}, ge = {
  key: 0,
  class: "gc-modal__verifying",
  "aria-live": "polite"
}, fe = {
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
    const e = r, t = o, {
      state: s,
      token: a,
      errorMsg: n,
      captchaData: i,
      load: c,
      onDragStart: k,
      onDragMove: w,
      onDragEnd: g,
      retry: d
    } = le(e.generateUrl, e.verifyUrl), p = x(null);
    function y(f) {
      p.value = f, w(f);
    }
    function m(f) {
      p.value = f, g(f);
    }
    return A(s, (f) => {
      var h;
      f === "success" && (p.value = ((h = i.value) == null ? void 0 : h.target_x) ?? p.value, t("verified", a.value)), f === "failed" && t("failed", n.value), f === "ready" && t("loaded", i.value);
    }), X(() => {
      e.autoLoad && c();
    }), (f, h) => {
      var D;
      return v(), _("div", {
        class: P(["gc-modal", [`gc-modal--${r.theme}`, `gc-modal--${r.difficulty}`]]),
        "data-state": u(s),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        l("div", de, [
          h[4] || (h[4] = l("div", { class: "gc-modal__header-text" }, [
            l("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
            l("p", { class: "gc-modal__subtitle" }, "Drag the slider left or right to score a goal")
          ], -1)),
          r.closable ? (v(), _("button", {
            key: 0,
            type: "button",
            class: "gc-modal__close",
            "aria-label": "Close",
            onClick: h[0] || (h[0] = (M) => f.$emit("close"))
          }, [...h[3] || (h[3] = [
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
          ])])) : b("", !0)
        ]),
        l("div", ue, [
          u(s) === "loading" ? (v(), _("div", he)) : u(i) ? (v(), _($, { key: 1 }, [
            U(W, {
              "captcha-data": u(i),
              "ball-x": p.value,
              "show-success": u(s) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            u(s) === "verifying" ? (v(), _("div", ge, [...h[5] || (h[5] = [
              l("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              l("span", null, "Verifying…", -1)
            ])])) : b("", !0)
          ], 64)) : u(s) === "failed" ? (v(), _("div", fe, [
            h[6] || (h[6] = l("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            l("p", ve, N(u(n) ?? "Verification failed. Please try again."), 1)
          ])) : (v(), _("div", me, [
            l("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: h[1] || (h[1] = (...M) => u(c) && u(c)(...M))
            }, "Start Verification")
          ]))
        ]),
        l("div", _e, [
          u(i) ? (v(), j(O, {
            key: 0,
            "ball-start-x": u(i).ball_start_x,
            "track-width": ((D = u(i).canvas) == null ? void 0 : D.width) ?? 400,
            success: u(s) === "success",
            disabled: u(s) === "verifying" || u(s) === "success",
            onDragStart: u(k),
            onDragMove: y,
            onDragEnd: m
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : u(s) === "loading" ? (v(), _("div", pe)) : u(s) === "failed" ? (v(), _("div", ye, [
            l("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: h[2] || (h[2] = (...M) => u(d) && u(d)(...M))
            }, "↺ Try again")
          ])) : b("", !0)
        ]),
        u(a) ? (v(), _("input", {
          key: 0,
          type: "hidden",
          name: r.fieldName,
          value: u(a)
        }, null, 8, ke)) : b("", !0)
      ], 10, ce);
    };
  }
}, we = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, xe = { class: "goal-captcha__success-text" }, be = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(r) {
    return (o, e) => (v(), _("div", we, [
      e[0] || (e[0] = l("div", { class: "goal-captcha__success-icon" }, [
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
      l("p", xe, N(r.message), 1)
    ]));
  }
}, Me = /* @__PURE__ */ L(be, [["__scopeId", "data-v-3f0157c9"]]), Se = (r, o = {}) => {
  (o.generateUrl || o.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: o.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: o.verifyUrl ?? "/_goal_captcha/verify",
    theme: o.theme ?? "football",
    difficulty: o.difficulty ?? "medium"
  }), r.component("GoalCaptcha", R), r.component("GoalCanvas", W), r.component("GoalSlider", O), r.component("SuccessAnimation", Me);
}, Ee = { install: Se };
function Pe() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: r } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((o) => {
      const e = o.querySelector("#goal-captcha-app");
      if (!e) return;
      const t = o.querySelector('input[type="hidden"]'), s = {
        generateUrl: o.dataset.generateUrl,
        verifyUrl: o.dataset.verifyUrl,
        theme: o.dataset.theme ?? "football",
        difficulty: o.dataset.difficulty ?? "medium",
        fieldName: o.dataset.fieldName ?? "captcha_token"
      };
      r(R, {
        ...s,
        onVerified: (n) => {
          t && (t.value = n);
        }
      }).mount(e);
    });
  });
}
export {
  W as GoalCanvas,
  R as GoalCaptcha,
  O as GoalSlider,
  Me as SuccessAnimation,
  Ee as default,
  Pe as initBladeMount,
  Se as install,
  le as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
