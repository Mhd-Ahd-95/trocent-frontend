<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Widget;
use App\Services\MemCache;
use Exception;
use Spatie\Permission\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    protected $cache_key = 'roles';
    protected $cache;
    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        try {
            $roles = $this->cache->get_entities($this->cache_key, Role::class, ['permissions', 'widgets']);
            return RoleResource::collection($roles);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function store(RoleRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'],
            ]);
            $role->givePermissionTo($data['permissions']);
            if (isset($data['widgets'])) {
                $role->widgets()->attach($data['widgets']);
            }
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
            $srole = $role->load(['permissions', 'widgets']);
            $this->cache->save_entity($this->cache_key, $srole);
            DB::commit();
            return new RoleResource($srole);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function update(int $id, RoleRequest $request)
    {
        DB::beginTransaction();
        try {
            $orole = Role::findOrFail($id);
            $nrole = $request->validated();
            $orole->fill($nrole);
            $orole->save();
            if (isset($nrole['permissions'])) {
                $orole->syncPermissions($nrole['permissions']);
            }
            if (isset($nrole['widgets'])) {
                $orole->widgets()->sync($nrole['widgets']);
            }
            $role = $orole->load(['permissions', 'widgets']);
            $this->cache->update_entity($this->cache_key, $id, $role);
            DB::commit();
            return new RoleResource($role);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $role = Role::findOrFail($id);
            $role->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show(int $id)
    {
        try {
            $role = $this->cache->get_entity_id($this->cache_key, $id, Role::class, ['permissions', 'widgets']);
            return new RoleResource($role);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function load_permissions()
    {
        return $this->cache->get_entities('permissions', Permission::class);
    }

    public function load_widgets()
    {
        return $this->cache->get_entities('widgets', Widget::class);
    }
}
