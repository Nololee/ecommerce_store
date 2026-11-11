import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    DollarSign,
    Package,
    ShoppingBag,
} from 'lucide-react';
import CustomerLayout from '@/layouts/customer/customer-layout';

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
    metrics: MetricData;
    statusCounts: Record<string, number>;
    recentOrders: RecentOrder[];
    recentItems: RecentItem[];
};

export default function CustomerDashboard({
    metrics,
    statusCounts,
    recentOrders,
    recentItems,
}: Props) {
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
        <CustomerLayout
            title="Dashboard Overview"
            subtitle="Overview of your orders, lifetime spending and purchased essentials."
            activeTab="overview"
        >
            <Head title="Customer Dashboard | Your Shopping Account" />

            <div className="space-y-8">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Orders */}
                    <div className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                                Total Orders
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8b9060]/10 text-[#8b9060]">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-black text-stone-900">
                                {metrics.total_orders}
                            </div>
                            <p className="mt-1 text-xs text-stone-500">
                                Lifetime orders placed
                            </p>
                        </div>
                    </div>

                    {/* Total Spent */}
                    <div className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                                Total Spent
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-black text-stone-900">
                                {formatCurrency(metrics.total_spent)}
                            </div>
                            <p className="mt-1 text-xs text-stone-500">
                                Settled customer purchases
                            </p>
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                                In Progress
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-black text-stone-900">
                                {metrics.pending_orders}
                            </div>
                            <p className="mt-1 text-xs text-stone-500">
                                Orders being prepped or processed
                            </p>
                        </div>
                    </div>

                    {/* Delivered Orders */}
                    <div className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                                Delivered
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-black text-stone-900">
                                {metrics.delivered_orders}
                            </div>
                            <p className="mt-1 text-xs text-stone-500">
                                Successfully completed orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Breakdown Bar */}
                <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                    <h2 className="text-sm font-bold tracking-wider text-stone-400 uppercase">
                        Order Status Breakdown
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {[
                            'pending',
                            'processing',
                            'shipped',
                            'delivered',
                            'cancelled',
                        ].map((st) => (
                            <div
                                key={st}
                                className="flex flex-col items-center justify-center rounded-2xl border border-stone-100 bg-stone-50/60 p-4 text-center"
                            >
                                <span className="text-xs font-bold text-stone-600 capitalize">
                                    {st}
                                </span>
                                <span className="mt-1 text-xl font-black text-stone-900">
                                    {statusCounts[st] ?? 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                        <div>
                            <h2 className="text-lg font-black text-stone-900">
                                Recent Orders
                            </h2>
                            <p className="mt-0.5 text-xs text-stone-500">
                                Your latest placed orders and tracking numbers
                            </p>
                        </div>
                        <Link
                            href="/customer/orders"
                            className="text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            View All Orders &rarr;
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="py-12 text-center">
                            <Package className="mx-auto h-12 w-12 text-stone-300" />
                            <h3 className="mt-3 text-sm font-bold text-stone-800">
                                No orders yet
                            </h3>
                            <p className="mt-1 text-xs text-stone-500">
                                You haven&apos;t placed any orders yet. Visit
                                our shop catalogue to get started!
                            </p>
                            <Link
                                href="/shop"
                                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#8b9060] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                            >
                                <ShoppingBag className="h-4 w-4" /> Start
                                Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-xs text-stone-600">
                                <thead className="border-b border-stone-100 bg-stone-50/60 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Order Number
                                        </th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Items</th>
                                        <th className="px-4 py-3">
                                            Total Amount
                                        </th>
                                        <th className="px-4 py-3">Payment</th>
                                        <th className="px-4 py-3">
                                            Fulfillment
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition hover:bg-stone-50/50"
                                        >
                                            <td className="px-4 py-3.5 font-bold text-stone-900">
                                                {order.tracking_number}
                                            </td>
                                            <td className="px-4 py-3.5 text-stone-500">
                                                {order.created_at}
                                            </td>
                                            <td className="px-4 py-3.5 font-medium">
                                                {order.items_count}{' '}
                                                {order.items_count === 1
                                                    ? 'item'
                                                    : 'items'}
                                            </td>
                                            <td className="px-4 py-3.5 font-bold text-stone-900">
                                                {formatCurrency(
                                                    order.total_amount,
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                        order.payment_status ===
                                                        'paid'
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : 'border-amber-200 bg-amber-50 text-amber-700'
                                                    }`}
                                                >
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${getStatusBadge(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/customer/orders/${order.tracking_number}`}
                                                        className="rounded-xl border border-stone-200 bg-white px-3 py-1 font-bold text-stone-700 hover:border-stone-400"
                                                    >
                                                        Details
                                                    </Link>
                                                    <Link
                                                        href={`/customer/tracking?tracking_number=${order.tracking_number}`}
                                                        className="rounded-xl bg-[#8b9060] px-3 py-1 font-bold text-white hover:bg-[#787c53]"
                                                    >
                                                        Track
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recently Purchased Items Grid */}
                <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                        <div>
                            <h2 className="text-lg font-black text-stone-900">
                                Recently Purchased Products
                            </h2>
                            <p className="mt-0.5 text-xs text-stone-500">
                                Snapshot of items you previously bought
                            </p>
                        </div>
                        <Link
                            href="/customer/purchase-history"
                            className="text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            View Full History &rarr;
                        </Link>
                    </div>

                    {recentItems.length === 0 ? (
                        <div className="py-10 text-center text-xs text-stone-400">
                            No purchased items on record yet.
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {recentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between rounded-2xl border border-stone-100 bg-stone-50/40 p-4 transition hover:border-stone-200 hover:bg-white"
                                >
                                    <div>
                                        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-stone-200">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-stone-400">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="line-clamp-2 text-xs font-bold text-stone-900">
                                            {item.product_name}
                                        </h3>
                                        <p className="mt-1 text-[11px] text-stone-500">
                                            Order #{item.order_tracking_number}
                                        </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2">
                                        <span className="text-xs font-bold text-stone-900">
                                            {formatCurrency(item.price)}
                                        </span>
                                        <span className="text-[11px] text-stone-500">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
