<?php

namespace Irabbi360\LaravelGoalCaptcha\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Irabbi360\LaravelGoalCaptcha\DTO\VerificationData;

final class CaptchaFailed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly VerificationData $verification,
        public readonly string           $reason,
    ) {}
}
