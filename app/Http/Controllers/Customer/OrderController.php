<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $status = $request->query('status');

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'tracking_number' => $order->tracking_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'shipping_address' => $order->shipping_address,
                'city' => $order->city,
                'postal_code' => $order->postal_code,
                'subtotal' => (float) $order->subtotal,
                'shipping_fee' => (float) $order->shipping_fee,
                'total_amount' => (float) $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'status' => $order->status,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'items_count' => $order->items->sum('quantity'),
                'items' => $order->items->map(fn (OrderItem $item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'product_slug' => $item->product?->slug,
                    'product_image' => $item->product?->image_url,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'line_total' => (float) $item->line_total,
                ]),
            ]);

        // Status pill badge counts for current customer
        $counts = [
            'all' => Order::where('user_id', $user->id)->count(),
            'pending' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
            'processing' => Order::where('user_id', $user->id)->where('status', 'processing')->count(),
            'shipped' => Order::where('user_id', $user->id)->where('status', 'shipped')->count(),
            'delivered' => Order::where('user_id', $user->id)->where('status', 'delivered')->count(),
            'cancelled' => Order::where('user_id', $user->id)->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('customer/orders/index', [
            'orders' => $orders,
            'filters' => [
                'status' => $status ?? 'all',
            ],
            'statusCounts' => $counts,
        ]);
    }

    public function show(Request $request, string $trackingNumber): Response
    {
        $user = $request->user();

        $order = Order::where('user_id', $user->id)
            ->where('tracking_number', $trackingNumber)
            ->with(['items.product'])
            ->firstOrFail();

        return Inertia::render('customer/orders/show', [
            'order' => [
                'id' => $order->id,
                'tracking_number' => $order->tracking_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'shipping_address' => $order->shipping_address,
                'city' => $order->city,
                'postal_code' => $order->postal_code,
                'subtotal' => (float) $order->subtotal,
                'shipping_fee' => (float) $order->shipping_fee,
                'total_amount' => (float) $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'payment_transaction_id' => $order->payment_transaction_id,
                'status' => $order->status,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'items' => $order->items->map(fn (OrderItem $item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'product_slug' => $item->product?->slug,
                    'product_image' => $item->product?->image_url,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'line_total' => (float) $item->line_total,
                ]),
            ],
        ]);
    }
}
