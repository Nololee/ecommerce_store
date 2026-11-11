<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $trackingNumber = $request->query('tracking_number');

        $selectedOrder = null;

        if ($trackingNumber) {
            $order = Order::where('user_id', $user->id)
                ->where('tracking_number', $trackingNumber)
                ->with(['items.product'])
                ->first();

            if ($order) {
                $selectedOrder = $this->transformOrder($order);
            }
        }

        // Active / in-progress orders for the customer
        $activeOrders = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'processing', 'shipped'])
            ->with(['items.product'])
            ->latest()
            ->get()
            ->map(fn (Order $o) => $this->transformOrder($o));

        // If no tracking query was provided, default to the most recent active order if exists
        if (! $selectedOrder && $activeOrders->isNotEmpty()) {
            $selectedOrder = $activeOrders->first();
        }

        return Inertia::render('customer/tracking', [
            'activeOrders' => $activeOrders,
            'selectedOrder' => $selectedOrder,
            'searchedTrackingNumber' => $trackingNumber ?? '',
        ]);
    }

    /**
     * Transform order model for frontend consumption.
     *
     * @return array<string, mixed>
     */
    private function transformOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'tracking_number' => $order->tracking_number,
            'customer_name' => $order->customer_name,
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
            'updated_at' => $order->updated_at->format('M d, Y H:i'),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'product_slug' => $item->product?->slug,
                'product_image' => $item->product?->image_url ?? $item->product?->image,
                'price' => (float) $item->price,
                'quantity' => $item->quantity,
                'line_total' => (float) $item->line_total,
            ]),
        ];
    }
}
