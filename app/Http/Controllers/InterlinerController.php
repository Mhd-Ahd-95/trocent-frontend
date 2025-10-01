<?php

namespace App\Http\Controllers;

use App\Http\Requests\InterlinerRequest;
use App\Http\Resources\InterlinerResource;
use App\Models\Interliner;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function PHPUnit\Framework\isEmpty;

class InterlinerController extends Controller
{
    protected $cache;
    protected $cache_key = 'interliners';

    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        try {
            $interliners = $this->cache->get_entities($this->cache_key, Interliner::class);
            return InterlinerResource::collection($interliners);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function show(int $id)
    {
        try {
            $interliner = $this->cache->get_entity_id($this->cache_key, $id, Interliner::class);
            if (!$interliner)
                throw new ModelNotFoundException('Interliner not found.');
            return new InterlinerResource($interliner);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function store(InterlinerRequest $request)
    {
        try {
            $data = $request->validated();
            $interliner = Interliner::create($data);
            $this->cache->save_entity($this->cache_key, $interliner);
            return new InterlinerResource($interliner);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function update(int $id, InterlinerRequest $request)
    {
        DB::beginTransaction();
        try {
            $ointerliner = $this->cache->get_entity_id($this->cache_key, $id, Interliner::class);
            if (!$ointerliner)
                throw new ModelNotFoundException("Interliner with ID {$id} not found.");
            $ninterliner = $request->validated();
            $ointerliner->fill($ninterliner);
            $ointerliner->save();
            $this->cache->update_entity($this->cache_key, $id, $ointerliner);
            DB::commit();
            return new InterlinerResource($ointerliner);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $interliner = $this->cache->get_entity_id($this->cache_key, $id, Interliner::class);
            if (!$interliner)
                throw new ModelNotFoundException("Interliner with ID {$id} not found.");
            $interliner->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete_interliners(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            if (!is_array($ids) || empty($ids)) {
                throw new ModelNotFoundException("No interliners IDs provided.");
            }
            $interliners = Interliner::whereIn('id', $ids)->get();
            if (count($interliners) !== count($ids)) {
                throw new ModelNotFoundException("Some interliners not found.");
            }
            Interliner::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
