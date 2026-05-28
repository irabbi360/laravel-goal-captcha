<?php

namespace Irabbi360\LaravelGoalCaptcha\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Irabbi360\LaravelGoalCaptcha\DTO\VerificationData;
use Irabbi360\LaravelGoalCaptcha\Exceptions\CaptchaExpiredException;
use Irabbi360\LaravelGoalCaptcha\Exceptions\CaptchaVerificationException;
use Irabbi360\LaravelGoalCaptcha\Exceptions\TooManyAttemptsException;
use Irabbi360\LaravelGoalCaptcha\Http\Requests\VerifyCaptchaRequest;
use Irabbi360\LaravelGoalCaptcha\Services\CaptchaVerifier;
use Irabbi360\LaravelGoalCaptcha\Services\TokenManager;

final class VerifyCaptchaController extends Controller
{
    public function __construct(
        private readonly CaptchaVerifier $verifier,
        private readonly TokenManager    $tokenManager,
    ) {}

    public function __invoke(VerifyCaptchaRequest $request): JsonResponse
    {
        $data = VerificationData::fromArray($request->validated());

        try {
            $this->verifier->verify($data);
        } catch (CaptchaExpiredException $e) {
            return $this->failure('expired', $e->getMessage(), 422);
        } catch (TooManyAttemptsException $e) {
            return $this->failure('too_many_attempts', $e->getMessage(), 429);
        } catch (CaptchaVerificationException $e) {
            return $this->failure('verification_failed', $e->getMessage(), 422);
        }

        $token = $this->tokenManager->issue($data->captchaId);

        return response()->json([
            'success' => true,
            'token'   => $token,
            'message' => 'CAPTCHA verified.',
        ]);
    }

    private function failure(string $code, string $message, int $status): JsonResponse
    {
        return response()->json([
            'success' => false,
            'code'    => $code,
            'message' => $message,
        ], $status);
    }
}
