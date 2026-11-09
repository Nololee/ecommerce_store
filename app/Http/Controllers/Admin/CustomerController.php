<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status'); // 'active', 'inactive'

        $customers = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum(['orders as total_spent' => function ($q) {
                $q->where('payment_status', 'paid');
            }], 'total_amount')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    public function show(User $customer): Response
    {
        if ($customer->is_admin) {
            abort(404, 'Admin accounts cannot be managed through customer directory.');
        }

        $customer->loadCount('orders');
        $customer->loadSum(['orders as total_spent' => function ($q) {
            $q->where('payment_status', 'paid');
        }], 'total_amount');

        // Customer's full order history
        $orders = $customer->orders()
            ->with('items')
            ->latest()
            ->paginate(10);

        // Customer's activity timeline
        $activities = ActivityLog::where('user_id', $customer->id)
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
            'orders' => $orders,
            'activities' => $activities,
        ]);
    }

    public function toggleStatus(User $customer): RedirectResponse
    {
        if ($customer->is_admin) {
            return back()->with('error', 'Cannot alter status of administrator accounts.');
        }

        $customer->update([
            'is_active' => ! $customer->is_active,
        ]);

        $statusText = $customer->is_active ? 'activated' : 'deactivated/suspended';

        ActivityLog::record(
            'customer_status_updated',
            "Customer account for {$customer->name} ({$customer->email}) was {$statusText}",
            $customer,
            auth()->user(),
            ['is_active' => $customer->is_active],
            'admin'
        );

        return back()->with('success', "Customer {$customer->name} has been {$statusText}.");
    }
}
