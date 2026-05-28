<template>
  <div
    class="goal-captcha__slider-track"
    ref="trackEl"
    role="slider"
    :aria-valuenow="Math.round(currentX)"
    :aria-valuemin="0"
    :aria-valuemax="trackWidth"
    aria-label="Drag the ball to the goal"
    tabindex="0"
    @keydown="onKeydown"
  >
    <!-- Track fill -->
    <div
      class="goal-captcha__slider-fill"
      :style="{ width: `${fillPercent}%` }"
    />

    <!-- Draggable ball handle -->
    <div
      class="goal-captcha__slider-handle"
      :class="{ 'is-dragging': isDragging }"
      :style="{ left: `${handleLeft}px` }"
      @mousedown.prevent="startDrag"
      @touchstart.prevent="startDrag"
    >
      <span class="goal-captcha__slider-icon">⚽</span>
    </div>

    <!-- Hint text -->
    <span v-if="!isDragging" class="goal-captcha__slider-hint">
      Drag to score →
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const emit = defineEmits(['drag-start', 'drag-move', 'drag-end'])

const props = defineProps({
  ballStartX:  { type: Number, default: 20 },
  trackWidth:  { type: Number, default: 400 },
  handleSize:  { type: Number, default: 44 },
})

const trackEl   = ref(null)
const currentX  = ref(props.ballStartX)
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
  isDragging.value = true
  emit('drag-start')

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('touchmove', onMove, { passive: true })
  window.addEventListener('mouseup',   endDrag)
  window.addEventListener('touchend',  endDrag)
}

function onMove(e) {
  if (!isDragging.value) return

  const clientX  = e.touches ? e.touches[0].clientX : e.clientX
  const rect     = trackEl.value.getBoundingClientRect()
  const relativeX = Math.max(0, Math.min(clientX - rect.left, props.trackWidth))

  currentX.value = relativeX
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
  const step = 5

  if (e.key === 'ArrowRight') {
    if (!isDragging.value) { isDragging.value = true; emit('drag-start') }
    currentX.value = Math.min(currentX.value + step, props.trackWidth)
    emit('drag-move', currentX.value)
  } else if (e.key === 'ArrowLeft') {
    currentX.value = Math.max(currentX.value - step, 0)
    emit('drag-move', currentX.value)
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (isDragging.value) endDrag()
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
.goal-captcha__slider-track {
  position:      relative;
  height:        48px;
  background:    #1a1a2e;
  border-radius: 0 0 8px 8px;
  overflow:      hidden;
  cursor:        ew-resize;
  user-select:   none;
  outline:       none;
}

.goal-captcha__slider-track:focus-visible {
  box-shadow: 0 0 0 2px #f1c40f;
}

.goal-captcha__slider-fill {
  position:       absolute;
  top:            0;
  left:           0;
  height:         100%;
  background:     linear-gradient(90deg, rgba(39,174,96,.5), rgba(241,196,15,.4));
  pointer-events: none;
  transition:     width 0.05s linear;
}

.goal-captcha__slider-handle {
  position:        absolute;
  top:             50%;
  transform:       translateY(-50%);
  width:           44px;
  height:          44px;
  background:      #f1c40f;
  border-radius:   50%;
  display:         flex;
  align-items:     center;
  justify-content: center;
  cursor:          grab;
  transition:      box-shadow 0.15s, transform 0.15s;
  z-index:         2;
}

.goal-captcha__slider-handle:hover,
.goal-captcha__slider-handle.is-dragging {
  box-shadow: 0 0 0 4px rgba(241,196,15,.4);
  cursor:     grabbing;
  transform:  translateY(-50%) scale(1.12);
}

.goal-captcha__slider-icon {
  font-size:   22px;
  line-height: 1;
}

.goal-captcha__slider-hint {
  position:     absolute;
  top:          50%;
  left:         50%;
  transform:    translate(-50%, -50%);
  color:        rgba(255,255,255,.55);
  font-size:    13px;
  pointer-events: none;
  white-space:  nowrap;
}
</style>
