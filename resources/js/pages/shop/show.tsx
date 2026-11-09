import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    slug: string;
    sku?: string | null;
    description: string | null;
    price: string | number;
    stock_quantity: number;
    image: string | null;
    category: {
        id?: number;
        name: string;
        slug: string;
    } | null;
};

type Props = {
    product: Product;
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

export default function ProductShow({ product }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (product.stock_quantity <= 0) return;

        setIsAdding(true);
        router.post(
            `/cart/items/${product.id}`,
            { quantity },
            {
                preserveScroll: true,
                onFinish: () => setIsAdding(false),
            },
        );
    };

    return (
        <>
            <Head title={`${product.name} | ARENOLO STORE`} />

            <div className="bg-[#faf9f6] py-10">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-stone-500">
                        <Link href="/" className="hover:text-stone-900">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-stone-900">
                            Shop
                        </Link>
                        {product.category && (
                            <>
                                <span>/</span>
                                <Link
                                    href={`/shop?category=${product.category.slug}`}
                                    className="hover:text-stone-900"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <span>/</span>
                        <span className="truncate text-stone-900 font-semibold">{product.name}</span>
                    </nav>

                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Product Image */}
                        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-100">
                                <img
                                    src={getProductImage(product.image)}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />

                                {product.category && (
                                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#8b9060] shadow-sm backdrop-blur-sm">
                                        {product.category.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Info & Actions */}
                        <div className="flex flex-col justify-center">
                            {product.sku && (
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                                    SKU: {product.sku}
                                </p>
                            )}

                            <h1 className="mt-2 text-3xl font-black text-[#252820] sm:text-4xl">
                                {product.name}
                            </h1>

                            <div className="mt-4 flex items-baseline gap-4">
                                <span className="text-3xl font-black text-[#252820]">
                                    R{Number(product.price).toFixed(2)}
                                </span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                        product.stock_quantity > 0
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-red-50 text-red-600'
                                    }`}
                                >
                                    {product.stock_quantity > 0
                                        ? `${product.stock_quantity} in stock`
                                        : 'Out of stock'}
                                </span>
                            </div>

                            <p className="mt-6 text-base leading-relaxed text-stone-600">
                                {product.description || 'No detailed description available for this item.'}
                            </p>

                            {/* Quantity & Add to Cart */}
                            {product.stock_quantity > 0 ? (
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label htmlFor="quantity" className="text-sm font-semibold text-stone-700">
                                            Quantity:
                                        </label>

                                        <div className="flex items-center rounded-xl border border-stone-300 bg-white">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                                disabled={quantity <= 1}
                                                className="p-3 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>

                                            <span className="w-12 text-center text-sm font-bold text-stone-900">
                                                {quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => setQuantity((prev) => Math.min(product.stock_quantity, prev + 1))}
                                                disabled={quantity >= product.stock_quantity}
                                                className="p-3 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={isAdding}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#252820] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#8b9060] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                                        </button>

                                        <Link
                                            href="/cart"
                                            className="rounded-2xl border border-stone-300 bg-white px-6 py-4 text-sm font-bold text-stone-800 transition hover:bg-stone-50"
                                        >
                                            View Cart
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                                    <p className="font-bold">This item is currently out of stock.</p>
                                    <p className="mt-1 text-sm text-red-600">Please check back soon or browse our other items.</p>
                                </div>
                            )}

                            {/* Trust Perks */}
                            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-stone-200 pt-6 text-stone-600">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-[#8b9060]" />
                                    <span className="text-xs font-semibold">Prompt nationwide shipping</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-[#8b9060]" />
                                    <span className="text-xs font-semibold">Guaranteed quality & support</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b9060] hover:underline"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Continue Shopping</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
