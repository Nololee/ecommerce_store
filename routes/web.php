<?php

use App\Http\Controllers\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
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
        // Dashboard
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Products
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
        Route::patch('/products/{product}/stock', [AdminProductController::class, 'updateStock'])->name('products.stock');
        Route::patch('/products/{product}/toggle', [AdminProductController::class, 'toggle'])->name('products.toggle');

        // Categories
        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        Route::patch('/orders/{order}/payment', [AdminOrderController::class, 'updatePaymentStatus'])->name('orders.payment');

        // Customers
        Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
        Route::get('/customers/{customer}', [AdminCustomerController::class, 'show'])->name('customers.show');
        Route::patch('/customers/{customer}/toggle-status', [AdminCustomerController::class, 'toggleStatus'])->name('customers.toggle-status');

        // Inventory Management
        Route::get('/inventory', [AdminInventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory/adjust', [AdminInventoryController::class, 'adjust'])->name('inventory.adjust');

        // Payments
        Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');

        // Activity & Audit Logs
        Route::get('/activity-logs', [AdminActivityLogController::class, 'index'])->name('activity-logs.index');

        // Reports & Analytics
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/export/{type}', [AdminReportController::class, 'export'])->name('reports.export');
    });

// Customer standard dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

Route::get('/team-invitations/{invitation}', [TeamInvitationController::class, 'accept'])
    ->middleware(['auth', EnsureTeamMembership::class])
    ->name('team-invitations.accept');
Route::post('/team-invitations/{invitation}/decline', [TeamInvitationController::class, 'decline'])
    ->middleware(['auth', EnsureTeamMembership::class])
    ->name('team-invitations.decline');

require __DIR__.'/settings.php';
