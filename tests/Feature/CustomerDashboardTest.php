<?php

use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

test('unauthenticated guests are redirected to login when visiting customer dashboard', function () {
    $this->get('/customer/dashboard')->assertRedirect('/login');
    $this->get('/customer/orders')->assertRedirect('/login');
    $this->get('/customer/purchase-history')->assertRedirect('/login');
    $this->get('/customer/tracking')->assertRedirect('/login');
    $this->get('/customer/profile')->assertRedirect('/login');
    $this->get('/customer/addresses')->assertRedirect('/login');
});

test('authenticated customer can access customer dashboard overview and see their statistics', function () {
    $customer = User::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $customer->id,
        'subtotal' => 250.00,
        'shipping_fee' => 0.00,
        'total_amount' => 250.00,
        'payment_status' => 'paid',
        'status' => 'delivered',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => null,
        'product_name' => 'Cozy Knit Sweater',
        'price' => 250.00,
        'quantity' => 1,
        'line_total' => 250.00,
    ]);

    $response = $this->actingAs($customer)->get('/customer/dashboard');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('customer/dashboard')
        ->has('metrics')
        ->where('metrics.total_orders', 1)
        ->where('metrics.total_spent', 250.00)
        ->where('metrics.delivered_orders', 1)
        ->has('recentOrders', 1)
        ->has('recentItems', 1)
    );
});

test('customer can only access and view their own orders', function () {
    $customerA = User::factory()->create();
    $customerB = User::factory()->create();

    $orderA = Order::factory()->create([
        'user_id' => $customerA->id,
        'tracking_number' => 'ARN-2026-AAAAAA',
    ]);

    $orderB = Order::factory()->create([
        'user_id' => $customerB->id,
        'tracking_number' => 'ARN-2026-BBBBBB',
    ]);

    // Customer A can view their own order
    $this->actingAs($customerA)
        ->get("/customer/orders/{$orderA->tracking_number}")
        ->assertOk();

    // Customer A CANNOT view Customer B's order -> 404
    $this->actingAs($customerA)
        ->get("/customer/orders/{$orderB->tracking_number}")
        ->assertNotFound();
});

test('customer purchase history displays items snapshot with historical price paid', function () {
    $customer = User::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $customer->id,
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => null,
        'product_name' => 'Mechanical Wireless Keyboard',
        'price' => 899.00,
        'quantity' => 2,
        'line_total' => 1798.00,
    ]);

    $response = $this->actingAs($customer)->get('/customer/purchase-history');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('customer/purchase-history')
        ->has('purchases.data', 1)
        ->where('purchases.data.0.product_name', 'Mechanical Wireless Keyboard')
        ->where('purchases.data.0.price_paid', 899.00)
        ->where('purchases.data.0.quantity', 2)
    );
});

test('customer can manage their own addresses and cannot modify other users addresses', function () {
    $customerA = User::factory()->create();
    $customerB = User::factory()->create();

    // Create address for customer A
    $response = $this->actingAs($customerA)->post('/customer/addresses', [
        'label' => 'Home Villa',
        'recipient_name' => 'Customer A',
        'phone' => '+27821234567',
        'street_address' => '123 Sunset Boulevard',
        'city' => 'Johannesburg',
        'province' => 'Gauteng',
        'postal_code' => '2196',
        'country' => 'South Africa',
        'is_default' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('customer_addresses', [
        'user_id' => $customerA->id,
        'label' => 'Home Villa',
        'is_default' => true,
    ]);

    $addressA = CustomerAddress::where('user_id', $customerA->id)->first();

    // Customer B attempts to update or delete Customer A's address -> 403 Forbidden
    $this->actingAs($customerB)
        ->put("/customer/addresses/{$addressA->id}", [
            'label' => 'Hacked',
            'recipient_name' => 'Hacker',
            'phone' => '+27829999999',
            'street_address' => '456 Fake Street',
            'city' => 'Pretoria',
            'postal_code' => '0001',
        ])
        ->assertForbidden();

    $this->actingAs($customerB)
        ->delete("/customer/addresses/{$addressA->id}")
        ->assertForbidden();
});

test('customer can update their profile information and phone number', function () {
    $customer = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
    ]);

    $response = $this->actingAs($customer)->patch('/customer/profile', [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '+27821112233',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $customer->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '+27821112233',
    ]);
});
