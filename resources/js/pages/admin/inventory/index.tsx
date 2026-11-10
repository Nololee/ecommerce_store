import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, Plus, Search } from 'lucide-react';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
};

type InventoryLog = {
    id: number;
    product_id: number;
    change_type: string;
    quantity_before: number;
    quantity_change: number;
    quantity_after: number;
    reason: string | null;
    created_at: string;
    product?: Product | null;
    user?: {
        id: number;
        name: string;
    } | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    logs: {
        data: InventoryLog[];
        links: PaginationLink[];
        total: number;
    };
    summary: {
        total_products: number;
        total_stock: number;
        low_stock: number;
        out_of_stock: number;
    };
    products: Product[];
    filters: {
        search: string;
        change_type: string;
    };
};

export default function AdminInventoryIndex({
    logs,
    summary,
    products,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [changeType, setChangeType] = useState(filters.change_type);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<{
        product_id: number | string;
        quantity_change: number;
        reason: string;
    }>({
        product_id: products[0]?.id ?? '',
        quantity_change: 5,
        reason: 'Restocking shipment',
    });

    const handleFilter = (newSearch: string, newType: string) => {
        router.get(
            '/admin/inventory',
            { search: newSearch, change_type: newType },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleAdjustSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/inventory/adjust', {
            onSuccess: () => {
                setIsAdjustModalOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Inventory Movements & Stock Adjustments | Admin" />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Inventory Movements & History
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        Audit logs of all stock additions, deductions,
                        cancellations, and manual administrator adjustments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAdjustModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#8b9060] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                >
                    <Plus className="h-4 w-4" />
                    <span>Record Stock Adjustment</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Catalogue Items
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {summary.total_products}
                    </p>
                    <span className="text-[11px] text-stone-400">Products</span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Total Stock On-Hand
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {summary.total_stock}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Total physical units
                    </span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                        Low Stock Alert
                    </span>
                    <p className="mt-2 text-2xl font-black text-amber-600">
                        {summary.low_stock}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        &le; 10 units left
                    </span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-red-600 uppercase">
                        Out of Stock
                    </span>
                    <p className="mt-2 text-2xl font-black text-red-600">
                        {summary.out_of_stock}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Needs replenishment
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
                        placeholder="Search by product name or SKU code..."
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilter(search, changeType);
                            }
                        }}
                        className="w-full rounded-xl border border-stone-300 py-2 pr-4 pl-9 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    />
                </div>

                <div>
                    <select
                        value={changeType}
                        onChange={(e) => {
                            setChangeType(e.target.value);
                            handleFilter(search, e.target.value);
                        }}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Movement Types</option>
                        <option value="adjustment">Manual Adjustment</option>
                        <option value="order_placed">
                            Customer Order Placed
                        </option>
                        <option value="order_cancelled">
                            Order Cancelled (Restocked)
                        </option>
                        <option value="initial_stock">
                            Initial Stock Creation
                        </option>
                    </select>
                </div>
            </div>

            {/* Movement Logs Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                            <tr>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Movement Type</th>
                                <th className="px-4 py-3">Before</th>
                                <th className="px-4 py-3">Change</th>
                                <th className="px-4 py-3">After</th>
                                <th className="px-4 py-3">Reason / Details</th>
                                <th className="px-4 py-3">Actor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-12 text-center text-stone-400"
                                    >
                                        No stock movements recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="transition hover:bg-stone-50/50"
                                    >
                                        <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-stone-900">
                                                {log.product?.name ??
                                                    'Deleted Product'}
                                            </p>
                                            <p className="font-mono text-[10px] text-stone-400">
                                                SKU: {log.product?.sku ?? 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                                                {log.change_type
                                                    .replace('_', ' ')
                                                    .toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-stone-500">
                                            {log.quantity_before}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold">
                                            <span
                                                className={`inline-flex items-center gap-0.5 ${
                                                    log.quantity_change > 0
                                                        ? 'text-emerald-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {log.quantity_change > 0 ? (
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                ) : (
                                                    <ArrowDownRight className="h-3.5 w-3.5" />
                                                )}
                                                {log.quantity_change > 0
                                                    ? `+${log.quantity_change}`
                                                    : log.quantity_change}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-stone-900">
                                            {log.quantity_after}
                                        </td>
                                        <td className="max-w-xs truncate px-4 py-3 text-stone-700">
                                            {log.reason || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-[11px] text-stone-500">
                                            {log.user?.name ?? 'System'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 px-4 py-3 text-xs">
                        <span className="text-stone-500">
                            Total movement entries: {logs.total}
                        </span>
                        <div className="flex items-center gap-1">
                            {logs.links.map((link, idx) => (
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

            {/* Stock Adjustment Modal */}
            {isAdjustModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h2 className="border-b border-stone-200 pb-3 text-base font-bold text-stone-900">
                            Record Manual Stock Adjustment
                        </h2>

                        <form
                            onSubmit={handleAdjustSubmit}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-bold text-stone-700">
                                    Select Product *
                                </label>
                                <select
                                    value={data.product_id}
                                    onChange={(e) =>
                                        setData('product_id', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                >
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.sku}) &bull; Current
                                            Stock: {p.stock_quantity}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700">
                                    Quantity Change (+ additions, - write-offs)
                                    *
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={data.quantity_change}
                                    onChange={(e) =>
                                        setData(
                                            'quantity_change',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 font-mono text-xs font-bold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                />
                                {errors.quantity_change && (
                                    <p className="mt-1 text-[11px] text-red-600">
                                        {errors.quantity_change}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700">
                                    Reason / Reference *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.reason}
                                    onChange={(e) =>
                                        setData('reason', e.target.value)
                                    }
                                    placeholder="e.g. Stocktake reconciliation, Damaged return, Supplier delivery"
                                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                />
                                {errors.reason && (
                                    <p className="mt-1 text-[11px] text-red-600">
                                        {errors.reason}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdjustModalOpen(false)}
                                    className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-[#8b9060] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#787c53] disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Applying...'
                                        : 'Apply Stock Adjustment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
