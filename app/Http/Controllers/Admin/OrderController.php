<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\InventoryLog;
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
        $paymentStatus = $request->input('payment_status');
        $search = $request->input('search');

        $orders = Order::with('items')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($paymentStatus, fn ($q) => $q->where('payment_status', $paymentStatus))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('tracking_number', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%")
                        ->orWhere('customer_phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'status' => $status ?? '',
                'payment_status' => $paymentStatus ?? '',
                'search' => $search ?? '',
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items.product', 'user']);

        $logs = ActivityLog::where('subject_type', Order::class)
            ->where('subject_id', $order->id)
            ->latest()
            ->get();

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'logs' => $logs,
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,shipped,delivered,cancelled'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        $adminNotes = $validated['notes'] ?? null;

        $order->update([
            'status' => $newStatus,
            'notes' => $adminNotes ? ($order->notes ? $order->notes."\n[Admin note]: ".$adminNotes : '[Admin note]: '.$adminNotes) : $order->notes,
        ]);

        // Restock inventory if order is cancelled from a non-cancelled state
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($order->items as $item) {
                if ($item->product) {
                    $stockBefore = $item->product->stock_quantity;
                    $stockAfter = $stockBefore + $item->quantity;
                    $item->product->update(['stock_quantity' => $stockAfter]);

                    InventoryLog::create([
                        'product_id' => $item->product->id,
                        'user_id' => auth()->id(),
                        'change_type' => 'order_cancelled',
                        'quantity_before' => $stockBefore,
                        'quantity_change' => $item->quantity,
                        'quantity_after' => $stockAfter,
                        'reason' => "Order #{$order->tracking_number} cancelled",
                    ]);
                }
            }
        }

        ActivityLog::record(
            'order_status_updated',
            "Order #{$order->tracking_number} status changed from {$oldStatus} to {$newStatus}",
            $order,
            auth()->user(),
            ['old_status' => $oldStatus, 'new_status' => $newStatus, 'admin_note' => $validated['notes'] ?? null],
            'admin'
        );

        return back()->with('success', "Order #{$order->tracking_number} status updated to {$newStatus}.");
    }

    public function updatePaymentStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'payment_status' => ['required', 'string', 'in:paid,pending,failed,refunded'],
            'payment_transaction_id' => ['nullable', 'string', 'max:100'],
        ]);

        $oldPayment = $order->payment_status;
        $order->update([
            'payment_status' => $validated['payment_status'],
            'payment_transaction_id' => $validated['payment_transaction_id'] ?? $order->payment_transaction_id,
        ]);

        ActivityLog::record(
            'payment_status_changed',
            "Order #{$order->tracking_number} payment status updated from {$oldPayment} to {$validated['payment_status']}",
            $order,
            auth()->user(),
            ['old_payment' => $oldPayment, 'new_payment' => $validated['payment_status'], 'ref' => $order->payment_transaction_id],
            'admin'
        );

        return back()->with('success', "Order #{$order->tracking_number} payment status updated to {$validated['payment_status']}.");
    }
}
