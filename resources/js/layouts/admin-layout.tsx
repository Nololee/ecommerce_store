import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    CreditCard,
    ExternalLink,
    FileText,
    FolderTree,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Shield,
    ShoppingBag,
    Users,
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
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { auth, flash } = usePage<SharedProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const navigationSections = [
        {
            title: 'Overview',
            links: [
                {
                    name: 'Dashboard Overview',
                    href: '/admin',
                    icon: LayoutDashboard,
                    exact: true,
                },
                {
                    name: 'Sales & Analytics',
                    href: '/admin/reports',
                    icon: BarChart3,
                    exact: false,
                },
            ],
        },
        {
            title: 'Store Management',
            links: [
                {
                    name: 'Orders',
                    href: '/admin/orders',
                    icon: ShoppingBag,
                    exact: false,
                },
                {
                    name: 'Products Catalogue',
                    href: '/admin/products',
                    icon: Package,
                    exact: false,
                },
                {
                    name: 'Categories',
                    href: '/admin/categories',
                    icon: FolderTree,
                    exact: false,
                },
                {
                    name: 'Inventory Movements',
                    href: '/admin/inventory',
                    icon: History,
                    exact: false,
                },
            ],
        },
        {
            title: 'Users & Finance',
            links: [
                {
                    name: 'Customers',
                    href: '/admin/customers',
                    icon: Users,
                    exact: false,
                },
                {
                    name: 'Payments & Transactions',
                    href: '/admin/payments',
                    icon: CreditCard,
                    exact: false,
                },
                {
                    name: 'Audit & Activity Logs',
                    href: '/admin/activity-logs',
                    icon: Activity,
                    exact: false,
                },
            ],
        },
    ];

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return currentUrl === href || currentUrl === `${href}/`;
        }
        return currentUrl.startsWith(href);
    };

    return (
        <div className="flex min-h-screen bg-stone-100 font-sans text-stone-900 antialiased">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#161814] text-white shadow-2xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Logo */}
                <div className="flex h-18 items-center justify-between border-b border-stone-800/80 px-6">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b9060] text-white shadow-md">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-base tracking-tight text-white">ARENOLO</span>
                                <span className="rounded bg-[#8b9060]/30 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#d1d5a7]">
                                    Admin
                                </span>
                            </div>
                            <p className="text-[11px] text-stone-400">Back-Office Command Center</p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
                    {navigationSections.map((section) => (
                        <div key={section.title} className="space-y-1">
                            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                                {section.title}
                            </p>
                            {section.links.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href, link.exact);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                                            active
                                                ? 'bg-[#8b9060] text-white shadow-sm font-bold'
                                                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-stone-400'}`} />
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}

                    <div className="pt-2 border-t border-stone-800/60">
                        <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                            Storefront
                        </p>
                        <Link
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-white"
                        >
                            <span>Open Public Store</span>
                            <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
                        </Link>
                    </div>
                </div>

                {/* Footer User Info & Logout */}
                <div className="border-t border-stone-800/80 p-4 bg-[#121310]">
                    <div className="flex items-center justify-between">
                        <div className="truncate">
                            <p className="truncate text-xs font-bold text-white">
                                {auth?.user?.name ?? 'Store Administrator'}
                            </p>
                            <p className="truncate text-[11px] text-stone-400">
                                {auth?.user?.email ?? 'admin@arenolostore.com'}
                            </p>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-red-400 transition"
                            title="Sign out of Admin"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-18 items-center justify-between border-b border-stone-200 bg-white px-6 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="hidden sm:block">
                            <span className="text-xs font-medium text-stone-500">System Environment:</span>{' '}
                            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                Operational &bull; Production Mode
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-bold text-stone-900">{auth?.user?.name}</p>
                            <p className="text-[11px] text-stone-500 font-medium">Administrator Privilege</p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b9060]/20 font-bold text-[#676c3f]">
                            {auth?.user?.name?.[0] ?? 'A'}
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-xs font-semibold text-red-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Body */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
