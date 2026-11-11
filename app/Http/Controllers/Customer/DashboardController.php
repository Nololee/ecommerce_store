<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        // 1. Order Counts and Spend Statistics for current user
        $ordersQuery = Order::where('user_id', $user->id);

        $totalOrders = (clone $ordersQuery)->count();
        $totalSpent = (float) (clone $ordersQuery)->where('payment_status', 'paid')->sum('total_amount');
        $pendingOrders = (clone $ordersQuery)->whereIn('status', ['pending', 'processing'])->count();
        $deliveredOrders = (clone $ordersQuery)->where('status', 'delivered')->count();

        // 2. Status breakdown summary
        $statusCounts = (clone $ordersQuery)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->all();

        // 3. Most recent orders (up to 5)
        $recentOrders = (clone $ordersQuery)
            ->with(['items.product'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'tracking_number' => $order->tracking_number,
                'total_amount' => (float) $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('M d, Y'),
                'items_count' => $order->items->sum('quantity'),
            ]);

        // 4. Recently purchased unique products from order items
        $recentItems = OrderItem::whereHas('order', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['product', 'order'])
            ->latest('id')
            ->take(8)
            ->get()
            ->map(fn (OrderItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_slug' => $item->product?->slug,
                'product_image' => $item->product?->image_url ?? $item->product?->image,
                'price' => (float) $item->price,
                'quantity' => $item->quantity,
                'line_total' => (float) $item->line_total,
                'order_tracking_number' => $item->order->tracking_number,
                'purchased_at' => $item->created_at->format('M d, Y'),
            ]);

        return Inertia::render('customer/dashboard', [
            'metrics' => [
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
                'pending_orders' => $pendingOrders,
                'delivered_orders' => $deliveredOrders,
            ],
            'statusCounts' => $statusCounts,
            'recentOrders' => $recentOrders,
            'recentItems' => $recentItems,
        ]);
    }
}
