import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    Filter,
    Package,
    Phone,
    RefreshCw,
    Search,
    ShoppingBag,
    Truck,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type OrderItem = {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    line_total: number;
};

type Order = {
    id: number;
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    total_amount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    items: OrderItem[];
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
        total: number;
    };
    filters: {
        status: string;
        payment_status: string;
        search: string;
    };
};

export default function AdminOrdersIndex({ orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status);

    const handleFilter = (newSearch: string, newStatus: string, newPay: string) => {
        router.get(
            '/admin/orders',
            { search: newSearch, status: newStatus, payment_status: newPay },
            { preserveState: true, preserveScroll: true },
        );
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    return (
        <div className="space-y-6">
            <Head title="Orders Management | Admin" />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Orders & Fulfillment
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        Track orders, update fulfillment statuses, process deliveries, and review payment validations.
                    </p>
                </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs sm:grid-cols-4">
                <div className="relative sm:col-span-2">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search tracking #, customer name, email, phone..."
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilter(search, status, paymentStatus);
                            }
                        }}
                        className="w-full rounded-xl border border-stone-300 py-2 pl-9 pr-4 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    />
                </div>

                <div>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            handleFilter(search, e.target.value, paymentStatus);
                        }}
                        className="w-full rounded-xl border border-stone-300 py-2 px-3 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Fulfillment Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <select
                        value={paymentStatus}
                        onChange={(e) => {
                            setPaymentStatus(e.target.value);
                            handleFilter(search, status, e.target.value);
                        }}
                        className="w-full rounded-xl border border-stone-300 py-2 px-3 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Payment Statuses</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl border border-stone-200/80 bg-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                            <tr>
                                <th className="px-4 py-3">Order Number</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Total Amount</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-stone-400">
                                        No order records found matching criteria.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone-50/50 transition">
                                        <td className="px-4 py-3 font-mono font-bold text-stone-900">
                                            {order.tracking_number}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-stone-900">{order.customer_name}</p>
                                            <p className="text-[11px] text-stone-400">{order.customer_email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-stone-900">
                                            {formatCurrency(Number(order.total_amount))}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    order.payment_status === 'paid'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : order.payment_status === 'failed'
                                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}
                                            >
                                                {order.payment_status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                    order.status === 'delivered'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : order.status === 'cancelled'
                                                        ? 'bg-red-50 text-red-700'
                                                        : order.status === 'shipped'
                                                        ? 'bg-purple-50 text-purple-700'
                                                        : order.status === 'processing'
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-800 hover:bg-[#8b9060] hover:text-white transition"
                                            >
                                                View Order
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 px-4 py-3 text-xs">
                        <span className="text-stone-500">
                            Total orders: {orders.total}
                        </span>
                        <div className="flex items-center gap-1">
                            {orders.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                        link.active
                                            ? 'bg-[#8b9060] text-white'
                                            : link.url
                                            ? 'text-stone-600 hover:bg-stone-200'
                                            : 'text-stone-300 pointer-events-none'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
