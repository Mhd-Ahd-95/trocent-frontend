<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class ChunkCache
{
    /**
     * Store large data in chunks.
     *
     * @param string $baseKey  The base cache key (example: "rate_sheets_customer_1")
     * @param array $data      The large dataset to store
     * @param int $chunkSize   How many items per chunk
     * @param int $ttlMinutes  Cache lifetime (in minutes)
     * @return int             Number of chunks stored
     */
    public function storeLargeData(string $baseKey, array $data, int $chunkSize = 1000, int $ttlMinutes = 60): int
    {
        $chunks = array_chunk($data, $chunkSize);

        foreach ($chunks as $index => $chunk) {
            $chunkKey = "{$baseKey}:chunk_{$index}";
            Cache::put($chunkKey, $chunk, now()->addMinutes($ttlMinutes));
        }

        $chunkCount = count($chunks);
        Cache::put("{$baseKey}:chunk_count", $chunkCount, now()->addMinutes($ttlMinutes));

        return $chunkCount;
    }

    /**
     * Retrieve large data from cache (rebuild from chunks).
     *
     * @param string $baseKey
     * @return array|null
     */
    public function getLargeData(string $baseKey): ?array
    {
        $chunkCount = Cache::get("{$baseKey}:chunk_count");

        if (!$chunkCount) {
            return null;
        }

        $data = [];
        for ($i = 0; $i < $chunkCount; $i++) {
            $chunkKey = "{$baseKey}:chunk_{$i}";
            $chunk = Cache::get($chunkKey);
            if ($chunk) {
                $data = array_merge($data, $chunk);
            }
        }

        return $data;
    }

    /**
     * Clear all chunks for a specific key.
     */
    public function clearLargeData(string $baseKey): void
    {
        $chunkCount = Cache::get("{$baseKey}:chunk_count");

        if ($chunkCount) {
            for ($i = 0; $i < $chunkCount; $i++) {
                Cache::forget("{$baseKey}:chunk_{$i}");
            }
            Cache::forget("{$baseKey}:chunk_count");
        }
    }
}
