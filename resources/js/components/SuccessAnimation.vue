<template>
  <div class="goal-captcha__success" role="status" aria-live="polite">
    <div class="goal-captcha__success-icon">
      <svg viewBox="0 0 52 52" class="goal-captcha__checkmark" aria-hidden="true">
        <circle cx="26" cy="26" r="25" fill="none" class="goal-captcha__checkmark-circle" />
        <path fill="none" d="M14 27l8 8 16-16" class="goal-captcha__checkmark-check" />
      </svg>
    </div>
    <p class="goal-captcha__success-text">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type:    String,
    default: 'GOAL! Human verified ✓',
  },
})
</script>

<style scoped>
.goal-captcha__success {
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  justify-content: center;
  padding:         1.5rem;
  background:      linear-gradient(135deg, #0f3460, #16213e);
  border-radius:   8px;
  gap:             0.75rem;
  animation:       gc-fade-in 0.4s ease;
}

.goal-captcha__success-icon {
  width:  64px;
  height: 64px;
}

.goal-captcha__checkmark {
  width:  100%;
  height: 100%;
}

.goal-captcha__checkmark-circle {
  stroke:           #27ae60;
  stroke-width:     2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation:        gc-stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.goal-captcha__checkmark-check {
  stroke:           #27ae60;
  stroke-width:     3;
  stroke-linecap:   round;
  stroke-linejoin:  round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation:        gc-stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

.goal-captcha__success-text {
  color:       #2ecc71;
  font-size:   1rem;
  font-weight: 600;
  margin:      0;
  text-align:  center;
}

@keyframes gc-stroke {
  100% { stroke-dashoffset: 0; }
}

@keyframes gc-fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
