import { Head, Link, router } from '@inertiajs/react';
import { Eye, Package, ShoppingBag, Truck } from 'lucide-react';
import CustomerLayout from '@/layouts/customer/customer-layout';

type OrderItem = {
    id: number;
    product_name: string;
    product_slug?: string | null;
    product_image?: string | null;
    price: number;
    quantity: number;
    line_total: number;
};

type Order = {
    id: number;
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    shipping_address: string;
    city: string;
    postal_code: string;
    subtotal: number;
    shipping_fee: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    status: string;
    notes?: string | null;
    created_at: string;
    items_count: number;
    items: OrderItem[];
};

type PaginatedOrders = {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Props = {
    orders: PaginatedOrders;
    filters: {
        status: string;
    };
    statusCounts: Record<string, number>;
};

export default function CustomerOrdersIndex({
    orders,
    filters,
    statusCounts,
}: Props) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    const filterStatus = (statusKey: string) => {
        router.get(
            '/customer/orders',
            { status: statusKey === 'all' ? undefined : statusKey },
            { preserveState: true },
        );
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

    const filterOptions = [
        { key: 'all', label: 'All Orders' },
        { key: 'pending', label: 'Pending' },
        { key: 'processing', label: 'Processing' },
        { key: 'shipped', label: 'Shipped' },
        { key: 'delivered', label: 'Delivered' },
        { key: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <CustomerLayout
            title="My Orders"
            subtitle="View your order history, items ordered, payment statuses and tracking details."
            activeTab="orders"
        >
            <Head title="My Orders | Customer Dashboard" />

            <div className="space-y-6">
                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-stone-200/80 bg-white p-2.5 shadow-xs">
                    {filterOptions.map((opt) => {
                        const count = statusCounts[opt.key] ?? 0;
                        const isSelected = filters.status === opt.key;

                        return (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => filterStatus(opt.key)}
                                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition ${
                                    isSelected
                                        ? 'bg-[#8b9060] text-white shadow-xs'
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                            >
                                <span>{opt.label}</span>
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                        isSelected
                                            ? 'bg-white/25 text-white'
                                            : 'bg-stone-100 text-stone-600'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Orders List */}
                {orders.data.length === 0 ? (
                    <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
                        <Package className="mx-auto h-12 w-12 text-stone-300" />
                        <h3 className="mt-4 text-base font-bold text-stone-800">
                            No orders found
                        </h3>
                        <p className="mt-1 text-xs text-stone-500">
                            {filters.status === 'all'
                                ? "You haven't placed any orders yet."
                                : `No orders with status "${filters.status}" were found.`}
                        </p>
                        <Link
                            href="/shop"
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#8b9060] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                        >
                            <ShoppingBag className="h-4 w-4" /> Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <div
                                key={order.id}
                                className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xs transition hover:border-stone-300"
                            >
                                {/* Header bar */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-stone-50/70 px-6 py-4">
                                    <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600">
                                        <div>
                                            <span className="block text-[11px] font-bold text-stone-400 uppercase">
                                                Order Number
                                            </span>
                                            <span className="font-mono font-bold text-stone-900">
                                                {order.tracking_number}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-[11px] font-bold text-stone-400 uppercase">
                                                Order Date
                                            </span>
                                            <span className="font-semibold text-stone-700">
                                                {order.created_at}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-[11px] font-bold text-stone-400 uppercase">
                                                Total Amount
                                            </span>
                                            <span className="font-bold text-stone-900">
                                                {formatCurrency(
                                                    order.total_amount,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase ${
                                                order.payment_status === 'paid'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                            }`}
                                        >
                                            Payment: {order.payment_status}
                                        </span>

                                        <span
                                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase ${getStatusBadge(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Items in Order */}
                                <div className="divide-y divide-stone-100 px-6 py-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-3.5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                                                    {item.product_image ? (
                                                        <img
                                                            src={
                                                                item.product_image
                                                            }
                                                            alt={
                                                                item.product_name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-stone-300">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-stone-900 sm:text-sm">
                                                        {item.product_name}
                                                    </h4>
                                                    <p className="mt-0.5 text-xs text-stone-500">
                                                        Qty: {item.quantity}{' '}
                                                        &times;{' '}
                                                        {formatCurrency(
                                                            item.price,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-xs font-bold text-stone-900 sm:text-sm">
                                                    {formatCurrency(
                                                        item.line_total,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions Footer */}
                                <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/30 px-6 py-3.5">
                                    <div className="text-xs text-stone-500">
                                        Ship to:{' '}
                                        <span className="font-medium text-stone-700">
                                            {order.shipping_address},{' '}
                                            {order.city}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/customer/orders/${order.tracking_number}`}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 shadow-2xs hover:border-stone-400"
                                        >
                                            <Eye className="h-3.5 w-3.5" />{' '}
                                            Order Details
                                        </Link>

                                        <Link
                                            href={`/customer/tracking?tracking_number=${order.tracking_number}`}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b9060] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#787c53]"
                                        >
                                            <Truck className="h-3.5 w-3.5" />{' '}
                                            Track Journey
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination Links */}
                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                {orders.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url ?? '#'}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                            link.active
                                                ? 'bg-[#8b9060] text-white'
                                                : link.url
                                                  ? 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                                  : 'cursor-not-allowed text-stone-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
