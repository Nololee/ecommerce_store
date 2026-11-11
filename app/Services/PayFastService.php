<?php

namespace App\Services;

use App\Models\Order;

class PayFastService
{
    /**
     * Build the payload and signature for PayFast checkout redirection.
     *
     * @return array<string, string>
     */
    public function generatePaymentPayload(Order $order): array
    {
        $config = config('services.payfast');

        $returnUrl = route('checkout.payfast.return', ['tracking_number' => $order->tracking_number]);
        $cancelUrl = route('checkout.payfast.cancel', ['tracking_number' => $order->tracking_number]);
        $notifyUrl = route('checkout.payfast.notify');

        // Customer name splitting
        $names = explode(' ', trim($order->customer_name), 2);
        $nameFirst = $names[0] ?? 'Valued';
        $nameLast = $names[1] ?? 'Customer';

        $data = [
            'merchant_id' => (string) $config['merchant_id'],
            'merchant_key' => (string) $config['merchant_key'],
            'return_url' => $returnUrl,
            'cancel_url' => $cancelUrl,
            'notify_url' => $notifyUrl,
            'name_first' => $nameFirst,
            'name_last' => $nameLast,
            'email_address' => $order->customer_email,
            'cell_number' => $order->customer_phone,
            'm_payment_id' => $order->tracking_number,
            'amount' => number_format((float) $order->total_amount, 2, '.', ''),
            'item_name' => 'Order #'.$order->tracking_number.' - ARENOLO Store',
            'item_description' => 'Online purchase from ARENOLO STORE',
        ];

        // Generate MD5 signature (PayFast standard algorithm)
        $signature = $this->generateSignature($data, $config['passphrase']);
        $data['signature'] = $signature;

        return $data;
    }

    /**
     * Generate MD5 signature according to PayFast specification.
     *
     * @param  array<string, string>  $data
     */
    public function generateSignature(array $data, ?string $passphrase = null): string
    {
        // Drop any pre-existing signature parameter
        unset($data['signature']);

        $pfOutput = '';
        foreach ($data as $key => $val) {
            if ($val !== '') {
                $pfOutput .= $key.'='.urlencode(trim((string) $val)).'&';
            }
        }

        $pfOutput = substr($pfOutput, 0, -1);

        if ($passphrase !== null && $passphrase !== '') {
            $pfOutput .= '&passphrase='.urlencode(trim($passphrase));
        }

        return md5($pfOutput);
    }

    /**
     * Get the PayFast process URL (Sandbox vs Live).
     */
    public function getProcessUrl(): string
    {
        return (string) config('services.payfast.url');
    }
}
