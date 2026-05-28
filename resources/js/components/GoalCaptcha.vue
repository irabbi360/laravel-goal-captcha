<template>
  <div
    class="goal-captcha"
    :class="[`goal-captcha--${theme}`, `goal-captcha--${difficulty}`]"
    :data-state="state"
    role="group"
    aria-label="Football goal CAPTCHA verification"
  >

    <!-- ── Loading skeleton ──────────────────────────────────────── -->
    <div v-if="state === 'loading'" class="goal-captcha__skeleton" aria-busy="true">
      <div class="goal-captcha__skeleton-canvas" />
      <div class="goal-captcha__skeleton-slider" />
      <p class="goal-captcha__skeleton-text">Loading challenge…</p>
    </div>

    <!-- ── Success state ─────────────────────────────────────────── -->
    <SuccessAnimation v-else-if="state === 'success'" />

    <!-- ── Failed state ──────────────────────────────────────────── -->
    <div v-else-if="state === 'failed'" class="goal-captcha__error" role="alert">
      <p class="goal-captcha__error-text">{{ errorMsg ?? 'Verification failed.' }}</p>
      <button
        type="button"
        class="goal-captcha__retry-btn"
        @click="retry"
        :disabled="state === 'loading'"
      >
        Try again
      </button>
    </div>

    <!-- ── Ready / Dragging / Verifying ──────────────────────────── -->
    <template v-else-if="captchaData">
      <!-- Canvas scene -->
      <GoalCanvas
        :captcha-data="captchaData"
        :ball-x="currentBallX"
      />

      <!-- Slider -->
      <GoalSlider
        :ball-start-x="captchaData.ball_start_x"
        :track-width="captchaData.canvas?.width ?? 400"
        @drag-start="onDragStart"
        @drag-move="onDragMove"
        @drag-end="onDragEnd"
      />

      <!-- Verifying overlay -->
      <div v-if="state === 'verifying'" class="goal-captcha__verifying" aria-live="polite">
        <span class="goal-captcha__spinner" aria-hidden="true" />
        <span>Verifying…</span>
      </div>
    </template>

    <!-- ── Idle (before first load) ──────────────────────────────── -->
    <div v-else class="goal-captcha__idle">
      <button type="button" class="goal-captcha__start-btn" @click="load">
        Start Verification
      </button>
    </div>

    <!-- One-time token injected into the parent form -->
    <input
      v-if="token"
      type="hidden"
      :name="fieldName"
      :value="token"
    >
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import GoalCanvas       from './GoalCanvas.vue'
import GoalSlider       from './GoalSlider.vue'
import SuccessAnimation from './SuccessAnimation.vue'
import { useGoalCaptcha } from '../composables/useGoalCaptcha.js'

// ─── Props ────────────────────────────────────────────────────────────────

const props = defineProps({
  /** POST URL of the generate endpoint */
  generateUrl: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.generateUrl ?? '/_goal_captcha/generate',
  },
  /** POST URL of the verify endpoint */
  verifyUrl: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.verifyUrl ?? '/_goal_captcha/verify',
  },
  /** Hidden input field name (attached to parent form) */
  fieldName: {
    type:    String,
    default: 'captcha_token',
  },
  /** Visual theme */
  theme: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.theme ?? 'football',
  },
  /** Difficulty (informational — server controls actual tolerance) */
  difficulty: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.difficulty ?? 'medium',
  },
  /** Auto-load on mount */
  autoLoad: {
    type:    Boolean,
    default: true,
  },
})

// ─── Emits ────────────────────────────────────────────────────────────────

const emit = defineEmits(['verified', 'failed', 'loaded'])

// ─── Composable ───────────────────────────────────────────────────────────

const {
  state,
  token,
  errorMsg,
  captchaData,
  load,
  onDragStart,
  onDragMove,
  onDragEnd,
  retry,
} = useGoalCaptcha(props.generateUrl, props.verifyUrl)

// ─── Canvas sync ─────────────────────────────────────────────────────────

const currentBallX = ref(null)

function handleDragMove(x) {
  currentBallX.value = x
  onDragMove(x)
}

function handleDragEnd(x) {
  onDragEnd(x)
}

// ─── Side-effects ─────────────────────────────────────────────────────────

watch(state, (s) => {
  if (s === 'success') emit('verified', token.value)
  if (s === 'failed')  emit('failed', errorMsg.value)
  if (s === 'ready')   emit('loaded', captchaData.value)
})

onMounted(() => {
  if (props.autoLoad) load()
})
</script>

<style>
/* ── Base ─────────────────────────────────────────────────────────────────── */
.goal-captcha {
  position:      relative;
  width:         100%;
  max-width:     400px;
  border-radius: 10px;
  overflow:      hidden;
  font-family:   system-ui, -apple-system, sans-serif;
  box-shadow:    0 4px 24px rgba(0,0,0,.35);
  background:    #16213e;
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
.goal-captcha__skeleton {
  padding: 1rem;
}
.goal-captcha__skeleton-canvas,
.goal-captcha__skeleton-slider {
  background:    linear-gradient(90deg, #1a1a2e 25%, #2a2a4e 50%, #1a1a2e 75%);
  background-size: 200% 100%;
  animation:     gc-shimmer 1.4s infinite;
  border-radius: 6px;
}
.goal-captcha__skeleton-canvas { height: 150px; margin-bottom: 8px; }
.goal-captcha__skeleton-slider { height: 48px; }
.goal-captcha__skeleton-text {
  text-align: center;
  color: rgba(255,255,255,.4);
  font-size: .85rem;
  margin: .5rem 0 0;
}

/* ── Error ────────────────────────────────────────────────────────────────── */
.goal-captcha__error {
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  gap:             .75rem;
  padding:         1.5rem;
  background:      #1a0a0a;
}
.goal-captcha__error-text {
  color:      #e74c3c;
  font-size:  .9rem;
  margin:     0;
  text-align: center;
}
.goal-captcha__retry-btn,
.goal-captcha__start-btn {
  padding:       .55rem 1.4rem;
  background:    #f1c40f;
  color:         #1a1a2e;
  border:        none;
  border-radius: 6px;
  font-size:     .9rem;
  font-weight:   700;
  cursor:        pointer;
  transition:    opacity .2s;
}
.goal-captcha__retry-btn:hover:not(:disabled),
.goal-captcha__start-btn:hover {
  opacity: .88;
}
.goal-captcha__retry-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}

/* ── Idle ─────────────────────────────────────────────────────────────────── */
.goal-captcha__idle {
  display:         flex;
  align-items:     center;
  justify-content: center;
  height:          198px;
  background:      #16213e;
}

/* ── Verifying overlay ────────────────────────────────────────────────────── */
.goal-captcha__verifying {
  position:        absolute;
  inset:           0;
  background:      rgba(22,33,62,.75);
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             .6rem;
  color:           #f1c40f;
  font-size:       .9rem;
  font-weight:     600;
  backdrop-filter: blur(2px);
}
.goal-captcha__spinner {
  width:         20px;
  height:        20px;
  border:        3px solid rgba(241,196,15,.25);
  border-top-color: #f1c40f;
  border-radius: 50%;
  animation:     gc-spin .7s linear infinite;
  display:       inline-block;
}

/* ── Keyframes ────────────────────────────────────────────────────────────── */
@keyframes gc-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes gc-spin {
  to { transform: rotate(360deg); }
}
</style>
