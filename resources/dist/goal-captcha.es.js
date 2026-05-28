import { ref as L, onMounted as te, onBeforeUnmount as ae, watch as ne, openBlock as I, createElementBlock as D, createElementVNode as b, unref as w, createVNode as H, Transition as oe, withCtx as le, Fragment as me, renderList as pe, createCommentVNode as re, computed as A, normalizeClass as q, normalizeStyle as J, createStaticVNode as ye, withModifiers as Y, readonly as U, defineComponent as be, h as y, createBlock as _e, Teleport as ke, toDisplayString as Me } from "vue";
const F = /* @__PURE__ */ new Map();
async function Se(i) {
  return F.has(i) ? F.get(i) : new Promise((s, l) => {
    const t = new Image();
    t.crossOrigin = "anonymous", t.onload = () => {
      F.set(i, t), s(t);
    }, t.onerror = () => l(new Error(`Failed to load image: ${i}`)), t.src = i;
  });
}
function Q(i, s, l, t) {
  i.beginPath();
  for (let n = 0; n < 5; n++) {
    const o = (n * 72 - 90) * Math.PI / 180;
    n === 0 ? i.moveTo(s + t * Math.cos(o), l + t * Math.sin(o)) : i.lineTo(s + t * Math.cos(o), l + t * Math.sin(o));
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
      Object.entries(s).map(async ([t, n]) => {
        const o = await Se(n);
        return [t, o];
      })
    );
    for (const t of l)
      if (t.status === "fulfilled") {
        const [n, o] = t.value;
        this.images[n] = o;
      }
    this.ready = !0, this.draw();
  }
  /** Update ball X position and redraw. Called during drag. */
  setBallX(s) {
    this.ballX = Math.max(0, Math.min(s, this.canvas.width)), this.draw();
  }
  draw() {
    const { ctx: s, canvas: l, data: t } = this, { width: n, height: o } = l;
    s.clearRect(0, 0, n, o), this._drawBackground(n, o), this._drawGoalPost(n, o), this._drawDecoys(t.scene.decoys ?? []), this._drawTargetRing(t.target_x, o), this._drawGoalkeeper(t.scene, n, o), this._drawBall(o);
  }
  // ─── Layer renderers ─────────────────────────────────────────────────────
  _drawBackground(s, l) {
    const t = this.images.stadium;
    if (t) {
      this.ctx.drawImage(t, 0, 0, s, l);
      return;
    }
    const n = this.ctx, o = n.createLinearGradient(0, 0, 0, l * 0.72);
    o.addColorStop(0, "#4e9fc8"), o.addColorStop(0.55, "#6ab9de"), o.addColorStop(1, "#88ccec"), n.fillStyle = o, n.fillRect(0, 0, s, l * 0.72), n.fillStyle = "rgba(58,118,178,0.38)", n.strokeStyle = "rgba(38,98,158,0.28)", n.lineWidth = 1, n.beginPath(), n.moveTo(0, 0), n.lineTo(s * 0.42, 0), n.lineTo(s * 0.3, l * 0.2), n.lineTo(0, l * 0.24), n.closePath(), n.fill(), n.stroke(), n.beginPath(), n.moveTo(s * 0.58, 0), n.lineTo(s, 0), n.lineTo(s, l * 0.24), n.lineTo(s * 0.7, l * 0.2), n.closePath(), n.fill(), n.stroke();
    const r = n.createLinearGradient(0, l * 0.63, 0, l);
    r.addColorStop(0, "#52c148"), r.addColorStop(0.3, "#46b23c"), r.addColorStop(1, "#3aa030"), n.fillStyle = r, n.fillRect(0, l * 0.66, s, l);
    const u = n.createLinearGradient(0, l * 0.62, 0, l * 0.7);
    u.addColorStop(0, "rgba(80,185,70,0)"), u.addColorStop(1, "#52c148"), n.fillStyle = u, n.fillRect(0, l * 0.62, s, l * 0.1), n.fillStyle = "rgba(255,255,255,0.04)";
    for (let f = 0; f < s; f += 36)
      n.fillRect(f, l * 0.66, 18, l * 0.34);
  }
  _drawGoalPost(s, l) {
    const t = this.images.goal_post, n = Math.round(s * 0.07), o = Math.round(s * 0.93), r = Math.round(l * 0.09), u = Math.round(l * 0.88), f = 7, a = Math.round(s * 0.055), c = Math.round(l * 0.1);
    if (t) {
      this.ctx.drawImage(t, n, r, o - n, u - r);
      return;
    }
    const e = this.ctx, h = n + a, m = o - a, p = r - c;
    e.save(), e.save(), e.beginPath(), e.rect(n + f * 0.5, r + f * 0.5, o - n - f, u - r - f * 0.5), e.clip(), e.fillStyle = "rgba(160,200,230,0.07)", e.fillRect(n, r, o - n, u - r), e.strokeStyle = "rgba(170,205,235,0.42)", e.lineWidth = 0.8;
    for (let d = n; d <= o; d += 20)
      e.beginPath(), e.moveTo(d, r), e.lineTo(d, u), e.stroke();
    for (let d = r; d <= u; d += 15)
      e.beginPath(), e.moveTo(n, d), e.lineTo(o, d), e.stroke();
    e.restore(), e.strokeStyle = "rgba(210,225,240,0.72)", e.lineWidth = 3.5, e.lineCap = "round", e.beginPath(), e.moveTo(n, r), e.lineTo(h, p), e.stroke(), e.beginPath(), e.moveTo(o, r), e.lineTo(m, p), e.stroke(), e.beginPath(), e.moveTo(h, p), e.lineTo(m, p), e.stroke(), e.strokeStyle = "rgba(190,215,235,0.48)", e.lineWidth = 2.5, e.beginPath(), e.moveTo(h, p), e.lineTo(h, u), e.stroke(), e.beginPath(), e.moveTo(m, p), e.lineTo(m, u), e.stroke(), e.strokeStyle = "#ffffff", e.lineWidth = f, e.lineCap = "square", e.beginPath(), e.moveTo(n, r), e.lineTo(o, r), e.stroke(), e.beginPath(), e.moveTo(n, r), e.lineTo(n, u), e.stroke(), e.beginPath(), e.moveTo(o, r), e.lineTo(o, u), e.stroke(), e.restore();
  }
  _drawGoalkeeper(s, l, t) {
    const n = this.images.goalkeeper, o = Math.round(this.keeperBaseX + this.keeperOffsetX), r = Math.round(t * 0.16), f = Math.round(t * 0.89) - r;
    if (n) {
      const Z = Math.round(f * 0.52);
      this.ctx.drawImage(n, o - Z / 2, r, Z, f);
      return;
    }
    const a = this.ctx;
    a.save();
    const c = Math.round(f * 0.09), e = r + c, h = Math.round(f * 0.035), m = e + c, p = m + h, d = Math.round(f * 0.27), g = Math.round(f * 0.13), T = Math.round(f * 0.12), _ = Math.round(f * 0.14), k = Math.round(f * 0.22), M = 22 * Math.PI / 180, X = Math.round(f * 0.43), E = Math.round(f * 0.058), v = p + d, S = v + g, P = S + T, C = Math.round(k * 1.05), x = Math.round(k * 0.48);
    a.fillStyle = "#111111", a.beginPath(), a.ellipse(o - C, P + _ + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), a.fill(), a.beginPath(), a.ellipse(o + C, P + _ + c * 0.3, c * 0.9, c * 0.34, 0, 0, Math.PI * 2), a.fill(), a.fillStyle = "#f0f0f0", a.fillRect(o - C - x / 2, P, x, _), a.fillRect(o + C - x / 2, P, x, _);
    const j = Math.round(_ * 0.2);
    a.fillStyle = "#e63946", a.fillRect(o - C - x / 2, P + _ * 0.68, x, j), a.fillRect(o + C - x / 2, P + _ * 0.68, x, j), a.fillStyle = "#f0c090", a.fillRect(o - C - x / 2, S, x, T), a.fillRect(o + C - x / 2, S, x, T), a.fillStyle = "#1a1a2e", a.beginPath(), a.moveTo(o - k, v), a.lineTo(o + k, v), a.lineTo(o + C + x / 2, S), a.lineTo(o - C - x / 2, S), a.closePath(), a.fill(), a.fillStyle = "#f4f4f4", a.fillRect(o - k, p, k * 2, d), a.fillStyle = "#1a1a2e", a.fillRect(o - k * 0.45, p, k * 0.9, Math.round(f * 0.025));
    const z = Math.round(k * 1.3), de = Math.round(d * 0.27), ue = p + Math.round(d * 0.36);
    a.fillStyle = "#e63946", a.fillRect(o - z / 2, ue, z, de);
    const N = p + Math.round(d * 0.06), R = o - k - Math.round(X * Math.cos(M)), B = N - Math.round(X * Math.sin(M)), W = o + k + Math.round(X * Math.cos(M)), G = N - Math.round(X * Math.sin(M));
    a.strokeStyle = "#f4f4f4", a.lineWidth = E, a.lineCap = "round", a.beginPath(), a.moveTo(o - k, N), a.lineTo(R, B), a.stroke(), a.beginPath(), a.moveTo(o + k, N), a.lineTo(W, G), a.stroke();
    const $ = Math.round(X * 0.14), he = R + Math.round($ * Math.cos(M)), fe = B + Math.round($ * Math.sin(M)), ge = W - Math.round($ * Math.cos(M)), ve = G + Math.round($ * Math.sin(M));
    a.strokeStyle = "#111111", a.lineWidth = E + 2, a.beginPath(), a.moveTo(he, fe), a.lineTo(R, B), a.stroke(), a.beginPath(), a.moveTo(ge, ve), a.lineTo(W, G), a.stroke();
    const O = Math.round(E * 1.9);
    a.fillStyle = "#e6e6e6", a.beginPath(), a.arc(R, B, O, 0, Math.PI * 2), a.fill(), a.beginPath(), a.arc(W, G, O, 0, Math.PI * 2), a.fill(), a.strokeStyle = "#aaaaaa", a.lineWidth = 1, a.beginPath(), a.arc(R, B, O, 0, Math.PI * 2), a.stroke(), a.beginPath(), a.arc(W, G, O, 0, Math.PI * 2), a.stroke();
    const K = Math.round(c * 0.55);
    a.fillStyle = "#f0c090", a.fillRect(o - K / 2, m, K, h + 2), a.fillStyle = "#f0c090", a.beginPath(), a.arc(o, e, c, 0, Math.PI * 2), a.fill(), a.fillStyle = "#1a0f08", a.beginPath(), a.arc(o, e, c, Math.PI * 1.05, Math.PI * 1.95), a.lineTo(o, e), a.closePath(), a.fill(), a.fillStyle = "#e8b07a", a.beginPath(), a.ellipse(o - c * 0.95, e + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), a.fill(), a.beginPath(), a.ellipse(o + c * 0.95, e + c * 0.1, c * 0.13, c * 0.2, 0, 0, Math.PI * 2), a.fill(), a.fillStyle = "#1a0f08", a.beginPath(), a.arc(o - c * 0.28, e + c * 0.08, c * 0.09, 0, Math.PI * 2), a.fill(), a.beginPath(), a.arc(o + c * 0.28, e + c * 0.08, c * 0.09, 0, Math.PI * 2), a.fill(), a.restore();
  }
  /** The target ring — metallic gray hoop inside the goal area. */
  _drawTargetRing(s, l) {
    const t = s, n = Math.round(l * 0.4), o = Math.round(l * 0.14), r = this.ctx;
    r.save(), r.shadowColor = "rgba(0,0,0,.55)", r.shadowBlur = 14, r.strokeStyle = "rgba(30,30,30,.6)", r.lineWidth = o * 0.58 + 2, r.beginPath(), r.arc(t, n, o, 0, Math.PI * 2), r.stroke(), r.shadowBlur = 0;
    const u = r.createLinearGradient(t - o, n - o, t + o, n + o);
    u.addColorStop(0, "#d4d4d4"), u.addColorStop(0.25, "#a0a0a0"), u.addColorStop(0.5, "#707070"), u.addColorStop(0.75, "#a8a8a8"), u.addColorStop(1, "#cecece"), r.strokeStyle = u, r.lineWidth = o * 0.55, r.beginPath(), r.arc(t, n, o, 0, Math.PI * 2), r.stroke(), r.strokeStyle = "rgba(255,255,255,.45)", r.lineWidth = 3, r.beginPath(), r.arc(t - o * 0.15, n - o * 0.15, o - o * 0.3, Math.PI * 1.05, Math.PI * 1.7), r.stroke(), r.strokeStyle = "rgba(0,0,0,.25)", r.lineWidth = 2, r.beginPath(), r.arc(t, n, o - o * 0.28, 0, Math.PI * 2), r.stroke(), r.restore();
  }
  /** Decoy rings — semi-transparent, misleading. */
  _drawDecoys(s) {
    for (const l of s) {
      const t = Math.round(this.canvas.height * 0.4);
      this.ctx.save(), this.ctx.strokeStyle = `rgba(180,180,180,${l.opacity})`, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.arc(l.x, t, Math.round(this.canvas.height * 0.12), 0, Math.PI * 2), this.ctx.stroke(), this.ctx.restore();
    }
  }
  _drawBall(s) {
    const l = this.images.ball, t = Math.round(s * 0.11), n = this.ballX, o = this.data.target_x, r = Math.abs(o - this.ballStartX) || 1, u = Math.max(0, Math.min(1, 1 - Math.abs(n - o) / r)), f = s * 0.82, a = s * 0.4, c = Math.round(f + u * (a - f));
    if (l) {
      this.ctx.drawImage(l, n - t, c - t, t * 2, t * 2);
      return;
    }
    const e = this.ctx;
    e.save(), e.beginPath(), e.rect(0, 0, this.canvas.width, this.canvas.height), e.clip(), e.fillStyle = "rgba(0,0,0,0.22)", e.beginPath(), e.ellipse(n + t * 0.05, c + t * 0.88, t * 0.75, t * 0.18, 0, 0, Math.PI * 2), e.fill();
    const h = e.createRadialGradient(n - t * 0.32, c - t * 0.32, t * 0.04, n, c, t);
    h.addColorStop(0, "#ffffff"), h.addColorStop(0.38, "#f0f0f0"), h.addColorStop(0.75, "#d4d4d4"), h.addColorStop(1, "#aaaaaa"), e.fillStyle = h, e.beginPath(), e.arc(n, c, t, 0, Math.PI * 2), e.fill(), e.save(), e.beginPath(), e.arc(n, c, t - 0.5, 0, Math.PI * 2), e.clip(), e.fillStyle = "#111111", Q(e, n, c, t * 0.28);
    const m = t * 0.58, p = t * 0.23;
    for (let d = 0; d < 5; d++) {
      const g = (d * 72 - 90) * Math.PI / 180;
      Q(e, n + m * Math.cos(g), c + m * Math.sin(g), p);
    }
    e.strokeStyle = "#333333", e.lineWidth = Math.max(0.8, t * 0.055), e.lineCap = "round";
    for (let d = 0; d < 5; d++) {
      const g = (d * 72 - 90) * Math.PI / 180;
      e.beginPath(), e.moveTo(n + t * 0.29 * Math.cos(g), c + t * 0.29 * Math.sin(g)), e.lineTo(n + m * 0.72 * Math.cos(g), c + m * 0.72 * Math.sin(g)), e.stroke();
    }
    e.restore(), e.strokeStyle = "#777777", e.lineWidth = 0.8, e.beginPath(), e.arc(n, c, t, 0, Math.PI * 2), e.stroke(), e.fillStyle = "rgba(255,255,255,0.55)", e.beginPath(), e.ellipse(n - t * 0.28, c - t * 0.3, t * 0.2, t * 0.13, -Math.PI / 5, 0, Math.PI * 2), e.fill(), e.restore();
  }
  destroy() {
  }
}
function Pe(i) {
  return 1 - Math.pow(1 - i, 3);
}
function xe(i, s, l, t, n) {
  let o = null, r = null, u = !1;
  function f(a) {
    if (u) return;
    o === null && (o = a);
    const c = a - o, e = Math.min(c / l, 1), h = i + (s - i) * Pe(e);
    t(h), e < 1 ? r = requestAnimationFrame(f) : n == null || n();
  }
  return r = requestAnimationFrame(f), () => {
    u = !0, r !== null && cancelAnimationFrame(r);
  };
}
const V = (i, s) => {
  const l = i.__vccOpts || i;
  for (const [t, n] of s)
    l[t] = n;
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
    var u, f, a, c;
    const s = i, l = L(null);
    let t = null, n = null;
    const o = ((f = (u = s.captchaData) == null ? void 0 : u.canvas) == null ? void 0 : f.width) ?? 400, r = ((c = (a = s.captchaData) == null ? void 0 : a.canvas) == null ? void 0 : c.height) ?? 220;
    return te(async () => {
      t = new we(l.value, s.captchaData), await t.preload();
      const e = o, h = s.captchaData.target_x ?? e * 0.65, m = e * 0.11, p = e * 0.89, d = h + 58, g = h - 58;
      function T() {
        const M = [];
        g - m > 30 && M.push([m, g]), p - d > 30 && M.push([d, p]), M.length || M.push([m, p]);
        const [X, E] = M[Math.floor(Math.random() * M.length)];
        return X + Math.random() * (E - X);
      }
      let _ = null;
      function k() {
        if (!t) return;
        const M = T(), X = t.keeperBaseX + t.keeperOffsetX, E = 500 + Math.random() * 600, v = 700 + Math.random() * 1e3;
        _ = xe(X, M, E, (S) => {
          t && (t.keeperOffsetX = S - t.keeperBaseX, t.draw());
        }, () => {
          t && setTimeout(k, v);
        });
      }
      k(), n = () => {
        _ == null || _();
      };
    }), ae(() => {
      n == null || n(), t == null || t.destroy();
    }), ne(
      () => s.ballX,
      (e) => {
        t && e !== null && t.setBallX(e);
      }
    ), (e, h) => (I(), D("div", Ce, [
      b("canvas", {
        ref_key: "canvasEl",
        ref: l,
        width: w(o),
        height: w(r),
        class: "gc-canvas",
        "aria-label": "Football goal CAPTCHA scene",
        role: "img"
      }, null, 8, Te),
      H(oe, { name: "gc-success" }, {
        default: le(() => [
          i.showSuccess ? (I(), D("div", Xe, [
            b("div", Ee, [
              (I(), D(me, null, pe(24, (m) => b("span", {
                key: m,
                class: "gc-confetti__piece",
                "data-i": m
              }, null, 8, Le)), 64))
            ]),
            h[0] || (h[0] = b("div", { class: "gc-success-badge" }, [
              b("div", { class: "gc-success-badge__ball" }, "⚽"),
              b("div", { class: "gc-success-badge__banner" }, [
                b("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--left",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  b("path", {
                    d: "M20 0 L0 20 L20 40 Z",
                    fill: "#15803d"
                  })
                ]),
                b("span", { class: "gc-success-badge__text" }, "SUCCESS"),
                b("svg", {
                  class: "gc-success-badge__ribbon gc-success-badge__ribbon--right",
                  viewBox: "0 0 20 40",
                  fill: "none"
                }, [
                  b("path", {
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
}, se = /* @__PURE__ */ V(Ie, [["__scopeId", "data-v-3a74f965"]]), De = {
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
    const l = s, t = i, n = L(null), o = L(t.trackWidth / 2), r = L(!1), u = A(() => t.handleSize / 2), f = A(
      () => Math.max(0, Math.min(o.value - u.value, t.trackWidth - t.handleSize))
    ), a = A(() => {
      const d = t.trackWidth / 2, g = o.value - d, T = d - t.handleSize / 2;
      if (T <= 0) return t.ballStartX;
      if (g < 0) {
        const _ = t.ballStartX / T;
        return Math.max(0, t.ballStartX + g * _);
      } else {
        const _ = (t.trackWidth - t.ballStartX) / T;
        return Math.min(t.trackWidth, t.ballStartX + g * _);
      }
    }), c = A(() => {
      const d = t.trackWidth / 2, g = o.value;
      return g < d ? {
        left: `${g}px`,
        width: `${d - g}px`
      } : {
        left: `${d}px`,
        width: `${g - d}px`
      };
    });
    function e(d) {
      t.disabled || (r.value = !0, l("drag-start"), window.addEventListener("mousemove", h, { passive: !0 }), window.addEventListener("touchmove", h, { passive: !0 }), window.addEventListener("mouseup", m), window.addEventListener("touchend", m));
    }
    function h(d) {
      if (!r.value) return;
      const g = d.touches ? d.touches[0].clientX : d.clientX, T = n.value.getBoundingClientRect(), _ = Math.max(u.value, Math.min(g - T.left, t.trackWidth - u.value));
      o.value = _, l("drag-move", a.value, _);
    }
    function m() {
      r.value && (r.value = !1, window.removeEventListener("mousemove", h), window.removeEventListener("touchmove", h), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m), l("drag-end", a.value));
    }
    function p(d) {
      if (t.disabled) return;
      const g = 5;
      d.key === "ArrowRight" ? (r.value || (r.value = !0, l("drag-start")), o.value = Math.min(o.value + g, t.trackWidth - u.value), l("drag-move", a.value)) : d.key === "ArrowLeft" ? (r.value || (r.value = !0, l("drag-start")), o.value = Math.max(o.value - g, u.value), l("drag-move", a.value)) : (d.key === "Enter" || d.key === " ") && r.value && m();
    }
    return ae(() => {
      window.removeEventListener("mousemove", h), window.removeEventListener("touchmove", h), window.removeEventListener("mouseup", m), window.removeEventListener("touchend", m);
    }), (d, g) => i.success ? (I(), D("div", De, [...g[0] || (g[0] = [
      b("div", { class: "gc-slider__success-check" }, [
        b("svg", {
          viewBox: "0 0 44 44",
          fill: "none",
          "aria-hidden": "true"
        }, [
          b("circle", {
            cx: "22",
            cy: "22",
            r: "20",
            fill: "#16a34a"
          }),
          b("path", {
            d: "M13 22.5l6.5 6.5 11-13",
            stroke: "#fff",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ])
      ], -1)
    ])])) : (I(), D("div", {
      key: 1,
      class: q(["gc-slider", { "gc-slider--disabled": i.disabled, "gc-slider--dragging": r.value }]),
      ref_key: "trackEl",
      ref: n,
      role: "slider",
      "aria-valuenow": Math.round(o.value),
      "aria-valuemin": 0,
      "aria-valuemax": i.trackWidth,
      "aria-label": "Drag the ball to score a goal",
      tabindex: i.disabled ? -1 : 0,
      onKeydown: p
    }, [
      b("div", {
        class: "gc-slider__fill",
        style: J(c.value)
      }, null, 4),
      g[2] || (g[2] = ye('<div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span><span class="gc-slider__chev" data-v-4210077b>❮</span></div><div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true" data-v-4210077b><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span><span class="gc-slider__chev" data-v-4210077b>❯</span></div>', 2)),
      b("div", {
        class: q(["gc-slider__handle", { "is-dragging": r.value }]),
        style: J({ left: f.value + "px" }),
        onMousedown: Y(e, ["prevent"]),
        onTouchstart: Y(e, ["prevent"]),
        "aria-hidden": "true"
      }, [...g[1] || (g[1] = [
        b("svg", {
          class: "gc-slider__handle-icon",
          viewBox: "0 0 32 18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          b("path", {
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
}, ie = /* @__PURE__ */ V(Be, [["__scopeId", "data-v-4210077b"]]);
function We() {
  let i = [], s = null, l = !1;
  function t() {
    i = [], s = null, l = !1;
  }
  function n() {
    s = performance.now(), l = !0;
  }
  function o(a) {
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
  function f() {
    return s === null ? 0 : Math.round(performance.now() - s);
  }
  return { reset: t, start: n, record: o, stop: r, getTrack: u, getElapsed: f };
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
  const l = L("idle"), t = L(null), n = L(null), o = L(null), r = We();
  async function u() {
    l.value = "loading", n.value = null, t.value = null;
    try {
      const h = await fetch(i, {
        method: "POST",
        headers: ee(),
        credentials: "same-origin"
      });
      if (!h.ok) throw new Error(`Server error: ${h.status}`);
      o.value = await h.json(), l.value = "ready";
    } catch (h) {
      l.value = "failed", n.value = "Failed to load CAPTCHA. Please refresh.", console.error("[GoalCaptcha] generate error:", h);
    }
  }
  function f() {
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
      const g = await (await fetch(s, {
        method: "POST",
        headers: ee(),
        credentials: "same-origin",
        body: JSON.stringify({
          captcha_id: o.value.captcha_id,
          final_x: Math.round(h),
          drag_time: p,
          movement_track: m
        })
      })).json();
      g.success ? (t.value = g.token, l.value = "success") : (n.value = g.message ?? "Verification failed.", l.value = "failed");
    } catch (d) {
      l.value = "failed", n.value = "Network error. Please try again.", console.error("[GoalCaptcha] verify error:", d);
    }
  }
  async function e() {
    r.reset(), await u();
  }
  return {
    state: U(l),
    token: U(t),
    errorMsg: U(n),
    captchaData: U(o),
    load: u,
    onDragStart: f,
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
  setup(i, { emit: s }) {
    const l = i, t = s, n = A(() => l.mode === "modal"), o = L(!1);
    let r = null;
    function u() {
      o.value = !0, t("open"), !m.value || c.value === "failed" ? _() : c.value === "idle" && p();
    }
    function f() {
      o.value = !1, t("close");
    }
    function a() {
      l.closable && f();
    }
    const {
      state: c,
      token: e,
      errorMsg: h,
      captchaData: m,
      load: p,
      onDragStart: d,
      onDragMove: g,
      onDragEnd: T,
      retry: _
    } = Ae(l.generateUrl, l.verifyUrl), k = L(null);
    function M(v, S) {
      k.value = v, g(S ?? v);
    }
    function X(v) {
      k.value = v, T(v);
    }
    ne(c, (v) => {
      var S;
      if (v === "success" && (k.value = ((S = m.value) == null ? void 0 : S.target_x) ?? k.value, t("verified", e.value), n.value && r)) {
        f();
        let P = r.querySelector(`input[name="${l.fieldName}"]`);
        P || (P = document.createElement("input"), P.type = "hidden", P.name = l.fieldName, r.appendChild(P)), P.value = e.value, setTimeout(() => r.submit(), 600);
      }
      v === "failed" && (t("failed", h.value), m.value && setTimeout(() => {
        k.value = null, _();
      }, 1400)), v === "ready" && t("loaded", m.value);
    }), te(() => {
      n.value && l.form && (r = typeof l.form == "string" ? document.querySelector(l.form) : l.form, r && r.addEventListener("submit", (v) => {
        r.dataset.gcVerified !== "1" && (v.preventDefault(), u());
      })), l.autoLoad && p();
    });
    const E = be({
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
      setup(v, { emit: S }) {
        return () => {
          var P;
          return [
            // ── Header
            y("div", { class: "gc-modal__header" }, [
              y("div", { class: "gc-modal__header-text" }, [
                y("h2", { class: "gc-modal__title" }, "Confirm you're not a robot"),
                y("p", { class: "gc-modal__subtitle" }, "Drag the slider to score a goal")
              ]),
              v.closable ? y("button", {
                type: "button",
                class: "gc-modal__close",
                "aria-label": "Close",
                onClick: () => S("close")
              }, [
                y("svg", { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round" }, [
                  y("line", { x1: 18, y1: 6, x2: 6, y2: 18 }),
                  y("line", { x1: 6, y1: 6, x2: 18, y2: 18 })
                ])
              ]) : null
            ]),
            // ── Scene
            y("div", { class: "gc-modal__scene" }, [
              v.state === "loading" ? y("div", { class: "gc-modal__skeleton", "aria-busy": "true" }) : v.captchaData ? [
                y(se, {
                  captchaData: v.captchaData,
                  ballX: v.currentBallX,
                  showSuccess: v.state === "success"
                }),
                v.state === "verifying" ? y("div", { class: "gc-modal__verifying", "aria-live": "polite" }, [
                  y("span", { class: "gc-spinner", "aria-hidden": "true" }),
                  y("span", {}, "Verifying…")
                ]) : null,
                v.state === "failed" ? y("div", { class: "gc-modal__verifying gc-modal__verifying--failed", "aria-live": "assertive" }, [
                  y("span", { class: "gc-icon-miss", "aria-hidden": "true" }, "❌"),
                  y("span", {}, "Missed! Retrying…")
                ]) : null
              ] : v.state === "failed" ? y("div", { class: "gc-modal__error-scene", role: "alert" }, [
                y("div", { class: "gc-modal__error-icon", "aria-hidden": "true" }, "⚽"),
                y("p", { class: "gc-modal__error-msg" }, v.errorMsg ?? "Verification failed. Please try again.")
              ]) : y("div", { class: "gc-modal__idle" }, [
                y("button", { type: "button", class: "gc-btn-primary", onClick: () => S("load") }, "Start Verification")
              ])
            ]),
            // ── Slider
            y("div", { class: "gc-modal__slider-wrap" }, [
              v.captchaData ? y(ie, {
                ballStartX: v.captchaData.ball_start_x,
                trackWidth: ((P = v.captchaData.canvas) == null ? void 0 : P.width) ?? 400,
                success: v.state === "success",
                disabled: v.state === "verifying" || v.state === "success",
                onDragStart: () => S("drag-start"),
                onDragMove: (C, x) => S("drag-move", C, x),
                onDragEnd: (C) => S("drag-end", C)
              }) : v.state === "loading" ? y("div", { class: "gc-modal__slider-skeleton" }) : y("div", { class: "gc-modal__error-actions" }, [
                y("button", { type: "button", class: "gc-btn-primary", onClick: () => S("retry") }, "↺ Try again")
              ])
            ]),
            // ── Hidden token (inline mode — appended to surrounding form)
            v.token ? y("input", { type: "hidden", name: v.fieldName, value: v.token }) : null
          ];
        };
      }
    });
    return (v, S) => n.value ? (I(), _e(ke, {
      key: 0,
      to: "body"
    }, [
      H(oe, { name: "gc-backdrop" }, {
        default: le(() => [
          o.value ? (I(), D("div", {
            key: 0,
            class: "gc-backdrop",
            "aria-modal": "true",
            role: "dialog",
            "aria-label": "Football goal CAPTCHA verification",
            onClick: Y(a, ["self"])
          }, [
            b("div", {
              class: q(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
              "data-state": w(c)
            }, [
              H(w(E), {
                state: w(c),
                "captcha-data": w(m),
                "current-ball-x": k.value,
                "error-msg": w(h),
                closable: i.closable,
                "field-name": i.fieldName,
                token: w(e),
                onClose: f,
                onLoad: w(p),
                onRetry: w(_),
                onDragStart: w(d),
                onDragMove: M,
                onDragEnd: X
              }, null, 8, ["state", "captcha-data", "current-ball-x", "error-msg", "closable", "field-name", "token", "onLoad", "onRetry", "onDragStart"])
            ], 10, Ne)
          ])) : re("", !0)
        ]),
        _: 1
      })
    ])) : (I(), D("div", {
      key: 1,
      class: q(["gc-modal", [`gc-modal--${i.theme}`, `gc-modal--${i.difficulty}`]]),
      "data-state": w(c)
    }, [
      H(w(E), {
        state: w(c),
        "captcha-data": w(m),
        "current-ball-x": k.value,
        "error-msg": w(h),
        closable: !1,
        "field-name": i.fieldName,
        token: w(e),
        onLoad: w(p),
        onRetry: w(_),
        onDragStart: w(d),
        onDragMove: M,
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
    return (s, l) => (I(), D("div", Oe, [
      l[0] || (l[0] = b("div", { class: "goal-captcha__success-icon" }, [
        b("svg", {
          viewBox: "0 0 52 52",
          class: "goal-captcha__checkmark",
          "aria-hidden": "true"
        }, [
          b("circle", {
            cx: "26",
            cy: "26",
            r: "25",
            fill: "none",
            class: "goal-captcha__checkmark-circle"
          }),
          b("path", {
            fill: "none",
            d: "M14 27l8 8 16-16",
            class: "goal-captcha__checkmark-check"
          })
        ])
      ], -1)),
      b("p", Ue, Me(i.message), 1)
    ]));
  }
}, qe = /* @__PURE__ */ V(He, [["__scopeId", "data-v-3f0157c9"]]), Fe = (i, s = {}) => {
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
      const t = s.querySelector('input[type="hidden"]'), n = {
        generateUrl: s.dataset.generateUrl,
        verifyUrl: s.dataset.verifyUrl,
        theme: s.dataset.theme ?? "football",
        difficulty: s.dataset.difficulty ?? "medium",
        fieldName: s.dataset.fieldName ?? "captcha_token"
      };
      i(ce, {
        ...n,
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
