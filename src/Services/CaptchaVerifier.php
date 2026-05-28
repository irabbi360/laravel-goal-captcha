<?php

namespace Irabbi360\LaravelGoalCaptcha\Services;

use Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface;
use Irabbi360\LaravelGoalCaptcha\Contracts\MotionAnalyzerInterface;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;
use Irabbi360\LaravelGoalCaptcha\DTO\VerificationData;
use Irabbi360\LaravelGoalCaptcha\Events\CaptchaFailed;
use Irabbi360\LaravelGoalCaptcha\Events\CaptchaVerified;
use Irabbi360\LaravelGoalCaptcha\Exceptions\CaptchaExpiredException;
use Irabbi360\LaravelGoalCaptcha\Exceptions\CaptchaVerificationException;
use Irabbi360\LaravelGoalCaptcha\Exceptions\TooManyAttemptsException;

final class CaptchaVerifier
{
    public function __construct(
        private readonly CaptchaStoreInterface   $store,
        private readonly MotionAnalyzerInterface $motionAnalyzer,
        private readonly array                   $config,
    ) {}

    /**
     * Verify a captcha submission.
     *
     * @throws CaptchaExpiredException
     * @throws TooManyAttemptsException
     * @throws CaptchaVerificationException
     */
    public function verify(VerificationData $data): bool
    {
        $captcha = $this->store->get($data->captchaId);

        if ($captcha === null) {
            throw new CaptchaExpiredException($data->captchaId);
        }

        // Guard: too many attempts
        if ($captcha->attempts >= $this->config['max_attempts']) {
            $this->store->delete($data->captchaId);
            throw new TooManyAttemptsException($data->captchaId, $this->config['max_attempts']);
        }

        // Increment attempt count before further checks (replay-safe)
        $captcha = $captcha->withIncrementedAttempts();
        $this->store->put($data->captchaId, $captcha, $this->config['expire']);

        // 1. Speed check
        if ($data->dragTimeMs < $this->config['min_drag_time']) {
            $this->fail($data, $captcha, 'drag_too_fast');
        }

        // 2. Alignment check
        $delta = abs($data->finalX - $captcha->targetX);
        if ($delta > $captcha->tolerance) {
            $this->fail($data, $captcha, "misaligned_by_{$delta}px");
        }

        // 3. Motion / behavior analysis
        if (
            $this->config['enable_behavior_analysis'] &&
            ! empty($data->movementTrack) &&
            ! $this->motionAnalyzer->isHuman($data->movementTrack, $data->dragTimeMs)
        ) {
            $this->fail($data, $captcha, 'robotic_movement');
        }

        // Success — delete token (replay protection)
        $this->store->delete($data->captchaId);

        event(new CaptchaVerified($captcha, $data));

        return true;
    }

    /** Fires failure event and throws. */
    private function fail(VerificationData $data, CaptchaData $captcha, string $reason): never
    {
        event(new CaptchaFailed($data, $reason));

        throw new CaptchaVerificationException($reason);
    }
}
