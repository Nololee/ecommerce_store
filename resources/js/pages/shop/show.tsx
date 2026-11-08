
import { Head, Link } from '@inertiajs/react';

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string | number;
    stock_quantity: number;
    image: string | null;
    category: {
        name: string;
        slug: string;
    } | null;
};

type Props = {
    product: Product;
};

export default function ProductShow({ product }: Props) {
    return (
        <>
            <Head title={`${product.name} | Your Store`} />

            <div className="min-h-screen bg-stone-50">
                <header className="border-b bg-white px-6 py-5">
                    <div className="mx-auto flex max-w-7xl justify-between">
                        <Link href="/" className="text-xl font-bold">
                            YOUR STORE
                        </Link>
                        <Link href="/shop" className="font-semibold text-emerald-800">
                            Back to shop
                        </Link>
                    </div>
                </header>

                <main className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl bg-white">
                        <img
                            src={
                                product.image
                                    ? `/storage/${product.image}`
                                    : 'https://placehold.co/800x800?text=Product'
                            }
                            alt={product.name}
                            className="aspect-square w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="font-semibold uppercase tracking-widest text-emerald-800">
                            {product.category?.name ?? 'General'}
                        </p>

                        <h1 className="mt-3 text-4xl font-bold">
                            {product.name}
                        </h1>

                        <p className="mt-5 text-2xl font-bold">
                            R{Number(product.price).toFixed(2)}
                        </p>

                        <p className="mt-6 leading-7 text-stone-600">
                            {product.description || 'No description available.'}
                        </p>

                        <p className="mt-6 text-sm text-stone-500">
                            {product.stock_quantity > 0
                                ? `${product.stock_quantity} available`
                                : 'Currently out of stock'}
                        </p>

                        <button
                            type="button"
                            disabled={product.stock_quantity <= 0}
                            className="mt-8 h-12 rounded-xl bg-emerald-950 px-8 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Shopping cart functionality will be added in the next phase"
                        >
                            {product.stock_quantity > 0
                                ? 'Add to cart (coming soon)'
                                : 'Out of stock'}
                        </button>

                        <Link
                            href="/shop"
                            className="mt-5 text-sm font-semibold text-emerald-800"
                        >
                            ← Continue shopping
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
