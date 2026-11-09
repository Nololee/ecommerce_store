<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalRevenue = (float) Order::where('payment_status', 'paid')->sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $lowStockCount = Product::where('stock_quantity', '<=', 10)->count();
        $totalCustomers = User::count();

        // Recent orders
        $recentOrders = Order::with('items')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'tracking_number' => $order->tracking_number,
                'customer_name' => $order->customer_name,
                'total_amount' => (float) $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'items_count' => $order->items->count(),
                'created_at' => $order->created_at->format('M d, Y H:i'),
            ]);

        // Top Selling Products (Sales Report)
        $topSelling = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(line_total) as total_revenue'))
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->product_name,
                'total_sold' => (int) $item->total_sold,
                'total_revenue' => (float) $item->total_revenue,
            ]);

        // Sales by Category
        $salesByCategory = Category::with(['products.orderItems'])
            ->get()
            ->map(function ($category) {
                $revenue = $category->products->flatMap->orderItems->sum('line_total');

                return [
                    'category' => $category->name,
                    'revenue' => (float) $revenue,
                    'products_count' => $category->products->count(),
                ];
            })
            ->filter(fn ($cat) => $cat['revenue'] > 0 || $cat['products_count'] > 0)
            ->values();

        // Low stock products alert
        $lowStockProducts = Product::where('stock_quantity', '<=', 10)
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'stock_quantity', 'price']);

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'lowStockCount' => $lowStockCount,
                'totalCustomers' => $totalCustomers,
            ],
            'recentOrders' => $recentOrders,
            'topSelling' => $topSelling,
            'salesByCategory' => $salesByCategory,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
