import { Head, router } from '@inertiajs/react';
import { Download, FileSpreadsheet, FileText, Filter } from 'lucide-react';

type MetricData = {
    total_sales: number;
    orders_count: number;
    average_order_value: number;
};

type TimelinePoint = {
    date: string;
    total_orders: number;
    revenue: number;
};

type ProductPerformance = {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
    units_sold: number;
    gross_sales: number;
};

type Props = {
    metrics: MetricData;
    salesTimeline: TimelinePoint[];
    productPerformance: ProductPerformance[];
    filters: {
        range: string;
    };
};

export default function AdminReportsIndex({
    metrics,
    productPerformance,
    filters,
}: Props) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    const handleRangeChange = (newRange: string) => {
        router.get(
            '/admin/reports',
            { range: newRange },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="space-y-6">
            <Head title="Sales Reports & CSV Export | Admin" />

            {/* Header & Export Dropdowns */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Sales Reports & Data Exports
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        Analyze business metrics, revenue performance, and
                        export spreadsheets.
                    </p>
                </div>

                {/* CSV Export Buttons */}
                <div className="flex items-center gap-2">
                    <a
                        href="/admin/reports/export/orders"
                        className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-2xs transition hover:bg-stone-50"
                    >
                        <Download className="h-3.5 w-3.5 text-stone-500" />
                        <span>Export Orders CSV</span>
                    </a>
                    <a
                        href="/admin/reports/export/products"
                        className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-2xs transition hover:bg-stone-50"
                    >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-stone-500" />
                        <span>Export Products CSV</span>
                    </a>
                    <a
                        href="/admin/reports/export/customers"
                        className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-2xs transition hover:bg-stone-50"
                    >
                        <FileText className="h-3.5 w-3.5 text-stone-500" />
                        <span>Export Customers CSV</span>
                    </a>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
                <span className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                    <Filter className="h-4 w-4 text-[#8b9060]" /> Select
                    Reporting Range:
                </span>
                <select
                    value={filters.range}
                    onChange={(e) => handleRangeChange(e.target.value)}
                    className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-900"
                >
                    <option value="today">Today</option>
                    <option value="7_days">Past 7 Days</option>
                    <option value="30_days">Past 30 Days</option>
                    <option value="this_year">Current Year</option>
                    <option value="all">Entire Store Lifetime</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Gross Sales Revenue
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {formatCurrency(metrics.total_sales)}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Total settled in period
                    </span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Total Orders Placed
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {metrics.orders_count}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Orders in period
                    </span>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Average Order Value (AOV)
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {formatCurrency(metrics.average_order_value)}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Revenue per order
                    </span>
                </div>
            </div>

            {/* Product Performance Table */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                <h2 className="mb-4 text-sm font-bold tracking-wider text-stone-900 uppercase">
                    Top Product Performance & Gross Contribution
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                            <tr>
                                <th className="px-4 py-3">Product Name</th>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-4 py-3">Retail Price</th>
                                <th className="px-4 py-3">Stock Left</th>
                                <th className="px-4 py-3">Units Sold</th>
                                <th className="px-4 py-3 text-right">
                                    Gross Sales Contribution
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {productPerformance.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-6 text-center text-stone-400"
                                    >
                                        No sales records recorded.
                                    </td>
                                </tr>
                            ) : (
                                productPerformance.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition hover:bg-stone-50/50"
                                    >
                                        <td className="px-4 py-3 font-bold text-stone-900">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-stone-500">
                                            {item.sku}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-stone-900">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            {item.stock_quantity} units
                                        </td>
                                        <td className="px-4 py-3 font-bold text-stone-700">
                                            {item.units_sold || 0}
                                        </td>
                                        <td className="px-4 py-3 text-right font-black text-stone-900">
                                            {formatCurrency(
                                                Number(item.gross_sales) || 0,
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
