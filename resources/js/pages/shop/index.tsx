import { Head, Link, router } from '@inertiajs/react';
import { Search, ShoppingBag } from 'lucide-react';

type Category = {
    id: number;
    name: string;
    slug: string;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string | number;
    stock_quantity: number;
    image: string | null;
    category: Category | null;
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
        total?: number;
    };
    categories: Category[];
    filters: {
        search: string;
        category: string;
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

export default function ShopIndex({
    products,
    categories,
    filters,
}: Props) {
    return (
        <>
            <Head title="Shop | ARENOLO STORE" />

            <div className="bg-[#faf9f6] text-[#252820]">
                <main className="mx-auto max-w-7xl px-6 py-12">
                    {/* Header */}
                    <div className="mb-10">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8b9060]">
                            Explore Our Collection
                        </p>

                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            Curated For You.
                        </h1>

                        <p className="mt-3 max-w-2xl text-base text-stone-600">
                            Discover quality products across fashion, electronics, beauty, home essentials, and accessories.
                        </p>
                    </div>

                    {/* Filter / Search Bar */}
                    <form
                        action="/shop"
                        method="GET"
                        className="mb-8 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px_auto]"
                    >
                        <div className="relative flex items-center">
                            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-stone-400" />
                            <input
                                type="search"
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search products by name or description..."
                                className="h-12 w-full rounded-xl border border-stone-200 pl-11 pr-4 outline-none transition focus:border-[#8b9060]"
                            />
                        </div>

                        <select
                            name="category"
                            defaultValue={filters.category}
                            className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none transition focus:border-[#8b9060]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="h-12 rounded-xl bg-[#252820] px-8 font-semibold text-white shadow-sm transition hover:bg-[#8b9060]"
                        >
                            Search
                        </button>
                    </form>

                    {/* Category Quick Tags */}
                    <div className="mb-10 flex flex-wrap items-center gap-2">
                        <Link
                            href="/shop"
                            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                !filters.category
                                    ? 'bg-[#252820] text-white'
                                    : 'border border-stone-200 bg-white text-stone-700 hover:border-[#8b9060]'
                            }`}
                        >
                            All
                        </Link>
                        {categories.map((cat) => {
                            const isSelected = filters.category === cat.slug;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/shop?category=${cat.slug}`}
                                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                        isSelected
                                            ? 'bg-[#8b9060] text-white'
                                            : 'border border-stone-200 bg-white text-stone-700 hover:border-[#8b9060]'
                                    }`}
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Results Count */}
                    <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
                        <h2 className="text-xl font-bold">
                            {filters.category
                                ? categories.find((c) => c.slug === filters.category)?.name ?? 'Products'
                                : 'All Products'}
                        </h2>
                        <p className="text-sm text-stone-500">
                            Showing {products.data.length} items
                        </p>
                    </div>

                    {/* Products Grid */}
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => (
                                <div
                                    key={product.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <Link
                                        href={`/shop/${product.slug}`}
                                        className="block"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-stone-100">
                                            <img
                                                src={getProductImage(product.image)}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#8b9060] shadow-sm backdrop-blur-sm">
                                                {product.category?.name ?? 'General'}
                                            </span>
                                        </div>

                                        <div className="p-5 pb-3">
                                            <h3 className="line-clamp-1 font-bold text-stone-900 group-hover:text-[#8b9060]">
                                                {product.name}
                                            </h3>

                                            <p className="mt-1.5 line-clamp-2 text-xs text-stone-500">
                                                {product.description}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-lg font-black text-[#252820]">
                                                    R{Number(product.price).toFixed(2)}
                                                </span>

                                                <span className="text-xs font-semibold text-stone-400">
                                                    {product.stock_quantity > 0
                                                        ? `${product.stock_quantity} in stock`
                                                        : 'Out of stock'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Action Buttons */}
                                    <div className="p-5 pt-0">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/shop/${product.slug}`}
                                                className="flex-1 rounded-xl border border-stone-200 py-2.5 text-center text-xs font-bold text-stone-700 transition hover:bg-stone-50"
                                            >
                                                Details
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.post(
                                                        `/cart/items/${product.id}`,
                                                        { quantity: 1 },
                                                        { preserveScroll: true },
                                                    )
                                                }
                                                disabled={product.stock_quantity < 1}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#252820] py-2.5 text-xs font-bold text-white transition hover:bg-[#8b9060] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <ShoppingBag className="h-3.5 w-3.5" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-20 text-center">
                            <h3 className="text-2xl font-bold text-stone-800">
                                No products found
                            </h3>
                            <p className="mt-2 text-stone-500">
                                Try adjusting your search keyword or browse a different category.
                            </p>
                            <Link
                                href="/shop"
                                className="mt-6 inline-block rounded-xl bg-[#252820] px-6 py-3 font-semibold text-white transition hover:bg-[#8b9060]"
                            >
                                View all products
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="mt-12 flex flex-wrap justify-center gap-2">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                                        link.active
                                            ? 'border-[#252820] bg-[#252820] text-white'
                                            : 'border-stone-200 bg-white text-stone-700 hover:border-[#8b9060]'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
