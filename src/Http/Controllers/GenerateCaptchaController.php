<?php

namespace Irabbi360\LaravelGoalCaptcha\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Irabbi360\LaravelGoalCaptcha\Services\AssetManager;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaGenerator;

final class GenerateCaptchaController extends Controller
{
    public function __construct(
        private readonly CaptchaGenerator $generator,
        private readonly AssetManager     $assetManager,
    ) {}

    public function __invoke(): JsonResponse
    {
        $captcha = $this->generator->generate();
        $assets  = $this->assetManager->sceneAssets($captcha->scene);

        return response()->json([
            'captcha_id'   => $captcha->captchaId,
            'target_x'     => $captcha->targetX,
            'ball_start_x' => $captcha->ballStartX,
            'difficulty'   => $captcha->difficulty,
            'canvas'       => config('goal-captcha.canvas'),
            'scene'        => array_merge($captcha->scene, ['assets' => $assets]),
        ]);
    }
}
