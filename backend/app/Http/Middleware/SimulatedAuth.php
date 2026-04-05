<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Guest;

class SimulatedAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for authentication routes to prevent 401/interference
        if ($request->is('api/auth/*')) {
            return $next($request);
        }

        $userId = $request->header('X-User-Id');
        $userType = $request->header('X-User-Type'); // 'staff', 'admin', or 'guest'

        if ($userId) {
            if ($userType === 'guest') {
                Auth::guard('guest')->loginUsingId($userId);
            } else {
                Auth::loginUsingId($userId);
            }
        }

        return $next($request);
    }
}
