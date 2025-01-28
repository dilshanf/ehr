<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Middleware\UserTypes\Admin;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/users', [UserController::class, 'get'])->middleware(Admin::class);
});

Route::post('login', [AuthController::class, 'store'])->name('login');
// Route::apiResource('register', RegistrationController::class)->only(['store']);
Route::apiResource('forgot-password', ForgotPasswordController::class)->only(['store']);
Route::apiResource('reset-password', ResetPasswordController::class)->only(['store']);
