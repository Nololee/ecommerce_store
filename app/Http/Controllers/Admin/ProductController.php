<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\InventoryLog;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $categoryId = $request->input('category_id');
        $stockFilter = $request->input('stock_filter'); // 'low', 'out', 'in'

        $products = Product::with('category')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($categoryId, fn ($q) => $q->where('category_id', $categoryId))
            ->when($stockFilter === 'low', fn ($q) => $q->where('stock_quantity', '<=', 10)->where('stock_quantity', '>', 0))
            ->when($stockFilter === 'out', fn ($q) => $q->where('stock_quantity', '<=', 0))
            ->when($stockFilter === 'in', fn ($q) => $q->where('stock_quantity', '>', 10))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search ?? '',
                'category_id' => $categoryId ?? '',
                'stock_filter' => $stockFilter ?? '',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable'],
            'image_file' => ['nullable', 'image', 'max:5120'], // max 5MB
            'is_active' => ['boolean'],
        ]);

        $imagePath = $validated['image'] ?? null;
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('products', 'public');
        }

        $slug = Str::slug($validated['name']);
        // Ensure slug uniqueness
        $count = Product::where('slug', 'like', "{$slug}%")->count();
        if ($count > 0) {
            $slug = "{$slug}-".($count + 1);
        }

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'sku' => strtoupper($validated['sku']),
            'price' => $validated['price'],
            'stock_quantity' => $validated['stock_quantity'],
            'description' => $validated['description'] ?? '',
            'image' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Record initial inventory log
        if ($product->stock_quantity > 0) {
            InventoryLog::create([
                'product_id' => $product->id,
                'user_id' => auth()->id(),
                'change_type' => 'initial_stock',
                'quantity_before' => 0,
                'quantity_change' => $product->stock_quantity,
                'quantity_after' => $product->stock_quantity,
                'reason' => 'Product catalogue creation',
            ]);
        }

        // Record Activity Log
        ActivityLog::record(
            'product_created',
            "Administrator created product {$product->name} (SKU: {$product->sku})",
            $product,
            auth()->user(),
            ['sku' => $product->sku, 'price' => $product->price, 'initial_stock' => $product->stock_quantity],
            'admin'
        );

        return back()->with('success', "Product {$product->name} created successfully.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku,'.$product->id],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['boolean'],
        ]);

        $imagePath = $product->image;
        if ($request->hasFile('image_file')) {
            // Delete old stored image if exists in storage
            if ($product->image && ! str_starts_with($product->image, 'http') && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image_file')->store('products', 'public');
        } elseif (isset($validated['image']) && $validated['image'] !== '') {
            $imagePath = $validated['image'];
        }

        $stockBefore = $product->stock_quantity;
        $stockAfter = (int) $validated['stock_quantity'];

        $product->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'sku' => strtoupper($validated['sku']),
            'price' => $validated['price'],
            'stock_quantity' => $stockAfter,
            'description' => $validated['description'] ?? '',
            'image' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($stockBefore !== $stockAfter) {
            $diff = $stockAfter - $stockBefore;
            InventoryLog::create([
                'product_id' => $product->id,
                'user_id' => auth()->id(),
                'change_type' => 'adjustment',
                'quantity_before' => $stockBefore,
                'quantity_change' => $diff,
                'quantity_after' => $stockAfter,
                'reason' => 'Administrator edited product stock',
            ]);
        }

        ActivityLog::record(
            'product_updated',
            "Administrator updated product {$product->name} (SKU: {$product->sku})",
            $product,
            auth()->user(),
            ['sku' => $product->sku, 'price' => $product->price, 'stock' => $product->stock_quantity],
            'admin'
        );

        return back()->with('success', "Product {$product->name} updated successfully.");
    }

    public function updateStock(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $stockBefore = $product->stock_quantity;
        $stockAfter = (int) $validated['stock_quantity'];
        $diff = $stockAfter - $stockBefore;

        $product->update([
            'stock_quantity' => $stockAfter,
        ]);

        InventoryLog::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'change_type' => 'adjustment',
            'quantity_before' => $stockBefore,
            'quantity_change' => $diff,
            'quantity_after' => $stockAfter,
            'reason' => $validated['reason'] ?? 'Manual stock level adjustment',
        ]);

        ActivityLog::record(
            'inventory_adjusted',
            "Stock quantity for {$product->name} changed from {$stockBefore} to {$stockAfter}",
            $product,
            auth()->user(),
            ['before' => $stockBefore, 'after' => $stockAfter, 'reason' => $validated['reason'] ?? 'Manual adjustment'],
            'admin'
        );

        return back()->with('success', "Stock for {$product->name} updated to {$stockAfter}.");
    }

    public function toggle(Product $product): RedirectResponse
    {
        $product->update([
            'is_active' => ! $product->is_active,
        ]);

        $status = $product->is_active ? 'activated' : 'deactivated';

        ActivityLog::record(
            'product_status_toggled',
            "Product {$product->name} was {$status}",
            $product,
            auth()->user(),
            ['is_active' => $product->is_active],
            'admin'
        );

        return back()->with('success', "Product {$product->name} is now {$status}.");
    }

    public function destroy(Product $product): RedirectResponse
    {
        // Safety guard: Check if product has existing orders
        if ($product->orderItems()->exists()) {
            return back()->with('error', "Cannot delete '{$product->name}' because it has existing order records. Deactivate it instead.");
        }

        $name = $product->name;
        if ($product->image && ! str_starts_with($product->image, 'http') && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        ActivityLog::record(
            'product_deleted',
            "Product {$name} was deleted by administrator",
            null,
            auth()->user(),
            ['name' => $name],
            'admin'
        );

        return back()->with('success', "Product '{$name}' has been safely deleted.");
    }
}
