<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::with('category')
            ->where('is_active', true)
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');

                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $category = $request->input('category');

                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => Category::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
            ],
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load('category');

        if (auth()->check()) {
            ActivityLog::record(
                'product_view',
                "Customer viewed product {$product->name}",
                $product,
                auth()->user(),
                ['product_id' => $product->id, 'price' => $product->price],
                'customer'
            );
        }

        return Inertia::render('shop/show', [
            'product' => $product,
        ]);
    }
}
