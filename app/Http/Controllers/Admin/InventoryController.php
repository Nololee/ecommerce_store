<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $changeType = $request->input('change_type');

        $logs = InventoryLog::with(['product', 'user'])
            ->when($search, function ($q) use ($search) {
                $q->whereHas('product', function ($p) use ($search) {
                    $p->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($changeType, fn ($q) => $q->where('change_type', $changeType))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $stockSummary = [
            'total_products' => Product::count(),
            'total_stock' => Product::sum('stock_quantity'),
            'low_stock' => Product::where('stock_quantity', '<=', 10)->where('stock_quantity', '>', 0)->count(),
            'out_of_stock' => Product::where('stock_quantity', '<=', 0)->count(),
        ];

        return Inertia::render('admin/inventory/index', [
            'logs' => $logs,
            'summary' => $stockSummary,
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku', 'stock_quantity']),
            'filters' => [
                'search' => $search ?? '',
                'change_type' => $changeType ?? '',
            ],
        ]);
    }

    public function adjust(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity_change' => ['required', 'integer', 'not_in:0'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        /** @var Product $product */
        $product = Product::findOrFail($validated['product_id']);
        $before = $product->stock_quantity;
        $after = max(0, $before + $validated['quantity_change']);
        $actualChange = $after - $before;

        $product->update(['stock_quantity' => $after]);

        InventoryLog::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'change_type' => 'adjustment',
            'quantity_before' => $before,
            'quantity_change' => $actualChange,
            'quantity_after' => $after,
            'reason' => $validated['reason'],
        ]);

        $diffStr = $actualChange > 0 ? '+'.$actualChange : (string) $actualChange;

        return back()->with('success', "Stock adjusted for {$product->name}: {$before} to {$after} ({$diffStr}).");
    }
}
