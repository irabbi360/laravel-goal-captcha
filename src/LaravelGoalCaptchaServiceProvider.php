<?php

namespace Irabbi360\LaravelGoalCaptcha;

use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use Irabbi360\LaravelGoalCaptcha\Commands\LaravelGoalCaptchaCommand;

class LaravelGoalCaptchaServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package
            ->name('laravel-goal-captcha')
            ->hasConfigFile()
            ->hasViews()
            ->hasMigration('create_laravel_goal_captcha_table')
            ->hasCommand(LaravelGoalCaptchaCommand::class);
    }
}
