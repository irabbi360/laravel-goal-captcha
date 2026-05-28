<?php

use Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;
use Irabbi360\LaravelGoalCaptcha\DTO\VerificationData;
use Irabbi360\LaravelGoalCaptcha\Exceptions\CaptchaExpiredException;
use Irabbi360\LaravelGoalCaptcha\Exceptions\CaptchaVerificationException;
use Irabbi360\LaravelGoalCaptcha\Exceptions\TooManyAttemptsException;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaGenerator;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaVerifier;
use Irabbi360\LaravelGoalCaptcha\Tests\TestCase;

uses(TestCase::class);

function makeCaptchaData(float $targetX = 250.0, int $tolerance = 12): CaptchaData
{
    return new CaptchaData(
        captchaId:  (string) \Illuminate\Support\Str::uuid(),
        targetX:    $targetX,
        ballStartX: 20.0,
        tolerance:  $tolerance,
        difficulty: 'medium',
        scene:      ['stadium' => 'stadium_1', 'goalkeeper' => 'keeper_1', 'weather' => 'clear',
                     'goal_width_scale' => 1.0, 'keeper_offset_x' => 0, 'decoys' => [], 'ball_radius' => 16],
        attempts:   0,
        createdAt:  time(),
    );
}

function storeAndMakeVerification(
    CaptchaData      $captcha,
    float            $finalX,
    int              $dragTime = 800,
    array            $track    = [],
): VerificationData {
    app(CaptchaStoreInterface::class)->put($captcha->captchaId, $captcha, 120);

    return new VerificationData(
        captchaId:     $captcha->captchaId,
        finalX:        $finalX,
        dragTimeMs:    $dragTime,
        movementTrack: $track,
    );
}

// ─── Happy path ──────────────────────────────────────────────────────────────

it('passes when ball is on target within tolerance', function () {
    $captcha = makeCaptchaData(250.0, 12);
    $data    = storeAndMakeVerification($captcha, 252.0, 800, humanTrack());

    $result = app(CaptchaVerifier::class)->verify($data);

    expect($result)->toBeTrue();
});

// ─── Expiry ──────────────────────────────────────────────────────────────────

it('throws CaptchaExpiredException for unknown id', function () {
    $data = new VerificationData(
        captchaId:     'non-existent-uuid',
        finalX:        250,
        dragTimeMs:    800,
        movementTrack: [],
    );

    expect(fn () => app(CaptchaVerifier::class)->verify($data))
        ->toThrow(CaptchaExpiredException::class);
});

// ─── Speed ───────────────────────────────────────────────────────────────────

it('throws when drag is too fast (bot speed)', function () {
    $captcha = makeCaptchaData(250.0);
    $data    = storeAndMakeVerification($captcha, 250.0, 50); // 50ms < 400ms min

    expect(fn () => app(CaptchaVerifier::class)->verify($data))
        ->toThrow(CaptchaVerificationException::class);
});

// ─── Alignment ───────────────────────────────────────────────────────────────

it('throws when ball is misaligned beyond tolerance', function () {
    $captcha = makeCaptchaData(250.0, 12);
    $data    = storeAndMakeVerification($captcha, 150.0, 800); // 100px off

    expect(fn () => app(CaptchaVerifier::class)->verify($data))
        ->toThrow(CaptchaVerificationException::class);
});

// ─── Too many attempts ────────────────────────────────────────────────────────

it('throws TooManyAttemptsException after max attempts', function () {
    config(['goal-captcha.max_attempts' => 2]);
    $captcha = makeCaptchaData(250.0);

    // Store a captcha that has already hit max attempts
    $exhausted = new CaptchaData(
        captchaId:  $captcha->captchaId,
        targetX:    $captcha->targetX,
        ballStartX: $captcha->ballStartX,
        tolerance:  $captcha->tolerance,
        difficulty: $captcha->difficulty,
        scene:      $captcha->scene,
        attempts:   2,
        createdAt:  time(),
    );
    app(CaptchaStoreInterface::class)->put($exhausted->captchaId, $exhausted, 120);

    $data = new VerificationData($captcha->captchaId, 250.0, 800);

    expect(fn () => app(CaptchaVerifier::class)->verify($data))
        ->toThrow(TooManyAttemptsException::class);
});

// ─── Replay protection ────────────────────────────────────────────────────────

it('cannot be verified twice (replay protection)', function () {
    $captcha = makeCaptchaData(250.0, 12);
    $data    = storeAndMakeVerification($captcha, 252.0, 800, humanTrack());

    app(CaptchaVerifier::class)->verify($data);

    // Second attempt — token should be gone
    $data2 = new VerificationData($captcha->captchaId, 252.0, 800);

    expect(fn () => app(CaptchaVerifier::class)->verify($data2))
        ->toThrow(CaptchaExpiredException::class);
});

// ─── Events ──────────────────────────────────────────────────────────────────

it('fires CaptchaVerified on success', function () {
    \Illuminate\Support\Facades\Event::fake();

    $captcha = makeCaptchaData(250.0, 12);
    $data    = storeAndMakeVerification($captcha, 252.0, 800, humanTrack());

    app(CaptchaVerifier::class)->verify($data);

    \Illuminate\Support\Facades\Event::assertDispatched(
        \Irabbi360\LaravelGoalCaptcha\Events\CaptchaVerified::class
    );
});

it('fires CaptchaFailed on misalignment', function () {
    \Illuminate\Support\Facades\Event::fake();

    $captcha = makeCaptchaData(250.0, 12);
    $data    = storeAndMakeVerification($captcha, 10.0, 800);

    try {
        app(CaptchaVerifier::class)->verify($data);
    } catch (CaptchaVerificationException) {}

    \Illuminate\Support\Facades\Event::assertDispatched(
        \Irabbi360\LaravelGoalCaptcha\Events\CaptchaFailed::class
    );
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function humanTrack(): array
{
    $track = [];
    $t = 0;
    for ($x = 20; $x <= 252; $x += random_int(3, 8)) {
        $t += random_int(20, 60);
        $track[] = ['x' => $x, 't' => $t];
    }
    return $track;
}
