<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Order;
use App\Services\PayFastService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PayFastPaymentController extends Controller
{
    public function __construct(private PayFastService $payFastService) {}

    /**
     * Show the PayFast redirect / auto-submit page.
     */
    public function redirect(Request $request, string $trackingNumber): Response|RedirectResponse
    {
        $order = Order::where('tracking_number', $trackingNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($order->payment_status === 'paid') {
            return redirect()->route('orders.show', $order->tracking_number);
        }

        $payload = $this->payFastService->generatePaymentPayload($order);
        $processUrl = $this->payFastService->getProcessUrl();

        return Inertia::render('checkout/payfast-redirect', [
            'order' => [
                'tracking_number' => $order->tracking_number,
                'total_amount' => (float) $order->total_amount,
                'customer_name' => $order->customer_name,
            ],
            'payload' => $payload,
            'processUrl' => $processUrl,
        ]);
    }

    /**
     * Customer returns to store after PayFast payment processing.
     */
    public function return(Request $request, string $trackingNumber): RedirectResponse
    {
        $order = Order::where('tracking_number', $trackingNumber)->firstOrFail();

        // In Sandbox / Test Mode, mark payment as paid if return from gateway
        if (config('services.payfast.sandbox') && $order->payment_status !== 'paid') {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'payment_transaction_id' => 'PF_SANDBOX_'.date('YmdHis'),
            ]);

            ActivityLog::record(
                'payment_completed',
                "PayFast Sandbox payment approved for Order #{$order->tracking_number}",
                $order,
                $request->user(),
                ['provider' => 'PayFast Sandbox', 'amount' => $order->total_amount]
            );
        }

        return redirect()->route('orders.show', $order->tracking_number)
            ->with('success', 'Your PayFast payment has been approved successfully!');
    }

    /**
     * Customer cancels payment on PayFast.
     */
    public function cancel(Request $request, string $trackingNumber): RedirectResponse
    {
        $order = Order::where('tracking_number', $trackingNumber)->firstOrFail();

        return redirect()->route('customer.orders.show', $order->tracking_number)
            ->with('error', 'Payment was cancelled. You can retry paying whenever you are ready.');
    }

    /**
     * PayFast ITN (Instant Transaction Notification) Webhook Callback.
     */
    public function notify(Request $request): HttpResponse
    {
        $pfData = $request->all();

        Log::info('PayFast ITN Received:', $pfData);

        if (empty($pfData['m_payment_id'])) {
            return response('Invalid ITN', 400);
        }

        $order = Order::where('tracking_number', $pfData['m_payment_id'])->first();

        if (! $order) {
            return response('Order Not Found', 404);
        }

        $paymentStatus = strtolower($pfData['payment_status'] ?? '');

        if ($paymentStatus === 'complete') {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'payment_transaction_id' => $pfData['pf_payment_id'] ?? 'PF_ITN_'.date('YmdHis'),
            ]);

            ActivityLog::record(
                'payment_completed',
                "PayFast ITN verified payment for Order #{$order->tracking_number}",
                $order,
                null,
                ['pf_payment_id' => $pfData['pf_payment_id'] ?? null, 'amount' => $pfData['amount_gross'] ?? null]
            );
        }

        return response('OK', 200);
    }
}
