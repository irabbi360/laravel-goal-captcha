<template>
  <div class="gc-canvas-wrap">
    <canvas
      ref="canvasEl"
      :width="width"
      :height="height"
      class="gc-canvas"
      aria-label="Football goal CAPTCHA scene"
      role="img"
    />

    <!-- ── Success overlay ──────────────────────────────────────── -->
    <Transition name="gc-success">
      <div v-if="showSuccess" class="gc-canvas__success-overlay" aria-live="polite">
        <!-- Confetti pieces -->
        <div class="gc-confetti" aria-hidden="true">
          <span v-for="i in 24" :key="i" class="gc-confetti__piece" :data-i="i" />
        </div>

        <!-- Badge -->
        <div class="gc-success-badge">
          <div class="gc-success-badge__ball">⚽</div>
          <div class="gc-success-badge__banner">
            <svg class="gc-success-badge__ribbon gc-success-badge__ribbon--left" viewBox="0 0 20 40" fill="none">
              <path d="M20 0 L0 20 L20 40 Z" fill="#15803d"/>
            </svg>
            <span class="gc-success-badge__text">SUCCESS</span>
            <svg class="gc-success-badge__ribbon gc-success-badge__ribbon--right" viewBox="0 0 20 40" fill="none">
              <path d="M0 0 L20 20 L0 40 Z" fill="#15803d"/>
            </svg>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { SceneRenderer } from '../canvas/renderer.js'
import { tween }        from '../canvas/animation.js'

const props = defineProps({
  captchaData: {
    type:     Object,
    required: true,
  },
  ballX: {
    type:    Number,
    default: null,
  },
  showSuccess: {
    type:    Boolean,
    default: false,
  },
})

const canvasEl = ref(null)
let renderer   = null
let stopBounce = null

const width  = props.captchaData?.canvas?.width  ?? 400
const height = props.captchaData?.canvas?.height ?? 220

onMounted(async () => {
  renderer = new SceneRenderer(canvasEl.value, props.captchaData)
  await renderer.preload()

  // Goalkeeper roams the full goal width, avoiding the target ring zone
  const cw       = width
  const targetX  = props.captchaData.target_x ?? (cw * 0.65)
  const goalL    = cw * 0.11          // inner left bound (clear of post)
  const goalR    = cw * 0.89          // inner right bound (clear of post)
  const avoidR   = targetX + 58       // exclusion zone around target ring
  const avoidL   = targetX - 58

  /** Pick a random keeper centre-X that is outside the target exclusion zone. */
  function pickKeeperX() {
    const zones = []
    if (avoidL - goalL > 30) zones.push([goalL, avoidL])
    if (goalR - avoidR > 30) zones.push([avoidR, goalR])
    if (!zones.length)       zones.push([goalL, goalR])  // fallback: full goal
    const [lo, hi] = zones[Math.floor(Math.random() * zones.length)]
    return lo + Math.random() * (hi - lo)
  }

  let cancelStep = null
  function doStep() {
    if (!renderer) return
    const nextX  = pickKeeperX()
    const fromX  = renderer.keeperBaseX + renderer.keeperOffsetX
    const dur    = 500 + Math.random() * 600    // 500–1100 ms slide
    const hold   = 700 + Math.random() * 1000   // 700–1700 ms pause
    cancelStep = tween(fromX, nextX, dur, (val) => {
      if (renderer) {
        renderer.keeperOffsetX = val - renderer.keeperBaseX
        renderer.draw()
      }
    }, () => {
      if (renderer) setTimeout(doStep, hold)
    })
  }
  doStep()

  stopBounce = () => { cancelStep?.() }
})

onBeforeUnmount(() => {
  stopBounce?.()
  renderer?.destroy()
})

// React to ball position changes during drag
watch(
  () => props.ballX,
  (x) => {
    if (renderer && x !== null) {
      renderer.setBallX(x)
    }
  }
)
</script>

<style scoped>
/* ── Wrapper ──────────────────────────────────────────────────────────────── */
.gc-canvas-wrap {
  position:    relative;
  line-height: 0;
  display:     block;
}

/* ── Canvas ───────────────────────────────────────────────────────────────── */
.gc-canvas {
  display:    block;
  width:      100%;
  max-width:  100%;
  user-select: none;
}

/* ── Success overlay ──────────────────────────────────────────────────────── */
.gc-canvas__success-overlay {
  position:        absolute;
  inset:           0;
  display:         flex;
  align-items:     center;
  justify-content: center;
  background:      rgba(15, 30, 60, .45);
  backdrop-filter: blur(1px);
  overflow:        hidden;
}

/* ── Transition ───────────────────────────────────────────────────────────── */
.gc-success-enter-active { transition: opacity .35s ease, transform .35s ease; }
.gc-success-leave-active { transition: opacity .2s ease; }
.gc-success-enter-from   { opacity: 0; transform: scale(1.06); }
.gc-success-leave-to     { opacity: 0; }

/* ── Badge ────────────────────────────────────────────────────────────────── */
.gc-success-badge {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            8px;
  animation:      gc-badge-in .55s cubic-bezier(.175,.885,.32,1.275) both;
}
.gc-success-badge__ball {
  font-size:   4rem;
  line-height: 1;
  filter:      drop-shadow(0 4px 12px rgba(0,0,0,.6));
  animation:   gc-ball-bounce .6s ease both;
}
.gc-success-badge__banner {
  display:      flex;
  align-items:  center;
  background:   #16a34a;
  border-radius: 4px;
  box-shadow:   0 3px 12px rgba(0,0,0,.4);
  overflow:     visible;
}
.gc-success-badge__ribbon {
  width:  20px;
  height: 40px;
  flex-shrink: 0;
}
.gc-success-badge__text {
  padding:        4px 16px;
  font-size:      1.55rem;
  font-weight:    900;
  letter-spacing: 3px;
  color:          #ffffff;
  text-shadow:    0 1px 4px rgba(0,0,0,.4);
  font-family:    system-ui, -apple-system, 'Segoe UI', sans-serif;
}

/* ── Confetti ─────────────────────────────────────────────────────────────── */
.gc-confetti {
  position:       absolute;
  inset:          0;
  pointer-events: none;
  overflow:       hidden;
}
.gc-confetti__piece {
  position:          absolute;
  width:             8px;
  height:            8px;
  border-radius:     2px;
  animation:         gc-fall 2.2s ease-in infinite;
  animation-fill-mode: both;
}
/* Distribute pieces across the width & stagger timing */
.gc-confetti__piece:nth-child(1)  { left:  4%; background: #f97316; animation-delay: 0s;    animation-duration: 2.1s; width: 6px;  height: 10px; }
.gc-confetti__piece:nth-child(2)  { left: 10%; background: #3b82f6; animation-delay: .15s;  animation-duration: 2.4s; }
.gc-confetti__piece:nth-child(3)  { left: 18%; background: #a855f7; animation-delay: .3s;   animation-duration: 2.0s; width: 10px; height: 6px; }
.gc-confetti__piece:nth-child(4)  { left: 25%; background: #eab308; animation-delay: .05s;  animation-duration: 2.3s; }
.gc-confetti__piece:nth-child(5)  { left: 33%; background: #ef4444; animation-delay: .4s;   animation-duration: 1.9s; border-radius: 50%; }
.gc-confetti__piece:nth-child(6)  { left: 42%; background: #22c55e; animation-delay: .2s;   animation-duration: 2.5s; }
.gc-confetti__piece:nth-child(7)  { left: 50%; background: #f97316; animation-delay: .6s;   animation-duration: 2.0s; width: 6px;  height: 12px; }
.gc-confetti__piece:nth-child(8)  { left: 57%; background: #3b82f6; animation-delay: .1s;   animation-duration: 2.2s; }
.gc-confetti__piece:nth-child(9)  { left: 65%; background: #a855f7; animation-delay: .5s;   animation-duration: 2.1s; width: 10px; height: 6px; }
.gc-confetti__piece:nth-child(10) { left: 72%; background: #eab308; animation-delay: .35s;  animation-duration: 2.4s; }
.gc-confetti__piece:nth-child(11) { left: 80%; background: #ef4444; animation-delay: .25s;  animation-duration: 1.9s; }
.gc-confetti__piece:nth-child(12) { left: 88%; background: #22c55e; animation-delay: .45s;  animation-duration: 2.3s; border-radius: 50%; }
.gc-confetti__piece:nth-child(13) { left:  7%; background: #eab308; animation-delay: .7s;   animation-duration: 2.0s; width: 12px; height: 6px; }
.gc-confetti__piece:nth-child(14) { left: 14%; background: #ef4444; animation-delay: .55s;  animation-duration: 2.2s; }
.gc-confetti__piece:nth-child(15) { left: 22%; background: #3b82f6; animation-delay: .8s;   animation-duration: 2.5s; }
.gc-confetti__piece:nth-child(16) { left: 30%; background: #a855f7; animation-delay: .65s;  animation-duration: 1.8s; }
.gc-confetti__piece:nth-child(17) { left: 38%; background: #f97316; animation-delay: .9s;   animation-duration: 2.1s; width: 6px;  height: 10px; }
.gc-confetti__piece:nth-child(18) { left: 47%; background: #22c55e; animation-delay: .75s;  animation-duration: 2.4s; width: 10px; height: 6px; }
.gc-confetti__piece:nth-child(19) { left: 54%; background: #eab308; animation-delay: 1.0s;  animation-duration: 2.2s; }
.gc-confetti__piece:nth-child(20) { left: 62%; background: #3b82f6; animation-delay: .85s;  animation-duration: 1.9s; border-radius: 50%; }
.gc-confetti__piece:nth-child(21) { left: 70%; background: #ef4444; animation-delay: 1.1s;  animation-duration: 2.3s; }
.gc-confetti__piece:nth-child(22) { left: 77%; background: #a855f7; animation-delay: .95s;  animation-duration: 2.0s; width: 12px; height: 6px; }
.gc-confetti__piece:nth-child(23) { left: 85%; background: #f97316; animation-delay: 1.2s;  animation-duration: 2.1s; }
.gc-confetti__piece:nth-child(24) { left: 93%; background: #22c55e; animation-delay: 1.05s; animation-duration: 2.4s; width: 6px;  height: 12px; }

@keyframes gc-fall {
  0%   { top: -10%; transform: rotate(0deg)   translateX(0); opacity: 1; }
  80%  { opacity: 1; }
  100% { top: 110%; transform: rotate(540deg) translateX(20px); opacity: 0; }
}
@keyframes gc-badge-in {
  from { opacity: 0; transform: scale(.7) translateY(20px); }
  to   { opacity: 1; transform: scale(1)  translateY(0); }
}
@keyframes gc-ball-bounce {
  0%   { transform: translateY(-30px) scale(.8); }
  60%  { transform: translateY(4px)   scale(1.05); }
  80%  { transform: translateY(-6px)  scale(.97); }
  100% { transform: translateY(0)     scale(1); }
}
</style>
