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
    <div class="gc-slider__fill" :style="{ width: fillPercent + '%' }" />

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
  handleSize: { type: Number, default: 52 },
  success:    { type: Boolean, default: false },
  disabled:   { type: Boolean, default: false },
})

const trackEl    = ref(null)
const currentX   = ref(props.ballStartX)
const isDragging = ref(false)

const HANDLE_HALF = computed(() => props.handleSize / 2)

const handleLeft = computed(() =>
  Math.max(0, Math.min(currentX.value - HANDLE_HALF.value, props.trackWidth - props.handleSize))
)

const fillPercent = computed(() =>
  Math.round((currentX.value / props.trackWidth) * 100)
)

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
  const relativeX = Math.max(0, Math.min(clientX - rect.left, props.trackWidth))
  currentX.value  = relativeX
  emit('drag-move', relativeX)
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('mouseup',   endDrag)
  window.removeEventListener('touchend',  endDrag)
  emit('drag-end', currentX.value)
}

// ─── Keyboard accessibility ───────────────────────────────────────────────

function onKeydown(e) {
  if (props.disabled) return
  const step = 5
  if (e.key === 'ArrowRight') {
    if (!isDragging.value) { isDragging.value = true; emit('drag-start') }
    currentX.value = Math.min(currentX.value + step, props.trackWidth)
    emit('drag-move', currentX.value)
  } else if (e.key === 'ArrowLeft') {
    currentX.value = Math.max(currentX.value - step, 0)
    emit('drag-move', currentX.value)
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
  left:           0;
  height:         100%;
  background:     linear-gradient(90deg, rgba(37,99,235,.15), rgba(37,99,235,.08));
  pointer-events: none;
  transition:     width 0.04s linear;
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
