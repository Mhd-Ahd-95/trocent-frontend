<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleTypeRequest;
use App\Http\Resources\VehicleTypeResource;
use App\Models\VehicleType;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehicleTypeController extends Controller
{
    protected $cache;

    protected string $cache_key = 'vehicleTypes';
    public function __construct()
    {
        $this->cache = new MemCache();
    }
    public function index()
    {
        try {
            $vtypes = $this->cache->get_entities($this->cache_key, VehicleType::class);
            return VehicleTypeResource::collection($vtypes);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function show(int $id)
    {
        try {
            $vtype = $this->cache->get_entity_id($this->cache_key, $id, VehicleType::class);
            if (!$vtype)
                throw new ModelNotFoundException('Vehicle type not found');
            return new VehicleTypeResource($vtype);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function store(VehicleTypeRequest $request)
    {
        try {
            $data = $request->validated();
            $vtype = VehicleType::create($data);
            $this->cache->save_entity($this->cache_key, $vtype);
            return new VehicleTypeResource($vtype);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function update(int $id, VehicleTypeRequest $request)
    {
        try {
            $ovt = $this->cache->get_entity_id($this->cache_key, $id, VehicleType::class);
            if (!$ovt)
                throw new ModelNotFoundException('Vehicle type not found');
            $validate = $request->validated();
            $ovt->fill($validate);
            $ovt->save();
            $this->cache->update_entity($this->cache_key, $id, $ovt);
            return new VehicleTypeResource($ovt);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function destroy(int $id)
    {
        try {
            $vtype = $this->cache->get_entity_id($this->cache_key, $id, VehicleType::class);
            if (!$vtype)
                throw new ModelNotFoundException('Vehicle type not found');
            $vtype->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function deleteVehicleTypes(Request $request)
    {
        $ids = $request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            throw new ModelNotFoundException('No Vehicle type IDs provider');
        }
        DB::beginTransaction();
        try {
            $vtypes = VehicleType::whereIn('id', $ids)->get();
            if (count($vtypes) !== count($ids)) {
                throw new ModelNotFoundException('Some Vehicle type ids not found');
            }
            VehicleType::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
