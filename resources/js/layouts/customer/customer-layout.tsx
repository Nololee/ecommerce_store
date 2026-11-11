import { Link, router, usePage } from '@inertiajs/react';
import {
    Home,
    KeyRound,
    LayoutDashboard,
    LogOut,
    MapPin,
    Package,
    Shield,
    ShoppingBag,
    Truck,
    User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import StoreLayout from '@/layouts/store-layout';

type SharedProps = {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            is_admin?: boolean;
        } | null;
    };
};

interface CustomerLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    activeTab?: string;
}

export default function CustomerLayout({
    children,
    title = 'Customer Dashboard',
    subtitle = 'Manage your orders, deliveries, addresses and account preferences.',
    activeTab,
}: CustomerLayoutProps) {
    const { auth } = usePage<SharedProps>().props;

    const navItems = [
        {
            key: 'overview',
            label: 'Dashboard Overview',
            href: '/customer/dashboard',
            icon: LayoutDashboard,
        },
        {
            key: 'orders',
            label: 'My Orders',
            href: '/customer/orders',
            icon: Package,
        },
        {
            key: 'purchases',
            label: 'Purchase History',
            href: '/customer/purchase-history',
            icon: ShoppingBag,
        },
        {
            key: 'tracking',
            label: 'Track My Orders',
            href: '/customer/tracking',
            icon: Truck,
        },
        {
            key: 'profile',
            label: 'My Profile',
            href: '/customer/profile',
            icon: User,
        },
        {
            key: 'addresses',
            label: 'My Addresses',
            href: '/customer/addresses',
            icon: MapPin,
        },
        {
            key: 'settings',
            label: 'Account Settings',
            href: '/settings/profile',
            icon: Home,
        },
        {
            key: 'security',
            label: 'Change Password',
            href: '/settings/security',
            icon: KeyRound,
        },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <StoreLayout>
            <div className="bg-[#f7f6f2] py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Top Header Banner */}
                    <div className="mb-8 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8b9060]/15 px-3 py-1 text-xs font-bold tracking-wider text-[#696d42] uppercase">
                                        <User className="h-3 w-3" /> Customer
                                        Portal
                                    </span>
                                </div>
                                <h1 className="mt-2 text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
                                    {title}
                                </h1>
                                <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                                    {subtitle}
                                </p>
                            </div>

                            {/* Customer Profile Pill */}
                            <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3 sm:p-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8b9060] font-bold text-white shadow-xs">
                                    {auth?.user?.name
                                        ? auth.user.name.charAt(0).toUpperCase()
                                        : 'U'}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm leading-tight font-bold text-stone-900">
                                        {auth?.user?.name ?? 'Customer'}
                                    </p>
                                    <p className="max-w-[180px] truncate text-xs text-stone-500">
                                        {auth?.user?.email ?? ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Layout: Sidebar + Main Content */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar Navigation */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-2 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-sm">
                                <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                    Customer Menu
                                </div>

                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeTab === item.key;

                                        return (
                                            <Link
                                                key={item.key}
                                                href={item.href}
                                                className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition sm:text-sm ${
                                                    isActive
                                                        ? 'bg-[#8b9060] text-white shadow-sm'
                                                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`}
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="space-y-1 border-t border-stone-100 pt-2">
                                    {auth?.user?.is_admin && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post('/choose-view/exit')
                                            }
                                            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 sm:text-sm"
                                        >
                                            <Shield className="h-4 w-4 shrink-0 text-indigo-500" />
                                            <span>Back to Admin Panel</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 sm:text-sm"
                                    >
                                        <LogOut className="h-4 w-4 shrink-0 text-red-500" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Main Tab Content */}
                        <main className="min-w-0 lg:col-span-3">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
