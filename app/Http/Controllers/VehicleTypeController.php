<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleTypeRequest;
use App\Models\VehicleType;
use Illuminate\Http\Request;

class VehicleTypeController extends Controller
{
    public function index()
    {
        $vtypes = VehicleType::all();
        return response()->json($vtypes);
    }

    public function show(int $id)
    {
        $vtype = VehicleType::findOrFail($id);
        return response()->json($vtype);
    }

    public function store(VehicleTypeRequest $request)
    {
        $data = $request->validated();
        $vtype = VehicleType::create($data);
        return response()->json($vtype);
    }

    public function update(int $id, Request $request)
    {
        $ovt = VehicleType::findOrFail($id);
        $validate = $request->validate([
            'name' => 'sometimes|string',
            'rate' => 'sometimes|float'
        ]);
        $ovt->fill($validate);
        $ovt->save();
        return response()->json($ovt);
    }

    public function destroy(int $id)
    {
        $vtype = VehicleType::findOrFail($id);
        $vtype->delete();
        return true;
    }
}
