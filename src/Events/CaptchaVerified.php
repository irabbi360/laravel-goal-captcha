<?php

namespace Irabbi360\LaravelGoalCaptcha\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;
use Irabbi360\LaravelGoalCaptcha\DTO\VerificationData;

final class CaptchaVerified
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly CaptchaData      $captcha,
        public readonly VerificationData $verification,
    ) {}
}
