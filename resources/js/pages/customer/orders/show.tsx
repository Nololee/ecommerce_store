import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Package, Truck } from 'lucide-react';
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
    order: Order;
};

export default function CustomerOrderShow({ order }: Props) {
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
            title={`Order #${order.tracking_number}`}
            subtitle={`Placed on ${order.created_at}`}
            activeTab="orders"
        >
            <Head
                title={`Order #${order.tracking_number} | Customer Details`}
            />

            <div className="space-y-8">
                {/* Back to Orders Button & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/customer/orders"
                        className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:border-stone-300"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to My Orders
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href={`/customer/tracking?tracking_number=${order.tracking_number}`}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#8b9060] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#787c53]"
                        >
                            <Truck className="h-4 w-4" /> Live Tracking
                        </Link>
                    </div>
                </div>

                {/* Status and Overview Strip */}
                <div className="grid grid-cols-1 gap-4 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:grid-cols-3">
                    <div>
                        <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                            Order Status
                        </span>
                        <div className="mt-1">
                            <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase ${getStatusBadge(order.status)}`}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                            Payment Details
                        </span>
                        <p className="mt-1 text-xs font-bold text-stone-800 capitalize">
                            {order.payment_method.replace('_', ' ')} &bull;{' '}
                            <span
                                className={
                                    order.payment_status === 'paid'
                                        ? 'text-emerald-600'
                                        : 'text-amber-600'
                                }
                            >
                                {order.payment_status}
                            </span>
                        </p>
                        {order.payment_transaction_id && (
                            <p className="font-mono text-[11px] text-stone-400">
                                Ref: {order.payment_transaction_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                            Total Order Value
                        </span>
                        <div className="mt-1 text-xl font-black text-stone-900">
                            {formatCurrency(order.total_amount)}
                        </div>
                    </div>
                </div>

                {/* Main Content Columns: Items + Shipping Address */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Items Purchased (2 Cols) */}
                    <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8 lg:col-span-2">
                        <h2 className="border-b border-stone-100 pb-4 text-base font-black text-stone-900">
                            Ordered Items ({order.items.length})
                        </h2>

                        <div className="divide-y divide-stone-100">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-stone-300">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-stone-900">
                                                {item.product_name}
                                            </h3>
                                            <p className="mt-0.5 text-xs text-stone-500">
                                                Quantity: {item.quantity}{' '}
                                                &times;{' '}
                                                {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-sm font-bold text-stone-900">
                                            {formatCurrency(item.line_total)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Cost Breakdown */}
                        <div className="mt-6 space-y-2 border-t border-stone-100 pt-6 text-xs text-stone-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-stone-900">
                                    {formatCurrency(order.subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Fee</span>
                                <span className="font-semibold text-stone-900">
                                    {order.shipping_fee > 0
                                        ? formatCurrency(order.shipping_fee)
                                        : 'FREE (Over R800)'}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-stone-200 pt-3 text-sm font-black text-stone-900">
                                <span>Total Paid</span>
                                <span>
                                    {formatCurrency(order.total_amount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address and Delivery Notes */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-stone-900">
                                <MapPin className="h-4 w-4 text-[#8b9060]" />{' '}
                                Delivery Address
                            </h3>
                            <div className="mt-4 space-y-1 text-xs text-stone-600">
                                <p className="font-bold text-stone-900">
                                    {order.customer_name}
                                </p>
                                <p>{order.shipping_address}</p>
                                <p>
                                    {order.city}, {order.postal_code}
                                </p>
                                <p className="pt-2 text-stone-400">
                                    Phone: {order.customer_phone}
                                </p>
                                <p className="text-stone-400">
                                    Email: {order.customer_email}
                                </p>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
                                <h3 className="text-sm font-bold text-stone-900">
                                    Delivery Instructions
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-stone-600">
                                    {order.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
