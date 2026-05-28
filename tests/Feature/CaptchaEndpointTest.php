<?php

use Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface;
use Irabbi360\LaravelGoalCaptcha\Tests\TestCase;

uses(TestCase::class);

// ─── Generate ─────────────────────────────────────────────────────────────────

it('generates a captcha via POST /generate', function () {
    $response = $this->postJson('/_goal_captcha/generate');

    $response->assertOk()
        ->assertJsonStructure([
            'captcha_id',
            'target_x',
            'ball_start_x',
            'difficulty',
            'canvas' => ['width', 'height'],
            'scene',
        ]);
});

it('returns valid numeric target_x in range', function () {
    $response = $this->postJson('/_goal_captcha/generate');
    $body     = $response->json();

    expect((float) $body['target_x'])->toBeGreaterThanOrEqual(200)->toBeLessThanOrEqual(340);
});

// ─── Verify ───────────────────────────────────────────────────────────────────

it('verifies a correct submission', function () {
    // First generate
    $gen     = $this->postJson('/_goal_captcha/generate')->json();
    $targetX = (float) $gen['target_x'];

    $response = $this->postJson('/_goal_captcha/verify', [
        'captcha_id'     => $gen['captcha_id'],
        'final_x'        => $targetX + 2,   // within tolerance
        'drag_time'      => 1200,
        'movement_track' => featureTrack($gen['ball_start_x'], $targetX),
    ]);

    $response->assertOk()
        ->assertJson(['success' => true])
        ->assertJsonStructure(['token']);
});

it('rejects misaligned submission', function () {
    $gen = $this->postJson('/_goal_captcha/generate')->json();

    $response = $this->postJson('/_goal_captcha/verify', [
        'captcha_id' => $gen['captcha_id'],
        'final_x'    => 10,   // way off
        'drag_time'  => 900,
    ]);

    $response->assertStatus(422)
        ->assertJson(['success' => false]);
});

it('rejects expired / unknown captcha_id', function () {
    $response = $this->postJson('/_goal_captcha/verify', [
        'captcha_id' => '00000000-0000-0000-0000-000000000000',
        'final_x'    => 250,
        'drag_time'  => 900,
    ]);

    $response->assertStatus(422)
        ->assertJsonPath('code', 'expired');
});

it('rejects too-fast drag (bot detection)', function () {
    $gen = $this->postJson('/_goal_captcha/generate')->json();

    $response = $this->postJson('/_goal_captcha/verify', [
        'captcha_id' => $gen['captcha_id'],
        'final_x'    => (float) $gen['target_x'],
        'drag_time'  => 10, // suspiciously fast
    ]);

    $response->assertStatus(422)
        ->assertJson(['success' => false]);
});

it('validates required fields', function () {
    $this->postJson('/_goal_captcha/verify', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['captcha_id', 'final_x', 'drag_time']);
});

it('validates captcha_id must be a UUID', function () {
    $this->postJson('/_goal_captcha/verify', [
        'captcha_id' => 'not-a-uuid',
        'final_x'    => 250,
        'drag_time'  => 900,
    ])->assertStatus(422)
      ->assertJsonValidationErrors(['captcha_id']);
});

// ─── Middleware alias ──────────────────────────────────────────────────────────

it('goal-captcha middleware blocks requests without token', function () {
    \Illuminate\Support\Facades\Route::middleware('goal-captcha')
        ->post('/test-protected', fn () => response()->json(['ok' => true]));

    $this->postJson('/test-protected')
        ->assertStatus(403)
        ->assertJsonPath('code', 'captcha_required');
});

it('goal-captcha middleware allows requests with valid token', function () {
    // Solve a captcha first
    $gen      = $this->postJson('/_goal_captcha/generate')->json();
    $targetX  = (float) $gen['target_x'];
    $verified = $this->postJson('/_goal_captcha/verify', [
        'captcha_id'     => $gen['captcha_id'],
        'final_x'        => $targetX,
        'drag_time'      => 1000,
        'movement_track' => featureTrack($gen['ball_start_x'], $targetX),
    ])->json();

    \Illuminate\Support\Facades\Route::middleware('goal-captcha')
        ->post('/test-protected', fn () => response()->json(['ok' => true]));

    $this->postJson('/test-protected', [
        'captcha_token' => $verified['token'],
    ])->assertOk()->assertJson(['ok' => true]);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function featureTrack(float $fromX, float $toX): array
{
    $track = [];
    $t     = 0;
    $steps = 25;

    for ($i = 0; $i <= $steps; $i++) {
        $t   += random_int(25, 70);
        $x    = $fromX + ($toX - $fromX) * ($i / $steps) + random_int(-2, 2);
        $track[] = ['x' => round($x, 1), 't' => $t];
    }

    return $track;
}
