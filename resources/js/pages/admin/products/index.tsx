import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    Edit2,
    ExternalLink,
    Package,
    Search,
} from 'lucide-react';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    slug: string;
    sku?: string | null;
    price: string | number;
    stock_quantity: number;
    image: string | null;
    is_active: boolean;
    category?: {
        id: number;
        name: string;
    } | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string;
        low_stock: boolean;
    };
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

export default function AdminProductsIndex({ products, filters }: Props) {
    const [editingStockId, setEditingStockId] = useState<number | null>(null);
    const [tempStock, setTempStock] = useState<number>(0);

    const handleSaveStock = (productId: number) => {
        router.patch(
            `/admin/products/${productId}/stock`,
            { stock_quantity: tempStock },
            {
                preserveScroll: true,
                onSuccess: () => setEditingStockId(null),
            },
        );
    };

    const handleToggleActive = (productId: number) => {
        router.patch(
            `/admin/products/${productId}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Inventory Management | ARENOLO STORE" />

            <div className="min-h-screen bg-stone-50 p-6 text-[#252820]">
                <div className="mx-auto max-w-7xl">
                    {/* Header Top links */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b9060] hover:underline"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back to Admin Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/orders"
                                className="text-xs font-bold text-stone-600 hover:text-stone-900"
                            >
                                Orders
                            </Link>
                            <span className="text-stone-300">•</span>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Live Store</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-stone-900">
                                Product Inventory Management
                            </h1>
                            <p className="mt-1 text-sm text-stone-500">
                                Monitor warehouse stock levels, adjust unit quantities, and control storefront availability.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={filters.low_stock ? '/admin/products' : '/admin/products?low_stock=true'}
                                className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                                    filters.low_stock
                                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                }`}
                            >
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                                <span>{filters.low_stock ? 'Showing Low Stock (Clear)' : 'Filter Low Stock (≤ 10)'}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form
                        action="/admin/products"
                        method="GET"
                        className="mb-6 flex max-w-md gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                            <input
                                type="search"
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search by product name or SKU..."
                                className="h-10 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 text-xs outline-none focus:border-[#8b9060]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#252820] px-4 text-xs font-bold text-white transition hover:bg-[#8b9060]"
                        >
                            Search
                        </button>
                    </form>

                    {/* Inventory Table */}
                    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                        {products.data.length === 0 ? (
                            <div className="px-6 py-20 text-center">
                                <Package className="mx-auto h-12 w-12 text-stone-300" />
                                <h3 className="mt-4 text-xl font-bold text-stone-800">
                                    No products found
                                </h3>
                                <p className="mt-1 text-sm text-stone-500">
                                    Try clearing your search query or low stock filter.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        <tr>
                                            <th className="px-6 py-4">Product Details</th>
                                            <th className="px-6 py-4">SKU</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Stock Quantity</th>
                                            <th className="px-6 py-4">Availability</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {products.data.map((product) => {
                                            const isEditingThis = editingStockId === product.id;
                                            const isLowStock = product.stock_quantity <= 10;

                                            return (
                                                <tr key={product.id} className="hover:bg-stone-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={getProductImage(product.image)}
                                                                alt={product.name}
                                                                className="h-11 w-11 rounded-xl object-cover"
                                                            />
                                                            <div>
                                                                <p className="font-bold text-stone-900">
                                                                    {product.name}
                                                                </p>
                                                                <Link
                                                                    href={`/shop/${product.slug}`}
                                                                    target="_blank"
                                                                    className="text-[11px] text-[#8b9060] hover:underline"
                                                                >
                                                                    View product ↗
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 font-mono text-xs text-stone-500">
                                                        {product.sku ?? '—'}
                                                    </td>

                                                    <td className="px-6 py-4 text-xs font-semibold text-stone-600">
                                                        {product.category?.name ?? 'Uncategorised'}
                                                    </td>

                                                    <td className="px-6 py-4 font-bold text-stone-900">
                                                        R{Number(product.price).toFixed(2)}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {isEditingThis ? (
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={tempStock}
                                                                    onChange={(e) => setTempStock(Number(e.target.value))}
                                                                    className="h-8 w-20 rounded border border-stone-300 px-2 text-xs font-bold outline-none focus:border-[#8b9060]"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSaveStock(product.id)}
                                                                    className="flex h-8 w-8 items-center justify-center rounded bg-[#8b9060] text-white hover:bg-emerald-700"
                                                                    title="Save stock"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                                                                        product.stock_quantity === 0
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : isLowStock
                                                                              ? 'bg-amber-100 text-amber-900'
                                                                              : 'bg-emerald-50 text-emerald-800'
                                                                    }`}
                                                                >
                                                                    {product.stock_quantity} units
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingStockId(product.id);
                                                                        setTempStock(product.stock_quantity);
                                                                    }}
                                                                    className="text-stone-400 hover:text-stone-700"
                                                                    title="Edit stock count"
                                                                >
                                                                    <Edit2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleActive(product.id)}
                                                            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                                                                product.is_active
                                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                                                            }`}
                                                            title="Click to toggle status"
                                                        >
                                                            {product.is_active ? 'Active in Shop' : 'Hidden / Draft'}
                                                        </button>
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            href={`/shop/${product.slug}`}
                                                            target="_blank"
                                                            className="text-xs font-bold text-stone-600 hover:text-[#8b9060]"
                                                        >
                                                            Store View →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {products.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url ?? '#'}
                                    className={`rounded-xl border px-4 py-2 text-xs font-semibold ${
                                        link.active
                                            ? 'border-[#252820] bg-[#252820] text-white'
                                            : 'border-stone-200 bg-white text-stone-700'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
