<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Widget;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
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
            throw $e;
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
            throw $e;
        }
    }

    public function update(int $id, RoleRequest $request)
    {
        DB::beginTransaction();
        try {
            $orole = $this->cache->get_entity_id($this->cache_key, $id, RoleController::class, ['permissions', 'widgets']);
            if (!$orole)
                throw new ModelNotFoundException('Role not found');
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
            throw $e;
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $role = $this->cache->get_entity_id($this->cache_key, $id, RoleController::class, ['permissions', 'widgets']);
            if (!$role)
                throw new ModelNotFoundException('Role not found');
            $role->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteRoles(Request $request)
    {
        $ids = $request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            throw new ModelNotFoundException('No role IDs provided.');
        }
        DB::beginTransaction();
        try {
            $roles = Role::whereIn('id', $ids)->get();
            if (count($roles) !== count($ids)) {
                throw new ModelNotFoundException('Some Roles not found.');
            }
            foreach ($roles as $role) {
                $role->syncPermissions([]);
                $role->widgets()->sync([]);
            }
            Role::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }


    public function show(int $id)
    {
        try {
            $role = $this->cache->get_entity_id($this->cache_key, $id, Role::class, ['permissions', 'widgets']);
            if ($role)
                throw new ModelNotFoundException('Role not found');
            return new RoleResource($role);
        } catch (Exception $e) {
            throw $e;
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
