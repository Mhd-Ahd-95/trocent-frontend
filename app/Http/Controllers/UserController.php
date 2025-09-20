<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    function index()
    {
        $users = User::with(['roles.permissions', 'roles.widgets'])->get();
        return UserResource::collection($users);
    }

    function show(int $id)
    {
        $user = User::with('role')->findOrFail($id);
        return new UserResource($user);
    }

    function store(UserRequest $request)
    {
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
    }

    function update(int $id, Request $request)
    {
        $ouser = User::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string',
            'username' => 'sometimes|string',
            'email' => 'sometimes|email',
            'type' => 'sometimes|string|in:customer,staff,admin,driver',
            'password' => 'sometimes|string',
            'role' => 'sometimes|exists:roles,name'
        ]);
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $ouser->fill($data);
        $ouser->save();
        if (isset($data['role'])) {
            $ouser->syncRoles($data['role']);
        }
        return new UserResource($ouser);
    }

    function destroy(int $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return true;
    }
}
