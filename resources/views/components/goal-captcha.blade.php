{{--
 * GoalCaptcha Blade Component
 *
 * Usage:
 *   <x-goal-captcha />
 *   <x-goal-captcha :action="route('login')" />
 *   <x-goal-captcha theme="football" difficulty="hard" />
 *
 * Emits a hidden input named "captcha_token" on success.
--}}

@props([
    'theme'      => config('goal-captcha.theme', 'football'),
    'difficulty' => config('goal-captcha.difficulty', 'medium'),
    'name'       => 'captcha_token',
    'locale'     => app()->getLocale(),
])

<div
    class="goal-captcha-wrapper"
    data-theme="{{ $theme }}"
    data-difficulty="{{ $difficulty }}"
    data-generate-url="{{ route('goal-captcha.generate') }}"
    data-verify-url="{{ route('goal-captcha.verify') }}"
    data-field-name="{{ $name }}"
    data-locale="{{ $locale }}"
    {{ $attributes->except(['theme', 'difficulty', 'name', 'locale']) }}
>
    {{-- Vue mounts here when JS is available --}}
    <div id="goal-captcha-app" style="min-height:200px;">
        {{-- No-JS / SSR fallback message --}}
        <noscript>
            <p style="text-align:center; color:#e74c3c; padding:1rem;">
                Please enable JavaScript to complete the CAPTCHA verification.
            </p>
        </noscript>
    </div>

    {{-- One-time verification token returned after successful solve --}}
    <input type="hidden" name="{{ $name }}" id="goal-captcha-token" value="">
</div>

{{-- Load the compiled package assets --}}
@once
    @push('styles')
        <link rel="stylesheet" href="{{ asset('vendor/goal-captcha/goal-captcha.css') }}">
    @endpush

    @push('scripts')
        <script src="{{ asset('vendor/goal-captcha/goal-captcha.js') }}" defer></script>
    @endpush
@endonce
