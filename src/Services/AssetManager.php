<?php

namespace Irabbi360\LaravelGoalCaptcha\Services;

/**
 * Resolves asset paths for themes and scene images.
 *
 * Assets are published to:  public/vendor/goal-captcha/{theme}/
 */
final class AssetManager
{
    public function __construct(private readonly array $config) {}

    /** Public URL for a given theme asset file. */
    public function url(string $file, ?string $theme = null): string
    {
        $theme ??= $this->config['theme'];

        return asset("vendor/goal-captcha/{$theme}/{$file}");
    }

    /** Absolute filesystem path to published assets. */
    public function path(string $file, ?string $theme = null): string
    {
        $theme ??= $this->config['theme'];

        return public_path("vendor/goal-captcha/{$theme}/{$file}");
    }

    /** Returns all image URLs for a given scene descriptor. */
    public function sceneAssets(array $scene): array
    {
        return [
            'stadium'    => $this->url("{$scene['stadium']}.jpg"),
            'goalkeeper' => $this->url("{$scene['goalkeeper']}.png"),
            'ball'       => $this->url('ball.png'),
            'goal_post'  => $this->url('goal_post.png'),
        ];
    }
}
