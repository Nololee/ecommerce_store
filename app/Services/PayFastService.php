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

        $customBaseUrl = $config['callback_url'] ?? null;
        if (! empty($customBaseUrl)) {
            $returnUrl = rtrim($customBaseUrl, '/').'/checkout/payfast/'.$order->tracking_number.'/return';
            $cancelUrl = rtrim($customBaseUrl, '/').'/checkout/payfast/'.$order->tracking_number.'/cancel';
            $notifyUrl = rtrim($customBaseUrl, '/').'/checkout/payfast/notify';
        } else {
            $returnUrl = route('checkout.payfast.return', ['tracking_number' => $order->tracking_number]);
            $cancelUrl = route('checkout.payfast.cancel', ['tracking_number' => $order->tracking_number]);
            $notifyUrl = route('checkout.payfast.notify');
        }

        // Customer name splitting into first and last name
        $rawName = trim((string) $order->customer_name);
        $names = preg_split('/\s+/', $rawName, 2) ?: [];
        $nameFirst = ! empty($names[0]) ? $names[0] : 'Valued';
        $nameLast = ! empty($names[1]) ? $names[1] : 'Customer';

        // Check if URLs point to localhost or loopback IP
        $isLocalhost = str_contains($returnUrl, 'localhost') || str_contains($returnUrl, '127.0.0.1');

        // Base data array structured in PayFast official documentation sequence:
        // 1. Merchant Details
        // 2. URLs (return_url and cancel_url redirect in the user's browser, notify_url is server-to-server)
        // 3. Customer Details
        // 4. Transaction Details
        $data = [
            'merchant_id' => (string) $config['merchant_id'],
            'merchant_key' => (string) $config['merchant_key'],
            'return_url' => $returnUrl,
            'cancel_url' => $cancelUrl,
        ];

        // Only include notify_url if not localhost, or if a public tunnel/callback URL is configured, or in testing
        if (! $isLocalhost || ! empty($customBaseUrl) || app()->runningUnitTests()) {
            $data['notify_url'] = $notifyUrl;
        }

        $data['name_first'] = $nameFirst;
        $data['name_last'] = $nameLast;

        $customerEmail = trim((string) $order->customer_email);

        // PayFast Security Restriction: PayFast strictly prohibits a merchant from making a payment to their own account
        // ("Merchant is unable to receive payments from the same account").
        // In sandbox mode, if the order is placed with the merchant's registered account email or by an admin user,
        // rewrite the customer email to a sandbox buyer alias so PayFast sandbox allows the payment to complete for all users.
        if (! empty($config['sandbox'])) {
            $merchantEmail = strtolower((string) ($config['merchant_email'] ?? ''));
            $isAdmin = (bool) ($order->user?->is_admin ?? false);

            if ($isAdmin
                || ($merchantEmail !== '' && strtolower($customerEmail) === $merchantEmail)
                || str_contains(strtolower($customerEmail), 'bonolo.tshoane83@gmail.com')
            ) {
                $customerEmail = 'buyer_'.preg_replace('/^buyer_/', '', $customerEmail);
            }
        }

        $data['email_address'] = $customerEmail;

        $cellNumber = preg_replace('/[^0-9+]/', '', (string) ($order->customer_phone ?? ''));
        if (! empty($cellNumber)) {
            $data['cell_number'] = $cellNumber;
        }

        $data['m_payment_id'] = (string) $order->tracking_number;
        $data['amount'] = number_format((float) $order->total_amount, 2, '.', '');
        $data['item_name'] = 'Order #'.$order->tracking_number;

        // PayFast requirement: Omit any blank / empty parameters completely
        // from both the signature string calculation and the HTML form submission.
        $filteredData = [];
        foreach ($data as $key => $val) {
            $trimmed = trim((string) $val);
            if ($trimmed !== '') {
                $filteredData[$key] = $trimmed;
            }
        }

        // Generate MD5 signature (PayFast standard algorithm)
        $passphrase = $config['passphrase'] ?? null;
        $filteredData['signature'] = $this->generateSignature($filteredData, $passphrase);

        return $filteredData;
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
            $trimmed = trim((string) $val);
            if ($trimmed !== '') {
                $pfOutput .= $key.'='.urlencode($trimmed).'&';
            }
        }

        $pfOutput = rtrim($pfOutput, '&');

        if ($passphrase !== null && trim($passphrase) !== '') {
            $pfOutput .= '&passphrase='.urlencode(trim($passphrase));
        }

        return md5($pfOutput);
    }

    /**
     * Validate an incoming ITN (webhook) signature from PayFast.
     *
     * @param  array<string, mixed>  $data
     */
    public function validateSignature(array $data, ?string $passphrase = null): bool
    {
        if (empty($data['signature'])) {
            return false;
        }

        $receivedSignature = (string) $data['signature'];
        unset($data['signature']);

        $expectedSignature = $this->generateSignature($data, $passphrase);

        return hash_equals($expectedSignature, $receivedSignature);
    }

    /**
     * Get the PayFast process URL (Sandbox vs Live).
     */
    public function getProcessUrl(): string
    {
        return (string) config('services.payfast.url');
    }
}
