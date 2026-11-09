import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Package, Search } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type RecentOrder = {
    id: number;
    tracking_number: string;
    status: string;
    payment_status: string;
    total_amount: number;
    items_count: number;
    created_at: string;
};

type Props = {
    recentOrders?: RecentOrder[];
};

export default function OrderTrack({ recentOrders = [] }: Props) {
    const [trackingNumber, setTrackingNumber] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = trackingNumber.trim();
        if (trimmed) {
            router.get(`/orders/${trimmed}`);
        }
    };

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
            <Head title="Track Your Order | ARENOLO STORE" />

            <div className="bg-[#faf9f6] px-6 py-16 text-[#252820]">
                <main className="mx-auto max-w-4xl">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f0e9] text-[#8b9060]">
                            <Package className="h-8 w-8" />
                        </div>

                        <p className="mt-4 text-xs font-bold tracking-[0.25em] text-[#8b9060] uppercase">
                            Real-Time Updates
                        </p>

                        <h1 className="mt-2 text-4xl font-black text-[#252820] sm:text-5xl">
                            Track Your Order
                        </h1>

                        <p className="mx-auto mt-3 max-w-lg text-sm text-stone-600">
                            Enter your unique order tracking number (sent to
                            your confirmation email or generated at checkout) to
                            view delivery status.
                        </p>

                        {/* Search Input */}
                        <form
                            onSubmit={handleSearch}
                            className="mx-auto mt-8 flex max-w-xl gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-stone-400" />
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) =>
                                        setTrackingNumber(e.target.value)
                                    }
                                    placeholder="e.g. ARN-2026-ABC123"
                                    required
                                    className="h-12 w-full rounded-2xl border border-stone-300 bg-white pr-4 pl-12 text-sm font-semibold tracking-wider uppercase outline-none focus:border-[#8b9060]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#252820] px-7 font-bold text-white shadow-sm transition hover:bg-[#8b9060]"
                            >
                                <span>Track</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>

                    {/* Customer's Recent Orders List if Authenticated */}
                    {recentOrders.length > 0 && (
                        <div className="mt-16 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-stone-900">
                                Your Recent Orders
                            </h2>
                            <p className="mt-1 text-xs text-stone-500">
                                Click on any tracking number to view full
                                shipment details.
                            </p>

                            <div className="mt-6 divide-y divide-stone-100">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex flex-wrap items-center justify-between gap-4 py-4"
                                    >
                                        <div>
                                            <Link
                                                href={`/orders/${order.tracking_number}`}
                                                className="font-bold text-stone-900 hover:text-[#8b9060]"
                                            >
                                                #{order.tracking_number}
                                            </Link>
                                            <p className="text-xs text-stone-400">
                                                Placed on {order.created_at} •{' '}
                                                {order.items_count} items
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-black text-stone-900">
                                                R{order.total_amount.toFixed(2)}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusBadge(
                                                    order.status,
                                                )}`}
                                            >
                                                {order.status}
                                            </span>

                                            <Link
                                                href={`/orders/${order.tracking_number}`}
                                                className="text-xs font-semibold text-[#8b9060] hover:underline"
                                            >
                                                View →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
