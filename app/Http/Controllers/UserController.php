<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    protected $cache;

    protected string $cache_key = 'users';
    public function __construct()
    {
        $this->cache = new MemCache();
    }
    function index()
    {
        try {
            $users = $this->cache->get_entities($this->cache_key, User::class, ['roles.permissions', 'roles.widgets']);
            return UserResource::collection($users);
        } catch (Exception $e) {
            throw $e;
        }
    }

    function show(int $id)
    {
        try {
            $user = $this->cache->get_entity_id($this->cache_key, $id, User::class, ['roles.permissions', 'roles.widgets']);
            if (!$user)
                throw new ModelNotFoundException('User not found');
            return new UserResource($user);
        } catch (Exception $e) {
            throw $e;
        }
    }

    function store(UserRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = User::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'type' => $data['type'],
            ]);
            if (isset($data['role'])) {
                $user->assignRole($data['role']);
            }
            $this->cache->save_entity($this->cache_key, $user->load(['roles.permissions', 'roles.widgets']));
            DB::commit();
            return new UserResource($user->load(['roles.permissions', 'roles.widgets']));
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    function update(int $id, UserRequest $request)
    {
        DB::beginTransaction();
        try {
            $ouser = $this->cache->get_entity_id($this->cache_key, $id, UserController::class, ['roles.permissions', 'roles.widgets']);
            if (!$ouser)
                throw new ModelNotFoundException('User not found', 404);
            $data = $request->validated();
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }
            $ouser->fill($data);
            $ouser->save();
            if (isset($data['role'])) {
                $ouser->syncRoles($data['role']);
            }
            $this->cache->update_entity($this->cache_key, $id, $ouser->load(['roles.permissions', 'roles.widgets']));
            DB::commit();
            return new UserResource($ouser->load(['roles.permissions', 'roles.widgets']));
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $user = $this->cache->get_entity_id($this->cache_key, $id, UserController::class, ['roles.permissions', 'roles.widgets']);
            if (!$user)
                throw new ModelNotFoundException('User not found');
            $user->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
