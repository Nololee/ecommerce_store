import { Head, Link, useForm } from '@inertiajs/react';
import {
    CreditCard,
    Lock,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import type { FormEvent } from 'react';

type CartItem = {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    quantity: number;
    line_total: number;
};

type Props = {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
    customer: {
        name: string;
        email: string;
        phone: string;
        shipping_address: string;
        city: string;
        postal_code: string;
    };
};

function getProductImage(image: string | null): string {
    if (!image) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    return `/storage/${image}`;
}

export default function CheckoutIndex({
    items,
    subtotal,
    shippingFee,
    totalAmount,
    customer,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: customer.name || '',
        customer_email: customer.email || '',
        customer_phone: customer.phone || '',
        shipping_address: customer.shipping_address || '',
        city: customer.city || '',
        postal_code: customer.postal_code || '',
        payment_method: 'payfast_sandbox',
        card_number: '4242 4242 4242 4242',
        card_expiry: '12/28',
        card_cvv: '123',
        notes: '',
    });

    const formatPrice = (price: number) => `R${Number(price).toFixed(2)}`;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <>
            <Head title="Secure Checkout | ARENOLO STORE" />

            <div className="bg-[#faf9f6] px-6 py-10 text-[#252820]">
                <main className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-stone-500">
                            <Link href="/cart" className="hover:text-stone-900">
                                Cart
                            </Link>
                            <span>/</span>
                            <span className="font-semibold text-stone-900">
                                Checkout
                            </span>
                        </nav>
                        <h1 className="text-3xl font-black sm:text-4xl">
                            Checkout & Payment
                        </h1>
                        <p className="mt-1 text-sm text-stone-500">
                            Complete your shipping details and simulate your
                            sandbox payment below.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-10 lg:grid-cols-[1fr_400px]"
                    >
                        {/* Left Column: Form Details */}
                        <div className="space-y-8">
                            {/* 1. Customer Information */}
                            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b9060] text-xs font-bold text-white">
                                        1
                                    </span>
                                    <span>Contact Information</span>
                                </h2>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-stone-700">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Sipho Ndlovu"
                                            required
                                            className="mt-1.5 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#8b9060]"
                                        />
                                        {errors.customer_name && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.customer_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-stone-700">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="you@example.com"
                                            required
                                            className="mt-1.5 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#8b9060]"
                                        />
                                        {errors.customer_email && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.customer_email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-stone-700">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.customer_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_phone',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="+27 82 123 4567"
                                            required
                                            className="mt-1.5 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#8b9060]"
                                        />
                                        {errors.customer_phone && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.customer_phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* 2. Delivery Address */}
                            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b9060] text-xs font-bold text-white">
                                        2
                                    </span>
                                    <span>Shipping Address</span>
                                </h2>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-stone-700">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.shipping_address}
                                            onChange={(e) =>
                                                setData(
                                                    'shipping_address',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="123 Nelson Mandela Ave, Apt 4B"
                                            required
                                            className="mt-1.5 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#8b9060]"
                                        />
                                        {errors.shipping_address && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.shipping_address}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-stone-700">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) =>
                                                setData('city', e.target.value)
                                            }
                                            placeholder="Johannesburg / Cape Town"
                                            required
                                            className="mt-1.5 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#8b9060]"
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-stone-700">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) =>
                                                setData(
                                                    'postal_code',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="2000"
                                            required
                                            className="mt-1.5 h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#8b9060]"
                                        />
                                        {errors.postal_code && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.postal_code}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-stone-700">
                                            Delivery Instructions (Optional)
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                            placeholder="e.g. Leave package with front desk reception."
                                            rows={2}
                                            className="mt-1.5 w-full rounded-xl border border-stone-200 p-4 text-sm outline-none focus:border-[#8b9060]"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* 3. Sandbox Payment Gateway */}
                            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b9060] text-xs font-bold text-white">
                                            3
                                        </span>
                                        <span>
                                            Payment Gateway Integration
                                            (Sandbox)
                                        </span>
                                    </h2>

                                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                        Sandbox Test Mode
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-stone-500">
                                    Simulate online card processing or cash on
                                    delivery. No real money will be charged.
                                </p>

                                {/* Payment Method Choices */}
                                <div className="mt-5 space-y-3">
                                    {/* Option 1: Official PayFast Sandbox */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                                            data.payment_method ===
                                            'payfast_sandbox'
                                                ? 'border-[#ea1c24] bg-red-50/20'
                                                : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="payfast_sandbox"
                                            checked={
                                                data.payment_method ===
                                                'payfast_sandbox'
                                            }
                                            onChange={() =>
                                                setData(
                                                    'payment_method',
                                                    'payfast_sandbox',
                                                )
                                            }
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-stone-900">
                                                        PayFast Gateway (Sandbox
                                                        Mode)
                                                    </span>
                                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                                        Recommended
                                                    </span>
                                                </div>
                                                <Lock className="h-5 w-5 text-[#ea1c24]" />
                                            </div>
                                            <p className="mt-1 text-xs text-stone-500">
                                                Redirects to PayFast&apos;s
                                                official sandbox test portal.
                                                Supports Visa, Mastercard,
                                                Instant EFT &amp; Capitec Pay
                                                simulations.
                                            </p>
                                        </div>
                                    </label>

                                    {/* Option 2: Direct Card Sandbox */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                                            data.payment_method ===
                                            'card_sandbox'
                                                ? 'border-[#8b9060] bg-stone-50/70'
                                                : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="card_sandbox"
                                            checked={
                                                data.payment_method ===
                                                'card_sandbox'
                                            }
                                            onChange={() =>
                                                setData(
                                                    'payment_method',
                                                    'card_sandbox',
                                                )
                                            }
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-stone-900">
                                                    Credit / Debit Card (Sandbox
                                                    Simulator)
                                                </span>
                                                <CreditCard className="h-5 w-5 text-[#8b9060]" />
                                            </div>
                                            <p className="mt-1 text-xs text-stone-500">
                                                Instant simulated card payment
                                                approval with automated receipt
                                                generation.
                                            </p>

                                            {data.payment_method ===
                                                'card_sandbox' && (
                                                <div className="mt-4 grid gap-3 border-t border-stone-200 pt-3 sm:grid-cols-2">
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-[11px] font-bold text-stone-600">
                                                            Card Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                data.card_number
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'card_number',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-1 h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-xs outline-none focus:border-[#8b9060]"
                                                        />
                                                        <p className="mt-1 text-[11px] text-stone-400">
                                                            💡 Tip: Use any 16
                                                            digits (e.g. 4242
                                                            4242 4242 4242).
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-stone-600">
                                                            Expiry Date
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                data.card_expiry
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'card_expiry',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-1 h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-xs outline-none focus:border-[#8b9060]"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-stone-600">
                                                            CVV / CVC
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                data.card_cvv
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'card_cvv',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-1 h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-xs outline-none focus:border-[#8b9060]"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                                            data.payment_method === 'cod'
                                                ? 'border-[#8b9060] bg-stone-50/70'
                                                : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cod"
                                            checked={
                                                data.payment_method === 'cod'
                                            }
                                            onChange={() =>
                                                setData('payment_method', 'cod')
                                            }
                                            className="mt-1"
                                        />
                                        <div>
                                            <span className="font-bold text-stone-900">
                                                Cash on Delivery (COD)
                                            </span>
                                            <p className="mt-1 text-xs text-stone-500">
                                                Pay cash or swipe your physical
                                                card upon delivery arrival.
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                                            data.payment_method ===
                                            'eft_sandbox'
                                                ? 'border-[#8b9060] bg-stone-50/70'
                                                : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="eft_sandbox"
                                            checked={
                                                data.payment_method ===
                                                'eft_sandbox'
                                            }
                                            onChange={() =>
                                                setData(
                                                    'payment_method',
                                                    'eft_sandbox',
                                                )
                                            }
                                            className="mt-1"
                                        />
                                        <div>
                                            <span className="font-bold text-stone-900">
                                                Instant Sandbox Bank EFT
                                            </span>
                                            <p className="mt-1 text-xs text-stone-500">
                                                Simulated direct bank transfer
                                                with instantaneous verification.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Order Summary Sidebar */}
                        <div>
                            <div className="sticky top-24 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900">
                                    <ShoppingBag className="h-5 w-5 text-[#8b9060]" />
                                    <span>Order Summary</span>
                                </h2>

                                {/* Items list */}
                                <div className="mt-6 max-h-60 space-y-3 overflow-y-auto border-b border-stone-200 pr-1 pb-5">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3"
                                        >
                                            <img
                                                src={getProductImage(
                                                    item.image,
                                                )}
                                                alt={item.name}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 truncate">
                                                <p className="truncate text-xs font-bold text-stone-800">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] text-stone-400">
                                                    Qty: {item.quantity} ×{' '}
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <span className="text-xs font-black text-stone-900">
                                                {formatPrice(item.line_total)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Price breakdown */}
                                <div className="mt-5 space-y-2.5 border-b border-stone-200 pb-5 text-sm text-stone-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-stone-900">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Delivery Fee</span>
                                        {shippingFee === 0 ? (
                                            <span className="font-bold text-emerald-700">
                                                FREE
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-stone-900">
                                                {formatPrice(shippingFee)}
                                            </span>
                                        )}
                                    </div>
                                    {shippingFee > 0 && (
                                        <p className="text-[11px] text-stone-400">
                                            Orders over R800 qualify for free
                                            nationwide delivery.
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 flex items-baseline justify-between text-stone-900">
                                    <span className="text-base font-bold">
                                        Total Due
                                    </span>
                                    <span className="text-2xl font-black text-[#252820]">
                                        {formatPrice(totalAmount)}
                                    </span>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#252820] py-4 text-center font-bold text-white shadow-lg transition hover:bg-[#8b9060] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Lock className="h-4 w-4" />
                                    <span>
                                        {processing
                                            ? 'Processing Order...'
                                            : `Complete Order (${formatPrice(totalAmount)})`}
                                    </span>
                                </button>

                                <div className="mt-6 space-y-2 text-center text-xs text-stone-400">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <ShieldCheck className="h-4 w-4 text-[#8b9060]" />
                                        <span>
                                            256-bit SSL encrypted checkout
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Truck className="h-4 w-4 text-[#8b9060]" />
                                        <span>
                                            Track delivery status immediately
                                            after purchase
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
