import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    ExternalLink,
    MapPin,
    Package,
    Shield,
    ShoppingBag,
    ShoppingCart,
    Store,
    Truck,
} from 'lucide-react';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { dashboard } from '@/routes';
import type { DashboardInvitation, User } from '@/types';

type MetricData = {
    total_orders: number;
    total_spent: number;
    pending_orders: number;
    delivered_orders: number;
};

type RecentOrder = {
    id: number;
    tracking_number: string;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
    items_count: number;
};

type RecentItem = {
    id: number;
    product_id: number;
    product_name: string;
    product_slug?: string | null;
    product_image?: string | null;
    price: number;
    quantity: number;
    line_total: number;
    order_tracking_number: string;
    purchased_at: string;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    metrics?: MetricData;
    statusCounts?: Record<string, number>;
    recentOrders?: RecentOrder[];
    recentItems?: RecentItem[];
};

export default function Dashboard({
    pendingInvitations = [],
    metrics = {
        total_orders: 0,
        total_spent: 0,
        pending_orders: 0,
        delivered_orders: 0,
    },
    statusCounts = {},
    recentOrders = [],
    recentItems = [],
}: Props) {
    const page = usePage<{ auth?: { user?: User | null } }>();
    const user = page.props.auth?.user;
    const isAdmin = Boolean(user?.is_admin);

    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'shipped':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'processing':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-stone-50 text-stone-700 border-stone-200';
        }
    };

    return (
        <>
            <Head title="Store Dashboard - ARENOLO STORE" />

            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Admin Quick Switcher Banner */}
                {isAdmin && (
                    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-indigo-950">
                                    Administrator Privileges Active
                                </h2>
                                <p className="text-xs text-indigo-700">
                                    You have full access to sales analytics, inventory management, and customer orders.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <span>Open Admin Panel</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                )}

                {/* Dashboard Hero Header */}
                <div className="flex flex-col justify-between gap-4 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center lg:p-8 dark:border-sidebar-border dark:bg-sidebar">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#8b9060]/10 px-3 py-1 text-xs font-bold text-[#8b9060]">
                            <Store className="h-3.5 w-3.5" />
                            <span>ARENOLO E-COMMERCE</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-black tracking-tight text-stone-900 sm:text-3xl dark:text-white">
                            Welcome back, {user?.name ?? 'Shopper'}!
                        </h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Track your shipments, monitor purchases, and discover new arrivals.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#252820] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#8b9060] dark:bg-white dark:text-black dark:hover:bg-stone-200"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span>Shop Catalog</span>
                        </Link>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs transition hover:border-[#8b9060] hover:text-[#8b9060] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Cart</span>
                        </Link>
                        <Link
                            href="/customer/tracking"
                            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs transition hover:border-[#8b9060] hover:text-[#8b9060] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                        >
                            <Truck className="h-4 w-4" />
                            <span>Track Order</span>
                        </Link>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Orders */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-sidebar-border dark:bg-sidebar">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                Total Orders
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-stone-900 dark:text-white">
                                {metrics.total_orders}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-400">
                            Orders placed in your account
                        </p>
                    </div>

                    {/* Total Spent */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-sidebar-border dark:bg-sidebar">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                Total Spent
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-stone-900 dark:text-white">
                                {formatCurrency(metrics.total_spent)}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-400">
                            Verified completed purchases
                        </p>
                    </div>

                    {/* Pending Deliveries */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-sidebar-border dark:bg-sidebar">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                In Progress
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-stone-900 dark:text-white">
                                {metrics.pending_orders}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-400">
                            Processing or out for delivery
                        </p>
                    </div>

                    {/* Delivered Orders */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-sidebar-border dark:bg-sidebar">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                Delivered
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black text-stone-900 dark:text-white">
                                {metrics.delivered_orders}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-400">
                            Delivered successfully
                        </p>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="rounded-2xl border border-stone-200/80 bg-white shadow-xs dark:border-sidebar-border dark:bg-sidebar">
                    <div className="flex items-center justify-between border-b border-stone-100 p-5 dark:border-stone-800">
                        <div>
                            <h2 className="text-base font-bold text-stone-900 dark:text-white">
                                Recent Store Orders
                            </h2>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                                Track the progress and details of your latest purchases
                            </p>
                        </div>
                        <Link
                            href="/customer/orders"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            <span>View All Orders</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="p-5">
                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-stone-100 text-xs font-bold text-stone-400 uppercase dark:border-stone-800">
                                            <th className="pb-3">Tracking #</th>
                                            <th className="pb-3">Date</th>
                                            <th className="pb-3">Items</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3">Payment</th>
                                            <th className="pb-3 text-right">Amount</th>
                                            <th className="pb-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                        {recentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="group transition-colors hover:bg-stone-50/60 dark:hover:bg-stone-800/40"
                                            >
                                                <td className="py-3.5 font-mono text-xs font-semibold text-stone-900 dark:text-white">
                                                    <Link
                                                        href={`/customer/orders/${order.id}`}
                                                        className="hover:text-[#8b9060] hover:underline"
                                                    >
                                                        {order.tracking_number}
                                                    </Link>
                                                </td>
                                                <td className="py-3.5 text-xs text-stone-500">
                                                    {order.created_at}
                                                </td>
                                                <td className="py-3.5 text-xs text-stone-600 dark:text-stone-300">
                                                    {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                                                </td>
                                                <td className="py-3.5">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${getStatusBadge(order.status)}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                                            order.payment_status === 'paid'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                        }`}
                                                    >
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 text-right font-semibold text-stone-900 dark:text-white">
                                                    {formatCurrency(order.total_amount)}
                                                </td>
                                                <td className="py-3.5 text-right">
                                                    <Link
                                                        href={`/customer/orders/${order.id}`}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#8b9060] transition hover:text-stone-900 dark:hover:text-white"
                                                    >
                                                        <span>View</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <h3 className="mt-3 text-sm font-bold text-stone-900 dark:text-white">
                                    No orders placed yet
                                </h3>
                                <p className="mt-1 text-xs text-stone-500">
                                    When you place an order, it will appear here with real-time tracking.
                                </p>
                                <div className="mt-4">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#8b9060] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#7a7e53]"
                                    >
                                        <Store className="h-3.5 w-3.5" />
                                        <span>Start Shopping</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recently Purchased Items Grid (if any) */}
                {recentItems.length > 0 && (
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs dark:border-sidebar-border dark:bg-sidebar">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-stone-900 dark:text-white">
                                    Recently Purchased Items
                                </h2>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    Quickly reorder or view products you've bought previously
                                </p>
                            </div>
                            <Link
                                href="/customer/purchase-history"
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#8b9060] hover:underline"
                            >
                                <span>Purchase History</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {recentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-xl border border-stone-200/70 p-3 transition hover:border-[#8b9060] dark:border-stone-800"
                                >
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800">
                                        {item.product_image ? (
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-stone-400">
                                                <Package className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate text-xs font-bold text-stone-900 dark:text-white">
                                            {item.product_name}
                                        </h4>
                                        <p className="text-xs font-semibold text-[#8b9060]">
                                            {formatCurrency(item.price)}
                                        </p>
                                        <p className="text-[11px] text-stone-400">
                                            Qty: {item.quantity} · {item.purchased_at}
                                        </p>
                                    </div>
                                    <Link
                                        href={item.product_slug ? `/shop/${item.product_slug}` : '/'}
                                        className="shrink-0 rounded-lg border border-stone-200 p-2 text-stone-500 transition hover:border-[#8b9060] hover:text-[#8b9060] dark:border-stone-700"
                                        title="View product in store"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Dashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ],
});
