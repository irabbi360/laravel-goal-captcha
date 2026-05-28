# ⚽ GoalCaptcha — Laravel Football Goal Slider CAPTCHA

[![Tests](https://github.com/irabbi360/laravel-goal-captcha/actions/workflows/tests.yml/badge.svg)](https://github.com/irabbi360/laravel-goal-captcha/actions)
[![Latest Version](https://img.shields.io/packagist/v/irabbi360/laravel-goal-captcha.svg)](https://packagist.org/packages/irabbi360/laravel-goal-captcha)
[![License](https://img.shields.io/packagist/l/irabbi360/laravel-goal-captcha.svg)](LICENSE.md)

A production-ready, anti-bot football-goal slider CAPTCHA for Laravel — built like **Sanctum / Telescope / Pulse**.

Users drag a football into the goal net. The backend verifies alignment, drag speed, and human motion patterns. Bots are rejected.

---

## Features

- ⚽ **Football goal canvas scene** — randomised stadium, goalkeeper, weather, decoys
- 🖱 **Drag slider interaction** — mouse + touch, fully accessible (keyboard)
- 🤖 **Anti-bot motion analysis** — speed variance, jerk, micro-corrections, interval consistency
- 🔒 **Replay attack protection** — token deleted after first use
- ⏱ **Auto-expiring challenges** — configurable TTL (default 2 min)
- 🎨 **Theme system** — football theme included, extendable
- 📱 **Mobile responsive** — works on touch devices
- 🧩 **Blade component** \`<x-goal-captcha />\`
- 🖼 **Vue 3 component** \`<GoalCaptcha />\`
- 🔌 **Inertia / SPA / Nuxt** compatible
- 🗃 **Pluggable storage** — Redis, Cache (array/file/database)
- 🎉 **Event system** — \`CaptchaGenerated\`, \`CaptchaVerified\`, \`CaptchaFailed\`

---

## Installation

```bash
composer require irabbi360/laravel-goal-captcha
```

Publish assets and config:

```bash
php artisan goal-captcha:install
```

---

## Quick Start — Blade

Add the component anywhere in your form:

```blade
<form method="POST" action="/login">
    @csrf
    <x-goal-captcha />
    <button type="submit">Login</button>
</form>
```

Protect the route with the middleware:

```php
Route::middleware('goal-captcha')->post('/login', LoginController::class);
```

---

## Quick Start — Vue 3 / Inertia

```vue
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import goalCaptcha from './vendor/irabbi360/laravel-goal-captcha/vite-plugin.js'

export default defineConfig({
    plugins: [
        laravel({ input: ['resources/js/app.js'] }),
        vue(),
        goalCaptcha(),   // ← adds the alias automatically
    ],
})
```

```vue
<script setup>
import { GoalCaptcha } from '@irabbi360/goal-captcha'
import '@irabbi360/goal-captcha/style'
const token = ref(null)
</script>

<template>
  <GoalCaptcha
    generate-url="/_goal_captcha/generate"
    verify-url="/_goal_captcha/verify"
    field-name="captcha_token"
    @verified="token = $event"
  />
</template>
```

---

## Vue Plugin

```js
import GoalCaptchaPlugin from '@irabbi360/goal-captcha'

createApp(App)
  .use(GoalCaptchaPlugin, {
    generateUrl: '/_goal_captcha/generate',
    verifyUrl:   '/_goal_captcha/verify',
    theme:       'football',
    difficulty:  'medium',
  })
  .mount('#app')
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/_goal_captcha/generate` | Returns a CAPTCHA challenge |
| POST | `/_goal_captcha/verify`   | Verifies submission, returns one-time token |

---

## Configuration

```php
return [
    'driver'                   => 'cache',    // 'redis' | 'cache'
    'expire'                   => 120,
    'tolerance'                => 12,
    'min_drag_time'            => 400,
    'max_attempts'             => 5,
    'theme'                    => 'football',
    'difficulty'               => 'medium',   // 'easy' | 'medium' | 'hard'
    'enable_behavior_analysis' => true,
];
```

---

## Events

```php
Event::listen(CaptchaVerified::class, fn($e) => logger('solved', ['id' => $e->captcha->captchaId]));
```

| Event | When |
|-------|------|
| `CaptchaGenerated` | Challenge created |
| `CaptchaVerified`  | Human confirmed |
| `CaptchaFailed`    | Verification rejected |

---

## Architecture

```
src/
├── GoalCaptchaServiceProvider.php
├── LaravelGoalCaptcha.php
├── Contracts/          CaptchaStoreInterface, MotionAnalyzerInterface
├── DTO/                CaptchaData, VerificationData
├── Events/             Generated, Verified, Failed
├── Exceptions/         Expired, VerificationFailed, TooManyAttempts
├── Facades/            GoalCaptcha
├── Http/               Controllers, Middleware, Requests
├── Services/           Generator, Verifier, MotionAnalyzer, SceneBuilder, TokenManager
└── Support/Stores/     CacheStore, RedisStore

resources/js/
├── components/         GoalCaptcha.vue, GoalCanvas.vue, GoalSlider.vue, SuccessAnimation.vue
├── composables/        useGoalCaptcha.js
├── canvas/             renderer.js, animation.js, physics.js
├── utils/              motionTracker.js
└── index.js            Vue plugin + Blade auto-mount
```

```
<link  rel="stylesheet" href="{{ asset('vendor/goal-captcha/goal-captcha.css') }}">
<script src="{{ asset('vendor/goal-captcha/goal-captcha.umd.js') }}" defer></script>
```

```
<form id="contact-form" method="POST" action="/contact">
    @csrf

    <input type="text" name="name" required>
    <input type="email" name="email" required>

    {{-- CAPTCHA mounts here; on solve it injects a hidden captcha_token input --}}
    <div id="goal-captcha"></div>

    <button type="submit" id="submit-btn" disabled>Submit</button>
</form>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const { initMount } = window.GoalCaptcha

    initMount('#goal-captcha', {
        fieldName: 'captcha_token',   // hidden input name injected into the form
    })

    // Enable submit only after CAPTCHA is solved
    document.getElementById('goal-captcha').addEventListener('gc:verified', () => {
        document.getElementById('submit-btn').disabled = false
    })
})
</script>
```

```php
<?php
// routes/web.php
use Illuminate\Support\Facades\Route;

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('goal-captcha');
```

Use in your form component:
```vue
<template>
  <form @submit.prevent="submitForm">
    <input v-model="form.name"  type="text"  required />
    <input v-model="form.email" type="email" required />

    <GoalCaptcha
      field-name="captcha_token"
      @verified="onCaptchaSolved"
      @failed="captchaToken = null"
    />

    <button type="submit" :disabled="!captchaToken">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const form         = ref({ name: '', email: '' })
const captchaToken = ref(null)

function onCaptchaSolved(token) {
  captchaToken.value = token
}

async function submitForm() {
  if (!captchaToken.value) return

  await fetch('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    body: JSON.stringify({
      ...form.value,
      captcha_token: captchaToken.value,  // ← send token with form data
    }),
  })
}
</script>
```

---

## Testing

```bash
composer test   # Pest (PHP)
npm run test    # Vitest (JS)
```

---

## License

MIT — [Fazle Rabbi](https://github.com/irabbi360)
