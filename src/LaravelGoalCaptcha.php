<?php

namespace Irabbi360\LaravelGoalCaptcha;

use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaGenerator;
use Irabbi360\LaravelGoalCaptcha\Services\TokenManager;

/**
 * Main entry-point class — accessible via GoalCaptcha facade.
 *
 * Example:
 *   $captcha = GoalCaptcha::generate();
 *   GoalCaptcha::validateToken($request->input('captcha_token'));
 */
final class LaravelGoalCaptcha
{
    public function __construct(
        private readonly CaptchaGenerator $generator,
        private readonly TokenManager     $tokenManager,
    ) {}

    /** Generate a new CAPTCHA challenge. */
    public function generate(): CaptchaData
    {
        return $this->generator->generate();
    }

    /** Issue a one-time verification token for a solved captchaId. */
    public function issueToken(string $captchaId): string
    {
        return $this->tokenManager->issue($captchaId);
    }

    /**
     * Validate and consume a one-time verification token.
     * Returns true if the token is valid and hasn't been used.
     */
    public function validateToken(string $token): bool
    {
        return $this->tokenManager->consume($token);
    }
}

