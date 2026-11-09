<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status');

        $orders = Order::with('items')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'status' => $status ?? '',
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items.product', 'user']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        $order->update(['status' => $validated['status']]);

        return back()->with('success', "Order #{$order->tracking_number} status updated to {$validated['status']}.");
    }

    public function updatePaymentStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'payment_status' => ['required', 'string', 'in:paid,pending,failed'],
        ]);

        $order->update(['payment_status' => $validated['payment_status']]);

        return back()->with('success', "Order #{$order->tracking_number} payment status updated to {$validated['payment_status']}.");
    }
}
