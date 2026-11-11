<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderTrackingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $userOrders = [];

        if ($user) {
            $userOrders = Order::with('items')
                ->where('user_id', $user->id)
                ->latest()
                ->take(10)
                ->get()
                ->map(fn ($order) => [
                    'id' => $order->id,
                    'tracking_number' => $order->tracking_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total_amount' => (float) $order->total_amount,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ]);
        }

        return Inertia::render('orders/track', [
            'recentOrders' => $userOrders,
        ]);
    }

    public function show(string $trackingNumber): Response
    {
        $order = Order::with(['items.product'])
            ->where('tracking_number', $trackingNumber)
            ->firstOrFail();

        return Inertia::render('orders/show', [
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
                'items' => $order->items->map(function (\App\Models\OrderItem $item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'product_slug' => $item->product?->slug,
                        'product_image' => $item->product?->image_url ?? $item->product?->image,
                        'price' => (float) $item->price,
                        'quantity' => $item->quantity,
                        'line_total' => (float) $item->line_total,
                    ];
                }),
            ],
        ]);
    }
}
