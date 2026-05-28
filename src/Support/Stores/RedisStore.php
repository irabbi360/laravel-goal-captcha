<?php

namespace Irabbi360\LaravelGoalCaptcha\Support\Stores;

use Illuminate\Contracts\Redis\Connection as RedisConnection;
use Irabbi360\LaravelGoalCaptcha\Contracts\CaptchaStoreInterface;
use Irabbi360\LaravelGoalCaptcha\DTO\CaptchaData;

final class RedisStore implements CaptchaStoreInterface
{
    private const PREFIX = 'goal_captcha:';

    public function __construct(private readonly RedisConnection $redis) {}

    public function put(string $id, CaptchaData $data, int $ttlSeconds): void
    {
        $this->redis->setex(
            self::PREFIX . $id,
            $ttlSeconds,
            json_encode($data->jsonSerialize(), JSON_THROW_ON_ERROR)
        );
    }

    public function get(string $id): ?CaptchaData
    {
        $raw = $this->redis->get(self::PREFIX . $id);

        if ($raw === null) {
            return null;
        }

        $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);

        return CaptchaData::fromArray($decoded);
    }

    public function delete(string $id): void
    {
        $this->redis->del(self::PREFIX . $id);
    }

    public function incrementAttempts(string $id): int
    {
        $data = $this->get($id);

        if ($data === null) {
            return 0;
        }

        $ttl = max(1, (int) $this->redis->ttl(self::PREFIX . $id));

        $updated = $data->withIncrementedAttempts();
        $this->put($id, $updated, $ttl);

        return $updated->attempts;
    }
}
