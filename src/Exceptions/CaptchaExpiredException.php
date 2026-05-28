<?php

namespace Irabbi360\LaravelGoalCaptcha\Exceptions;

use RuntimeException;

final class CaptchaExpiredException extends RuntimeException
{
    public function __construct(string $captchaId)
    {
        parent::__construct("CAPTCHA [{$captchaId}] has expired or does not exist.");
    }
}
