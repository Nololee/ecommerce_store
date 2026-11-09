<?php

namespace App\Http\Responses;

use App\Http\Responses\Concerns\RedirectsToCurrentTeam;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    use RedirectsToCurrentTeam;

    public function toResponse($request): Response
    {
        if ($request->user()?->is_admin) {
            return $request->wantsJson()
                ? new JsonResponse(['two_factor' => false], 200)
                : redirect()->intended('/admin');
        }

        // Regular e-commerce client / customer:
        // Redirect to wherever they were headed (e.g. /checkout), or to the public store catalogue / shop
        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 200)
            : redirect()->intended('/shop');
    }
}
