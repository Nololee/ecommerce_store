<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\TeamInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // If the authenticated user is an administrator and not actively previewing the customer view,
        // redirect them directly to the E-Commerce Admin Dashboard.
        if ($user?->is_admin && ! $request->session()->get('admin_viewing_as_customer')) {
            return redirect()->route('admin.dashboard');
        }

        $email = strtolower($user->email ?? '');

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        // E-commerce customer statistics
        $ordersQuery = Order::where('user_id', $user->id);

        $totalOrders = (clone $ordersQuery)->count();
        $totalSpent = (float) (clone $ordersQuery)->where('payment_status', 'paid')->sum('total_amount');
        $pendingOrders = (clone $ordersQuery)->whereIn('status', ['pending', 'processing'])->count();
        $deliveredOrders = (clone $ordersQuery)->where('status', 'delivered')->count();

        $statusCounts = (clone $ordersQuery)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->all();

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

        $recentItems = OrderItem::whereHas('order', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['product', 'order'])
            ->latest('id')
            ->take(6)
            ->get()
            ->map(fn (OrderItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_slug' => $item->product?->slug,
                'product_image' => $item->product?->image_url,
                'price' => (float) $item->price,
                'quantity' => $item->quantity,
                'line_total' => (float) $item->line_total,
                'order_tracking_number' => $item->order->tracking_number,
                'purchased_at' => $item->created_at->format('M d, Y'),
            ]);

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
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
