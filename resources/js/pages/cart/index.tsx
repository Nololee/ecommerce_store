import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';

type SharedProps = {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
};

type CartItem = {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    image: string | null;
    stock_quantity: number;
    quantity: number;
    line_total: number;
    category?: {
        name: string;
    } | null;
};

type Props = {
    items: CartItem[];
    subtotal: number;
};

function getProductImage(image: string | null): string {
    if (!image) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    return `/storage/${image}`;
}

export default function CartIndex({ items, subtotal }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const formatPrice = (price: number) => `R${Number(price).toFixed(2)}`;

    const handleUpdateQuantity = (productId: number, newQuantity: number, maxStock: number) => {
        if (newQuantity < 1 || newQuantity > maxStock) return;

        setUpdatingId(productId);
        router.patch(
            `/cart/items/${productId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            },
        );
    };

    const handleRemoveItem = (productId: number) => {
        router.delete(`/cart/items/${productId}`, {
            preserveScroll: true,
        });
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to empty your cart?')) {
            router.delete('/cart', {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Shopping Cart | ARENOLO STORE" />

            <div className="bg-[#faf9f6] px-6 py-12 text-[#252820]">
                <main className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b9060]">
                                Your Shopping Bag
                            </p>
                            <h1 className="mt-2 text-4xl font-black sm:text-5xl">
                                Shopping Cart
                            </h1>
                            <p className="mt-2 text-sm text-stone-500">
                                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>

                        {items.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearCart}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 transition hover:text-red-800 hover:underline"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Clear Cart</span>
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-3xl border border-stone-200 bg-white px-6 py-20 text-center shadow-sm">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f0e9] text-[#8b9060]">
                                <ShoppingBag className="h-10 w-10" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold text-stone-900">
                                Your cart is currently empty
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-stone-500">
                                Looks like you haven't added anything to your cart yet. Explore our store to find products you'll love!
                            </p>

                            <Link
                                href="/shop"
                                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#252820] px-8 py-4 font-bold text-white shadow-md transition hover:bg-[#8b9060]"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>Start Shopping</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
                            {/* Items List */}
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition sm:flex-row"
                                    >
                                        {/* Product Thumbnail */}
                                        <Link
                                            href={`/shop/${item.slug}`}
                                            className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:w-32"
                                        >
                                            <img
                                                src={getProductImage(item.image)}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition hover:scale-105"
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <Link
                                                        href={`/shop/${item.slug}`}
                                                        className="font-bold text-stone-900 hover:text-[#8b9060]"
                                                    >
                                                        {item.name}
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-stone-400 hover:text-red-600"
                                                        title="Remove from cart"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <p className="mt-1 text-sm font-semibold text-stone-600">
                                                    {formatPrice(Number(item.price))} each
                                                </p>

                                                <p className="mt-1 text-xs text-stone-400">
                                                    {item.stock_quantity} available in stock
                                                </p>
                                            </div>

                                            {/* Quantity and Line Total */}
                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-stone-500">
                                                        Qty:
                                                    </span>

                                                    <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50">
                                                        <button
                                                            type="button"
                                                            disabled={item.quantity <= 1 || updatingId === item.id}
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity - 1,
                                                                    item.stock_quantity,
                                                                )
                                                            }
                                                            className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="h-3.5 w-3.5" />
                                                        </button>

                                                        <span className="w-9 text-center text-xs font-bold text-stone-900">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                item.quantity >= item.stock_quantity ||
                                                                updatingId === item.id
                                                            }
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity + 1,
                                                                    item.stock_quantity,
                                                                )
                                                            }
                                                            className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-base font-black text-[#252820]">
                                                        {formatPrice(item.line_total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b9060] hover:underline"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Continue Shopping</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Order Summary Sidebar */}
                            <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-stone-900">
                                    Order Summary
                                </h2>

                                <div className="mt-6 space-y-3 border-b border-stone-200 pb-5 text-sm">
                                    <div className="flex justify-between text-stone-600">
                                        <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                                        <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between text-stone-600">
                                        <span>Estimated Shipping</span>
                                        <span className="font-semibold text-emerald-700">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-baseline justify-between text-lg font-black text-[#252820]">
                                    <span>Total Amount</span>
                                    <span className="text-2xl">{formatPrice(subtotal)}</span>
                                </div>

                                <p className="mt-3 text-xs leading-relaxed text-stone-400">
                                    Taxes included where applicable. Delivery costs will be confirmed during checkout.
                                </p>

                                <div className="mt-6 space-y-3">
                                    <Link
                                        href="/checkout"
                                        className="block w-full rounded-2xl bg-[#252820] py-4 text-center font-bold text-white shadow-md transition hover:bg-[#8b9060]"
                                    >
                                        Proceed to Checkout →
                                    </Link>

                                    {!auth?.user && (
                                        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center text-xs text-stone-600">
                                            <p className="font-bold text-stone-900">
                                                Customer Account Required
                                            </p>
                                            <p className="mt-1 text-stone-500">
                                                Please sign in or register to complete your order.
                                            </p>
                                            <div className="mt-3 flex items-center justify-center gap-3 font-bold">
                                                <Link href="/login" className="text-[#8b9060] hover:underline">
                                                    Log In
                                                </Link>
                                                <span className="text-stone-300">•</span>
                                                <Link href="/register" className="text-[#8b9060] hover:underline">
                                                    Create Account
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/shop"
                                    className="mt-4 block text-center text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#8b9060]"
                                >
                                    ← Add More Items
                                </Link>
                            </aside>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
