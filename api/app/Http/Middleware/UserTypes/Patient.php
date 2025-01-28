<?php

namespace App\Http\Middleware\UserTypes;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Patient
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user()->user_type !== 'patient') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
