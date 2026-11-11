import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, MapPin, Package, Search, Truck } from 'lucide-react';
import { useState } from 'react';
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
    updated_at: string;
    items: OrderItem[];
};

type Props = {
    activeOrders: Order[];
    selectedOrder: Order | null;
    searchedTrackingNumber: string;
};

export default function CustomerTracking({
    selectedOrder,
    searchedTrackingNumber,
}: Props) {
    const [trackingInput, setTrackingInput] = useState(searchedTrackingNumber);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingInput.trim()) return;

        router.get(
            '/customer/tracking',
            { tracking_number: trackingInput.trim() },
            { preserveState: true },
        );
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    // Tracking steps calculation
    const steps = [
        {
            key: 'placed',
            label: 'Order Placed',
            desc: 'Order details recorded',
        },
        { key: 'paid', label: 'Payment Confirmed', desc: 'Payment approved' },
        { key: 'processing', label: 'Processing', desc: 'Packed at warehouse' },
        {
            key: 'shipped',
            label: 'Dispatched / In Transit',
            desc: 'With courier',
        },
        { key: 'delivered', label: 'Delivered', desc: 'Handed to recipient' },
    ];

    const getStepStatus = (stepKey: string, order: Order) => {
        if (order.status === 'cancelled') {
            return stepKey === 'placed' ? 'completed' : 'cancelled';
        }

        const orderStatus = order.status;
        const isPaid = order.payment_status === 'paid';

        switch (stepKey) {
            case 'placed':
                return 'completed';
            case 'paid':
                return isPaid ? 'completed' : 'current';
            case 'processing':
                if (
                    orderStatus === 'processing' ||
                    orderStatus === 'shipped' ||
                    orderStatus === 'delivered'
                ) {
                    return 'completed';
                }
                return isPaid ? 'current' : 'upcoming';
            case 'shipped':
                if (orderStatus === 'shipped' || orderStatus === 'delivered') {
                    return 'completed';
                }
                return orderStatus === 'processing' ? 'upcoming' : 'upcoming';
            case 'delivered':
                return orderStatus === 'delivered' ? 'completed' : 'upcoming';
            default:
                return 'upcoming';
        }
    };

    return (
        <CustomerLayout
            title="Track My Orders"
            subtitle="Follow live fulfillment updates, delivery timeline and dispatch status."
            activeTab="tracking"
        >
            <Head title="Track Orders | Customer Dashboard" />

            <div className="space-y-8">
                {/* Search Bar for Tracking */}
                <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="text"
                                value={trackingInput}
                                onChange={(e) =>
                                    setTrackingInput(e.target.value)
                                }
                                placeholder="Enter tracking number (e.g. ARN-2026-XXXXXX)..."
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pr-4 pl-11 text-xs font-medium text-stone-900 transition focus:border-[#8b9060] focus:bg-white focus:ring-2 focus:ring-[#8b9060]/20 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8b9060] px-6 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                        >
                            <Truck className="h-4 w-4" /> Track Order
                        </button>
                    </form>
                </div>

                {/* Tracking Progress Section */}
                {selectedOrder ? (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-6">
                                <div>
                                    <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                        Tracking Shipment
                                    </span>
                                    <h2 className="mt-1 font-mono text-xl font-black text-stone-900">
                                        {selectedOrder.tracking_number}
                                    </h2>
                                    <p className="mt-0.5 text-xs text-stone-500">
                                        Estimated courier dispatch: Aramex /
                                        Fastway South Africa
                                    </p>
                                </div>

                                <div className="text-right">
                                    <span
                                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase ${
                                            selectedOrder.status === 'delivered'
                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                : selectedOrder.status ===
                                                    'shipped'
                                                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                  : selectedOrder.status ===
                                                      'processing'
                                                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                    : 'border-stone-200 bg-stone-50 text-stone-700'
                                        }`}
                                    >
                                        Status: {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Journey Timeline */}
                            <div className="py-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                                    {steps.map((st, i) => {
                                        const status = getStepStatus(
                                            st.key,
                                            selectedOrder,
                                        );
                                        const isCompleted =
                                            status === 'completed';
                                        const isCurrent = status === 'current';

                                        return (
                                            <div
                                                key={st.key}
                                                className="relative flex flex-col items-center text-center"
                                            >
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold transition ${
                                                        isCompleted
                                                            ? 'bg-[#8b9060] text-white shadow-sm'
                                                            : isCurrent
                                                              ? 'border-2 border-[#8b9060] bg-[#8b9060]/10 text-[#8b9060]'
                                                              : 'border border-stone-200 bg-stone-50 text-stone-400'
                                                    }`}
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="h-6 w-6" />
                                                    ) : (
                                                        <span>{i + 1}</span>
                                                    )}
                                                </div>

                                                <h4 className="mt-3 text-xs font-bold text-stone-900">
                                                    {st.label}
                                                </h4>
                                                <p className="mt-0.5 text-[11px] text-stone-400">
                                                    {st.desc}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Delivery Address & Summary */}
                            <div className="border-t border-stone-100 pt-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-stone-900 uppercase">
                                            <MapPin className="h-4 w-4 text-[#8b9060]" />{' '}
                                            Delivery Destination
                                        </h3>
                                        <div className="mt-2 space-y-0.5 text-xs text-stone-600">
                                            <p className="font-bold text-stone-900">
                                                {selectedOrder.customer_name}
                                            </p>
                                            <p>
                                                {selectedOrder.shipping_address}
                                            </p>
                                            <p>
                                                {selectedOrder.city},{' '}
                                                {selectedOrder.postal_code}
                                            </p>
                                            <p className="pt-1 text-stone-400">
                                                Recipient Phone:{' '}
                                                {selectedOrder.customer_phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-stone-900 uppercase">
                                            <Package className="h-4 w-4 text-[#8b9060]" />{' '}
                                            Package Contents (
                                            {selectedOrder.items.length})
                                        </h3>
                                        <div className="mt-2 space-y-2">
                                            {selectedOrder.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between text-xs text-stone-700"
                                                >
                                                    <span>
                                                        {item.quantity} &times;{' '}
                                                        {item.product_name}
                                                    </span>
                                                    <span className="font-bold text-stone-900">
                                                        {formatCurrency(
                                                            item.line_total,
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
                        <Truck className="mx-auto h-12 w-12 text-stone-300" />
                        <h3 className="mt-4 text-base font-bold text-stone-800">
                            No active orders in transit
                        </h3>
                        <p className="mt-1 text-xs text-stone-500">
                            Enter an order tracking number above or browse all
                            your past orders.
                        </p>
                        <Link
                            href="/customer/orders"
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-bold text-stone-700 shadow-xs hover:border-stone-400"
                        >
                            View All Orders
                        </Link>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
