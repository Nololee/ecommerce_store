<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderTrackingController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Storefront Home
Route::get('/', function () {
    return Inertia::render('welcome', [
        'products' => Product::with('category')
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->latest()
            ->take(8)
            ->get([
                'id',
                'category_id',
                'name',
                'slug',
                'price',
                'image',
                'stock_quantity',
            ]),
    ]);
})->name('home');

// Shop catalogue & product details
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/{product:slug}', [ShopController::class, 'show'])->name('shop.show');

// Shopping Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/items/{product}', [CartController::class, 'add'])->name('cart.items.add');
Route::patch('/cart/items/{product}', [CartController::class, 'update'])->name('cart.items.update');
Route::delete('/cart/items/{product}', [CartController::class, 'remove'])->name('cart.items.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

// Checkout Process & Sandbox Payment (Requires Registered & Authenticated Account)
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

// Order Tracking
Route::get('/track-order', [OrderTrackingController::class, 'index'])->name('orders.track');
Route::get('/orders/{tracking_number}', [OrderTrackingController::class, 'show'])->name('orders.show');

// Admin Panel (Protected: Admin Only)
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', EnsureUserIsAdmin::class])
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::patch('/products/{product}/stock', [AdminProductController::class, 'updateStock'])->name('products.stock');
        Route::patch('/products/{product}/toggle', [AdminProductController::class, 'toggle'])->name('products.toggle');

        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        Route::patch('/orders/{order}/payment', [AdminOrderController::class, 'updatePaymentStatus'])->name('orders.payment');
    });

// Authenticated Team / User Dashboard
Route::prefix('{current_team}')
    ->middleware(['auth',  EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
