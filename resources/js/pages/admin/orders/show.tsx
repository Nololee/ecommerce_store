import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    Mail,
    MapPin,
    Package,
    Phone,
    RefreshCw,
    Shield,
    ShoppingBag,
    Truck,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type OrderItem = {
    id: number;
    product_id: number;
    product_name: string;
    price: number | string;
    quantity: number;
    line_total: number | string;
    product?: {
        id: number;
        image: string | null;
        stock_quantity: number;
    } | null;
};

type Order = {
    id: number;
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string;
    city: string;
    postal_code: string;
    subtotal: number | string;
    shipping_fee: number | string;
    total_amount: number | string;
    payment_method: string;
    payment_status: string;
    payment_transaction_id: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    items: OrderItem[];
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

type ActivityLog = {
    id: number;
    activity_type: string;
    description: string;
    created_at: string;
};

type Props = {
    order: Order;
    logs: ActivityLog[];
};

export default function AdminOrderShow({ order, logs }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [adminNote, setAdminNote] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(order.payment_status);
    const [paymentTxId, setPaymentTxId] = useState(order.payment_transaction_id ?? '');

    const formatCurrency = (val: number | string) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(Number(val));
    };

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(
            `/admin/orders/${order.id}/status`,
            {
                status: selectedStatus,
                notes: adminNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => setAdminNote(''),
            },
        );
    };

    const handleUpdatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(
            `/admin/orders/${order.id}/payment`,
            {
                payment_status: selectedPaymentStatus,
                payment_transaction_id: paymentTxId,
            },
            { preserveScroll: true },
        );
    };

    return (
        <div className="space-y-6">
            <Head title={`Order #${order.tracking_number} | Admin`} />

            {/* Back link & Header */}
            <div>
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition mb-3"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Orders List</span>
                </Link>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-stone-900">
                                Order #{order.tracking_number}
                            </h1>
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                    order.status === 'delivered'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : order.status === 'cancelled'
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                            >
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                            Placed on {new Date(order.created_at).toLocaleString()} &bull; Order ID: {order.id}
                        </p>
                    </div>

                    <a
                        href={`/orders/${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50"
                    >
                        View Customer Tracking View &rarr;
                    </a>
                </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Items & Financial Summary (2 cols) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Items List */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
                            Purchased Products ({order.items.length})
                        </h2>

                        <div className="divide-y divide-stone-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-500 font-bold">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-stone-900">{item.product_name}</p>
                                            <p className="text-[11px] text-stone-500">
                                                Qty: {item.quantity} &times; {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-stone-900">
                                        {formatCurrency(item.line_total)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Order Cost Breakdown */}
                        <div className="mt-6 border-t border-stone-200 pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-stone-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-stone-500">
                                <span>Shipping Fee</span>
                                <span>{formatCurrency(order.shipping_fee)}</span>
                            </div>
                            <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-100">
                                <span>Grand Total</span>
                                <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                                <User className="h-4 w-4" /> Customer Details
                            </h3>
                            <p className="text-xs font-bold text-stone-900">{order.customer_name}</p>
                            <p className="text-xs text-stone-600 mt-1">{order.customer_email}</p>
                            <p className="text-xs text-stone-600 font-mono mt-0.5">{order.customer_phone || 'No phone'}</p>
                            {order.user && (
                                <Link
                                    href={`/admin/customers/${order.user.id}`}
                                    className="mt-3 inline-block text-[11px] font-bold text-[#8b9060] hover:underline"
                                >
                                    Open Customer Profile &rarr;
                                </Link>
                            )}
                        </div>

                        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Shipping Address
                            </h3>
                            <p className="text-xs text-stone-800 font-medium">{order.shipping_address}</p>
                            <p className="text-xs text-stone-600 mt-1">
                                {order.city}, {order.postal_code}
                            </p>
                            <p className="text-[11px] text-stone-400 mt-2 font-mono">South Africa</p>
                        </div>
                    </div>
                </div>

                {/* Fulfillment Actions & Status Controls (1 col) */}
                <div className="space-y-6">
                    {/* Status Management Form */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-4 flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#8b9060]" /> Update Fulfillment Status
                        </h3>

                        <form onSubmit={handleUpdateStatus} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-stone-600">Order Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-stone-300 py-2 px-3 text-xs font-bold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled (Auto-Restocks Items)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-stone-600">Admin Dispatch Note</label>
                                <textarea
                                    rows={2}
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Courier tracking reference, delivery notes..."
                                    className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-xs text-stone-800"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-[#8b9060] py-2 text-xs font-bold text-white shadow-xs hover:bg-[#787c53] transition"
                            >
                                Update Status
                            </button>
                        </form>
                    </div>

                    {/* Payment Status Management */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-4 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-emerald-600" /> Payment Verification
                        </h3>

                        <form onSubmit={handleUpdatePayment} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-stone-600">Payment Status</label>
                                <select
                                    value={selectedPaymentStatus}
                                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-stone-300 py-2 px-3 text-xs font-bold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending Verification</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-stone-600">Gateway Transaction Reference</label>
                                <input
                                    type="text"
                                    value={paymentTxId}
                                    onChange={(e) => setPaymentTxId(e.target.value)}
                                    placeholder="e.g. PAY-XXXXXXXX"
                                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-mono text-stone-900"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-stone-900 py-2 text-xs font-bold text-white hover:bg-stone-800 transition"
                            >
                                Save Payment Record
                            </button>
                        </form>
                    </div>

                    {/* Audit Logs for this order */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                            Order Audit Log
                        </h3>
                        <div className="space-y-3">
                            {logs.length === 0 ? (
                                <p className="text-[11px] text-stone-400">No status changes recorded yet.</p>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-stone-300 pl-2.5 py-0.5">
                                        <p className="text-[11px] font-medium text-stone-800">{log.description}</p>
                                        <span className="text-[10px] text-stone-400">
                                            {new Date(log.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
