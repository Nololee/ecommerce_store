<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $cart = $request->session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->withErrors([
                'cart' => 'Your cart is empty. Please add items before checking out.',
            ]);
        }

        $products = Product::whereIn('id', array_keys($cart))
            ->where('is_active', true)
            ->get();

        if ($products->isEmpty()) {
            return redirect()->route('cart.index')->withErrors([
                'cart' => 'Selected products are no longer available.',
            ]);
        }

        $items = $products->map(function ($product) use ($cart) {
            $quantity = min((int) ($cart[$product->id] ?? 1), $product->stock_quantity);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'image' => $product->image_url ?? $product->image,
                'quantity' => $quantity,
                'line_total' => (float) $product->price * $quantity,
            ];
        })->values();

        $subtotal = (float) $items->sum('line_total');
        $shippingFee = $subtotal >= 800 ? 0.00 : 75.00;
        $totalAmount = $subtotal + $shippingFee;

        $user = $request->user();

        return Inertia::render('checkout/index', [
            'items' => $items,
            'subtotal' => $subtotal,
            'shippingFee' => $shippingFee,
            'totalAmount' => $totalAmount,
            'customer' => [
                'name' => $user?->name ?? '',
                'email' => $user?->email ?? '',
                'phone' => '',
                'shipping_address' => '',
                'city' => '',
                'postal_code' => '',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $cart = $request->session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->withErrors([
                'cart' => 'Your cart is empty.',
            ]);
        }

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'payment_method' => ['required', 'string', 'in:card_sandbox,cod,eft_sandbox'],
            'card_number' => ['nullable', 'string'],
            'card_expiry' => ['nullable', 'string'],
            'card_cvv' => ['nullable', 'string'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Sandbox payment simulation check
        if ($validated['payment_method'] === 'card_sandbox') {
            $cleanedCardNumber = str_replace(' ', '', (string) ($validated['card_number'] ?? ''));
            if (str_ends_with($cleanedCardNumber, '0000')) {
                return back()->withInput()->withErrors([
                    'payment' => 'Sandbox payment declined: Simulated card failure for test card ending in 0000.',
                ]);
            }
        }

        $order = DB::transaction(function () use ($request, $validated, $cart) {
            $products = Product::whereIn('id', array_keys($cart))
                ->lockForUpdate()
                ->get();

            $subtotal = 0;
            $itemsData = [];

            foreach ($products as $product) {
                $requestedQty = (int) ($cart[$product->id] ?? 1);

                if (! $product->is_active || $product->stock_quantity < $requestedQty) {
                    abort(422, "Insufficient stock for {$product->name}. Only {$product->stock_quantity} available.");
                }

                $lineTotal = (float) $product->price * $requestedQty;
                $subtotal += $lineTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $requestedQty,
                    'line_total' => $lineTotal,
                ];

                // Decrement inventory (Inventory Management)
                $product->decrement('stock_quantity', $requestedQty);
            }

            $shippingFee = $subtotal >= 800 ? 0.00 : 75.00;
            $totalAmount = $subtotal + $shippingFee;

            $trackingNumber = 'ARN-'.date('Y').'-'.strtoupper(Str::random(6));

            $paymentStatus = match ($validated['payment_method']) {
                'card_sandbox' => 'paid',
                'eft_sandbox' => 'paid',
                'cod' => 'pending',
                default => 'paid',
            };

            $order = Order::create([
                'user_id' => $request->user()?->id,
                'tracking_number' => $trackingNumber,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total_amount' => $totalAmount,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $paymentStatus,
                'payment_transaction_id' => 'TXN_SANDBOX_'.strtoupper(Str::random(12)),
                'status' => 'processing',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($itemsData as $item) {
                $order->items()->create($item);
            }

            return $order;
        });

        // Clear cart session
        $request->session()->forget('cart');

        return redirect()->route('orders.show', $order->tracking_number)
            ->with('success', "Order #{$order->tracking_number} placed successfully!");
    }
}
