<?php

namespace Irabbi360\LaravelGoalCaptcha\Commands;

use Illuminate\Console\Command;

class LaravelGoalCaptchaCommand extends Command
{
    public $signature = 'laravel-goal-captcha';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
