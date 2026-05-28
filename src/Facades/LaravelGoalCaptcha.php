<?php

namespace Irabbi360\LaravelGoalCaptcha\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Irabbi360\LaravelGoalCaptcha\LaravelGoalCaptcha
 */
class LaravelGoalCaptcha extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Irabbi360\LaravelGoalCaptcha\LaravelGoalCaptcha::class;
    }
}
