<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\MemCache;
use Exception;
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
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    function show(int $id)
    {
        try {
            $user = $this->cache->get_entity_id($this->cache_key, $id, User::class, ['roles.permissions', 'roles.widgets']);
            return new UserResource($user);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
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
            $user->assignRole($data['role']);
            $this->cache->save_entity($this->cache_key, $user->load(['roles.permissions', 'roles.widgets']));
            DB::commit();
            return new UserResource($user->load(['roles.permissions', 'roles.widgets']));
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    function update(int $id, UserRequest $request)
    {
        DB::beginTransaction();
        try {
            $ouser = User::findOrFail($id);
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
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $user = User::findOrFail($id);
            $user->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()]);
        }
    }
}
