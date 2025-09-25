<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccessorialRequest;
use App\Http\Resources\AccessorialResource;
use App\Models\AccessorialModel;
use App\Services\MemCache;
use Error;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccessorialController extends Controller
{
    protected $cache;
    protected $cache_key = 'accessorials';

    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        try {
            $accessorials = $this->cache->get_entities($this->cache_key, AccessorialModel::class);
            return AccessorialResource::collection($accessorials);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function show(int $id)
    {
        try {
            $acc = $this->cache->get_entity_id($this->cache_key, $id, AccessorialModel::class);
            if (!$acc)
                throw new ModelNotFoundException('Accessorial not found.');
            return new AccessorialResource($acc);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function store(AccessorialRequest $request)
    {
        try {
            $data = $request->validated();
            $acc = AccessorialModel::create($data);
            $this->cache->save_entity($this->cache_key, $acc);
            return new AccessorialResource($acc);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function update(int $id, AccessorialRequest $request)
    {
        try {
            $oacc = $this->cache->get_entity_id($this->cache_key, $id, AccessorialModel::class);
            if (!$oacc)
                throw new ModelNotFoundException('Accessorial not found.');
            $data = $request->validated();
            $oacc->fill($data);
            $oacc->save();
            $this->cache->update_entity($this->cache_key, $id, $oacc);
            return new AccessorialResource($oacc);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delete(int $id)
    {
        try {
            $acc = $this->cache->get_entity_id($this->cache_key, $id, AccessorialModel::class);
            if (!$acc)
                throw new ModelNotFoundException('Accessorial not found');
            $acc->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delete_accessorials(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            if (!is_array($ids) || empty($ids)) {
                throw new ModelNotFoundException('No accessorials IDs provider');
            }
            $accs = $this->cache->get_entities_by_ids($this->cache_key, $ids, AccessorialModel::class);
            if (count($accs) !== count($ids)) {
                throw new ModelNotFoundException("Some accessroials not found.");
            }
            AccessorialModel::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
