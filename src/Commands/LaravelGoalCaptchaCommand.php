<?php

namespace Irabbi360\LaravelGoalCaptcha\Commands;

use Illuminate\Console\Command;

class LaravelGoalCaptchaCommand extends Command
{
    public $signature = 'goal-captcha:install
                        {--config : Publish config file}
                        {--assets : Publish frontend assets}
                        {--views : Publish Blade views}
                        {--migrations : Publish database migrations}';

    public $description = 'Install the GoalCaptcha package assets and configuration.';

    public function handle(): int
    {
        $this->info('Installing GoalCaptcha...');

        $tags = [];

        if ($this->option('config') || ! $this->anyOptionSelected()) {
            $tags[] = 'goal-captcha-config';
        }

        if ($this->option('assets') || ! $this->anyOptionSelected()) {
            $tags[] = 'goal-captcha-assets';
        }

        if ($this->option('views')) {
            $tags[] = 'goal-captcha-views';
        }

        if ($this->option('migrations')) {
            $tags[] = 'goal-captcha-migrations';
        }

        foreach ($tags as $tag) {
            $this->callSilently('vendor:publish', [
                '--tag'   => $tag,
                '--force' => false,
            ]);
            $this->line("  <fg=green;options=bold>✓</> Published: {$tag}");
        }

        $this->newLine();
        $this->info('GoalCaptcha installed successfully.');
        $this->line('  Add <comment><x-goal-captcha /></comment> to your Blade templates.');
        $this->line('  Or use the <comment><GoalCaptcha /></comment> Vue component.');

        return self::SUCCESS;
    }

    private function anyOptionSelected(): bool
    {
        return $this->option('config')
            || $this->option('assets')
            || $this->option('views')
            || $this->option('migrations');
    }
}

