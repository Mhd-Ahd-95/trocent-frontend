<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\auth\LoginRequest;
use Auth;
use ErrorException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
            return response()->json([
                'message' => 'Invalid username or password.'
            ], 401);
        }
        $user = Auth::user();

        if ($user->type === 'driver') {
            return response()->json([
                'message' => 'Driver accounts cannot log in to this app.'
            ], 403);
        }

        $token = $user->createToken(
            'auth_token',
            ['*'],
            $remember ? now()->addDays(30) : now()->addHours(2)
        )->plainTextToken;

        // $response = array_merge($user, ['token' => $token]);
        return response()->json([...$user->toArray(), 'access_token' => $token]);
    }

    function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(true);
    }
}
