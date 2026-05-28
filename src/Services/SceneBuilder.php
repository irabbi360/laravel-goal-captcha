<?php

namespace Irabbi360\LaravelGoalCaptcha\Services;

/**
 * Builds randomised scene metadata for each CAPTCHA challenge.
 *
 * The actual rendering happens on the client (Canvas), so this
 * class only produces a descriptor array that the Vue component
 * consumes to paint the scene.
 */
final class SceneBuilder
{
    public function __construct(private readonly array $config) {}

    /** @return array<string, mixed> */
    public function build(string $difficulty = 'medium'): array
    {
        $sceneConfig = $this->config['scene'];
        $weather     = $sceneConfig['randomize_weather']
            ? $this->randomItem($sceneConfig['weather'])
            : 'clear';

        return [
            'stadium'          => $this->randomItem($sceneConfig['stadiums']),
            'goalkeeper'       => $this->randomItem($sceneConfig['goalkeepers']),
            'weather'          => $weather,
            'goal_width_scale' => $this->goalWidthScale($difficulty),
            'keeper_offset_x'  => $this->keeperOffset($difficulty),
            'decoys'           => $this->buildDecoys($difficulty),
        ];
    }

    /** Scale the visual goal width to affect difficulty perception. */
    private function goalWidthScale(string $difficulty): float
    {
        return match ($difficulty) {
            'easy'  => 1.3,
            'hard'  => 0.7,
            default => 1.0,
        };
    }

    /** Goalkeeper X offset from center — creates a more dynamic scene. */
    private function keeperOffset(string $difficulty): int
    {
        $range = match ($difficulty) {
            'easy'  => 10,
            'hard'  => 30,
            default => 20,
        };

        return random_int(-$range, $range);
    }

    /**
     * Build decoy target rings (extra distraction circles).
     *
     * @return array<int, array{x: int, opacity: float}>
     */
    private function buildDecoys(string $difficulty): array
    {
        $count = match ($difficulty) {
            'easy'  => 0,
            'hard'  => 2,
            default => 1,
        };

        $decoys = [];
        $canvasWidth = $this->config['canvas']['width'];

        for ($i = 0; $i < $count; $i++) {
            $decoys[] = [
                'x'       => random_int((int) ($canvasWidth * 0.3), (int) ($canvasWidth * 0.8)),
                'opacity' => round(mt_rand(30, 60) / 100, 2),
            ];
        }

        return $decoys;
    }

    private function randomItem(array $items): string
    {
        return $items[array_rand($items)];
    }
}
