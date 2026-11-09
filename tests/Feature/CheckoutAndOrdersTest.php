<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

test('unauthenticated customer is redirected to login when visiting checkout', function () {
    $product = Product::factory()->create([
        'price' => 200.00,
        'stock_quantity' => 10,
    ]);

    $response = $this->withSession(['cart' => [$product->id => 2]])
        ->get(route('checkout.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated customer can access checkout with cart items', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 200.00,
        'stock_quantity' => 10,
    ]);

    $response = $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 2]])
        ->get(route('checkout.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('checkout/index'));
});

test('checkout fails when cart is empty', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('checkout.index'));

    $response->assertRedirect(route('cart.index'));
});

test('a registered customer can place an order using sandbox card payment which decrements stock and clears cart', function () {
    $user = User::factory()->create([
        'name' => 'Thabo Mokoena',
        'email' => 'thabo@example.com',
    ]);

    $product = Product::factory()->create([
        'name' => 'Leather Wallet',
        'price' => 250.00,
        'stock_quantity' => 15,
        'is_active' => true,
    ]);

    $orderData = [
        'customer_name' => 'Thabo Mokoena',
        'customer_email' => 'thabo@example.com',
        'customer_phone' => '+27 82 555 1234',
        'shipping_address' => '45 Main Street',
        'city' => 'Pretoria',
        'postal_code' => '0001',
        'payment_method' => 'card_sandbox',
        'card_number' => '4242 4242 4242 4242',
        'card_expiry' => '12/28',
        'card_cvv' => '123',
    ];

    $response = $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 3]])
        ->post(route('checkout.store'), $orderData);

    $response->assertRedirect();

    // Check order created and tied to authenticated user
    $order = Order::where('customer_email', 'thabo@example.com')->first();
    expect($order)->not->toBeNull();
    expect($order->user_id)->toBe($user->id);
    expect($order->payment_status)->toBe('paid');
    expect($order->status)->toBe('processing');
    expect($order->items)->toHaveCount(1);

    // Verify inventory management decremented stock: 15 - 3 = 12
    expect($product->fresh()->stock_quantity)->toBe(12);

    // Verify session cart is cleared
    $this->assertEmpty(session('cart', []));
});

test('sandbox payment fails if test card ends in 0000', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $orderData = [
        'customer_name' => 'Test User',
        'customer_email' => 'test@example.com',
        'customer_phone' => '123456789',
        'shipping_address' => 'Street',
        'city' => 'City',
        'postal_code' => '1234',
        'payment_method' => 'card_sandbox',
        'card_number' => '4000 0000 0000 0000',
    ];

    $response = $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 1]])
        ->post(route('checkout.store'), $orderData);

    $response->assertSessionHasErrors(['payment']);
    expect(Order::count())->toBe(0);
});

test('a customer can view their order tracking page via tracking number', function () {
    $order = Order::factory()->create([
        'tracking_number' => 'ARN-2026-TEST99',
        'customer_name' => 'Lerato Khumalo',
        'status' => 'shipped',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_name' => 'Smartwatch Series 5',
        'price' => 1299.00,
        'quantity' => 1,
        'line_total' => 1299.00,
    ]);

    $response = $this->get(route('orders.show', 'ARN-2026-TEST99'));

    $response->assertOk();
    $response->assertSee('ARN-2026-TEST99');
    $response->assertSee('Lerato Khumalo');
});

test('guest and non-admin customers cannot access admin dashboard', function () {
    // Unauthenticated guest
    $response = $this->get(route('admin.dashboard'));
    $response->assertRedirect(route('login'));

    // Regular customer (non-admin)
    $customer = User::factory()->create(['is_admin' => false]);
    $response2 = $this->actingAs($customer)->get(route('admin.dashboard'));
    $response2->assertForbidden();
});

test('admin can access dashboard and view sales reports metrics', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/dashboard'));
});

test('admin can update order status and payment status', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create([
        'status' => 'processing',
        'payment_status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.orders.status', $order), [
        'status' => 'shipped',
    ]);

    $response->assertRedirect();
    expect($order->fresh()->status)->toBe('shipped');

    $response2 = $this->actingAs($admin)->patch(route('admin.orders.payment', $order), [
        'payment_status' => 'paid',
    ]);

    $response2->assertRedirect();
    expect($order->fresh()->payment_status)->toBe('paid');
});

test('admin can update product inventory stock quantity directly', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create([
        'stock_quantity' => 5,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.products.stock', $product), [
        'stock_quantity' => 45,
    ]);

    $response->assertRedirect();
    expect($product->fresh()->stock_quantity)->toBe(45);
});
