<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    function index()
    {
        try {
            $users = User::with(['roles.permissions', 'roles.widgets'])->get();
            return UserResource::collection($users);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    function show(int $id)
    {
        try {
            $user = User::with('role')->findOrFail($id);
            return new UserResource($user);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    function store(UserRequest $request)
    {
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
            return new UserResource($user);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    function update(int $id, UserRequest $request)
    {
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
            return new UserResource($ouser);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    function destroy(int $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return true;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }
}
