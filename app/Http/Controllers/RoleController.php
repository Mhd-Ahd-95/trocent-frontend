<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\WidgetResource;
use App\Models\Widget;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Models\Role;

class RoleController extends Controller
{

    public function index()
    {
        $roles = Role::with(['permissions', 'widgets'])->get();
        return RoleResource::collection($roles);
    }

    public function store(RoleRequest $request)
    {
        $data = $request->validated();
        logger($data);
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'],
        ]);
        $role->givePermissionTo($data['permissions']);
        if (isset($data['widgets'])) {
            $role->widgets()->attach($data['widgets'])->pluck('id');
        }
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        return new RoleResource($role);
    }

    public function update(int $id, Request $request)
    {
        $orole = Role::findOrFail($id);
        $nrole = $request->validate([
            'name' => 'sometimes|string',
            'guard_name' => 'sometimes|in:web,api',
            'permissions.*' => 'sometimes|exists:permissions,name',
            'permissions' => 'sometimes|array',
            'widgets.*' => 'sometimes|exists:widgets,id',
            'widgets' => 'sometimes|array'
        ]);
        $orole->fill($nrole);
        $orole->save();
        if (isset($nrole['permissions'])) {
            $orole->syncPermissions($nrole['permissions']);
        }
        logger($nrole['widgets']);
        if (isset($nrole['widgets'])) {
            $orole->widgets()->sync($nrole['widgets']);
        }
        return new RoleResource($orole->load(['permissions', 'widgets']));
    }

    public function destroy(int $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return true;
    }

    public function show(int $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return new RoleResource($role);
    }

    public function load_permissions()
    {
        return PermissionResource::collection(Permission::all());
    }

    public function load_widgets()
    {
        return WidgetResource::collection(Widget::all());
    }
}
