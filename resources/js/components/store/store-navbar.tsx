import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu, Package, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';

type SharedProps = {
    cartCount?: number;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
};

export default function StoreNavbar() {
    const { auth, cartCount = 0 } = usePage<SharedProps>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Brand Logo */}
                <Link
                    href="/"
                    className="text-2xl font-black tracking-tight text-[#252820] transition hover:opacity-90"
                >
                    ARENOLO<span className="text-[#8b9060]">STORE.</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex">
                    <Link
                        href="/"
                        className="transition hover:text-[#8b9060]"
                    >
                        Home
                    </Link>
                    <Link
                        href="/shop"
                        className="transition hover:text-[#8b9060]"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/track-order"
                        className="inline-flex items-center gap-1.5 transition hover:text-[#8b9060]"
                    >
                        <Package className="h-4 w-4" />
                        <span>Track Order</span>
                    </Link>
                    <Link
                        href="/#featured"
                        className="transition hover:text-[#8b9060]"
                    >
                        Featured
                    </Link>
                    <Link
                        href="/#about"
                        className="transition hover:text-[#8b9060]"
                    >
                        About Us
                    </Link>
                </nav>

                {/* Right Side: Cart + Customer Account Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Cart Button */}
                    <Link
                        href="/cart"
                        className="relative flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm font-semibold text-[#252820] shadow-sm transition hover:border-[#8b9060] hover:text-[#8b9060]"
                        title="Shopping Cart"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="hidden sm:inline">Cart</span>
                        {Number(cartCount) > 0 ? (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b9060] px-1.5 text-xs font-bold text-white transition-transform animate-in zoom-in">
                                {cartCount}
                            </span>
                        ) : (
                            <span className="text-xs text-stone-400">0</span>
                        )}
                    </Link>

                    {auth?.user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 sm:flex">
                                <User className="h-3.5 w-3.5 text-[#8b9060]" />
                                <span className="text-xs font-bold text-stone-700">
                                    {auth.user.name.split(' ')[0]}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hidden items-center gap-1 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 sm:inline-flex"
                                title="Sign Out"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                href="/login"
                                className="px-3 py-2 text-sm font-semibold text-stone-700 transition hover:text-[#8b9060]"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-[#252820] px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#8b9060]"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 md:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-stone-200 bg-white px-6 py-5 md:hidden">
                    <nav className="flex flex-col gap-3 text-base font-medium text-stone-700">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 hover:text-[#8b9060]"
                        >
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 hover:text-[#8b9060]"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/track-order"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 hover:text-[#8b9060]"
                        >
                            Track Order
                        </Link>
                        <Link
                            href="/#featured"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 hover:text-[#8b9060]"
                        >
                            Featured
                        </Link>
                        <Link
                            href="/#about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 hover:text-[#8b9060]"
                        >
                            About Us
                        </Link>

                        <div className="mt-4 border-t border-stone-100 pt-4">
                            {auth?.user ? (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-stone-500">
                                        Signed in as {auth.user.name}
                                    </p>
                                    <Link
                                        href="/track-order"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block rounded-xl border border-stone-200 py-2.5 text-center font-semibold text-stone-800"
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full rounded-xl bg-stone-100 py-2.5 text-center font-semibold text-stone-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="rounded-xl border border-stone-200 py-2.5 text-center font-semibold text-stone-800"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="rounded-xl bg-[#252820] py-2.5 text-center font-semibold text-white"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
