<template>
  <!-- ── Success state ──────────────────────────────────────────── -->
  <div v-if="success" class="gc-slider gc-slider--success" aria-label="Verification successful">
    <div class="gc-slider__success-check">
      <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="20" fill="#16a34a" />
        <path d="M13 22.5l6.5 6.5 11-13" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>

  <!-- ── Normal slider ──────────────────────────────────────────── -->
  <div
    v-else
    class="gc-slider"
    :class="{ 'gc-slider--disabled': disabled, 'gc-slider--dragging': isDragging }"
    ref="trackEl"
    role="slider"
    :aria-valuenow="Math.round(currentX)"
    :aria-valuemin="0"
    :aria-valuemax="trackWidth"
    aria-label="Drag the ball to score a goal"
    :tabindex="disabled ? -1 : 0"
    @keydown="onKeydown"
  >
    <!-- Filled progress (behind chevrons) -->
    <div class="gc-slider__fill" :style="fillStyle" />

    <!-- Left chevrons -->
    <div class="gc-slider__chevrons gc-slider__chevrons--left" aria-hidden="true">
      <span class="gc-slider__chev">❮</span>
      <span class="gc-slider__chev">❮</span>
      <span class="gc-slider__chev">❮</span>
    </div>

    <!-- Right chevrons -->
    <div class="gc-slider__chevrons gc-slider__chevrons--right" aria-hidden="true">
      <span class="gc-slider__chev">❯</span>
      <span class="gc-slider__chev">❯</span>
      <span class="gc-slider__chev">❯</span>
    </div>

    <!-- Draggable pill handle -->
    <div
      class="gc-slider__handle"
      :class="{ 'is-dragging': isDragging }"
      :style="{ left: handleLeft + 'px' }"
      @mousedown.prevent="startDrag"
      @touchstart.prevent="startDrag"
      aria-hidden="true"
    >
      <svg class="gc-slider__handle-icon" viewBox="0 0 32 18" fill="none" aria-hidden="true">
        <path d="M1 9h30M23 3l8 6-8 6M9 3L1 9l8 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const emit = defineEmits(['drag-start', 'drag-move', 'drag-end'])

const props = defineProps({
  ballStartX: { type: Number, default: 20 },
  trackWidth: { type: Number, default: 400 },
  handleSize: { type: Number, default: 72 }, // matching the 72px pill width style
  success:    { type: Boolean, default: false },
  disabled:   { type: Boolean, default: false },
})

const trackEl    = ref(null)
const currentX   = ref(props.trackWidth / 2) // initialize handle in the exact center
const isDragging = ref(false)

const HANDLE_HALF = computed(() => props.handleSize / 2)

const handleLeft = computed(() =>
  Math.max(0, Math.min(currentX.value - HANDLE_HALF.value, props.trackWidth - props.handleSize))
)

// Dynamic piecewise scaling mapping centered handle to the actual ball coordinates
const ballX = computed(() => {
  const center = props.trackWidth / 2
  const offset = currentX.value - center
  const maxOffset = center - props.handleSize / 2
  if (maxOffset <= 0) return props.ballStartX

  if (offset < 0) {
    const scaleLeft = props.ballStartX / maxOffset
    return Math.max(0, props.ballStartX + offset * scaleLeft)
  } else {
    const scaleRight = (props.trackWidth - props.ballStartX) / maxOffset
    return Math.min(props.trackWidth, props.ballStartX + offset * scaleRight)
  }
})

// Fill area extending from the center of the slider track to the current handle position
const fillStyle = computed(() => {
  const center = props.trackWidth / 2
  const x = currentX.value
  if (x < center) {
    return {
      left: `${x}px`,
      width: `${center - x}px`
    }
  } else {
    return {
      left: `${center}px`,
      width: `${x - center}px`
    }
  }
})

// ─── Drag handlers ────────────────────────────────────────────────────────

function startDrag(e) {
  if (props.disabled) return
  isDragging.value = true
  emit('drag-start')

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('touchmove', onMove, { passive: true })
  window.addEventListener('mouseup',   endDrag)
  window.addEventListener('touchend',  endDrag)
}

function onMove(e) {
  if (!isDragging.value) return
  const clientX   = e.touches ? e.touches[0].clientX : e.clientX
  const rect      = trackEl.value.getBoundingClientRect()
  const relativeX = Math.max(HANDLE_HALF.value, Math.min(clientX - rect.left, props.trackWidth - HANDLE_HALF.value))
  currentX.value  = relativeX
  emit('drag-move', ballX.value)
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('mouseup',   endDrag)
  window.removeEventListener('touchend',  endDrag)
  emit('drag-end', ballX.value)
}

// ─── Keyboard accessibility ───────────────────────────────────────────────

function onKeydown(e) {
  if (props.disabled) return
  const step = 5
  if (e.key === 'ArrowRight') {
    if (!isDragging.value) { isDragging.value = true; emit('drag-start') }
    currentX.value = Math.min(currentX.value + step, props.trackWidth - HANDLE_HALF.value)
    emit('drag-move', ballX.value)
  } else if (e.key === 'ArrowLeft') {
    if (!isDragging.value) { isDragging.value = true; emit('drag-start') }
    currentX.value = Math.max(currentX.value - step, HANDLE_HALF.value)
    emit('drag-move', ballX.value)
  } else if ((e.key === 'Enter' || e.key === ' ') && isDragging.value) {
    endDrag()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('mouseup',   endDrag)
  window.removeEventListener('touchend',  endDrag)
})
</script>

<style scoped>
/* ── Base track ───────────────────────────────────────────────────────────── */
.gc-slider {
  position:      relative;
  height:        54px;
  background:    #e5e7eb;
  border-radius: 12px;
  overflow:      hidden;
  cursor:        ew-resize;
  user-select:   none;
  outline:       none;
  display:       flex;
  align-items:   center;
}
.gc-slider:focus-visible {
  box-shadow: 0 0 0 3px rgba(37,99,235,.4);
}

/* ── Fill ─────────────────────────────────────────────────────────────────── */
.gc-slider__fill {
  position:       absolute;
  top:            0;
  height:         100%;
  background:     linear-gradient(90deg, #60a5fa, #3b82f6);
  pointer-events: none;
  transition:     width 0.04s linear, left 0.04s linear;
}

/* ── Chevrons ─────────────────────────────────────────────────────────────── */
.gc-slider__chevrons {
  position:    absolute;
  top:         50%;
  transform:   translateY(-50%);
  display:     flex;
  align-items: center;
  gap:         2px;
  pointer-events: none;
}
.gc-slider__chevrons--left  { left: 14px; }
.gc-slider__chevrons--right { right: 14px; }

.gc-slider__chev {
  display:     block;
  font-size:   20px;
  line-height: 1;
  color:       #9ca3af;
  font-weight: 600;
}
/* slight depth: chevrons closer to handle are slightly darker */
.gc-slider__chevrons--left  .gc-slider__chev:last-child,
.gc-slider__chevrons--right .gc-slider__chev:first-child {
  color: #6b7280;
}
.gc-slider__chevrons--left  .gc-slider__chev:first-child,
.gc-slider__chevrons--right .gc-slider__chev:last-child {
  color: #d1d5db;
}

/* ── Handle pill ──────────────────────────────────────────────────────────── */
.gc-slider__handle {
  position:        absolute;
  top:             50%;
  transform:       translateY(-50%);
  width:           72px;
  height:          38px;
  background:      #3b5998;
  border-radius:   24px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  box-shadow:      0 2px 8px rgba(0,0,0,.25), 0 1px 3px rgba(0,0,0,.15);
  cursor:          grab;
  transition:      box-shadow .15s, background .15s;
  z-index:         2;
}
.gc-slider__handle:hover,
.gc-slider__handle.is-dragging {
  background:  #2c4a8a;
  box-shadow:  0 4px 14px rgba(0,0,0,.3);
  cursor:      grabbing;
}
.gc-slider__handle-icon {
  width:  32px;
  height: 18px;
  color:  #ffffff;
  flex-shrink: 0;
}

/* ── Success state ────────────────────────────────────────────────────────── */
.gc-slider--success {
  background:  #dcfce7;
  cursor:      default;
  height:      54px;
  border-radius: 12px;
  overflow:    hidden;
  display:     flex;
  align-items: center;
  justify-content: center;
}
.gc-slider__success-check {
  width:  44px;
  height: 44px;
  animation: gc-check-pop .4s cubic-bezier(.175,.885,.32,1.275) both;
}
@keyframes gc-check-pop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* ── Disabled ─────────────────────────────────────────────────────────────── */
.gc-slider--disabled {
  opacity: .65;
  cursor:  not-allowed;
}
.gc-slider--disabled .gc-slider__handle {
  cursor: not-allowed;
}
</style>
