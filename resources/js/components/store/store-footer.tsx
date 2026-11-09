import { Link } from '@inertiajs/react';

export default function StoreFooter() {
    return (
        <footer className="bg-[#171a15] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
                <div>
                    <h2 className="text-2xl font-black">
                        ARENOLO<span className="text-[#8b9060]">STORE.</span>
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-gray-400">
                        Your destination for quality fashion, electronics,
                        skincare, home decor and everyday essentials.
                    </p>
                </div>

                <div>
                    <h3 className="mb-4 font-bold text-white">Quick Links</h3>
                    <div className="flex flex-col gap-3 text-sm text-gray-400">
                        <Link href="/" className="transition hover:text-white">
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            className="transition hover:text-white"
                        >
                            Shop All Products
                        </Link>
                        <Link
                            href="/cart"
                            className="transition hover:text-white"
                        >
                            Shopping Cart
                        </Link>
                        <Link
                            href="/track-order"
                            className="transition hover:text-white"
                        >
                            Track Order
                        </Link>
                        <Link
                            href="/#about"
                            className="transition hover:text-white"
                        >
                            About Us
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 font-bold text-white">
                        Customer Account
                    </h3>
                    <div className="flex flex-col gap-3 text-sm text-gray-400">
                        <Link
                            href="/login"
                            className="transition hover:text-white"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="transition hover:text-white"
                        >
                            Register Account
                        </Link>
                        <Link
                            href="/track-order"
                            className="transition hover:text-white"
                        >
                            Order History & Tracking
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} ARENOLO STORE. All rights reserved.
            </div>
        </footer>
    );
}
