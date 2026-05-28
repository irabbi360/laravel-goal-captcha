import { ref as x, onMounted as ee, onBeforeUnmount as te, watch as ae, openBlock as k, createElementBlock as S, createElementVNode as g, unref as _, createVNode as ne, Transition as ve, withCtx as me, Fragment as oe, renderList as pe, createCommentVNode as I, computed as $, normalizeClass as Y, normalizeStyle as K, createStaticVNode as _e, withModifiers as Z, readonly as U, toDisplayString as le, createBlock as ye } from "vue";
const O = /* @__PURE__ */ new Map();
async function be(i) {
  return O.has(i) ? O.get(i) : new Promise((r, l) => {
    const a = new Image();
    a.crossOrigin = "anonymous", a.onload = () => {
      O.set(i, a), r(a);
    }, a.onerror = () => l(new Error(`Failed to load image: ${i}`)), a.src = i;
  });
}
function J(i, r, l, a) {
  i.beginPath();
  for (let e = 0; e < 5; e++) {
    const o = (e * 72 - 90) * Math.PI / 180;
    e === 0 ? i.moveTo(r + a * Math.cos(o), l + a * Math.sin(o)) : i.lineTo(r + a * Math.cos(o), l + a * Math.sin(o));
  }
  i.closePath(), i.fill();
}
class ke {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} captchaData  - data from the generate endpoint
   */
  constructor(r, l) {
    var o;
    this.canvas = r, this.ctx = r.getContext("2d"), this.data = l, this.ballX = l.ball_start_x, this.ballStartX = l.ball_start_x, this.keeperOffsetX = ((o = l.scene) == null ? void 0 : o.keeper_offset_x) ?? 0, this.images = {}, this.ready = !1;
    const a = r.width, e = l.target_x ?? a * 0.65;
    this.keeperBaseX = e >= a * 0.5 ? Math.round(a * 0.26) : Math.round(a * 0.74);
  }
  async preload() {
    const r = this.data.scene.assets ?? {}, l = await Promise.allSettled(
      Object.entries(r).map(async ([a, e]) => {
        const o = await be(e);
        return [a, o];
      })
    );
    for (const a of l)
      if (a.status === "fulfilled") {
        const [e, o] = a.value;
        this.images[e] = o;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(r) {
    this.ballX = Math.max(0, Math.min(r, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: r, canvas: l, data: a } = this, { width: e, height: o } = l;
    r.clearRect(0, 0, e, o), this._drawBackground(e, o), this._drawGoalPost(e, o), this._drawDecoys(a.scene.decoys ?? []), this._drawTargetRing(a.target_x, o), this._drawGoalkeeper(a.scene, e, o), this._drawBall(o);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(r, l) {
    const a = this.images.stadium;
    if (a) {
      this.ctx.drawImage(a, 0, 0, r, l);
      return;
    }
    const e = this.ctx, o = e.createLinearGradient(0, 0, 0, l * 0.72);
    o.addColorStop(0, "#4e9fc8"), o.addColorStop(0.55, "#6ab9de"), o.addColorStop(1, "#88ccec"), e.fillStyle = o, e.fillRect(0, 0, r, l * 0.72), e.fillStyle = "rgba(58,118,178,0.38)", e.strokeStyle = "rgba(38,98,158,0.28)", e.lineWidth = 1, e.beginPath(), e.moveTo(0, 0), e.lineTo(r * 0.42, 0), e.lineTo(r * 0.3, l * 0.2), e.lineTo(0, l * 0.24), e.closePath(), e.fill(), e.stroke(), e.beginPath(), e.moveTo(r * 0.58, 0), e.lineTo(r, 0), e.lineTo(r, l * 0.24), e.lineTo(r * 0.7, l * 0.2), e.closePath(), e.fill(), e.stroke();
    const s = e.createLinearGradient(0, l * 0.63, 0, l);
    s.addColorStop(0, "#52c148"), s.addColorStop(0.3, "#46b23c"), s.addColorStop(1, "#3aa030"), e.fillStyle = s, e.fillRect(0, l * 0.66, r, l);
    const d = e.createLinearGradient(0, l * 0.62, 0, l * 0.7);
    d.addColorStop(0, "rgba(80,185,70,0)"), d.addColorStop(1, "#52c148"), e.fillStyle = d, e.fillRect(0, l * 0.62, r, l * 0.1), e.fillStyle = "rgba(255,255,255,0.04)";
    for (let f = 0; f < r; f += 36)
      e.fillRect(f, l * 0.66, 18, l * 0.34);
  }
  _drawGoalPost(r, l) {
    const a = this.images.goal_post, e = Math.round(r * 0.07), o = Math.round(r * 0.93), s = Math.round(l * 0.09), d = Math.round(l * 0.88), f = 7, n = Math.round(r * 0.055), c = Math.round(l * 0.1);
    if (a) {
      this.ctx.drawImage(a, e, s, o - e, d - s);
      return;
    }
    const t = this.ctx, v = e + n, m = o - n, y = s - c;
    t.save(), t.save(), t.beginPath(), t.rect(e + f * 0.5, s + f * 0.5, o - e - f, d - s - f * 0.5), t.clip(), t.fillStyle = "rgba(160,200,230,0.07)", t.fillRect(e, s, o - e, d - s), t.strokeStyle = "rgba(170,205,235,0.42)", t.lineWidth = 0.8;
    for (let u = e; u <= o; u += 20)
      t.beginPath(), t.moveTo(u, s), t.lineTo(u, d), t.stroke();
    for (let u = s; u <= d; u += 15)
      t.beginPath(), t.moveTo(e, u), t.lineTo(o, u), t.stroke();
    t.restore(), t.strokeStyle = "rgba(210,225,240,0.72)", t.lineWidth = 3.5, t.lineCap = "round", t.beginPath(), t.moveTo(e, s), t.lineTo(v, y), t.stroke(), t.beginPath(), t.moveTo(o, s), t.lineTo(m, y), t.stroke(), t.beginPath(), t.moveTo(v, y), t.lineTo(m, y), t.stroke(), t.strokeStyle = "rgba(190,215,235,0.48)", t.lineWidth = 2.5, t.beginPath(), t.moveTo(v, y), t.lineTo(v, d), t.stroke(), t.beginPath(), t.moveTo(m, y), t.lineTo(m, d), t.stroke(), t.strokeStyle = "#ffffff", t.lineWidth = f, t.lineCap = "square", t.beginPath(), t.moveTo(e, s), t.lineTo(o, s), t.stroke(), t.beginPath(), t.moveTo(e, s), t.lineTo(e, d), t.stroke(), t.beginPath(), t.moveTo(o, s), t.lineTo(o, d), t.stroke(), t.restore();
  }
  _drawGoalkeeper(r, l, a) {
    const e = this.images.goalkeeper, o = Math.round(this.keeperBaseX + this.keeperOffsetX), s = Math.round(a * 0.16), f = Math.round(a * 0.89) - s;
    if (e) {
      const z = Math.round(f * 0.52);
      this.ctx.drawImage(e, o - z / 2, s, z, f);
      return;
    }
    const n = this.ctx;
    n.save();
    const c = Math.round(f * 0.09), t = s + c, v = Math.round(f * 0.035), m = t + c, y = m + v, u = Math.round(f * 0.27), h = Math.round(f * 0.13), p = Math.round(f * 0.12), M = Math.round(f * 0.14), b = Math.round(f * 0.22), T = 22 * Math.PI / 180, E = Math.round(f * 0.43), N = Math.round(f * 0.058), H = y + u, X = H + h, C = X + p, P = Math.round(b * 1.05), w = Math.round(b * 0.48);
    n.fillStyle = "#111111", n.beginPath(), n.ellipse(o - P, C + M + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), n.fill(), n.beginPath(), n.ellipse(o + P, C + M + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), n.fill(), n.fillStyle = "#f0f0f0", n.fillRect(o - P - w / 2, C, w, M), n.fillRect(o + P - w / 2, C, w, M);
    const q = Math.round(M * 0.2);
    n.fillStyle = "#e63946", n.fillRect(o - P - w / 2, C + M * 0.68, w, q), n.fillRect(o + P - w / 2, C + M * 0.68, w, q), n.fillStyle = "#f0c090", n.fillRect(o - P - w / 2, X, w, p), n.fillRect(o + P - w / 2, X, w, p), n.fillStyle = "#1a1a2e", n.beginPath(), n.moveTo(o - b, H), n.lineTo(o + b, H), n.lineTo(o + P + w / 2, X), n.lineTo(o - P - w / 2, X), n.closePath(), n.fill(), n.fillStyle = "#f4f4f4", n.fillRect(o - b, y, b * 2, u), n.fillStyle = "#1a1a2e", n.fillRect(o - b * 0.45, y, b * 0.9, Math.round(f * 0.025));
    const V = Math.round(b * 1.3), ce = Math.round(u * 0.27), de = y + Math.round(u * 0.36);
    n.fillStyle = "#e63946", n.fillRect(o - V / 2, de, V, ce);
    const B = y + Math.round(u * 0.06), L = o - b - Math.round(E * Math.cos(T)), W = B - Math.round(E * Math.sin(T)), G = o + b + Math.round(E * Math.cos(T)), R = B - Math.round(E * Math.sin(T));
    n.strokeStyle = "#f4f4f4", n.lineWidth = N, n.lineCap = "round", n.beginPath(), n.moveTo(o - b, B), n.lineTo(L, W), n.stroke(), n.beginPath(), n.moveTo(o + b, B), n.lineTo(G, R), n.stroke();
    const A = Math.round(E * 0.14), ue = L + Math.round(A * Math.cos(T)), he = W + Math.round(A * Math.sin(T)), fe = G - Math.round(A * Math.cos(T)), ge = R + Math.round(A * Math.sin(T));
    n.strokeStyle = "#111111", n.lineWidth = N + 2, n.beginPath(), n.moveTo(ue, he), n.lineTo(L, W), n.stroke(), n.beginPath(), n.moveTo(fe, ge), n.lineTo(G, R), n.stroke();
    const D = Math.round(N * 1.9);
    n.fillStyle = "#e6e6e6", n.beginPath(), n.arc(L, W, D, 0, Math.PI * 2), n.fill(), n.beginPath(), n.arc(G, R, D, 0, Math.PI * 2), n.fill(), n.strokeStyle = "#aaaaaa", n.lineWidth = 1, n.beginPath(), n.arc(L, W, D, 0, Math.PI * 2), n.stroke(), n.beginPath(), n.arc(G, R, D, 0, Math.PI * 2), n.stroke();
    const j = Math.round(c * 0.55);
    n.fillStyle = "#f0c090", n.fillRect(o - j / 2, m, j, v + 2), n.fillStyle = "#f0c090", n.beginPath(), n.arc(o, t, c, 0, Math.PI * 2), n.fill(), n.fillStyle = "#1a0f08", n.beginPath(), n.arc(o, t, c, Math.PI * 1.05, Math.PI * 1.95), n.lineTo(o, t), n.closePath(), n.fill(), n.fillStyle = "#e8b07a", n.beginPath(), n.ellipse(o - c * 0.95, t + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), n.fill(), n.beginPath(), n.ellipse(o + c * 0.95, t + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), n.fill(), n.fillStyle = "#1a0f08", n.beginPath(), n.arc(o - c * 0.28, t + c * 0.08, c * 0.09, 0, Math.PI * 2), n.fill(), n.beginPath(), n.arc(o + c * 0.28, t + c * 0.08, c * 0.09, 0, Math.PI * 2), n.fill(), n.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(r, l) {
    const a = r, e = Math.round(l * 0.4), o = Math.round(l * 0.14), s = this.ctx;
    s.save(), s.shadowColor = "rgba(0,0,0,.55)", s.shadowBlur = 14, s.strokeStyle = "rgba(30,30,30,.6)", s.lineWidth = o * 0.58 + 2, s.beginPath(), s.arc(a, e, o, 0, Math.PI * 2), s.stroke(), s.shadowBlur = 0;
    const d = s.createLinearGradient(a - o, e - o, a + o, e + o);
    d.addColorStop(0, "#d4d4d4"), d.addColorStop(0.25, "#a0a0a0"), d.addColorStop(0.5, "#707070"), d.addColorStop(0.75, "#a8a8a8"), d.addColorStop(1, "#cecece"), s.strokeStyle = d, s.lineWidth = o * 0.55, s.beginPath(), s.arc(a, e, o, 0, Math.PI * 2), s.stroke(), s.strokeStyle = "rgba(255,255,255,.45)", s.lineWidth = 3, s.beginPath(), s.arc(a - o * 0.15, e - o * 0.15, o - o * 0.3, Math.PI * 1.05, Math.PI * 1.7), s.stroke(), s.strokeStyle = "rgba(0,0,0,.25)", s.lineWidth = 2, s.beginPath(), s.arc(a, e, o - o * 0.28, 0, Math.PI * 2), s.stroke(), s.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(r) {
    for (const l of r) {
      const a = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${l.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(l.x, a, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(r) {
    const l = this.images.ball, a = Math.round(r * 0.11), e = this.ballX, o = this.data.target_x, s = Math.abs(o - this.ballStartX) || 1, d = Math.max(0, Math.min(1, 1 - Math.abs(e - o) / s)), f = r * 0.82, n = r * 0.4, c = Math.round(f + d * (n - f));
    if (l) {
      this.ctx.drawImage(l, e - a, c - a, a * 2, a * 2);
      return;
    }
    const t = this.ctx;
    t.save(), t.beginPath(), t.rect(0, 0, this.canvas.width, this.canvas.height), t.clip(), t.fillStyle = "rgba(0,0,0,0.22)", t.beginPath(), t.ellipse(e + a * 0.05, c + a * 0.88, a * 0.75, a * 0.18, 0, 0, Math.PI * 2), t.fill();
    const v = t.createRadialGradient(e - a * 0.32, c - a * 0.32, a * 0.04, e, c, a);
    v.addColorStop(0, "#ffffff"), v.addColorStop(0.38, "#f0f0f0"), v.addColorStop(0.75, "#d4d4d4"), v.addColorStop(1, "#aaaaaa"), t.fillStyle = v, t.beginPath(), t.arc(e, c, a, 0, Math.PI * 2), t.fill(), t.save(), t.beginPath(), t.arc(e, c, a - 0.5, 0, Math.PI * 2), t.clip(), t.fillStyle = "#111111", J(t, e, c, a * 0.28);
    const m = a * 0.58, y = a * 0.23;
    for (let u = 0; u < 5; u++) {
      const h = (u * 72 - 90) * Math.PI / 180;
      J(t, e + m * Math.cos(h), c + m * Math.sin(h), y);
    }
    t.strokeStyle = "#333333", t.lineWidth = Math.max(0.8, a * 0.055), t.lineCap = "round";
    for (let u = 0; u < 5; u++) {
      const h = (u * 72 - 90) * Math.PI / 180;
      t.beginPath(), t.moveTo(e + a * 0.29 * Math.cos(h), c + a * 0.29 * Math.sin(h)), t.lineTo(e + m * 0.72 * Math.cos(h), c + m * 0.72 * Math.sin(h)), t.stroke();
    }
    t.restore(), t.strokeStyle = "#777777", t.lineWidth = 0.8, t.beginPath(), t.arc(e, c, a, 0, Math.PI * 2), t.stroke(), t.fillStyle = "rgba(255,255,255,0.55)", t.beginPath(), t.ellipse(e - a * 0.28, c - a * 0.3, a * 0.2, a * 0.13, -Math.PI / 5, 0, Math.PI * 2), t.fill(), t.restore();
  }
  destroy() {
  }
}
function Me(i) {
  return 1 - Math.pow(1 - i, 3);
}
function Se(i, r, l, a, e) {
  let o = null, s = null, d = !1;
  function f(n) {
    if (d) return;
    o === null && (o = n);
    const c = n - o, t = Math.min(c / l, 1), v = i + (r - i) * Me(t);
    a(v), t < 1 ? s = requestAnimationFrame(f) : e == null || e();
  }
  return s = requestAnimationFrame(f), () => {
    d = !0, s !== null && cancelAnimationFrame(s);
  };
}
function we(i, r) {
  let l = !0, a = null, e = 0, o = null;
  function s() {
    if (!l) return;
    const d = (Math.random() * 2 - 1) * i, f = 450 + Math.random() * 550, n = 600 + Math.random() * 900;
    a = Se(e, d, f, (c) => {
      e = c, r(c);
    }, () => {
      l && (o = setTimeout(s, n));
    });
  }
  return s(), () => {
    l = !1, a == null || a(), o !== null && clearTimeout(o);
  };
}
const F = (i, r) => {
  const l = i.__vccOpts || i;
  for (const [a, e] of r)
    l[a] = e;
  return l;
}, Pe = { class: "gc-canvas-wrap" }, xe = ["width", "height"], Te = {
  key: 0,
  class: "gc-canvas__success-overlay",
  "aria-live": "polite"
}, Ce = {
  class: "gc-confetti",
  "aria-hidden": "true"
}, Ie = ["data-i"], Ee = {
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
    var d, f, n, c;
    const r = i, l = x(null);
    let a = null, e = null;
    const o = ((f = (d = r.captchaData) == null ? void 0 : d.canvas) == null ? void 0 : f.width) ?? 400, s = ((c = (n = r.captchaData) == null ? void 0 : n.canvas) == null ? void 0 : c.height) ?? 220;
    return ee(async () => {
      a = new ke(l.value, r.captchaData), await a.preload(), e = we(
        50,
        // ±50 px around keeperBaseX — stays comfortably in their half of the goal
        (t) => {
          a && (a.keeperOffsetX = t, a.draw());
        }
      );
    }), te(() => {
      e == null || e(), a == null || a.destroy();
    }), ae(
      () => r.ballX,
      (t) => {
        a && t !== null && a.setBallX(t);
      }
    ), (t, v) => (k(), S("div", Pe, [
      g("canvas", {
        ref_key: "canvasEl",
        ref: l,
        width: _(o),
        height: _(s),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, xe),
      ne(ve, { name: "gc-success" }, {
        default: me(() => [
          i.showSuccess ? (k(), S("div", Te, [
            g("div", Ce, [
              (k(), S(oe, null, pe(24, (m) => g("span", {
                key: m,
                class: "gc-confetti__piece",
                "data-i": m
              }, null, 8, Ie)), 64))
            ]),
            v[0] || (v[0] = g("div", { class: "gc-success-badge" }, [
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
          ])) : I("", !0)
        ]),
        _: 1
      })
    ]));
  }
}, se = /* @__PURE__ */ F(Ee, [["__scopeId", "data-v-7b96a50c"]]), Xe = {
  key: 0,
  class: "gc-slider gc-slider--success",
  "aria-label": "Verification successful"
}, Le = ["aria-valuenow", "aria-valuemax", "tabindex"], We = {
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
    const l = r, a = i, e = x(null), o = x(a.trackWidth / 2), s = x(!1), d = $(() => a.handleSize / 2), f = $(
      () => Math.max(0, Math.min(o.value - d.value, a.trackWidth - a.handleSize))
    ), n = $(() => {
      const u = a.trackWidth / 2, h = o.value - u, p = u - a.handleSize / 2;
      if (p <= 0) return a.ballStartX;
      if (h < 0) {
        const M = a.ballStartX / p;
        return Math.max(0, a.ballStartX + h * M);
      } else {
        const M = (a.trackWidth - a.ballStartX) / p;
        return Math.min(a.trackWidth, a.ballStartX + h * M);
      }
    }), c = $(() => {
      const u = a.trackWidth / 2, h = o.value;
      return h < u ? {
        left: `${h}px`,
        width: `${u - h}px`
      } : {
        left: `${u}px`,
        width: `${h - u}px`
      };
    });
    function t(u) {
      a.disabled || (s.value = !0, l("drag-start"), window.addEventListener("mousemove", v, { passive: !0 }), window.addEventListener("touchmove", v, { passive: !0 }), window.addEventListener("mouseup", m), window.addEventListener("touchend", m));
    }
    function v(u) {
      if (!s.value) return;
      const h = u.touches ? u.touches[0].clientX : u.clientX, p = e.value.getBoundingClientRect(), M = Math.max(d.value, Math.min(h - p.left, a.trackWidth - d.value));
      o.value = M, l("drag-move", n.value, M);
    }
    function m() {
      s.value && (s.value = !1, window.removeEventListener("mousemove", v), window.removeEventListener("touchmove", v), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m), l("drag-end", n.value));
    }
    function y(u) {
      if (a.disabled) return;
      const h = 5;
      u.key === "ArrowRight" ? (s.value || (s.value = !0, l("drag-start")), o.value = Math.min(o.value + h, a.trackWidth - d.value), l("drag-move", n.value)) : u.key === "ArrowLeft" ? (s.value || (s.value = !0, l("drag-start")), o.value = Math.max(o.value - h, d.value), l("drag-move", n.value)) : (u.key === "Enter" || u.key === " ") && s.value && m();
    }
    return te(() => {
      window.removeEventListener("mousemove", v), window.removeEventListener("touchmove", v), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m);
    }), (u, h) => i.success ? (k(), S("div", Xe, [...h[0] || (h[0] = [
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
    ])])) : (k(), S("div", {
      key: 1,
      class: Y(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": s.value }]),
      ref_key: "trackEl",
      ref: e,
      role: "slider",
      "aria-valuenow": Math.round(o.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: y
    }, [
      g("div", {
        class: "gc-slider__fill",
        style: K(c.value)
      }, null, 4),
      h[2] || (h[2] = _e('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span></div>', 2)),
      g("div", {
        class: Y(["gc-slider__handle", { "is-dragging": s.value }]),
        style: K({ left: f.value + "px" }),
        onMousedown: Z(t, ["prevent"]),
        onTouchstart: Z(t, ["prevent"]),
        "aria-hidden": "true"
      }, [...h[1] || (h[1] = [
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
    ], 42, Le));
  }
}, re = /* @__PURE__ */ F(We, [["__scopeId", "data-v-4210077b"]]);
function Ge() {
  let i = [], r = null, l = !1;
  function a() {
    i = [], r = null, l = !1;
  }
  function e() {
    r = performance.now(), l = !0;
  }
  function o(n) {
    if (!l || r === null) return;
    const c = Math.round(performance.now() - r);
    i.length > 0 && c - i[i.length - 1].t < 8 || i.push({ x: Math.round(n), t: c });
  }
  function s() {
    l = !1;
  }
  function d() {
    return [...i];
  }
  function f() {
    return r === null ? 0 : Math.round(performance.now() - r);
  }
  return { reset: a, start: e, record: o, stop: s, getTrack: d, getElapsed: f };
}
function Re() {
  if (typeof document > "u") return null;
  const i = document.querySelector('meta[name="csrf-token"]');
  if (i != null && i.content) return i.content;
  const r = document.cookie.split("; ").find((l) => l.startsWith("XSRF-TOKEN="));
  return r ? decodeURIComponent(r.split("=")[1]) : null;
}
function Q() {
  const i = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }, r = Re();
  return r && (i["X-CSRF-TOKEN"] = r, i["X-XSRF-TOKEN"] = r), i;
}
function Be(i, r) {
  const l = x("idle"), a = x(null), e = x(null), o = x(null), s = Ge();
  async function d() {
    l.value = "loading", e.value = null, a.value = null;
    try {
      const v = await fetch(i, {
        method: "POST",
        headers: Q(),
        credentials: "same-origin"
      });
      if (!v.ok) throw new Error(`Server error: ${v.status}`);
      o.value = await v.json(), l.value = "ready";
    } catch (v) {
      l.value = "failed", e.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", v);
    }
  }
  function f() {
    l.value === "ready" && (l.value = "dragging", s.reset(), s.start());
  }
  function n(v) {
    l.value === "dragging" && s.record(v);
  }
  async function c(v) {
    if (l.value !== "dragging") return;
    s.stop(), l.value = "verifying";
    const m = s.getTrack(), y = s.getElapsed();
    try {
      const h = await (await fetch(r, {
        method: "POST",
        headers: Q(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: o.value.captcha_id,
          final_x: Math.round(v),
          drag_time: y,
          movement_track: m
        })
      })).json();
      h.success ? (a.value = h.token, l.value = "success") : (e.value = h.message ?? "Verification failed.", l.value = "failed");
    } catch (u) {
      l.value = "failed", e.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", u);
    }
  }
  async function t() {
    s.reset(), await d();
  }
  return {
    state: U(l),
    token: U(a),
    errorMsg: U(e),
    captchaData: U(o),
    load: d,
    onDragStart: f,
    onDragMove: n,
    onDragEnd: c,
    retry: t
  };
}
const Ae = ["data-state"], De = { class: "gc-modal__header" }, $e = { class: "gc-modal__scene" }, Ue = {
  key: 0,
  class: "gc-modal__skeleton",
  "aria-busy": "true"
}, Ne = {
  key: 0,
  class: "gc-modal__verifying",
  "aria-live": "polite"
}, He = {
  key: 1,
  class: "gc-modal__verifying gc-modal__verifying--failed",
  "aria-live": "assertive"
}, Oe = {
  key: 2,
  class: "gc-modal__error-scene",
  role: "alert"
}, Ye = { class: "gc-modal__error-msg" }, Fe = {
  key: 3,
  class: "gc-modal__idle"
}, qe = { class: "gc-modal__slider-wrap" }, Ve = {
  key: 1,
  class: "gc-modal__slider-skeleton"
}, je = {
  key: 2,
  class: "gc-modal__error-actions"
}, ze = ["name", "value"], ie = {
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
    const l = i, a = r, {
      state: e,
      token: o,
      errorMsg: s,
      captchaData: d,
      load: f,
      onDragStart: n,
      onDragMove: c,
      onDragEnd: t,
      retry: v
    } = Be(l.generateUrl, l.verifyUrl), m = x(null);
    function y(h, p) {
      m.value = h, c(p ?? h);
    }
    function u(h) {
      m.value = h, t(h);
    }
    return ae(e, (h) => {
      var p;
      h === "success" && (m.value = ((p = d.value) == null ? void 0 : p.target_x) ?? m.value, a("verified", o.value)), h === "failed" && (a("failed", s.value), d.value && setTimeout(() => {
        m.value = null, v();
      }, 1400)), h === "ready" && a("loaded", d.value);
    }), ee(() => {
      l.autoLoad && f();
    }), (h, p) => {
      var M;
      return k(), S("div", {
        class: Y(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
        "data-state": _(e),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Football goal CAPTCHA verification"
      }, [
        g("div", De, [
          p[4] || (p[4] = g("div", { class: "gc-modal__header-text" }, [
            g("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
            g("p", { class: "gc-modal__subtitle" }, "Drag the slider left or right to score a goal")
          ], -1)),
          i.closable ? (k(), S("button", {
            key: 0,
            type: "button",
            class: "gc-modal__close",
            "aria-label": "Close",
            onClick: p[0] || (p[0] = (b) => h.$emit("close"))
          }, [...p[3] || (p[3] = [
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
          ])])) : I("", !0)
        ]),
        g("div", $e, [
          _(e) === "loading" ? (k(), S("div", Ue)) : _(d) ? (k(), S(oe, { key: 1 }, [
            ne(se, {
              "captcha-data": _(d),
              "ball-x": m.value,
              "show-success": _(e) === "success"
            }, null, 8, ["captcha-data", "ball-x", "show-success"]),
            _(e) === "verifying" ? (k(), S("div", Ne, [...p[5] || (p[5] = [
              g("span", {
                class: "gc-spinner",
                "aria-hidden": "true"
              }, null, -1),
              g("span", null, "Verifying…", -1)
            ])])) : I("", !0),
            _(e) === "failed" ? (k(), S("div", He, [...p[6] || (p[6] = [
              g("span", {
                class: "gc-icon-miss",
                "aria-hidden": "true"
              }, "❌", -1),
              g("span", null, "Missed! Retrying…", -1)
            ])])) : I("", !0)
          ], 64)) : _(e) === "failed" ? (k(), S("div", Oe, [
            p[7] || (p[7] = g("div", {
              class: "gc-modal__error-icon",
              "aria-hidden": "true"
            }, "⚽", -1)),
            g("p", Ye, le(_(s) ?? "Verification failed. Please try again."), 1)
          ])) : (k(), S("div", Fe, [
            g("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: p[1] || (p[1] = (...b) => _(f) && _(f)(...b))
            }, "Start Verification")
          ]))
        ]),
        g("div", qe, [
          _(d) ? (k(), ye(re, {
            key: 0,
            "ball-start-x": _(d).ball_start_x,
            "track-width": ((M = _(d).canvas) == null ? void 0 : M.width) ?? 400,
            success: _(e) === "success",
            disabled: _(e) === "verifying" || _(e) === "success",
            onDragStart: _(n),
            onDragMove: y,
            onDragEnd: u
          }, null, 8, ["ball-start-x", "track-width", "success", "disabled", "onDragStart"])) : _(e) === "loading" ? (k(), S("div", Ve)) : _(e) === "failed" ? (k(), S("div", je, [
            g("button", {
              type: "button",
              class: "gc-btn-primary",
              onClick: p[2] || (p[2] = (...b) => _(v) && _(v)(...b))
            }, "↺ Try again")
          ])) : I("", !0)
        ]),
        _(o) ? (k(), S("input", {
          key: 0,
          type: "hidden",
          name: i.fieldName,
          value: _(o)
        }, null, 8, ze)) : I("", !0)
      ], 10, Ae);
    };
  }
}, Ke = {
  class: "goal-captcha__success",
  role: "status",
  "aria-live": "polite"
}, Ze = { class: "goal-captcha__success-text" }, Je = {
  __name: "SuccessAnimation",
  props: {
    message: {
      type: String,
      default: "GOAL! Human verified ✓"
    }
  },
  setup(i) {
    return (r, l) => (k(), S("div", Ke, [
      l[0] || (l[0] = g("div", { class: "goal-captcha__success-icon" }, [
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
      g("p", Ze, le(i.message), 1)
    ]));
  }
}, Qe = /* @__PURE__ */ F(Je, [["__scopeId", "data-v-3f0157c9"]]), et = (i, r = {}) => {
  (r.generateUrl || r.verifyUrl) && (window.__GoalCaptchaConfig = {
    generateUrl: r.generateUrl ?? "/_goal_captcha/generate",
    verifyUrl: r.verifyUrl ?? "/_goal_captcha/verify",
    theme: r.theme ?? "football",
    difficulty: r.difficulty ?? "medium"
  }), i.component("GoalCaptcha", ie), i.component("GoalCanvas", se), i.component("GoalSlider", re), i.component("SuccessAnimation", Qe);
}, at = { install: et };
function nt() {
  typeof document > "u" || document.addEventListener("DOMContentLoaded", () => {
    const { createApp: i } = window.Vue ?? require("vue");
    document.querySelectorAll(".goal-captcha-wrapper").forEach((r) => {
      const l = r.querySelector("#goal-captcha-app");
      if (!l) return;
      const a = r.querySelector('input[type="hidden"]'), e = {
        generateUrl: r.dataset.generateUrl,
        verifyUrl: r.dataset.verifyUrl,
        theme: r.dataset.theme ?? "football",
        difficulty: r.dataset.difficulty ?? "medium",
        fieldName: r.dataset.fieldName ?? "captcha_token"
      };
      i(ie, {
        ...e,
        onVerified: (s) => {
          a && (a.value = s);
        }
      }).mount(l);
    });
  });
}
export {
  se as GoalCanvas,
  ie as GoalCaptcha,
  re as GoalSlider,
  Qe as SuccessAnimation,
  at as default,
  nt as initBladeMount,
  et as install,
  Be as useGoalCaptcha
};
//# sourceMappingURL=goal-captcha.es.js.map
