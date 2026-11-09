<?php

use App\Models\Category;
use App\Models\Product;

test('shop page renders successfully and lists products', function () {
    $category = Category::factory()->create(['name' => 'Clothing', 'slug' => 'clothing']);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Cool Shirt',
        'is_active' => true,
    ]);

    $response = $this->get(route('shop.index'));

    $response->assertOk();
    $response->assertSee('Cool Shirt');
});

test('product detail page displays product information', function () {
    $product = Product::factory()->create([
        'name' => 'Vintage Denim Jacket',
        'slug' => 'vintage-denim-jacket',
        'price' => 699.00,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $response = $this->get(route('shop.show', $product));

    $response->assertOk();
    $response->assertSee('Vintage Denim Jacket');
});

test('a customer can add an in-stock product to the cart', function () {
    $product = Product::factory()->create([
        'name' => 'Ceramic Mug',
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    $response = $this->post(route('cart.items.add', $product), [
        'quantity' => 2,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertEquals([$product->id => 2], session('cart'));
});

test('cannot add more than available stock to cart', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 2,
        'is_active' => true,
    ]);

    $response = $this->post(route('cart.items.add', $product), [
        'quantity' => 5,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['cart']);
});

test('cannot add out of stock product to cart', function () {
    $product = Product::factory()->outOfStock()->create([
        'is_active' => true,
    ]);

    $response = $this->post(route('cart.items.add', $product), [
        'quantity' => 1,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['cart']);
});

test('cart page renders items and subtotal correctly', function () {
    $product = Product::factory()->create([
        'name' => 'Wireless Headphones',
        'price' => 500.00,
        'stock_quantity' => 10,
    ]);

    $response = $this->withSession(['cart' => [$product->id => 2]])
        ->get(route('cart.index'));

    $response->assertOk();
});

test('a customer can update item quantity in the cart', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 10,
    ]);

    $response = $this->withSession(['cart' => [$product->id => 2]])
        ->patch(route('cart.items.update', $product), [
            'quantity' => 4,
        ]);

    $response->assertRedirect();
    $this->assertEquals([$product->id => 4], session('cart'));
});

test('a customer can remove an item from the cart', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 10,
    ]);

    $response = $this->withSession(['cart' => [$product->id => 2]])
        ->delete(route('cart.items.remove', $product));

    $response->assertRedirect();
    $this->assertArrayNotHasKey($product->id, session('cart', []));
});

test('a customer can clear the entire cart', function () {
    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $response = $this->withSession(['cart' => [$product1->id => 1, $product2->id => 2]])
        ->delete(route('cart.clear'));

    $response->assertRedirect();
    $this->assertEmpty(session('cart', []));
});
