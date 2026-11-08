
import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

const products = [
    {
        id: 1,
        name: 'Everyday Tote Bag',
        category: 'Accessories',
        price: 'R349.00',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=700',
        label: 'Bestseller',
    },
    {
        id: 2,
        name: 'Classic Sneakers',
        category: 'Footwear',
        price: 'R899.00',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700',
        label: 'Popular',
    },
    {
        id: 3,
        name: 'Minimal Watch',
        category: 'Accessories',
        price: 'R599.00',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
        label: 'New arrival',
    },
    {
        id: 4,
        name: 'Ceramic Coffee Set',
        category: 'Home & Living',
        price: 'R249.00',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=700',
        label: 'Featured',
    },
];

export default function Welcome() {
    const { auth, currentTeam } = usePage().props;

    const dashboardUrl = currentTeam
        ? dashboard(currentTeam.slug)
        : '/';

    return (
        <>
            <Head title="Home | ARENOLO STORE" />

            <div className="min-h-screen bg-[#faf9f6] text-[#252820]">

                {/* NAVIGATION */}
                <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                        <Link href="/" className="text-2xl font-black tracking-tight">
                            ARENOLO<span className="text-[#a3a66b]">STORE.</span>
                        </Link>

                        <nav className="hidden items-center gap-9 text-sm font-medium md:flex">
                            <Link href="/" className="text-[#a3a66b]">Home</Link>
                            <Link href="/shop" className="hover:text-[#a3a66b]">Shop</Link>
                            <a href="#featured" className="hover:text-[#a3a66b]">Featured</a>
                            <a href="#about" className="hover:text-[#a3a66b]">About Us</a>
                            <a href="#contact" className="hover:text-[#a3a66b]">Contact</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="rounded-full bg-[#252820] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a3a66b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hidden text-sm font-semibold hover:text-[#a3a66b] sm:block"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-[#252820] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a3a66b]"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* HERO SECTION */}
                <section className="relative overflow-hidden bg-[#eeeee5]">
                    <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">

                        <div className="max-w-xl">
                            <span className="mb-6 inline-block rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b9060]">
                                Welcome to ARENOLO Store
                            </span>

                            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
                                Find Your
                                <span className="block text-[#969b60]">
                                    Everyday
                                </span>
                                Essentials.
                            </h1>

                            <p className="mt-7 max-w-md text-base leading-8 text-gray-600">
                                Discover quality products, amazing finds and
                                everyday essentials all in one place.
                                Shopping made simple, convenient and enjoyable.
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
                                    <p className="mt-1 text-xs text-gray-500">Products you can trust</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black">Easy</p>
                                    <p className="mt-1 text-xs text-gray-500">Online shopping</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black">Secure</p>
                                    <p className="mt-1 text-xs text-gray-500">Shopping experience</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[#d8d9bd] blur-2xl"></div>

                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
                                alt="Beautiful modern shopping store"
                                className="relative h-[400px] w-full rounded-3xl object-cover shadow-2xl md:h-[550px]"
                            />

                            <div className="absolute -bottom-5 left-5 rounded-2xl bg-white p-5 shadow-xl md:left-[-25px]">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
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
                                <h3 className="font-bold">Convenient Delivery</h3>
                                <p className="text-sm text-gray-500">Shop from anywhere</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🔒</span>
                            <div>
                                <h3 className="font-bold">Secure Payments</h3>
                                <p className="text-sm text-gray-500">Shop with confidence</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl">💬</span>
                            <div>
                                <h3 className="font-bold">Customer Support</h3>
                                <p className="text-sm text-gray-500">We're here to help</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* FEATURED PRODUCTS */}
                <section id="featured" className="mx-auto max-w-7xl px-6 py-20">

                    <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#969b60]">
                                Our Collection
                            </p>
                            <h2 className="text-3xl font-black md:text-4xl">
                                Featured Products
                            </h2>
                            <p className="mt-3 text-gray-500">
                                Take a look at some of the products available in our store.
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
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="relative overflow-hidden bg-[#f0f0e9]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#777c4d]">
                                        {product.label}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        {product.category}
                                    </p>

                                    <h3 className="mt-2 text-lg font-bold">
                                        {product.name}
                                    </h3>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-lg font-black">
                                            {product.price}
                                        </span>

                                        <Link
                                            href="/shop"
                                            className="rounded-full bg-[#252820] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#969b60]"
                                        >
                                            View Item
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>

                {/* ABOUT SECTION */}
                <section id="about" className="bg-[#252820] px-6 py-20 text-white">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

                        <div>
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#c3c69a]">
                                Shopping with us
                            </p>

                            <h2 className="text-4xl font-black leading-tight md:text-5xl">
                                More than just shopping.
                                <span className="block text-[#c3c69a]">
                                    It's an experience.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg leading-8 text-gray-300">
                                We believe finding the products you need should
                                be easy and enjoyable. Browse our collection,
                                discover your favourites and shop from the
                                comfort of your home.
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
                            className="h-80 w-full rounded-3xl object-cover md:h-96"
                        />

                    </div>
                </section>

                {/* NEWSLETTER / CALL TO ACTION */}
                <section className="bg-[#eeeee5] px-6 py-20 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#969b60]">
                        Don't miss out
                    </p>

                    <h2 className="mt-4 text-3xl font-black md:text-4xl">
                        Ready to find something you love?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-gray-600">
                        Explore our collection and discover products
                        selected with you in mind.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-8 inline-block rounded-full bg-[#252820] px-10 py-4 text-sm font-bold text-white transition hover:bg-[#969b60]"
                    >
                        Explore Our Shop →
                    </Link>
                </section>

                {/* FOOTER */}
                <footer id="contact" className="bg-[#171a15] px-6 py-12 text-white">
                    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">

                        <div>
                            <h2 className="text-2xl font-black">
                                ARENOLO<span className="text-[#a3a66b]">STORE.</span>
                            </h2>
                            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
                                Your destination for quality products and
                                convenient online shopping.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold">Quick Links</h3>
                            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
                                <Link href="/" className="hover:text-white">Home</Link>
                                <Link href="/shop" className="hover:text-white">Shop</Link>
                                <a href="#featured" className="hover:text-white">Featured Products</a>
                                <a href="#about" className="hover:text-white">About Us</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold">Customer Account</h3>
                            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
                                {!auth.user && (
                                    <>
                                        <Link href={login()} className="hover:text-white">Login</Link>
                                        <Link href={register()} className="hover:text-white">Create Account</Link>
                                    </>
                                )}
                                <Link href="/shop" className="hover:text-white">Browse Products</Link>
                            </div>
                        </div>

                    </div>

                    <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} ARENOLO Store. All rights reserved.
                    </div>
                </footer>

            </div>
        </>
    );
}
