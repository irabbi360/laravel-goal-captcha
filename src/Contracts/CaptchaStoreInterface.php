<?php

namespace Irabbi360\LaravelGoalCaptcha\Contracts;

use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;

interface CaptchaStoreInterface
{
    public function put(string $id, CaptchaData $data, int $ttlSeconds): void;

    public function get(string $id): ?CaptchaData;

    public function delete(string $id): void;

    public function incrementAttempts(string $id): int;
}
