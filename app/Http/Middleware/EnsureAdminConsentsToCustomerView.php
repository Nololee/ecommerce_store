<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminConsentsToCustomerView
{
    /**
     * If the authenticated user is an admin, they must have explicitly chosen
     * to browse as a customer (session flag) before accessing /customer/* routes.
     * Without the flag they are redirected to the view-selector page.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->is_admin && ! $request->session()->get('admin_viewing_as_customer', false)) {
            return redirect()->route('choose-view');
        }

        return $next($request);
    }
}
