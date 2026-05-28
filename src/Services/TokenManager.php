<?php

namespace Irabbi360\LaravelGoalCaptcha\Services;

use Illuminate\Support\Str;

/**
 * Manages one-time signed verification tokens returned to the
 * client after a successful CAPTCHA solve.
 *
 * These short-lived tokens can be attached to form submissions
 * and validated by the ValidateCaptchaToken middleware or the
 * GoalCaptcha::validateToken() helper.
 */
final class TokenManager
{
    private const PREFIX    = 'goal_captcha_verified:';
    private const TTL       = 300; // 5 minutes

    public function __construct(
        private readonly \Illuminate\Contracts\Cache\Repository $cache,
    ) {}

    /** Issue a one-time signed token after successful verification. */
    public function issue(string $captchaId): string
    {
        $token = Str::random(64);

        $this->cache->put(
            self::PREFIX . $token,
            ['captcha_id' => $captchaId, 'used' => false],
            self::TTL
        );

        return $token;
    }

    /**
     * Validate and consume a token (single-use).
     * Returns true only if the token exists and has not been used.
     */
    public function consume(string $token): bool
    {
        $key  = self::PREFIX . $token;
        $data = $this->cache->get($key);

        if ($data === null || $data['used'] === true) {
            return false;
        }

        $this->cache->forget($key);

        return true;
    }

    /** Check without consuming (idempotent). */
    public function isValid(string $token): bool
    {
        $data = $this->cache->get(self::PREFIX . $token);

        return $data !== null && $data['used'] === false;
    }
}
