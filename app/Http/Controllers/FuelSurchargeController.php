<?php

namespace App\Http\Controllers;

use App\Http\Requests\fuelSurchargeRequest;
use App\Http\Resources\FuelSurchargeResource;
use App\Models\FuelSurcharge;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FuelSurchargeController extends Controller
{
    protected $cache;

    protected string $cache_key = 'fuelSurcharges';
    public function __construct()
    {
        $this->cache = new MemCache();
    }
    public function index()
    {
        try {
            $vtypes = $this->cache->get_entities($this->cache_key, FuelSurcharge::class);
            return FuelSurchargeResource::collection($vtypes);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function show(int $id)
    {
        try {
            $vtype = $this->cache->get_entity_id($this->cache_key, $id, FuelSurcharge::class);
            if (!$vtype)
                throw new ModelNotFoundException('fuel surcharge not found');
            return new FuelSurchargeResource($vtype);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function store(fuelSurchargeRequest $request)
    {
        try {
            $data = $request->validated();
            $vtype = FuelSurcharge::create($data);
            $this->cache->save_entity($this->cache_key, $vtype);
            return new FuelSurchargeResource($vtype);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function update(int $id, fuelSurchargeRequest $request)
    {
        try {
            $ovt = $this->cache->get_entity_id($this->cache_key, $id, FuelSurcharge::class);
            if (!$ovt)
                throw new ModelNotFoundException('Fuel surcharge not found');
            $validate = $request->validated();
            $ovt->fill($validate);
            $ovt->save();
            $this->cache->update_entity($this->cache_key, $id, $ovt);
            return new FuelSurchargeResource($ovt);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function destroy(int $id)
    {
        try {
            $vtype = $this->cache->get_entity_id($this->cache_key, $id, FuelSurcharge::class);
            if (!$vtype)
                throw new ModelNotFoundException('Fuel surcharge not found');
            $vtype->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function deleteFuelSurcharges(Request $request)
    {
        $ids = $request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            throw new ModelNotFoundException('No Fuel Surcharges IDs provider');
        }
        DB::beginTransaction();
        try {
            $vtypes = FuelSurcharge::whereIn('id', $ids)->get();
            if (count($vtypes) !== count($ids)) {
                throw new ModelNotFoundException('Some Fuel surcharge ids not found');
            }
            FuelSurcharge::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
