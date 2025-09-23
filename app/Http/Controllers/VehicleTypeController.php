<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleTypeRequest;
use App\Http\Resources\VehicleTypeResource;
use App\Models\VehicleType;
use App\Services\MemCache;
use Exception;
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
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show(int $id)
    {
        try {
            $vtype = $this->cache->get_entity_id($this->cache_key, $id, VehicleType::class);
            return new VehicleTypeResource($vtype);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
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
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function update(int $id, VehicleTypeRequest $request)
    {
        try {
            $ovt = VehicleType::findOrFail($id);
            $validate = $request->validated();
            $ovt->fill($validate);
            $ovt->save();
            $this->cache->update_entity($this->cache_key, $id, $ovt);
            return new VehicleTypeResource($ovt);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        try {
            $vtype = VehicleType::findOrFail($id);
            $vtype->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            return true;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function deleteVehicleTypes(Request $request)
    {
        $ids = $request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            return response()->json(['message' => 'No vehicle types IDs provided'], 400);
        }
        DB::beginTransaction();
        try {
            $vtypes = VehicleType::whereIn('id', $ids)->get();
            if (count($vtypes) !== count($ids)) {
                return response()->json([
                    'message' => 'Some vehicle types not found'
                ], 404);
            }
            VehicleType::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);  
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
