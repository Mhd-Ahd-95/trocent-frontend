<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleTypeRequest;
use App\Http\Resources\VehicleTypeResource;
use App\Models\VehicleType;
use Exception;
use Illuminate\Http\Request;

class VehicleTypeController extends Controller
{
    public function index()
    {
        try {
            $vtypes = VehicleType::all();
            return VehicleTypeResource::collection($vtypes);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show(int $id)
    {
        try {
            $vtype = VehicleType::findOrFail($id);
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
            return true;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }
}
