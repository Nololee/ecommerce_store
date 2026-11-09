<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $lowStockOnly = $request->boolean('low_stock');

        $products = Product::with('category')
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->when($lowStockOnly, fn ($q) => $q->where('stock_quantity', '<=', 10))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'filters' => [
                'search' => $search ?? '',
                'low_stock' => $lowStockOnly,
            ],
        ]);
    }

    public function updateStock(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'stock_quantity' => ['required', 'integer', 'min:0'],
        ]);

        $product->update([
            'stock_quantity' => $validated['stock_quantity'],
        ]);

        return back()->with('success', "Stock for {$product->name} updated to {$validated['stock_quantity']}.");
    }

    public function toggle(Product $product): RedirectResponse
    {
        $product->update([
            'is_active' => ! $product->is_active,
        ]);

        $status = $product->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Product {$product->name} is now {$status}.");
    }
}
