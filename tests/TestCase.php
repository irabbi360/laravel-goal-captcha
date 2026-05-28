<?php

namespace Irabbi360\LaravelGoalCaptcha\Tests;

use Irabbi360\LaravelGoalCaptcha\GoalCaptchaServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app): array
    {
        return [GoalCaptchaServiceProvider::class];
    }

    protected function getPackageAliases($app): array
    {
        return [
            'GoalCaptcha' => \Irabbi360\LaravelGoalCaptcha\Facades\GoalCaptcha::class,
        ];
    }

    protected function defineEnvironment($app): void
    {
        $app['config']->set('goal-captcha.driver',    'cache');
        $app['config']->set('goal-captcha.expire',    120);
        $app['config']->set('goal-captcha.tolerance', 12);
        $app['config']->set('goal-captcha.min_drag_time', 400);
        $app['config']->set('goal-captcha.max_attempts',  5);
        $app['config']->set('goal-captcha.difficulty', 'medium');
        $app['config']->set('goal-captcha.enable_behavior_analysis', true);
        $app['config']->set('goal-captcha.store_motion_data', true);
        $app['config']->set('goal-captcha.ball', [
            'min_radius'  => 14,
            'max_radius'  => 20,
            'start_x_min' => 10,
            'start_x_max' => 40,
        ]);
        $app['config']->set('goal-captcha.target', [
            'min_x' => 200,
            'max_x' => 340,
        ]);
        $app['config']->set('goal-captcha.canvas', [
            'width'  => 400,
            'height' => 200,
        ]);
        $app['config']->set('goal-captcha.scene', [
            'stadiums'          => ['stadium_1'],
            'goalkeepers'       => ['keeper_1'],
            'weather'           => ['clear'],
            'randomize_weather' => false,
        ]);
        $app['config']->set('goal-captcha.route_prefix', '_goal_captcha');
        $app['config']->set('goal-captcha.middleware',   ['web']);
        $app['config']->set('goal-captcha.theme',        'football');
        $app['config']->set('cache.default', 'array');
    }
}
