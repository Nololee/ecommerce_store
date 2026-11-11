<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $range = $request->input('range', '30_days');

        $startDate = match ($range) {
            'today' => Carbon::today(),
            '7_days' => Carbon::now()->subDays(7),
            'this_year' => Carbon::now()->startOfYear(),
            'all' => null,
            default => Carbon::now()->subDays(30),
        };

        $ordersQuery = Order::query()->when($startDate, fn ($q) => $q->where('created_at', '>=', $startDate));

        $totalSales = (float) (clone $ordersQuery)->where('payment_status', 'paid')->sum('total_amount');
        $ordersCount = (clone $ordersQuery)->count();
        $averageOrderValue = $ordersCount > 0 ? $totalSales / $ordersCount : 0;

        // Sales by day
        $salesTimeline = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total_orders'),
            DB::raw('SUM(CASE WHEN payment_status = "paid" THEN total_amount ELSE 0 END) as revenue')
        )
            ->when($startDate, fn ($q) => $q->where('created_at', '>=', $startDate))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        // Product performance
        $productPerformance = Product::withCount(['orderItems as units_sold' => function ($q) {
            $q->select(DB::raw('COALESCE(SUM(quantity), 0)'));
        }])
            ->withSum('orderItems as gross_sales', 'line_total')
            ->orderByDesc('gross_sales')
            ->take(10)
            ->get(['id', 'name', 'sku', 'price', 'stock_quantity']);

        return Inertia::render('admin/reports/index', [
            'metrics' => [
                'total_sales' => $totalSales,
                'orders_count' => $ordersCount,
                'average_order_value' => round($averageOrderValue, 2),
            ],
            'salesTimeline' => $salesTimeline,
            'productPerformance' => $productPerformance,
            'filters' => [
                'range' => $range,
            ],
        ]);
    }

    public function export(Request $request, string $type): StreamedResponse
    {
        $filename = "arenolo-{$type}-report-".now()->format('Y-m-d').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($type) {
            $handle = fopen('php://output', 'w');
            if (! is_resource($handle)) {
                return;
            }

            if ($type === 'orders') {
                fputcsv($handle, ['Tracking Number', 'Customer Name', 'Customer Email', 'Subtotal', 'Shipping', 'Total', 'Payment Status', 'Order Status', 'Created At']);
                Order::latest()->chunk(100, function ($orders) use ($handle) {
                    foreach ($orders as $order) {
                        fputcsv($handle, [
                            $order->tracking_number,
                            $order->customer_name,
                            $order->customer_email,
                            $order->subtotal,
                            $order->shipping_fee,
                            $order->total_amount,
                            $order->payment_status,
                            $order->status,
                            $order->created_at->toDateTimeString(),
                        ]);
                    }
                });
            } elseif ($type === 'products') {
                fputcsv($handle, ['ID', 'SKU', 'Name', 'Category', 'Price', 'Stock Quantity', 'Status']);
                Product::with('category')->latest()->chunk(100, function ($products) use ($handle) {
                    /** @var Product $product */
                    foreach ($products as $product) {
                        fputcsv($handle, [
                            $product->id,
                            $product->sku,
                            $product->name,
                            $product->category ? $product->category->name : 'Uncategorized',
                            $product->price,
                            $product->stock_quantity,
                            $product->is_active ? 'Active' : 'Inactive',
                        ]);
                    }
                });
            } elseif ($type === 'customers') {
                fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Status', 'Registered At']);
                User::where('is_admin', false)->latest()->chunk(100, function ($users) use ($handle) {
                    foreach ($users as $user) {
                        fputcsv($handle, [
                            $user->id,
                            $user->name,
                            $user->email,
                            $user->phone ?? 'N/A',
                            $user->is_active ? 'Active' : 'Suspended',
                            $user->created_at->toDateTimeString(),
                        ]);
                    }
                });
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
