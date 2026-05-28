<?php

namespace Irabbi360\LaravelGoalCaptcha\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;

final class CaptchaGenerated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly CaptchaData $captcha,
    ) {}
}
