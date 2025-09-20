<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware(['auth:sanctum', 'setapplang'])->prefix('{locale}')->group(function(){
// });

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('/roles')->group(function () {
        Route::post('', [RoleController::class, 'store']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::get('', [RoleController::class, 'index']);
    });

    Route::get('/permissions', [RoleController::class, 'load_permissions']);

    Route::prefix('/users')->group(function () {
        Route::post('', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::get('', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
    });

    Route::prefix('/vehicle-types')->group(function () {
        Route::post('', [VehicleTypeController::class, 'store']);
        Route::put('/{id}', [VehicleTypeController::class, 'update']);
        Route::delete('/{id}', [VehicleTypeController::class, 'destroy']);
        Route::get('', [VehicleTypeController::class, 'index']);
        Route::get('/{id}', [VehicleTypeController::class, 'show']);
    });


});

Route::fallback(function () {
    return response()->json([
        'data' => [],
        'success' => false,
        'status' => 404,
        'message' => 'Invalid Route'
    ]);
});