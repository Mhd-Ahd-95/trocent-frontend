<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\WidgetResource;
use App\Models\Widget;
use Exception;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Models\Role;

class RoleController extends Controller
{

    public function index()
    {
        try {
            $roles = Role::with(['permissions', 'widgets'])->get();
            return RoleResource::collection($roles);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function store(RoleRequest $request)
    {
        try {
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
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function update(int $id, RoleRequest $request)
    {
        try {
            $orole = Role::findOrFail($id);
            $nrole = $request->validated();
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
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        try {
            $role = Role::findOrFail($id);
            $role->delete();
            return true;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show(int $id)
    {
        try {
            $role = Role::with('permissions')->findOrFail($id);
            return new RoleResource($role);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
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
