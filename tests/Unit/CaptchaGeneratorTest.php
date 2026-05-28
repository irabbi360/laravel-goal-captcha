<?php

use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaGenerator;
use Irabbi360\LaravelGoalCaptcha\Services\SceneBuilder;
use Irabbi360\LaravelGoalCaptcha\Support\Stores\CacheStore;
use Irabbi360\LaravelGoalCaptcha\Tests\TestCase;

uses(TestCase::class);

it('generates a captcha with a uuid', function () {
    $generator = app(CaptchaGenerator::class);

    $captcha = $generator->generate();

    expect($captcha)->toBeInstanceOf(CaptchaData::class)
        ->and($captcha->captchaId)->toMatch('/^[0-9a-f\-]{36}$/')
        ->and($captcha->targetX)->toBeGreaterThanOrEqual(200)
        ->and($captcha->targetX)->toBeLessThanOrEqual(340)
        ->and($captcha->ballStartX)->toBeGreaterThanOrEqual(10)
        ->and($captcha->ballStartX)->toBeLessThanOrEqual(40)
        ->and($captcha->attempts)->toBe(0);
});

it('stores the captcha in cache after generation', function () {
    $generator = app(CaptchaGenerator::class);
    $store     = app(\Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface::class);

    $captcha  = $generator->generate();
    $fromCache = $store->get($captcha->captchaId);

    expect($fromCache)->not->toBeNull()
        ->and($fromCache->captchaId)->toBe($captcha->captchaId);
});

it('applies easy tolerance multiplier', function () {
    config(['goal-captcha.difficulty' => 'easy', 'goal-captcha.tolerance' => 12]);

    $generator = app(CaptchaGenerator::class);
    $captcha   = $generator->generate();

    // Easy tolerance is base * 1.8 = 21
    expect($captcha->tolerance)->toBeGreaterThan(12);
});

it('applies hard tolerance multiplier', function () {
    config(['goal-captcha.difficulty' => 'hard', 'goal-captcha.tolerance' => 12]);

    $generator = app(CaptchaGenerator::class);
    $captcha   = $generator->generate();

    // Hard tolerance is base * 0.5 = 6
    expect($captcha->tolerance)->toBeLessThan(12);
});

it('fires CaptchaGenerated event', function () {
    \Illuminate\Support\Facades\Event::fake();

    app(CaptchaGenerator::class)->generate();

    \Illuminate\Support\Facades\Event::assertDispatched(
        \Irabbi360\LaravelGoalCaptcha\Events\CaptchaGenerated::class
    );
});

it('builds a scene with required keys', function () {
    $builder = app(SceneBuilder::class);
    $scene   = $builder->build('medium');

    expect($scene)->toHaveKeys(['stadium', 'goalkeeper', 'weather', 'goal_width_scale', 'keeper_offset_x', 'decoys']);
});
