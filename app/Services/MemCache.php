<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class MemCache
{
    protected int $cache_time;

    public function __construct(int $dct = 3600)
    {
        $this->cache_time = $dct;
    }

    public function put_in_cache(string $key, $items)
    {
        if (is_array($items)) {
            $items = collect($items);
        }
        Cache::put($key, $items, $this->cache_time);
    }

    public function get_cache(string $key): Collection
    {
        $items = Cache::get($key, collect());
        return $items instanceof Collection ? $items : collect($items);
    }

    public function save_entity(string $key, $entity)
    {
        $items = $this->get_cache($key)->push($entity)->unique('id');
        $this->put_in_cache($key, $items);
    }

    public function save_entities(string $key, $entities)
    {
        $items = $this->get_cache($key)->concat($entities)->unique('id');
        $this->put_in_cache($key, $items);
    }

    public function get_entity_id(string $key, int $id, string $model, array $relations = [])
    {
        $entity = $this->get_cache($key)->firstWhere('id', $id);
        if (!$entity) {
            $query = $model::query();
            if (!empty($relations)) {
                $query->with($relations);
            }
            $entity = $query->find($id);
            if ($entity) {
                $this->save_entity($key, $entity);
            }
        }

        return $entity;
    }

    public function get_entities(string $key, string $model, array $rel = [])
    {
        $items = $this->get_cache($key);
        if ($items->isEmpty()) {
            $query = $model::query();
            if (!empty($rel)) {
                $query->with($rel);
            }
            $items = $query->get();
            $this->put_in_cache($key, $items);
        }

        return $items;
    }

    public function get_entities_by_ids(string $key, array $ids = [], string $model, array $rel = [])
    {
        $items = $this->get_cache($key)->whereIn('id', $ids);
        $found_ids = $items->pluck('id')->all();
        $missing_ids = array_diff($ids, $found_ids);

        if (!empty($missing_ids)) {
            $query = $model::query();
            if (!empty($rel)) {
                $query->with($rel);
            }
            $missing_items = $query->whereIn('id', $missing_ids)->get();
            $items = $items->concat($missing_items)->unique('id');
            $this->put_in_cache($key, $items);
        }

        return $items;
    }

    public function update_entity(string $key, int $id, $entity)
    {
        $found = false;
        $items = $this->get_cache($key)->map(function ($item) use ($id, $entity, &$found) {
            if ($item->id === $id) {
                $found = true;
                return $entity;
            }
            return $item;
        });

        if (!$found) {
            $items->push($entity);
        }

        $this->put_in_cache($key, $items);
    }

    public function delete_entity(string $key, int $id)
    {
        $items = $this->get_cache($key)
            ->filter(fn($item) => (int) $item->id !== (int) $id)
            ->values();
        $this->put_in_cache($key, $items);
    }

    public function delete_entities(string $key, array $ids = [])
    {
        $items = $this->get_cache($key)
            ->filter(fn($item) => !in_array($item->id, $ids))
            ->values();

        $this->put_in_cache($key, $items);
    }
}
