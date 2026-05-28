<?php

namespace Irabbi360\LaravelGoalCaptcha;

use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface;
use Irabbi360\LaravelGoalCaptcha\Contracts\MotionAnalyzerInterface;
use Irabbi360\LaravelGoalCaptcha\Http\Middleware\ValidateCaptchaToken;
use Irabbi360\LaravelGoalCaptcha\Services\AssetManager;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaGenerator;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaVerifier;
use Irabbi360\LaravelGoalCaptcha\Services\MotionAnalyzer;
use Irabbi360\LaravelGoalCaptcha\Services\SceneBuilder;
use Irabbi360\LaravelGoalCaptcha\Services\TokenManager;
use Irabbi360\LaravelGoalCaptcha\Support\Stores\CacheStore;
use Irabbi360\LaravelGoalCaptcha\Support\Stores\RedisStore;

/**
 * GoalCaptcha Service Provider
 *
 * Mirrors the architecture of Laravel Sanctum / Telescope / Pulse:
 *  - Publishes config, assets, views, migrations
 *  - Registers routes under a configurable prefix
 *  - Binds all services to the container
 *  - Registers the <x-goal-captcha /> Blade component
 *  - Registers the `goal-captcha` middleware alias
 */
class LaravelGoalCaptchaServiceProvider extends ServiceProvider
{
    // ─── Boot ───────────────────────────────────────────────────────────────

    public function boot(): void
    {
        $this->registerPublishing();
        $this->registerRoutes();
        $this->registerViews();
        $this->registerBladeComponents();
        $this->registerMiddlewareAlias();
    }

    // ─── Register ───────────────────────────────────────────────────────────

    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/goal-captcha.php',
            'goal-captcha'
        );

        $this->registerStore();
        $this->registerServices();
    }

    // ─── Private helpers ────────────────────────────────────────────────────

    private function registerStore(): void
    {
        $this->app->singleton(CaptchaStoreInterface::class, function ($app) {
            $driver = config('goal-captcha.driver', 'cache');

            return match ($driver) {
                'redis'  => new RedisStore(
                    $app->make('redis')->connection(
                        config('goal-captcha.redis_connection', 'default')
                    )
                ),
                default  => new CacheStore(
                    $app->make(CacheRepository::class)
                ),
            };
        });
    }

    private function registerServices(): void
    {
        $this->app->singleton(MotionAnalyzerInterface::class, MotionAnalyzer::class);

        $this->app->singleton(SceneBuilder::class, function () {
            return new SceneBuilder(config('goal-captcha'));
        });

        $this->app->singleton(AssetManager::class, function () {
            return new AssetManager(config('goal-captcha'));
        });

        $this->app->singleton(CaptchaGenerator::class, function ($app) {
            return new CaptchaGenerator(
                $app->make(SceneBuilder::class),
                $app->make(CaptchaStoreInterface::class),
                config('goal-captcha'),
            );
        });

        $this->app->singleton(CaptchaVerifier::class, function ($app) {
            return new CaptchaVerifier(
                $app->make(CaptchaStoreInterface::class),
                $app->make(MotionAnalyzerInterface::class),
                config('goal-captcha'),
            );
        });

        $this->app->singleton(TokenManager::class, function ($app) {
            return new TokenManager($app->make(CacheRepository::class));
        });

        $this->app->singleton(LaravelGoalCaptcha::class, function ($app) {
            return new LaravelGoalCaptcha(
                $app->make(CaptchaGenerator::class),
                $app->make(TokenManager::class),
            );
        });

        // Facade accessor alias
        $this->app->alias(LaravelGoalCaptcha::class, 'goal-captcha');
    }

    private function registerRoutes(): void
    {
        if ($this->app->routesAreCached()) {
            return;
        }

        Route::group([], function () {
            $this->loadRoutesFrom(__DIR__ . '/routes/api.php');
        });
    }

    private function registerViews(): void
    {
        $this->loadViewsFrom(
            __DIR__ . '/../resources/views',
            'goal-captcha'
        );
    }

    private function registerBladeComponents(): void
    {
        Blade::componentNamespace(
            'Irabbi360\\LaravelGoalCaptcha\\View\\Components',
            'goal-captcha'
        );

        // Allow <x-goal-captcha /> as a short-hand alias
        Blade::component(
            'goal-captcha::components.goal-captcha',
            'goal-captcha'
        );
    }

    private function registerMiddlewareAlias(): void
    {
        /** @var \Illuminate\Routing\Router $router */
        $router = $this->app->make('router');
        $router->aliasMiddleware('goal-captcha', ValidateCaptchaToken::class);
    }

    private function registerPublishing(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        // Config
        $this->publishes([
            __DIR__ . '/../config/goal-captcha.php' => config_path('goal-captcha.php'),
        ], 'goal-captcha-config');

        // Views
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/goal-captcha'),
        ], 'goal-captcha-views');

        // Assets (images, compiled JS/CSS)
        $this->publishes([
            __DIR__ . '/../resources/dist' => public_path('vendor/goal-captcha'),
        ], 'goal-captcha-assets');

        // Migrations
        // $this->publishes([
        //     __DIR__ . '/../database/migrations' => database_path('migrations'),
        // ], 'goal-captcha-migrations');
    }
}

