<template>
  <canvas
    ref="canvasEl"
    :width="width"
    :height="height"
    class="goal-captcha__canvas"
    aria-label="Football goal CAPTCHA scene"
    role="img"
  />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { SceneRenderer } from '../canvas/renderer.js'
import { bounce }        from '../canvas/animation.js'

const props = defineProps({
  captchaData: {
    type:     Object,
    required: true,
  },
  ballX: {
    type:    Number,
    default: null,
  },
})

const canvasEl = ref(null)
let renderer   = null
let stopBounce = null

const width  = props.captchaData?.canvas?.width  ?? 400
const height = props.captchaData?.canvas?.height ?? 200

onMounted(async () => {
  renderer = new SceneRenderer(canvasEl.value, props.captchaData)
  await renderer.preload()

  // Animate goalkeeper idle bounce
  stopBounce = bounce(
    (props.captchaData.scene?.keeper_offset_x ?? 0) - 8,
    (props.captchaData.scene?.keeper_offset_x ?? 0) + 8,
    2400,
    (offset) => {
      if (renderer) {
        renderer.data.scene.keeper_offset_x = offset
        renderer.draw()
      }
    }
  )
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
.goal-captcha__canvas {
  display:       block;
  border-radius: 8px 8px 0 0;
  width:         100%;
  max-width:     100%;
  user-select:   none;
}
</style>
