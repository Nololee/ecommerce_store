<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

test('non-admin user is rejected with 403 on all admin endpoints', function () {
    $customer = User::factory()->create([
        'is_admin' => false,
        'is_active' => true,
    ]);

    $this->actingAs($customer)->get('/admin')->assertForbidden();
    $this->actingAs($customer)->get('/admin/products')->assertForbidden();
    $this->actingAs($customer)->get('/admin/categories')->assertForbidden();
    $this->actingAs($customer)->get('/admin/orders')->assertForbidden();
    $this->actingAs($customer)->get('/admin/customers')->assertForbidden();
    $this->actingAs($customer)->get('/admin/inventory')->assertForbidden();
    $this->actingAs($customer)->get('/admin/payments')->assertForbidden();
    $this->actingAs($customer)->get('/admin/activity-logs')->assertForbidden();
    $this->actingAs($customer)->get('/admin/reports')->assertForbidden();
});

test('unauthenticated guest is redirected to login from admin routes', function () {
    $this->get('/admin')->assertRedirect('/login');
    $this->get('/admin/orders')->assertRedirect('/login');
    $this->get('/admin/products')->assertRedirect('/login');
});

test('admin can access dashboard overview and retrieve metrics', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('metrics')
        ->has('trends')
        ->has('recentOrders')
        ->has('recentCustomers')
    );
});

test('admin can manage products with stock and activity logging', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    // Create product
    $createResponse = $this->actingAs($admin)->post('/admin/products', [
        'name' => 'Premium Noise Cancelling Headphones',
        'category_id' => $category->id,
        'sku' => 'TEST-HEADPHONES-01',
        'price' => 2499.00,
        'stock_quantity' => 25,
        'description' => 'High quality studio audio.',
        'is_active' => true,
    ]);

    $createResponse->assertRedirect();
    $this->assertDatabaseHas('products', [
        'sku' => 'TEST-HEADPHONES-01',
        'stock_quantity' => 25,
    ]);
    $this->assertDatabaseHas('inventory_logs', [
        'change_type' => 'initial_stock',
        'quantity_after' => 25,
    ]);
    $this->assertDatabaseHas('activity_logs', [
        'activity_type' => 'product_created',
        'actor_type' => 'admin',
    ]);

    $product = Product::where('sku', 'TEST-HEADPHONES-01')->first();

    // Update stock quantity
    $this->actingAs($admin)->patch("/admin/products/{$product->id}/stock", [
        'stock_quantity' => 40,
        'reason' => 'Inventory restock',
    ])->assertRedirect();

    expect($product->fresh()->stock_quantity)->toBe(40);
    $this->assertDatabaseHas('inventory_logs', [
        'product_id' => $product->id,
        'change_type' => 'adjustment',
        'quantity_before' => 25,
        'quantity_after' => 40,
        'quantity_change' => 15,
    ]);

    // Toggle active status
    $this->actingAs($admin)->patch("/admin/products/{$product->id}/toggle")->assertRedirect();
    expect($product->fresh()->is_active)->toBeFalse();
});

test('admin can manage categories and deletion is protected when products exist', function () {
    $admin = User::factory()->admin()->create();

    // Create category
    $this->actingAs($admin)->post('/admin/categories', [
        'name' => 'Mechanical Watches',
        'description' => 'Luxury timepieces',
    ])->assertRedirect();

    $category = Category::where('name', 'Mechanical Watches')->first();
    expect($category)->not->toBeNull();

    // Assign product to category
    Product::factory()->create([
        'category_id' => $category->id,
    ]);

    // Attempt delete -> should fail / prevent deletion
    $this->actingAs($admin)->delete("/admin/categories/{$category->id}")->assertRedirect();
    expect(Category::where('id', $category->id)->exists())->toBeTrue();
});

test('admin can view customers and toggle customer activation status', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->create(['is_admin' => false, 'is_active' => true]);

    $this->actingAs($admin)->get('/admin/customers')->assertOk();
    $this->actingAs($admin)->get("/admin/customers/{$customer->id}")->assertOk();

    // Toggle status (suspend)
    $this->actingAs($admin)->patch("/admin/customers/{$customer->id}/toggle-status")->assertRedirect();
    expect($customer->fresh()->is_active)->toBeFalse();

    // Re-activate
    $this->actingAs($admin)->patch("/admin/customers/{$customer->id}/toggle-status")->assertRedirect();
    expect($customer->fresh()->is_active)->toBeTrue();
});

test('admin cancelling an order automatically restocks the products and records inventory log', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create(['stock_quantity' => 10]);

    $order = Order::factory()->create([
        'status' => 'processing',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 3,
        'price' => $product->price,
        'line_total' => $product->price * 3,
    ]);

    // Cancel order
    $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'cancelled',
        'notes' => 'Customer requested cancellation before dispatch',
    ])->assertRedirect();

    expect($order->fresh()->status)->toBe('cancelled');
    expect($product->fresh()->stock_quantity)->toBe(13); // Restocked +3

    $this->assertDatabaseHas('inventory_logs', [
        'product_id' => $product->id,
        'change_type' => 'order_cancelled',
        'quantity_change' => 3,
        'quantity_after' => 13,
    ]);
});

test('admin can access inventory, payments, activity logs, and export CSV reports', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin/inventory')->assertOk();
    $this->actingAs($admin)->get('/admin/payments')->assertOk();
    $this->actingAs($admin)->get('/admin/activity-logs')->assertOk();
    $this->actingAs($admin)->get('/admin/reports')->assertOk();

    // CSV report exports
    $ordersExport = $this->actingAs($admin)->get('/admin/reports/export/orders');
    $ordersExport->assertOk();
    $ordersExport->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

    $productsExport = $this->actingAs($admin)->get('/admin/reports/export/products');
    $productsExport->assertOk();
    $productsExport->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

    $customersExport = $this->actingAs($admin)->get('/admin/reports/export/customers');
    $customersExport->assertOk();
    $customersExport->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
});
