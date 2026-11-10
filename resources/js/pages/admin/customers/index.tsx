import { Head, Link, router } from '@inertiajs/react';
import { Power, Search } from 'lucide-react';
import { useState } from 'react';

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    orders_count: number;
    total_spent: number | string | null;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    customers: {
        data: Customer[];
        links: PaginationLink[];
        total: number;
    };
    filters: {
        search: string;
        status: string;
    };
};

export default function AdminCustomersIndex({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    const handleFilter = (newSearch: string, newStatus: string) => {
        router.get(
            '/admin/customers',
            { search: newSearch, status: newStatus },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleToggleStatus = (customerId: number) => {
        router.patch(
            `/admin/customers/${customerId}/toggle-status`,
            {},
            { preserveScroll: true },
        );
    };

    const formatCurrency = (val: number | string | null) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(Number(val) || 0);
    };

    return (
        <div className="space-y-6">
            <Head title="Customer Directory & Profiles | Admin" />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Customer Management
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        View registered customers, purchase history, lifetime
                        value, and account access statuses.
                    </p>
                </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs sm:grid-cols-3">
                <div className="relative sm:col-span-2">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search by customer name, email address, phone..."
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
                        <option value="">All Account Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Suspended Only</option>
                    </select>
                </div>
            </div>

            {/* Customer Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                            <tr>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Orders</th>
                                <th className="px-4 py-3">Lifetime Spend</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {customers.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-stone-400"
                                    >
                                        No customer records found matching your
                                        filters.
                                    </td>
                                </tr>
                            ) : (
                                customers.data.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="transition hover:bg-stone-50/50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b9060]/20 font-bold text-[#676c3f]">
                                                    {c.name[0]?.toUpperCase() ??
                                                        'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-900">
                                                        {c.name}
                                                    </p>
                                                    <p className="text-[11px] text-stone-400">
                                                        {c.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-stone-600">
                                            {c.phone || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-md bg-stone-100 px-2 py-0.5 font-bold text-stone-800">
                                                {c.orders_count}{' '}
                                                {c.orders_count === 1
                                                    ? 'order'
                                                    : 'orders'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-stone-900">
                                            {formatCurrency(c.total_spent)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleStatus(c.id)
                                                }
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                                                    c.is_active
                                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : 'border border-red-200 bg-red-50 text-red-700'
                                                }`}
                                            >
                                                <Power className="h-3 w-3" />
                                                <span>
                                                    {c.is_active
                                                        ? 'ACTIVE'
                                                        : 'SUSPENDED'}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/customers/${c.id}`}
                                                className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-800 transition hover:bg-[#8b9060] hover:text-white"
                                            >
                                                View Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {customers.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 px-4 py-3 text-xs">
                        <span className="text-stone-500">
                            Total registered customers: {customers.total}
                        </span>
                        <div className="flex items-center gap-1">
                            {customers.links.map((link, idx) => (
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
