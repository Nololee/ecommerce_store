import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    ExternalLink,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Shield,
    ShoppingBag,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

type SharedProps = {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage<SharedProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const navLinks = [
        {
            name: 'Dashboard & Reports',
            href: '/admin',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            name: 'Orders Management',
            href: '/admin/orders',
            icon: ShoppingBag,
            exact: false,
        },
        {
            name: 'Inventory & Products',
            href: '/admin/products',
            icon: Package,
            exact: false,
        },
    ];

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return currentUrl === href;
        }
        return currentUrl.startsWith(href);
    };

    return (
        <div className="flex min-h-screen bg-stone-100 font-sans text-stone-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#1c1f1a] text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Logo */}
                <div className="flex h-16 items-center justify-between border-b border-stone-800 px-6">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8b9060] text-white">
                            <Shield className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="font-black text-sm tracking-tight">ARENOLO</span>
                            <span className="ml-1 rounded bg-[#8b9060]/30 px-1.5 py-0.5 text-[10px] font-bold text-[#c3c69a]">
                                ADMIN
                            </span>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded p-1 text-stone-400 hover:text-white lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 space-y-1.5 px-4 py-6">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Back-Office Controls
                    </p>

                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href, link.exact);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition ${
                                    active
                                        ? 'bg-[#8b9060] text-white shadow-sm'
                                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-6">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                            External
                        </p>
                        <Link
                            href="/"
                            target="_blank"
                            className="mt-1.5 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-400 transition hover:bg-stone-800 hover:text-white"
                        >
                            <span>Open Client Storefront</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Footer User Info */}
                <div className="border-t border-stone-800 p-4">
                    <div className="flex items-center justify-between">
                        <div className="truncate">
                            <p className="truncate text-xs font-bold text-white">
                                {auth?.user?.name ?? 'Store Administrator'}
                            </p>
                            <p className="truncate text-[11px] text-stone-400">
                                {auth?.user?.email ?? 'admin@arenolostore.com'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="hidden items-center gap-2 text-xs font-semibold text-stone-500 sm:flex">
                            <span>Admin Console</span>
                            <span>/</span>
                            <span className="font-bold text-stone-900 capitalize">
                                {currentUrl.replace('/admin', '').replace('/', '') || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 sm:inline-block border border-emerald-200">
                            ● System Operational
                        </span>

                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-100"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Storefront</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
