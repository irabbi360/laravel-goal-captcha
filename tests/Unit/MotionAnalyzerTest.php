<?php

use Irabbi360\LaravelGoalCaptcha\Services\MotionAnalyzer;
use Irabbi360\LaravelGoalCaptcha\Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    $this->analyzer = new MotionAnalyzer();
});

// ─── isHuman ─────────────────────────────────────────────────────────────────

it('flags instant movement as robotic', function () {
    expect($this->analyzer->isHuman(naturalTrack(), 50))->toBeFalse();
});

it('flags too-few data points as robotic', function () {
    $track = [['x' => 0, 't' => 0], ['x' => 250, 't' => 900]];
    expect($this->analyzer->isHuman($track, 900))->toBeFalse();
});

it('accepts natural human movement', function () {
    expect($this->analyzer->isHuman(naturalTrack(), 1200))->toBeTrue();
});

it('rejects perfectly constant-speed movement', function () {
    $track = [];
    for ($i = 0; $i <= 20; $i++) {
        $track[] = ['x' => $i * 10, 't' => $i * 60]; // perfectly even
    }
    // Perfectly linear — low score
    $score = $this->analyzer->analyse($track);
    expect($score)->toBeLessThan(50);
});

it('accepts movement with micro-corrections', function () {
    $track = naturalTrackWithCorrections();
    expect($this->analyzer->isHuman($track, 1400))->toBeTrue();
});

// ─── analyse score ────────────────────────────────────────────────────────────

it('returns score 0 for empty track', function () {
    expect($this->analyzer->analyse([]))->toBe(0);
});

it('returns score 0 for two-point track', function () {
    expect($this->analyzer->analyse([
        ['x' => 0,   't' => 0],
        ['x' => 250, 't' => 900],
    ]))->toBe(0);
});

it('returns score between 0 and 100', function () {
    $score = $this->analyzer->analyse(naturalTrack());
    expect($score)->toBeGreaterThanOrEqual(0)->toBeLessThanOrEqual(100);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function naturalTrack(): array
{
    $track = [];
    $t     = 0;
    $x     = 10.0;

    for ($i = 0; $i < 30; $i++) {
        $dt     = random_int(15, 80);
        $dx     = random_int(3, 15) * (mt_rand(0, 10) > 1 ? 1 : -0.5);
        $t     += $dt;
        $x      = max(0.0, $x + $dx);
        $track[] = ['x' => $x, 't' => $t];
    }

    return $track;
}

function naturalTrackWithCorrections(): array
{
    $track = [];
    $t     = 0;

    for ($i = 0; $i < 25; $i++) {
        $t += random_int(20, 70);
        // Every 5th point reverses slightly (micro-correction)
        $dx     = ($i % 5 === 4) ? -3 : random_int(5, 14);
        $track[] = ['x' => array_sum(array_column($track, 'x')) / max(1, count($track)) + $dx, 't' => $t];
    }

    return $track;
}
