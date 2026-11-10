import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

type Payment = {
    id: number;
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number | string;
    payment_method: string;
    payment_status: string;
    payment_transaction_id: string | null;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    payments: {
        data: Payment[];
        links: PaginationLink[];
        total: number;
    };
    metrics: {
        total_collected: number;
        successful_count: number;
        pending_count: number;
        failed_count: number;
        refunded_count: number;
    };
    filters: {
        status: string;
        search: string;
    };
};

export default function AdminPaymentsIndex({
    payments,
    metrics,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    const handleFilter = (newSearch: string, newStatus: string) => {
        router.get(
            '/admin/payments',
            { search: newSearch, status: newStatus },
            { preserveState: true, preserveScroll: true },
        );
    };

    const formatCurrency = (val: number | string) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(Number(val));
    };

    return (
        <div className="space-y-6">
            <Head title="Payment Transactions & Auditing | Admin" />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Payment & Transaction Auditing
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        Verify incoming payment references, transaction amounts,
                        gateways, and reconciliation records.
                    </p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Total Collected
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {formatCurrency(metrics.total_collected)}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        All settled payments
                    </span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
                        Successful Payments
                    </span>
                    <p className="mt-2 text-2xl font-black text-emerald-600">
                        {metrics.successful_count}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Paid orders
                    </span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                        Pending Verification
                    </span>
                    <p className="mt-2 text-2xl font-black text-amber-600">
                        {metrics.pending_count}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Awaiting clearance
                    </span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-red-600 uppercase">
                        Failed / Refunded
                    </span>
                    <p className="mt-2 text-2xl font-black text-red-600">
                        {metrics.failed_count + metrics.refunded_count}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        {metrics.refunded_count} refunded
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs sm:grid-cols-3">
                <div className="relative sm:col-span-2">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search by order #, transaction reference, customer name or email..."
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilter(search, status);
                            }
                        }}
                        className="w-full rounded-xl border border-stone-300 py-2 pr-4 pl-9 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    />
                </div>

                <div>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            handleFilter(search, e.target.value);
                        }}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Payment Statuses</option>
                        <option value="paid">Paid / Settled</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Order Number</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">
                                    Transaction Reference
                                </th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {payments.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-stone-400"
                                    >
                                        No transaction records found matching
                                        filters.
                                    </td>
                                </tr>
                            ) : (
                                payments.data.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="transition hover:bg-stone-50/50"
                                    >
                                        <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                                            {new Date(
                                                p.created_at,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-stone-900">
                                            {p.tracking_number}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-stone-900">
                                                {p.customer_name}
                                            </p>
                                            <p className="text-[11px] text-stone-400">
                                                {p.customer_email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-stone-700">
                                            {p.payment_transaction_id || (
                                                <span className="text-stone-300">
                                                    Pending Ref
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-stone-900">
                                            {formatCurrency(p.total_amount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                    p.payment_status === 'paid'
                                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : p.payment_status ===
                                                            'failed'
                                                          ? 'border border-red-200 bg-red-50 text-red-700'
                                                          : 'border border-amber-200 bg-amber-50 text-amber-700'
                                                }`}
                                            >
                                                {p.payment_status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/orders/${p.id}`}
                                                className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-800 transition hover:bg-[#8b9060] hover:text-white"
                                            >
                                                Inspect
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {payments.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 px-4 py-3 text-xs">
                        <span className="text-stone-500">
                            Total payment records: {payments.total}
                        </span>
                        <div className="flex items-center gap-1">
                            {payments.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                        link.active
                                            ? 'bg-[#8b9060] text-white'
                                            : link.url
                                              ? 'text-stone-600 hover:bg-stone-200'
                                              : 'pointer-events-none text-stone-300'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
