<?php

use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware(['auth:sanctum', 'setapplang'])->prefix('{locale}')->group(function(){
// });
Route::post('/role', [RoleController::class, 'store']);

