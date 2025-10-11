<?php

use App\Http\Controllers\AccessorialController;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\InterlinerController;
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

    Route::prefix('/accessorials')->group(function () {
        Route::post('', [AccessorialController::class, 'store']);
        Route::put('/{id}', [AccessorialController::class, 'update']);
        Route::delete('', [AccessorialController::class, 'delete_accessorials']);
        Route::delete('/{id}', [AccessorialController::class, 'destroy']);
        Route::get('', [AccessorialController::class, 'index']);
        Route::get('/{id}', [AccessorialController::class, 'show']);
    });

    Route::prefix('/interliners')->group(function () {
        Route::post('', [InterlinerController::class, 'store']);
        Route::put('/{id}', [InterlinerController::class, 'update']);
        Route::delete('', [InterlinerController::class, 'delete_interliners']);
        Route::delete('/{id}', [InterlinerController::class, 'destroy']);
        Route::get('', [InterlinerController::class, 'index']);
        Route::get('/{id}', [InterlinerController::class, 'show']);
    });

    Route::prefix('/companies')->group(function () {
        Route::post('', [CompanyController::class, 'store']);
        Route::put('/{id}', [CompanyController::class, 'update']);
        Route::delete('', [CompanyController::class, 'delete_companies']);
        Route::delete('/{id}', [CompanyController::class, 'destroy']);
        Route::get('', [CompanyController::class, 'index']);
        Route::get('/{id}', [CompanyController::class, 'show']);
    });

    Route::prefix('/drivers')->group(function () {
        Route::post('', [DriverController::class, 'store']);
        // Route::post('/{id}', [DriverController::class, 'update']);
        Route::put('/{id}', [DriverController::class, 'update']);
        Route::delete('', [DriverController::class, 'delete_drivers']);
        Route::delete('/{id}', [DriverController::class, 'destroy']);
        Route::get('', [DriverController::class, 'index']);
        Route::get('/{id}', [DriverController::class, 'show']);
        Route::get('/download-file/{id}', [DriverController::class, 'download_file']);
        Route::post('/create-login/{id}', [DriverController::class, 'create_login']);
    });

});

Route::fallback(function () {
    return response()->json(['status' => 404, 'message' => 'Invalid Route']);
});