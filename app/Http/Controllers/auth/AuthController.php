<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\auth\LoginRequest;
use Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    function login(LoginRequest $credentials)
    {
        $data = $credentials->validated();
        $remember = (bool) ($data['remember'] ?? false);
        if (
            !Auth::attempt([
                'username' => $data['username'],
                'password' => $data['password']
            ])
        ) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $user = Auth::user();

        $token = $user->createToken(
            'auth_token',
            ['*'],
            $remember ? now()->addDay(30) : now()->addHours(2)
        )->plainTextToken;
        return response()->json(['message' => 'Login successfully', 'access_token' => $token]);
    }

    function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout successfully']);
    }
}
