<?php

namespace Irabbi360\LaravelGoalCaptcha\Exceptions;

use RuntimeException;

final class CaptchaVerificationException extends RuntimeException
{
    public function __construct(string $reason)
    {
        parent::__construct("CAPTCHA verification failed: {$reason}");
    }
}
