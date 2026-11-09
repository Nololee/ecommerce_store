<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $range = $request->query('range', '30_days'); // 'today', '7_days', '30_days', 'this_year', 'all'

        $startDate = match ($range) {
            'today' => Carbon::today(),
            '7_days' => Carbon::now()->subDays(7),
            'this_year' => Carbon::now()->startOfYear(),
            'all' => null,
            default => Carbon::now()->subDays(30),
        };

        // Orders query scoped by date if specified
        $scopedOrdersQuery = Order::query();
        if ($startDate) {
            $scopedOrdersQuery->where('created_at', '>=', $startDate);
        }

        // Summary Cards Figures
        $totalCustomers = User::where('is_admin', false)->count();
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalOrders = Order::count();

        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $completedOrders = Order::where('status', 'delivered')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        $totalRevenue = (float) Order::where('payment_status', 'paid')->sum('total_amount');
        $lowStockCount = Product::where('stock_quantity', '<=', 10)->where('stock_quantity', '>', 0)->count();
        $outOfStockCount = Product::where('stock_quantity', '<=', 0)->count();

        // Range specific metrics
        $rangeOrdersCount = (clone $scopedOrdersQuery)->count();
        $rangeRevenue = (float) (clone $scopedOrdersQuery)->where('payment_status', 'paid')->sum('total_amount');

        // Revenue & Order Trends (Grouped by date for interactive charts)
        $chartDays = $range === 'today' ? 1 : ($range === '7_days' ? 7 : ($range === 'this_year' ? 12 : 30));

        if ($range === 'this_year') {
            // Group by month
            $trends = Order::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(CASE WHEN payment_status = "paid" THEN total_amount ELSE 0 END) as revenue')
            )
                ->where('created_at', '>=', Carbon::now()->startOfYear())
                ->groupBy('period')
                ->orderBy('period')
                ->get();
        } else {
            // Group by day
            $trendStart = $startDate ?? Carbon::now()->subDays(30);
            $trends = Order::select(
                DB::raw('DATE(created_at) as period'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(CASE WHEN payment_status = "paid" THEN total_amount ELSE 0 END) as revenue')
            )
                ->where('created_at', '>=', $trendStart)
                ->groupBy('period')
                ->orderBy('period')
                ->get();
        }

        // Periodic breakdowns
        $dailySales = (float) Order::where('payment_status', 'paid')
            ->whereDate('created_at', Carbon::today())
            ->sum('total_amount');

        $weeklySales = (float) Order::where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->sum('total_amount');

        $monthlySales = (float) Order::where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->sum('total_amount');

        $annualSales = (float) Order::where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->startOfYear())
            ->sum('total_amount');

        // Recent Orders
        $recentOrders = Order::with('items')
            ->latest()
            ->take(6)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'tracking_number' => $order->tracking_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'total_amount' => (float) $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'items_count' => $order->items->count(),
                'created_at' => $order->created_at->format('M d, Y H:i'),
            ]);

        // Recent Customer Registrations
        $recentCustomers = User::where('is_admin', false)
            ->latest()
            ->take(6)
            ->get(['id', 'name', 'email', 'phone', 'is_active', 'created_at'])
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? 'N/A',
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at->format('M d, Y'),
            ]);

        // Top Selling Products (Most purchased)
        $topSelling = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(line_total) as total_revenue'))
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->take(6)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->product_name,
                'total_sold' => (int) $item->total_sold,
                'total_revenue' => (float) $item->total_revenue,
            ]);

        // Best Selling Categories
        $salesByCategory = Category::with(['products.orderItems'])
            ->get()
            ->map(function ($category) {
                $revenue = $category->products->flatMap->orderItems->sum('line_total');
                $sold = $category->products->flatMap->orderItems->sum('quantity');

                return [
                    'category' => $category->name,
                    'revenue' => (float) $revenue,
                    'total_sold' => (int) $sold,
                    'products_count' => $category->products->count(),
                ];
            })
            ->sortByDesc('revenue')
            ->values();

        // Low Stock & Out of Stock Products
        $stockAlertProducts = Product::where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity', 'asc')
            ->take(6)
            ->get(['id', 'name', 'stock_quantity', 'price', 'is_active']);

        return Inertia::render('admin/dashboard', [
            'filters' => [
                'range' => $range,
            ],
            'metrics' => [
                'totalCustomers' => $totalCustomers,
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'processingOrders' => $processingOrders,
                'completedOrders' => $completedOrders,
                'cancelledOrders' => $cancelledOrders,
                'totalRevenue' => $totalRevenue,
                'lowStockCount' => $lowStockCount,
                'outOfStockCount' => $outOfStockCount,
                'rangeRevenue' => $rangeRevenue,
                'rangeOrdersCount' => $rangeOrdersCount,
                'dailySales' => $dailySales,
                'weeklySales' => $weeklySales,
                'monthlySales' => $monthlySales,
                'annualSales' => $annualSales,
            ],
            'trends' => $trends,
            'recentOrders' => $recentOrders,
            'recentCustomers' => $recentCustomers,
            'topSelling' => $topSelling,
            'salesByCategory' => $salesByCategory,
            'stockAlertProducts' => $stockAlertProducts,
        ]);
    }
}
