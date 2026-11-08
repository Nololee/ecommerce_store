
import { Head, Link } from '@inertiajs/react';

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
    };
    categories: Category[];
    filters: {
        search: string;
        category: string;
    };
};

export default function ShopIndex({
    products,
    categories,
    filters,
}: Props) {
    return (
        <>
            <Head title="Shop | Your Store" />

            <div className="min-h-screen bg-stone-50 text-stone-900">
                <header className="border-b border-stone-200 bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                        <Link href="/" className="text-xl font-bold tracking-wide">
                            YOUR STORE
                        </Link>

                        <nav className="flex items-center gap-6 text-sm font-medium">
                            <Link href="/" className="hover:text-emerald-800">
                                Home
                            </Link>
                            <Link href="/shop" className="text-emerald-800">
                                Shop
                            </Link>
                            <Link href="/login" className="hover:text-emerald-800">
                                Login
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-12">
                    <div className="mb-10">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-800">
                            Explore our collection
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight">
                            Find something you love.
                        </h1>

                        <p className="mt-3 max-w-xl text-stone-500">
                            Discover quality products across different
                            categories, all in one place.
                        </p>
                    </div>

                    <form
                        action="/shop"
                        method="GET"
                        className="mb-10 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-[1fr_240px_auto]"
                    >
                        <input
                            type="search"
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Search for products..."
                            className="h-12 rounded-xl border border-stone-200 px-4 outline-none focus:border-emerald-800"
                        />

                        <select
                            name="category"
                            defaultValue={filters.category}
                            className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none focus:border-emerald-800"
                        >
                            <option value="">All categories</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="h-12 rounded-xl bg-emerald-950 px-8 font-semibold text-white hover:bg-emerald-900"
                        >
                            Search
                        </button>
                    </form>

                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Our products</h2>
                        <p className="text-sm text-stone-500">
                            {products.data.length} products on this page
                        </p>
                    </div>

                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/shop/${product.slug}`}
                                    className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="aspect-square overflow-hidden bg-stone-100">
                                        <img
                                            src={
                                                product.image
                                                    ? `/storage/${product.image}`
                                                    : 'https://placehold.co/600x600?text=Product'
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-5">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                                            {product.category?.name ?? 'General'}
                                        </p>

                                        <h3 className="mt-2 font-bold">
                                            {product.name}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm text-stone-500">
                                            {product.description}
                                        </p>

                                        <div className="mt-5 flex items-center justify-between">
                                            <span className="text-lg font-bold">
                                                R{Number(product.price).toFixed(2)}
                                            </span>

                                            <span className="text-sm font-semibold text-emerald-800">
                                                View product →
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs text-stone-400">
                                            {product.stock_quantity > 0
                                                ? `${product.stock_quantity} in stock`
                                                : 'Out of stock'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
                            <h3 className="text-xl font-bold">
                                No products found
                            </h3>
                            <p className="mt-2 text-sm text-stone-500">
                                Try another search or select a different category.
                            </p>
                            <Link
                                href="/shop"
                                className="mt-5 inline-block font-semibold text-emerald-800"
                            >
                                View all products
                            </Link>
                        </div>
                    )}

                    <div className="mt-10 flex flex-wrap justify-center gap-2">
                        {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-lg border px-4 py-2 text-sm ${
                                    link.active
                                        ? 'border-emerald-950 bg-emerald-950 text-white'
                                        : 'border-stone-200 bg-white text-stone-700'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </main>

                <footer className="mt-16 border-t border-stone-200 bg-white px-6 py-8 text-center text-sm text-stone-500">
                    © {new Date().getFullYear()} Your Store. All rights reserved.
                </footer>
            </div>
        </>
    );
}
