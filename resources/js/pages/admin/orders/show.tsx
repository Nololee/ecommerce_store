import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, Package, User } from 'lucide-react';
import { useState } from 'react';

type OrderItem = {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    line_total: number;
    product?: {
        name: string;
        image: string | null;
        image_url?: string | null;
    } | null;
};

type OrderData = {
    id: number;
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    postal_code: string;
    subtotal: number;
    shipping_fee: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    payment_transaction_id?: string | null;
    status: string;
    notes?: string | null;
    created_at: string;
    items: OrderItem[];
};

type Props = {
    order: OrderData;
};

export default function AdminOrderShow({ order }: Props) {
    const [status, setStatus] = useState(order.status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);

    const formatPrice = (price: number) => `R${Number(price).toFixed(2)}`;

    const handleUpdateStatus = () => {
        router.patch(
            `/admin/orders/${order.id}/status`,
            { status },
            { preserveScroll: true },
        );
    };

    const handleUpdatePayment = () => {
        router.patch(
            `/admin/orders/${order.id}/payment`,
            { payment_status: paymentStatus },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={`Admin: Order #${order.tracking_number} | ARENOLO STORE`} />

            <div className="min-h-screen bg-stone-50 p-6 text-[#252820]">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-6">
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b9060] hover:underline"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back to Orders List</span>
                        </Link>
                    </div>

                    {/* Order Heading */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-stone-900">
                                Order #{order.tracking_number}
                            </h1>
                            <p className="mt-1 text-xs text-stone-500">
                                Placed on {order.created_at} • Reference ID: {order.id}
                            </p>
                        </div>

                        <Link
                            href={`/orders/${order.tracking_number}`}
                            target="_blank"
                            className="text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            View Customer Tracking Page ↗
                        </Link>
                    </div>

                    {/* Status Modifiers Grid */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2">
                        {/* Fulfillment Status updater */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-400">
                                <Package className="h-4 w-4 text-[#8b9060]" />
                                <span>Fulfillment Status</span>
                            </h2>

                            <div className="mt-4 flex items-center gap-3">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-11 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 text-xs font-bold uppercase tracking-wider text-stone-800 outline-none focus:border-[#8b9060]"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={handleUpdateStatus}
                                    className="rounded-xl bg-[#252820] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#8b9060]"
                                >
                                    Save Status
                                </button>
                            </div>
                        </div>

                        {/* Payment Status updater */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-400">
                                <CreditCard className="h-4 w-4 text-[#8b9060]" />
                                <span>Payment Status</span>
                            </h2>

                            <div className="mt-4 flex items-center gap-3">
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="h-11 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 text-xs font-bold uppercase tracking-wider text-stone-800 outline-none focus:border-[#8b9060]"
                                >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={handleUpdatePayment}
                                    className="rounded-xl bg-[#252820] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#8b9060]"
                                >
                                    Save Payment
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Details & Items */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Order Items */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
                            <h2 className="text-base font-bold text-stone-900">
                                Items Ordered
                            </h2>

                            <div className="mt-4 divide-y divide-stone-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-4">
                                        <div>
                                            <p className="font-bold text-stone-900">{item.product_name}</p>
                                            <p className="text-xs text-stone-400">
                                                Qty: {item.quantity} × {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <span className="font-black text-stone-900">
                                            {formatPrice(item.line_total)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-stone-900">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold text-stone-900">{formatPrice(order.shipping_fee)}</span>
                                </div>
                                <div className="flex justify-between border-t border-stone-200 pt-3 text-sm font-black text-stone-900">
                                    <span>Total Due</span>
                                    <span className="text-lg">{formatPrice(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                                    <User className="h-4 w-4 text-[#8b9060]" />
                                    <span>Customer Details</span>
                                </h3>
                                <div className="mt-3 text-xs">
                                    <p className="font-bold text-stone-900">{order.customer_name}</p>
                                    <p className="text-stone-500">{order.customer_email}</p>
                                    <p className="text-stone-500">{order.customer_phone}</p>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                                    <MapPin className="h-4 w-4 text-[#8b9060]" />
                                    <span>Delivery Address</span>
                                </h3>
                                <div className="mt-3 text-xs text-stone-600">
                                    <p>{order.shipping_address}</p>
                                    <p>
                                        {order.city}, {order.postal_code}
                                    </p>
                                    {order.notes && (
                                        <p className="mt-2 rounded bg-stone-50 p-2 italic text-stone-500">
                                            Notes: {order.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
