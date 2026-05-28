<?php

namespace Irabbi360\LaravelGoalCaptcha\Exceptions;

use RuntimeException;

final class TooManyAttemptsException extends RuntimeException
{
    public function __construct(string $captchaId, int $max)
    {
        parent::__construct(
            "CAPTCHA [{$captchaId}] exceeded the maximum of {$max} verification attempts."
        );
    }
}
