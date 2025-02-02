<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function get(): JsonResponse
    {
        $data = User::get();

        return response()->json([
            'data' => $data
        ]);
    }
}
