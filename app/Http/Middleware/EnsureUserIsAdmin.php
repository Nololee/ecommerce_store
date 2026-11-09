<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->guest(route('login'))->withErrors([
                'email' => 'Please sign in to access the administration portal.',
            ]);
        }

        if (! $user->is_admin || ! $user->is_active) {
            abort(403, 'Unauthorized access: Administrator privileges required.');
        }

        return $next($request);
    }
}
