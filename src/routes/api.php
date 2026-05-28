<?php

use Illuminate\Support\Facades\Route;
use Irabbi360\LaravelGoalCaptcha\Http\Controllers\GenerateCaptchaController;
use Irabbi360\LaravelGoalCaptcha\Http\Controllers\VerifyCaptchaController;

Route::prefix(config('goal-captcha.route_prefix', '_goal_captcha'))
    ->middleware(config('goal-captcha.middleware', ['web']))
    ->name('goal-captcha.')
    ->group(function (): void {
        Route::post('/generate', GenerateCaptchaController::class)
            ->name('generate');

        Route::post('/verify', VerifyCaptchaController::class)
            ->name('verify');
    });
