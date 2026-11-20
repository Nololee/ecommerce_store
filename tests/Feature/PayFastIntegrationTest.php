<?php

use App\Models\Order;
use App\Models\User;
use App\Services\PayFastService;

test('payfast service generates valid md5 signature with passphrase', function () {
    $service = new PayFastService;

    $data = [
        'merchant_id' => '10000100',
        'merchant_key' => '46f0cd694581a',
        'return_url' => 'http://localhost:8000/checkout/payfast/ARN-2026-TEST1/return',
        'cancel_url' => 'http://localhost:8000/checkout/payfast/ARN-2026-TEST1/cancel',
        'notify_url' => 'http://localhost:8000/checkout/payfast/notify',
        'name_first' => 'John',
        'name_last' => 'Doe',
        'email_address' => 'john@example.com',
        'm_payment_id' => 'ARN-2026-TEST1',
        'amount' => '150.00',
        'item_name' => 'Order #ARN-2026-TEST1',
    ];

    $signature = $service->generateSignature($data, 'jt7NOE43FZPn');

    // Build the expected string and verify MD5 hash matches PayFast standard
    $expectedString = 'merchant_id=10000100'
        .'&merchant_key=46f0cd694581a'
        .'&return_url='.urlencode('http://localhost:8000/checkout/payfast/ARN-2026-TEST1/return')
        .'&cancel_url='.urlencode('http://localhost:8000/checkout/payfast/ARN-2026-TEST1/cancel')
        .'&notify_url='.urlencode('http://localhost:8000/checkout/payfast/notify')
        .'&name_first=John'
        .'&name_last=Doe'
        .'&email_address='.urlencode('john@example.com')
        .'&m_payment_id=ARN-2026-TEST1'
        .'&amount=150.00'
        .'&item_name='.urlencode('Order #ARN-2026-TEST1')
        .'&passphrase=jt7NOE43FZPn';

    expect($signature)->toBe(md5($expectedString));
});

test('payfast service excludes empty fields from generated payload and signature', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'tracking_number' => 'ARN-2026-NO-PHONE',
        'customer_name' => 'Alice SingleName',
        'customer_email' => 'alice@example.com',
        'customer_phone' => '   ', // empty whitespace string
        'total_amount' => 350.00,
    ]);

    $service = new PayFastService;
    $payload = $service->generatePaymentPayload($order);

    expect($payload)->not->toHaveKey('cell_number');
    expect($payload)->toHaveKey('signature');
    expect($payload['merchant_id'])->toBe(config('services.payfast.merchant_id'));
    expect($payload['amount'])->toBe('350.00');

    // Verify signature validates with the payload
    expect($service->validateSignature($payload, config('services.payfast.passphrase')))->toBeTrue();
});

test('customer can view payfast redirect auto-submit page for pending order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'tracking_number' => 'ARN-2026-PF-REDIRECT',
        'payment_status' => 'pending',
        'total_amount' => 500.00,
    ]);

    $response = $this->actingAs($user)
        ->get(route('checkout.payfast.redirect', $order->tracking_number));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('checkout/payfast-redirect')
        ->has('payload.signature')
        ->where('payload.m_payment_id', 'ARN-2026-PF-REDIRECT')
        ->where('order.tracking_number', 'ARN-2026-PF-REDIRECT')
    );
});

test('payfast return callback updates order payment status in sandbox', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'tracking_number' => 'ARN-2026-RETURN-TEST',
        'payment_status' => 'pending',
        'status' => 'pending',
        'total_amount' => 250.00,
    ]);

    $response = $this->get(route('checkout.payfast.return', $order->tracking_number));

    $response->assertRedirect(route('shop.index'));
    expect($order->fresh()->payment_status)->toBe('paid');
    expect($order->fresh()->status)->toBe('processing');
    expect($order->fresh()->payment_transaction_id)->toStartWith('PF_SANDBOX_');
});

test('payfast cancel callback redirects gracefully to order tracking', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'tracking_number' => 'ARN-2026-CANCEL-TEST',
        'payment_status' => 'pending',
    ]);

    $response = $this->get(route('checkout.payfast.cancel', $order->tracking_number));

    $response->assertRedirect(route('orders.show', $order->tracking_number));
    $response->assertSessionHas('error');
    expect($order->fresh()->payment_status)->toBe('pending');
});

test('payfast itn webhook marks order as paid when payment status is complete', function () {
    $order = Order::factory()->create([
        'tracking_number' => 'ARN-2026-ITN-TEST',
        'payment_status' => 'pending',
        'status' => 'pending',
        'total_amount' => 450.00,
    ]);

    $itnData = [
        'm_payment_id' => 'ARN-2026-ITN-TEST',
        'pf_payment_id' => '12345678',
        'payment_status' => 'COMPLETE',
        'amount_gross' => '450.00',
        'amount_fee' => '-10.35',
        'amount_net' => '439.65',
    ];

    $response = $this->post(route('checkout.payfast.notify'), $itnData);

    $response->assertOk();
    expect($order->fresh()->payment_status)->toBe('paid');
    expect($order->fresh()->status)->toBe('processing');
    expect($order->fresh()->payment_transaction_id)->toBe('12345678');
});

test('payfast service aliases merchant or admin email in sandbox mode to avoid same-account rejection', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'bonolo.tshoane83@gmail.com',
    ]);

    $order = Order::factory()->create([
        'user_id' => $admin->id,
        'customer_name' => 'Bonolo Tshoane',
        'customer_email' => 'bonolo.tshoane83@gmail.com',
        'total_amount' => 120.00,
    ]);

    $service = new PayFastService;
    $payload = $service->generatePaymentPayload($order);

    expect($payload['email_address'])->toBe('buyer_bonolo.tshoane83@gmail.com');
    expect($service->validateSignature($payload, config('services.payfast.passphrase')))->toBeTrue();
});
