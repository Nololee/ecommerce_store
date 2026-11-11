<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseHistoryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        // Customer's purchased items snapshot (historical price paid, actual purchased quantity)
        $items = OrderItem::whereHas('order', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['product.category', 'order'])
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (OrderItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_slug' => $item->product?->slug,
                'product_sku' => $item->product?->sku ?? 'N/A',
                'product_image' => $item->product?->image_url ?? $item->product?->image,
                'category_name' => $item->product?->category?->name,
                'price_paid' => (float) $item->price,
                'quantity' => $item->quantity,
                'line_total' => (float) $item->line_total,
                'order_tracking_number' => $item->order->tracking_number,
                'order_status' => $item->order->status,
                'purchased_at' => $item->created_at->format('M d, Y H:i'),
            ]);

        return Inertia::render('customer/purchase-history', [
            'purchases' => $items,
        ]);
    }
}
