<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChooseViewController extends Controller
{
    /**
     * Show the view-selector page for admin users who also want to browse as a customer.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('choose-view', [
            'user' => $request->user()->only('name', 'email'),
        ]);
    }

    /**
     * Set the admin-to-customer session flag and redirect to the customer dashboard.
     */
    public function enterCustomerView(Request $request): RedirectResponse
    {
        $request->session()->put('admin_viewing_as_customer', true);

        return redirect()->route('customer.dashboard');
    }

    /**
     * Clear the flag and redirect back to the admin panel.
     */
    public function exitCustomerView(Request $request): RedirectResponse
    {
        $request->session()->forget('admin_viewing_as_customer');

        return redirect()->route('admin.dashboard');
    }
}
