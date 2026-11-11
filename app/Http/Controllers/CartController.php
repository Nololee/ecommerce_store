<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $request->session()->get('cart', []);

        $products = Product::with('category')
            ->whereIn('id', array_keys($cart))
            ->get();

        $items = $products->map(function (Product $product) use ($cart) {
            $quantity = (int) ($cart[$product->id] ?? 1);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'image' => $product->image_url ?? $product->image,
                'image_url' => $product->image_url ?? $product->image,
                'stock_quantity' => $product->stock_quantity,
                'quantity' => $quantity,
                'line_total' => (float) $product->price * $quantity,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
            ];
        })->values();

        return Inertia::render('cart/index', [
            'items' => $items,
            'subtotal' => (float) $items->sum('line_total'),
        ]);
    }

    public function add(Request $request, Product $product): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        if ($product->stock_quantity < 1) {
            return back()->withErrors([
                'cart' => 'This product is currently out of stock.',
            ]);
        }

        $validated = $request->validate([
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $quantity = (int) ($validated['quantity'] ?? 1);

        $cart = $request->session()->get('cart', []);
        $newQuantity = ($cart[$product->id] ?? 0) + $quantity;

        if ($newQuantity > $product->stock_quantity) {
            return back()->withErrors([
                'cart' => "Only {$product->stock_quantity} items are available in stock.",
            ]);
        }

        $cart[$product->id] = $newQuantity;

        $request->session()->put('cart', $cart);

        if ($request->user()) {
            ActivityLog::record(
                'cart_add',
                "Customer added {$quantity}x {$product->name} to cart",
                $product,
                $request->user(),
                ['quantity' => $quantity, 'total_in_cart' => $newQuantity],
                'customer'
            );
        }

        return back()->with('success', "Added {$product->name} to your cart.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        if (! $product->is_active || $validated['quantity'] > $product->stock_quantity) {
            return back()->withErrors([
                'cart' => "The requested quantity exceeds available stock ({$product->stock_quantity}).",
            ]);
        }

        $cart = $request->session()->get('cart', []);

        if (! isset($cart[$product->id])) {
            return back();
        }

        $cart[$product->id] = (int) $validated['quantity'];

        $request->session()->put('cart', $cart);

        return back()->with('success', 'Cart updated successfully.');
    }

    public function remove(Request $request, Product $product): RedirectResponse
    {
        $cart = $request->session()->get('cart', []);

        unset($cart[$product->id]);

        $request->session()->put('cart', $cart);

        if ($request->user()) {
            ActivityLog::record(
                'cart_remove',
                "Customer removed {$product->name} from cart",
                $product,
                $request->user(),
                ['product_id' => $product->id],
                'customer'
            );
        }

        return back()->with('success', "Removed {$product->name} from your cart.");
    }

    public function clear(Request $request): RedirectResponse
    {
        $request->session()->forget('cart');

        return back()->with('success', 'Your shopping cart has been cleared.');
    }
}
