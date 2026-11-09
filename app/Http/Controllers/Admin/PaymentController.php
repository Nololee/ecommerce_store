<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $payments = Order::select([
            'id',
            'tracking_number',
            'customer_name',
            'customer_email',
            'total_amount',
            'payment_method',
            'payment_status',
            'payment_transaction_id',
            'created_at',
        ])
            ->when($status, fn ($q) => $q->where('payment_status', $status))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('tracking_number', 'like', "%{$search}%")
                        ->orWhere('payment_transaction_id', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $metrics = [
            'total_collected' => (float) Order::where('payment_status', 'paid')->sum('total_amount'),
            'successful_count' => Order::where('payment_status', 'paid')->count(),
            'pending_count' => Order::where('payment_status', 'pending')->count(),
            'failed_count' => Order::where('payment_status', 'failed')->count(),
            'refunded_count' => Order::where('payment_status', 'refunded')->count(),
        ];

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'metrics' => $metrics,
            'filters' => [
                'status' => $status ?? '',
                'search' => $search ?? '',
            ],
        ]);
    }
}
