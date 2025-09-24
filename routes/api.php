<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AddressBookController;

Route::get('/user', function (Request $request) {
    return $request->user();
});

// Route::middleware(['auth:sanctum', 'setapplang'])->prefix('{locale}')->group(function(){
// });

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // roles api
    Route::prefix('/roles')->group(function () {
        Route::get('/permissions', [RoleController::class, 'load_permissions']);
        Route::get('/widgets', [RoleController::class, 'load_widgets']);
        Route::post('', [RoleController::class, 'store']);
        Route::delete('', [RoleController::class, 'deleteRoles']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::get('', [RoleController::class, 'index']);
    });

    // users api
    Route::prefix('/users')->group(function () {
        Route::post('', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::get('', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
    });

    // vehicle types api
    Route::prefix('/vehicle-types')->group(function () {
        Route::post('', [VehicleTypeController::class, 'store']);
        Route::put('/{id}', [VehicleTypeController::class, 'update']);
        Route::delete('', [VehicleTypeController::class, 'deleteVehicleTypes']);
        Route::delete('/{id}', [VehicleTypeController::class, 'destroy']);
        Route::get('', [VehicleTypeController::class, 'index']);
        Route::get('/{id}', [VehicleTypeController::class, 'show']);
    });

    Route::prefix('/address-books')->group(function () {
        Route::post('', [AddressBookController::class, 'store']);
        Route::put('/{id}', [AddressBookController::class, 'update']);
        Route::delete('', [AddressBookController::class, 'delete_address_books']);
        Route::delete('/{id}', [AddressBookController::class, 'destroy']);
        Route::get('', [AddressBookController::class, 'index']);
        Route::get('/{id}', [AddressBookController::class, 'show']);
    });

});

Route::fallback(function () {
    return response()->json(['status' => 404, 'message' => 'Invalid Route']);
});