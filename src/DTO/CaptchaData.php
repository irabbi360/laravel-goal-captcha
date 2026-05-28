<?php

namespace Irabbi360\LaravelGoalCaptcha\DTO;

use JsonSerializable;

final class CaptchaData implements JsonSerializable
{
    public function __construct(
        public readonly string $captchaId,
        public readonly float  $targetX,
        public readonly float  $ballStartX,
        public readonly int    $tolerance,
        public readonly string $difficulty,
        public readonly array  $scene,
        public readonly int    $attempts = 0,
        public readonly int    $createdAt = 0,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            captchaId:  $data['captcha_id'],
            targetX:    (float) $data['target_x'],
            ballStartX: (float) $data['ball_start_x'],
            tolerance:  (int) $data['tolerance'],
            difficulty: $data['difficulty'],
            scene:      $data['scene'],
            attempts:   (int) ($data['attempts'] ?? 0),
            createdAt:  (int) ($data['created_at'] ?? time()),
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'captcha_id'   => $this->captchaId,
            'target_x'     => $this->targetX,
            'ball_start_x' => $this->ballStartX,
            'tolerance'    => $this->tolerance,
            'difficulty'   => $this->difficulty,
            'scene'        => $this->scene,
            'attempts'     => $this->attempts,
            'created_at'   => $this->createdAt,
        ];
    }

    /** Returns a new instance with incremented attempt count. */
    public function withIncrementedAttempts(): self
    {
        return new self(
            captchaId:  $this->captchaId,
            targetX:    $this->targetX,
            ballStartX: $this->ballStartX,
            tolerance:  $this->tolerance,
            difficulty: $this->difficulty,
            scene:      $this->scene,
            attempts:   $this->attempts + 1,
            createdAt:  $this->createdAt,
        );
    }
}
