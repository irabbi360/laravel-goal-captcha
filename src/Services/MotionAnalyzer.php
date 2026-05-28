<?php

namespace Irabbi360\LaravelGoalCaptcha\Services;

use Irabbi360\LaravelGoalCaptcha\Contracts\MotionAnalyzerInterface;

/**
 * Heuristic-based human movement analyser.
 *
 * Scoring rubric (0–100, higher = more human):
 *  - Variance in inter-frame speed       : +30
 *  - Non-linear acceleration (jerk)      : +25
 *  - Micro-corrections (direction change): +20
 *  - Reasonable total data-point count   : +15
 *  - Gap consistency (not perfectly even): +10
 */
final class MotionAnalyzer implements MotionAnalyzerInterface
{
    private const HUMAN_THRESHOLD = 28;

    // Milliseconds between points that looks "scripted" (too perfectly even)
    private const PERFECT_INTERVAL_TOLERANCE = 2;

    public function analyse(array $track): int
    {
        if (count($track) < 3) {
            return 0; // Too few points — likely scripted
        }

        $score = 0;
        $score += $this->scoreSpeedVariance($track);
        $score += $this->scoreAccelerationJerk($track);
        $score += $this->scoreMicroCorrections($track);
        $score += $this->scorePointDensity($track);
        $score += $this->scoreIntervalVariance($track);

        return min(100, max(0, $score));
    }

    public function isHuman(array $track, int $dragTimeMs): bool
    {
        if ($dragTimeMs < 100) {
            return false; // Instant movement — definitely scripted
        }

        return $this->analyse($track) >= self::HUMAN_THRESHOLD;
    }

    // ─── Scoring helpers ────────────────────────────────────────────────────

    /** Speed variance: humans don't move at constant speed. */
    private function scoreSpeedVariance(array $track): int
    {
        $speeds = $this->calculateSpeeds($track);

        if (count($speeds) < 2) {
            return 0;
        }

        $variance = $this->variance($speeds);

        return match (true) {
            $variance > 200  => 30,
            $variance > 50   => 22,
            $variance > 10   => 16,
            $variance > 2    => 10,
            default          => 4,   // smooth drag is still human
        };
    }

    /** Jerk (change in acceleration): natural movement has irregular jerk. */
    private function scoreAccelerationJerk(array $track): int
    {
        $speeds        = $this->calculateSpeeds($track);
        $accelerations = [];

        for ($i = 1; $i < count($speeds); $i++) {
            $accelerations[] = abs($speeds[$i] - $speeds[$i - 1]);
        }

        if (empty($accelerations)) {
            return 0;
        }

        $jerkVariance = $this->variance($accelerations);

        return match (true) {
            $jerkVariance > 100 => 25,
            $jerkVariance > 20  => 18,
            $jerkVariance > 5   => 12,
            $jerkVariance > 1   => 6,
            default             => 2,   // minimal jerk = smooth human drag
        };
    }

    /** Micro-corrections: humans sometimes go backward slightly. */
    private function scoreMicroCorrections(array $track): int
    {
        $reversals = 0;
        $prevDx    = null;

        for ($i = 1; $i < count($track); $i++) {
            $dx = $track[$i]['x'] - $track[$i - 1]['x'];

            if ($prevDx !== null && ($dx * $prevDx) < 0) {
                $reversals++;
            }

            $prevDx = $dx;
        }

        return match (true) {
            $reversals >= 3 => 20,
            $reversals >= 1 => 12,
            default         => 5,   // straight drag with no reversals is still human
        };
    }

    /** Reasonable data point count relative to drag distance and time. */
    private function scorePointDensity(array $track): int
    {
        $count = count($track);

        return match (true) {
            $count > 30  => 15,
            $count > 15  => 12,
            $count > 7   => 8,
            $count >= 3  => 4,
            default      => 0,
        };
    }

    /** Inter-frame interval consistency: perfectly even = robotic. */
    private function scoreIntervalVariance(array $track): int
    {
        $intervals = [];

        for ($i = 1; $i < count($track); $i++) {
            $dt = $track[$i]['t'] - $track[$i - 1]['t'];
            if ($dt > 0) {
                $intervals[] = $dt;
            }
        }

        if (count($intervals) < 2) {
            return 0;
        }

        $variance = $this->variance($intervals);

        // Near-zero variance means scripted perfect timing
        if ($variance <= self::PERFECT_INTERVAL_TOLERANCE) {
            return 0;
        }

        return match (true) {
            $variance > 100 => 10,
            $variance > 30  => 7,
            $variance > 5   => 4,
            default         => 1,
        };
    }

    // ─── Math utilities ─────────────────────────────────────────────────────

    /**
     * @param  array<int, array{x: int|float, t: int}>  $track
     * @return float[]
     */
    private function calculateSpeeds(array $track): array
    {
        $speeds = [];

        for ($i = 1; $i < count($track); $i++) {
            $dx = abs($track[$i]['x'] - $track[$i - 1]['x']);
            $dt = $track[$i]['t'] - $track[$i - 1]['t'];

            if ($dt > 0) {
                $speeds[] = $dx / $dt; // pixels per millisecond
            }
        }

        return $speeds;
    }

    /** @param float[] $values */
    private function variance(array $values): float
    {
        $n = count($values);

        if ($n < 2) {
            return 0.0;
        }

        $mean = array_sum($values) / $n;
        $sum  = 0.0;

        foreach ($values as $v) {
            $sum += ($v - $mean) ** 2;
        }

        return $sum / $n;
    }
}
