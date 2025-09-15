<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{

    function index()
    {

    }

    function store(RoleRequest $request)
    {
        $data = $request->validated();
        logger($data);
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'],
        ]);
        $role->givePermissionTo($data['permissions']);
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        return response()->json(['data' => $role], 200);
    }

    function update(Request $request)
    {
    }

    function destroy()
    {
    }

    function show()
    {
    }
}
