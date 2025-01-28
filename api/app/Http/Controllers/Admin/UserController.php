<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function get(): JsonResponse
    {
        return response()->json([
            'users' => 'success'
        ]);
    }
}
