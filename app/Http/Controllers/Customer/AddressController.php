<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        $addresses = CustomerAddress::where('user_id', $request->user()->id)
            ->latest('is_default')
            ->latest('id')
            ->get();

        return Inertia::render('customer/addresses/index', [
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:50'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'street_address' => ['required', 'string', 'max:255'],
            'suburb' => ['nullable', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'is_default' => ['boolean'],
        ]);

        $user = $request->user();

        // If marked as default or if this is user's first address, unset others
        $hasExisting = CustomerAddress::where('user_id', $user->id)->exists();
        $isDefault = ($validated['is_default'] ?? false) || ! $hasExisting;

        if ($isDefault) {
            CustomerAddress::where('user_id', $user->id)->update(['is_default' => false]);
        }

        CustomerAddress::create([
            ...$validated,
            'user_id' => $user->id,
            'country' => $validated['country'] ?? 'South Africa',
            'is_default' => $isDefault,
        ]);

        return back()->with('success', 'Address added successfully.');
    }

    public function update(Request $request, CustomerAddress $address): RedirectResponse
    {
        // Enforce ownership
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'label' => ['required', 'string', 'max:50'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'street_address' => ['required', 'string', 'max:255'],
            'suburb' => ['nullable', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'is_default' => ['boolean'],
        ]);

        if (! empty($validated['is_default'])) {
            CustomerAddress::where('user_id', $request->user()->id)
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return back()->with('success', 'Address updated successfully.');
    }

    public function destroy(Request $request, CustomerAddress $address): RedirectResponse
    {
        // Enforce ownership
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        // If deleted address was default, promote next address if any
        if ($wasDefault) {
            $next = CustomerAddress::where('user_id', $request->user()->id)->first();
            if ($next) {
                $next->update(['is_default' => true]);
            }
        }

        return back()->with('success', 'Address removed successfully.');
    }

    public function setDefault(Request $request, CustomerAddress $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        CustomerAddress::where('user_id', $request->user()->id)->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return back()->with('success', 'Default delivery address updated.');
    }
}
