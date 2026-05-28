<?php

namespace Irabbi360\LaravelGoalCaptcha\Facades;

use Illuminate\Support\Facades\Facade;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;

/**
 * @method static CaptchaData generate()
 * @method static string      issueToken(string $captchaId)
 * @method static bool        validateToken(string $token)
 *
 * @see \Irabbi360\LaravelGoalCaptcha\LaravelGoalCaptcha
 */
class GoalCaptcha extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'goal-captcha';
    }
}
