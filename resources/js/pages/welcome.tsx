import { Head, Link, router } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

type Product = {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    image: string | null;
    stock_quantity: number;
};

type Props = {
    products: Product[];
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

export default function Welcome({ products }: Props) {
    return (
        <>
            <Head title="Home | ARENOLO STORE" />

            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-[#eeeee5]">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
                    <div className="max-w-xl">
                        <span className="mb-6 inline-block rounded-full bg-white px-5 py-2 text-xs font-bold tracking-[0.2em] text-[#8b9060] uppercase">
                            Welcome to ARENOLO Store
                        </span>

                        <h1 className="text-5xl leading-tight font-black tracking-tight md:text-7xl">
                            Find Your
                            <span className="block text-[#969b60]">
                                Everyday
                            </span>
                            Essentials.
                        </h1>

                        <p className="mt-7 max-w-md text-base leading-8 text-gray-600">
                            Discover quality products, amazing finds and
                            everyday essentials all in one place. Shopping made
                            simple, convenient and enjoyable.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link
                                href="/shop"
                                className="rounded-full bg-[#252820] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#a3a66b]"
                            >
                                Shop Now →
                            </Link>

                            <a
                                href="#featured"
                                className="rounded-full border border-gray-400 px-8 py-4 text-sm font-bold transition hover:bg-white"
                            >
                                Explore Products
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-8">
                            <div>
                                <p className="text-2xl font-black">Quality</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Products you can trust
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-black">Easy</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Online shopping
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-black">Secure</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Shopping experience
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-5 -right-5 h-40 w-40 rounded-full bg-[#d8d9bd] blur-2xl"></div>

                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
                            alt="Beautiful modern shopping store"
                            className="relative h-[400px] w-full rounded-3xl object-cover shadow-2xl md:h-[550px]"
                        />

                        <div className="absolute -bottom-5 left-5 rounded-2xl bg-white p-5 shadow-xl md:left-[-25px]">
                            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                Shopping made easy
                            </p>
                            <p className="mt-1 text-lg font-black">
                                Everything in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="border-b border-gray-100 bg-white py-9">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-3">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🚚</span>
                        <div>
                            <h3 className="font-bold">
                                Fast & Convenient Delivery
                            </h3>
                            <p className="text-sm text-gray-500">
                                Delivered right to your doorstep
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🔒</span>
                        <div>
                            <h3 className="font-bold">Secure Transactions</h3>
                            <p className="text-sm text-gray-500">
                                Shop with peace of mind
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl">💬</span>
                        <div>
                            <h3 className="font-bold">Dedicated Support</h3>
                            <p className="text-sm text-gray-500">
                                Always here to help you
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section id="featured" className="mx-auto max-w-7xl px-6 py-20">
                <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="mb-3 text-xs font-bold tracking-[0.25em] text-[#969b60] uppercase">
                            Our Collection
                        </p>
                        <h2 className="text-3xl font-black md:text-4xl">
                            Featured Products
                        </h2>
                        <p className="mt-3 text-gray-500">
                            Explore our latest and most popular items ready to
                            purchase today.
                        </p>
                    </div>

                    <Link
                        href="/shop"
                        className="border-b-2 border-[#969b60] pb-1 text-sm font-bold hover:text-[#969b60]"
                    >
                        View All Products →
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <Link
                                    href={`/shop/${product.slug}`}
                                    className="block"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-[#f0f0e9]">
                                        <img
                                            src={getProductImage(product.image)}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#777c4d] shadow-sm backdrop-blur-sm">
                                            Featured
                                        </span>
                                    </div>

                                    <div className="px-5 pt-5">
                                        <h3 className="line-clamp-1 text-base font-bold text-[#252820] group-hover:text-[#8b9060]">
                                            {product.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-stone-400">
                                            {product.stock_quantity > 0
                                                ? `${product.stock_quantity} in stock`
                                                : 'Out of stock'}
                                        </p>

                                        <p className="mt-3 text-xl font-black text-[#252820]">
                                            R{Number(product.price).toFixed(2)}
                                        </p>
                                    </div>
                                </Link>

                                <div className="p-5 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            className="flex-1 rounded-full border border-stone-200 px-3 py-2.5 text-center text-xs font-bold text-stone-700 transition hover:bg-stone-100"
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
                                            disabled={
                                                product.stock_quantity < 1
                                            }
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#252820] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#8b9060] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ShoppingBag className="h-3.5 w-3.5" />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full rounded-2xl bg-[#f0f0e9] p-10 text-center">
                            <h3 className="text-xl font-bold">
                                No featured products yet
                            </h3>
                            <p className="mt-2 text-gray-500">
                                Products will appear here once they are added to
                                your store.
                            </p>
                            <Link
                                href="/shop"
                                className="mt-5 inline-block font-bold text-[#777c4d]"
                            >
                                Visit our shop →
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="bg-[#252820] px-6 py-20 text-white">
                <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                    <div>
                        <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#c3c69a] uppercase">
                            Shopping with us
                        </p>

                        <h2 className="text-4xl leading-tight font-black md:text-5xl">
                            More than just shopping.
                            <span className="block text-[#c3c69a]">
                                It's an experience.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-lg leading-8 text-gray-300">
                            We believe finding the products you need should be
                            easy, seamless and enjoyable. Browse our curated
                            collection, discover your favourites and enjoy
                            speedy checkout from the comfort of your home.
                        </p>

                        <Link
                            href="/shop"
                            className="mt-8 inline-block rounded-full bg-[#c3c69a] px-8 py-4 text-sm font-bold text-[#252820] transition hover:bg-white"
                        >
                            Start Shopping →
                        </Link>
                    </div>

                    <img
                        src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1000"
                        alt="Shopping bags and retail shopping"
                        className="h-80 w-full rounded-3xl object-cover shadow-xl md:h-96"
                    />
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section
                id="contact"
                className="bg-[#eeeee5] px-6 py-20 text-center"
            >
                <p className="text-xs font-bold tracking-[0.25em] text-[#969b60] uppercase">
                    Don't miss out
                </p>

                <h2 className="mt-4 text-3xl font-black md:text-4xl">
                    Ready to find something you love?
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-gray-600">
                    Explore our complete catalog across clothing, electronics,
                    beauty, home and accessories.
                </p>

                <Link
                    href="/shop"
                    className="mt-8 inline-block rounded-full bg-[#252820] px-10 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#969b60]"
                >
                    Explore Our Shop →
                </Link>
            </section>
        </>
    );
}
