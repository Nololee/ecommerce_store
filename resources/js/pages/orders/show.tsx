import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    MapPin,
    Package,
    ShoppingBag,
    Truck,
    User,
} from 'lucide-react';

type OrderItem = {
    id: number;
    product_name: string;
    product_slug?: string | null;
    product_image?: string | null;
    price: number;
    quantity: number;
    line_total: number;
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

function getProductImage(image?: string | null): string {
    if (!image) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    return `/storage/${image}`;
}

export default function OrderShow({ order }: Props) {
    const formatPrice = (price: number) => `R${Number(price).toFixed(2)}`;

    // Tracking step progress
    const steps = [
        { key: 'placed', label: 'Order Placed', icon: Clock },
        { key: 'paid', label: 'Payment Confirmed', icon: CreditCard },
        { key: 'processing', label: 'Processing & Packed', icon: Package },
        { key: 'shipped', label: 'Out for Delivery', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    const getStepStatus = (stepKey: string) => {
        if (order.status === 'cancelled') return 'cancelled';

        if (stepKey === 'placed') return 'completed';

        if (stepKey === 'paid') {
            return order.payment_status === 'paid' ? 'completed' : 'pending';
        }

        if (stepKey === 'processing') {
            if (['processing', 'shipped', 'delivered'].includes(order.status))
                return 'completed';
            return 'pending';
        }

        if (stepKey === 'shipped') {
            if (['shipped', 'delivered'].includes(order.status))
                return 'completed';
            return 'pending';
        }

        if (stepKey === 'delivered') {
            return order.status === 'delivered' ? 'completed' : 'pending';
        }

        return 'pending';
    };

    return (
        <>
            <Head title={`Order #${order.tracking_number} | ARENOLO STORE`} />

            <div className="bg-[#faf9f6] px-6 py-12 text-[#252820]">
                <main className="mx-auto max-w-5xl">
                    {/* Header Banner */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <Link
                                href="/track-order"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b9060] hover:underline"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Track Another Order</span>
                            </Link>

                            <h1 className="mt-2 text-3xl font-black text-stone-900 sm:text-4xl">
                                Order #{order.tracking_number}
                            </h1>

                            <p className="mt-1 text-sm text-stone-500">
                                Placed on {order.created_at} • Payment:{' '}
                                <span className="font-bold text-stone-700 uppercase">
                                    {order.payment_status}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span
                                className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase ${
                                    order.status === 'delivered'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : order.status === 'shipped'
                                          ? 'bg-blue-100 text-blue-800'
                                          : order.status === 'processing'
                                            ? 'bg-amber-100 text-amber-800'
                                            : order.status === 'cancelled'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-stone-200 text-stone-800'
                                }`}
                            >
                                Status: {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Visual Progress Timeline */}
                    <div className="mb-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="mb-6 text-sm font-bold tracking-wider text-stone-400 uppercase">
                            Fulfillment Journey
                        </h2>

                        <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-2">
                            {steps.map((step) => {
                                const status = getStepStatus(step.key);
                                const isCompleted = status === 'completed';
                                const StepIcon = step.icon;

                                return (
                                    <div
                                        key={step.key}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                                                isCompleted
                                                    ? 'bg-[#8b9060] text-white shadow-md'
                                                    : 'border border-stone-200 bg-stone-50 text-stone-400'
                                            }`}
                                        >
                                            <StepIcon className="h-5 w-5" />
                                        </div>

                                        <p
                                            className={`mt-2 text-xs font-bold ${
                                                isCompleted
                                                    ? 'text-stone-900'
                                                    : 'text-stone-400'
                                            }`}
                                        >
                                            {step.label}
                                        </p>

                                        {isCompleted && (
                                            <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                                <Check className="h-3 w-3" />{' '}
                                                Done
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Details & Summary Grid */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left 2 Cols: Order Items */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                                    <ShoppingBag className="h-5 w-5 text-[#8b9060]" />
                                    <span>
                                        Purchased Products ({order.items.length}
                                        )
                                    </span>
                                </h2>

                                <div className="mt-6 divide-y divide-stone-100">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 py-4"
                                        >
                                            <img
                                                src={getProductImage(
                                                    item.product_image,
                                                )}
                                                alt={item.product_name}
                                                className="h-16 w-16 rounded-xl object-cover"
                                            />

                                            <div className="flex-1 truncate">
                                                {item.product_slug ? (
                                                    <Link
                                                        href={`/shop/${item.product_slug}`}
                                                        className="font-bold text-stone-900 hover:text-[#8b9060]"
                                                    >
                                                        {item.product_name}
                                                    </Link>
                                                ) : (
                                                    <p className="font-bold text-stone-900">
                                                        {item.product_name}
                                                    </p>
                                                )}

                                                <p className="mt-1 text-xs text-stone-500">
                                                    Qty: {item.quantity} ×{' '}
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <span className="font-black text-stone-900">
                                                    {formatPrice(
                                                        item.line_total,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Price Breakdown */}
                                <div className="mt-6 space-y-2.5 border-t border-stone-100 pt-5 text-sm text-stone-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-stone-900">
                                            {formatPrice(order.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping & Handling</span>
                                        <span className="font-semibold text-stone-900">
                                            {order.shipping_fee > 0
                                                ? formatPrice(
                                                      order.shipping_fee,
                                                  )
                                                : 'FREE'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-black text-stone-900">
                                        <span>Total Paid / Due</span>
                                        <span className="text-xl">
                                            {formatPrice(order.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Customer & Destination Information */}
                        <div className="space-y-6">
                            {/* Customer Details */}
                            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-stone-400 uppercase">
                                    <User className="h-4 w-4 text-[#8b9060]" />
                                    <span>Recipient</span>
                                </h3>

                                <div className="mt-3 text-sm">
                                    <p className="font-bold text-stone-900">
                                        {order.customer_name}
                                    </p>
                                    <p className="text-stone-500">
                                        {order.customer_email}
                                    </p>
                                    <p className="text-stone-500">
                                        {order.customer_phone}
                                    </p>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-stone-400 uppercase">
                                    <MapPin className="h-4 w-4 text-[#8b9060]" />
                                    <span>Destination</span>
                                </h3>

                                <div className="mt-3 text-sm text-stone-600">
                                    <p>{order.shipping_address}</p>
                                    <p>
                                        {order.city}, {order.postal_code}
                                    </p>
                                    {order.notes && (
                                        <p className="mt-2 rounded-lg bg-stone-50 p-2 text-xs text-stone-500 italic">
                                            Notes: {order.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-stone-400 uppercase">
                                    <CreditCard className="h-4 w-4 text-[#8b9060]" />
                                    <span>Payment Info</span>
                                </h3>

                                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                                    <div className="flex justify-between">
                                        <span>Method:</span>
                                        <span className="font-semibold text-stone-900 uppercase">
                                            {order.payment_method.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <span className="font-bold text-emerald-700 uppercase">
                                            {order.payment_status}
                                        </span>
                                    </div>
                                    {order.payment_transaction_id && (
                                        <div className="flex justify-between">
                                            <span>Ref:</span>
                                            <span className="font-mono text-stone-500">
                                                {order.payment_transaction_id}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/shop"
                                className="block w-full rounded-2xl bg-[#252820] py-3.5 text-center text-xs font-bold tracking-wider text-white uppercase shadow-md transition hover:bg-[#8b9060]"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
