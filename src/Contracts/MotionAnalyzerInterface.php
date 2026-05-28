<?php

namespace Irabbi360\LaravelGoalCaptcha\Contracts;

interface MotionAnalyzerInterface
{
    /**
     * Analyse a movement track and return a human-likelihood score 0–100.
     * Score < 50 is considered robotic.
     *
     * @param  array<int, array{x: int|float, t: int}>  $track
     */
    public function analyse(array $track): int;

    /**
     * Returns true when the track passes all human-movement heuristics.
     *
     * @param  array<int, array{x: int|float, t: int}>  $track
     */
    public function isHuman(array $track, int $dragTimeMs): bool;
}
