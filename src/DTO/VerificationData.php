<?php

namespace Irabbi360\LaravelGoalCaptcha\DTO;

final class VerificationData
{
    /**
     * @param  array<int, array{x: int|float, t: int}>  $movementTrack
     */
    public function __construct(
        public readonly string $captchaId,
        public readonly float  $finalX,
        public readonly int    $dragTimeMs,
        public readonly array  $movementTrack = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            captchaId:     $data['captcha_id'],
            finalX:        (float) $data['final_x'],
            dragTimeMs:    (int) $data['drag_time'],
            movementTrack: $data['movement_track'] ?? [],
        );
    }
}
