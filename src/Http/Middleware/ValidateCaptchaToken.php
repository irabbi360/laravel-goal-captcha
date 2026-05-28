<?php

namespace Irabbi360\LaravelGoalCaptcha\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Irabbi360\LaravelGoalCaptcha\Services\TokenManager;
use Symfony\Component\HttpFoundation\Response;

/**
 * Validates the one-time CAPTCHA verification token that the client
 * receives after solving the CAPTCHA, then attaches to the next form request.
 *
 * Usage — register in a route group or controller constructor:
 *   Route::middleware('goal-captcha')->post('/register', ...)
 *
 * The token must be sent as:
 *   - JSON field:  "captcha_token"
 *   - Form field:  "captcha_token"
 *   - Header:      X-Captcha-Token
 */
final class ValidateCaptchaToken
{
    public function __construct(private readonly TokenManager $tokenManager) {}

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->input('captcha_token')
            ?? $request->header('X-Captcha-Token');

        if (empty($token) || ! $this->tokenManager->consume((string) $token)) {
            return response()->json([
                'success' => false,
                'code'    => 'captcha_required',
                'message' => 'A valid CAPTCHA token is required.',
            ], 403);
        }

        return $next($request);
    }
}
