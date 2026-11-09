import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpRight,
    DollarSign,
    ExternalLink,
    Package,
    ShoppingBag,
    TrendingUp,
    Users,
} from 'lucide-react';

type MetricData = {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    lowStockCount: number;
    totalCustomers: number;
};

type RecentOrder = {
    id: number;
    tracking_number: string;
    customer_name: string;
    total_amount: number;
    status: string;
    payment_status: string;
    items_count: number;
    created_at: string;
};

type TopSelling = {
    name: string;
    total_sold: number;
    total_revenue: number;
};

type CategorySales = {
    category: string;
    revenue: number;
    products_count: number;
};

type LowStockItem = {
    id: number;
    name: string;
    stock_quantity: number;
    price: number;
};

type Props = {
    metrics: MetricData;
    recentOrders: RecentOrder[];
    topSelling: TopSelling[];
    salesByCategory: CategorySales[];
    lowStockProducts: LowStockItem[];
};

export default function AdminDashboard({
    metrics,
    recentOrders,
    topSelling,
    salesByCategory,
    lowStockProducts,
}: Props) {
    const formatPrice = (price: number) => `R${Number(price).toFixed(2)}`;

    return (
        <>
            <Head title="Admin Dashboard & Sales Reports | ARENOLO STORE" />

            <div className="min-h-screen bg-stone-50 p-6 text-[#252820]">
                <div className="mx-auto max-w-7xl">
                    {/* Top Bar */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#8b9060]">
                                Store Administration
                            </p>
                            <h1 className="mt-1 text-3xl font-black text-stone-900">
                                Business Dashboard & Sales Reports
                            </h1>
                            <p className="mt-1 text-sm text-stone-500">
                                Monitor overall store performance, incoming orders, and product inventory.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/orders"
                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-sm transition hover:bg-stone-50"
                            >
                                Manage Orders
                            </Link>

                            <Link
                                href="/admin/products"
                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-sm transition hover:bg-stone-50"
                            >
                                Inventory Manager
                            </Link>

                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#252820] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#8b9060]"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Live Store</span>
                            </Link>
                        </div>
                    </div>

                    {/* KPI Metrics Cards */}
                    <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Revenue */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                    Total Sales Revenue
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-black text-stone-900">
                                {formatPrice(metrics.totalRevenue)}
                            </p>
                            <p className="mt-1 text-xs text-stone-400">Paid customer orders</p>
                        </div>

                        {/* Total Orders */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                    Total Orders Placed
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-black text-stone-900">
                                {metrics.totalOrders}
                            </p>
                            <p className="mt-1 text-xs text-stone-400">Tracked in system</p>
                        </div>

                        {/* Catalog Inventory */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                    Products in Inventory
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                                    <Package className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-black text-stone-900">
                                {metrics.totalProducts}
                            </p>
                            <p className="mt-1 text-xs text-stone-400">Across 5 categories</p>
                        </div>

                        {/* Low Stock Alert */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                    Low Stock Alerts
                                </span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-black text-amber-700">
                                {metrics.lowStockCount}
                            </p>
                            <p className="mt-1 text-xs text-stone-400">Units ≤ 10 in stock</p>
                        </div>
                    </div>

                    {/* Sales Reports & Analytics Section */}
                    <div className="mb-8 grid gap-8 lg:grid-cols-2">
                        {/* Top Selling Products */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                                        <TrendingUp className="h-5 w-5 text-[#8b9060]" />
                                        <span>Top Selling Products</span>
                                    </h2>
                                    <p className="text-xs text-stone-400">
                                        Sales volume and revenue performance report
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                {topSelling.length > 0 ? (
                                    <div className="divide-y divide-stone-100">
                                        {topSelling.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between py-3.5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-bold text-stone-900">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-stone-400">
                                                            {item.total_sold} units sold
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="text-sm font-black text-stone-900">
                                                    {formatPrice(item.total_revenue)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-sm text-stone-400">
                                        No sales recorded yet. Once customers place orders, top items will appear here.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Sales Breakdown */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                                <Package className="h-5 w-5 text-[#8b9060]" />
                                <span>Sales by Category</span>
                            </h2>
                            <p className="text-xs text-stone-400">
                                Revenue distribution across product departments
                            </p>

                            <div className="mt-6">
                                {salesByCategory.length > 0 ? (
                                    <div className="space-y-4">
                                        {salesByCategory.map((cat, idx) => (
                                            <div key={idx} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold text-stone-700">
                                                    <span>{cat.category}</span>
                                                    <span>{formatPrice(cat.revenue)}</span>
                                                </div>
                                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
                                                    <div
                                                        className="h-full rounded-full bg-[#8b9060]"
                                                        style={{
                                                            width: `${Math.min(
                                                                100,
                                                                Math.max(
                                                                    15,
                                                                    metrics.totalRevenue > 0
                                                                        ? (cat.revenue / metrics.totalRevenue) * 100
                                                                        : 20,
                                                                ),
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-sm text-stone-400">
                                        Category sales data will populate with order activity.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Alerts & Recent Orders */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Recent Orders Table (2 cols) */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-stone-900">
                                        Recent Orders
                                    </h2>
                                    <p className="text-xs text-stone-400">
                                        Latest customer purchases needing fulfillment
                                    </p>
                                </div>

                                <Link
                                    href="/admin/orders"
                                    className="text-xs font-bold text-[#8b9060] hover:underline"
                                >
                                    View All Orders →
                                </Link>
                            </div>

                            <div className="mt-6 overflow-x-auto">
                                {recentOrders.length > 0 ? (
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-stone-100 bg-stone-50/50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                            <tr>
                                                <th className="px-4 py-3">Tracking #</th>
                                                <th className="px-4 py-3">Customer</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {recentOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-stone-50/50">
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-stone-900">
                                                        #{order.tracking_number}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-stone-700">
                                                        {order.customer_name}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs font-black text-stone-900">
                                                        {formatPrice(order.total_amount)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                                                                order.status === 'delivered'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : order.status === 'shipped'
                                                                      ? 'bg-blue-100 text-blue-800'
                                                                      : 'bg-amber-100 text-amber-800'
                                                            }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="text-xs font-bold text-[#8b9060] hover:underline"
                                                        >
                                                            Manage →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-12 text-center text-sm text-stone-400">
                                        No recent customer orders yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Low Stock Alerts (1 col) */}
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-stone-900">
                                        Inventory Warnings
                                    </h2>
                                    <p className="text-xs text-stone-400">
                                        Items with limited remaining stock
                                    </p>
                                </div>

                                <Link
                                    href="/admin/products?low_stock=true"
                                    className="text-xs font-bold text-amber-700 hover:underline"
                                >
                                    Filter All →
                                </Link>
                            </div>

                            <div className="mt-6 space-y-3">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/40 p-3.5"
                                        >
                                            <div className="truncate">
                                                <p className="truncate text-xs font-bold text-stone-900">
                                                    {p.name}
                                                </p>
                                                <p className="text-[11px] text-stone-500">
                                                    {formatPrice(p.price)}
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-amber-200/80 px-2.5 py-1 text-xs font-black text-amber-900">
                                                {p.stock_quantity} left
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-sm text-stone-400">
                                        All product inventory is well-stocked!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
