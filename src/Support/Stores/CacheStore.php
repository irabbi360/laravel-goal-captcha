<?php

namespace Irabbi360\LaravelGoalCaptcha\Support\Stores;

use Illuminate\Contracts\Cache\Repository as Cache;
use Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;

final class CacheStore implements CaptchaStoreInterface
{
    private const PREFIX = 'goal_captcha:';

    public function __construct(private readonly Cache $cache) {}

    public function put(string $id, CaptchaData $data, int $ttlSeconds): void
    {
        $this->cache->put(self::PREFIX . $id, $data->jsonSerialize(), $ttlSeconds);
    }

    public function get(string $id): ?CaptchaData
    {
        $raw = $this->cache->get(self::PREFIX . $id);

        return $raw !== null ? CaptchaData::fromArray($raw) : null;
    }

    public function delete(string $id): void
    {
        $this->cache->forget(self::PREFIX . $id);
    }

    public function incrementAttempts(string $id): int
    {
        $data = $this->get($id);

        if ($data === null) {
            return 0;
        }

        $updated = $data->withIncrementedAttempts();

        // Preserve remaining TTL by storing with the original expire time
        // (we use a fixed ttl here; a more precise impl could track remaining TTL)
        $this->cache->put(self::PREFIX . $id, $updated->jsonSerialize(), 120);

        return $updated->attempts;
    }
}
