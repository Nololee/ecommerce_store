import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Package, ShoppingBag } from 'lucide-react';

type Order = {
    id: number;
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    items_count?: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    orders: {
        data: Order[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status: string;
    };
};

export default function AdminOrdersIndex({ orders, filters }: Props) {
    const formatPrice = (price: number) => `R${Number(price).toFixed(2)}`;

    const statuses = [
        { label: 'All Orders', value: '' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-emerald-100 text-emerald-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-amber-100 text-amber-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-stone-100 text-stone-800';
        }
    };

    return (
        <>
            <Head title="Order Management | ARENOLO STORE" />

            <div className="min-h-screen bg-stone-50 p-6 text-[#252820]">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b9060] hover:underline"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back to Admin Dashboard</span>
                        </Link>

                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Storefront</span>
                        </Link>
                    </div>

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-stone-900">
                                Customer Orders
                            </h1>
                            <p className="mt-1 text-sm text-stone-500">
                                Fulfill, inspect and update customer purchase orders.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 shadow-sm">
                            Total Orders: {orders.total}
                        </div>
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        {statuses.map((s) => (
                            <Link
                                key={s.value}
                                href={s.value ? `/admin/orders?status=${s.value}` : '/admin/orders'}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    filters.status === s.value
                                        ? 'bg-[#252820] text-white shadow-sm'
                                        : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                {s.label}
                            </Link>
                        ))}
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                        {orders.data.length === 0 ? (
                            <div className="px-6 py-20 text-center">
                                <Package className="mx-auto h-12 w-12 text-stone-300" />
                                <h3 className="mt-4 text-xl font-bold text-stone-800">
                                    No orders found
                                </h3>
                                <p className="mt-1 text-sm text-stone-500">
                                    No orders matching this status filter have been placed yet.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        <tr>
                                            <th className="px-6 py-4">Order Ref</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Payment</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-stone-50/50">
                                                <td className="px-6 py-4 font-mono text-xs font-bold text-stone-900">
                                                    #{order.tracking_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-stone-900">{order.customer_name}</p>
                                                    <p className="text-xs text-stone-400">{order.customer_email}</p>
                                                </td>
                                                <td className="px-6 py-4 font-black text-stone-900">
                                                    {formatPrice(order.total_amount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                                                            order.payment_status === 'paid'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                        }`}
                                                    >
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusBadge(
                                                            order.status,
                                                        )}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="text-xs font-bold text-[#8b9060] hover:underline"
                                                    >
                                                        View Order →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {orders.links && orders.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {orders.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url ?? '#'}
                                    className={`rounded-xl border px-4 py-2 text-xs font-semibold ${
                                        link.active
                                            ? 'border-[#252820] bg-[#252820] text-white'
                                            : 'border-stone-200 bg-white text-stone-700'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
