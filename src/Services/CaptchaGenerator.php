<?php

namespace Irabbi360\LaravelGoalCaptcha\Services;

use Illuminate\Support\Str;
use Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;
use Irabbi360\LaravelGoalCaptcha\Events\CaptchaGenerated;

final class CaptchaGenerator
{
    public function __construct(
        private readonly SceneBuilder           $sceneBuilder,
        private readonly CaptchaStoreInterface  $store,
        private readonly array                  $config,
    ) {}

    public function generate(): CaptchaData
    {
        $difficulty  = $this->config['difficulty'] ?? 'medium';
        $tolerance   = $this->resolveTolerance($difficulty);
        $scene       = $this->sceneBuilder->build($difficulty);

        $ballRadius  = random_int(
            $this->config['ball']['min_radius'],
            $this->config['ball']['max_radius']
        );

        $ballStartX  = random_int(
            $this->config['ball']['start_x_min'],
            $this->config['ball']['start_x_max']
        );

        $targetX = random_int(
            $this->config['target']['min_x'],
            $this->config['target']['max_x']
        );

        $captcha = new CaptchaData(
            captchaId:  (string) Str::uuid(),
            targetX:    (float) $targetX,
            ballStartX: (float) $ballStartX,
            tolerance:  $tolerance,
            difficulty: $difficulty,
            scene:      array_merge($scene, ['ball_radius' => $ballRadius]),
            attempts:   0,
            createdAt:  time(),
        );

        $this->store->put(
            $captcha->captchaId,
            $captcha,
            $this->config['expire']
        );

        event(new CaptchaGenerated($captcha));

        return $captcha;
    }

    private function resolveTolerance(string $difficulty): int
    {
        $base = $this->config['tolerance'];

        return match ($difficulty) {
            'easy'  => (int) round($base * 1.8),
            'hard'  => (int) round($base * 0.5),
            default => $base,
        };
    }
}
