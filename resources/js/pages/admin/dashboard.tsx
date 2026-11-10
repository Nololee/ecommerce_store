import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    DollarSign,
    Filter,
    FolderTree,
    Package,
    RefreshCw,
    ShoppingBag,
    Users,
    XCircle,
} from 'lucide-react';

type MetricData = {
    totalCustomers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    lowStockCount: number;
    outOfStockCount: number;
    rangeRevenue: number;
    rangeOrdersCount: number;
    dailySales: number;
    weeklySales: number;
    monthlySales: number;
    annualSales: number;
};

type TrendPoint = {
    period: string;
    total_orders: number;
    revenue: number;
};

type RecentOrder = {
    id: number;
    tracking_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    items_count: number;
    created_at: string;
};

type RecentCustomer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    is_active: boolean;
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
    total_sold: number;
    products_count: number;
};

type StockAlertItem = {
    id: number;
    name: string;
    stock_quantity: number;
    price: number;
    is_active: boolean;
};

type Props = {
    filters: {
        range: string;
    };
    metrics: MetricData;
    trends: TrendPoint[];
    recentOrders: RecentOrder[];
    recentCustomers: RecentCustomer[];
    topSelling: TopSelling[];
    salesByCategory: CategorySales[];
    stockAlertProducts: StockAlertItem[];
};

export default function AdminDashboard({
    filters,
    metrics,
    trends,
    recentOrders,
    recentCustomers,
    topSelling,
    salesByCategory,
    stockAlertProducts,
}: Props) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 2,
        }).format(val);
    };

    const handleRangeChange = (newRange: string) => {
        router.get(
            '/admin',
            { range: newRange },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Calculate maximum trend value for visual scaling in charts
    const maxRevenueTrend = Math.max(
        ...trends.map((t) => Number(t.revenue) || 0),
        100,
    );

    return (
        <div className="space-y-8">
            <Head title="Admin Dashboard Overview | ARENOLO" />

            {/* Header & Date Filter Bar */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Business Dashboard & Analytics
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        Real-time overview of sales, orders, customer
                        registrations, and inventory status.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                        <Filter className="h-3.5 w-3.5" /> Date Filter:
                    </span>
                    <select
                        value={filters.range}
                        onChange={(e) => handleRangeChange(e.target.value)}
                        className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 shadow-2xs focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="today">Today</option>
                        <option value="7_days">Last 7 Days</option>
                        <option value="30_days">Last 30 Days</option>
                        <option value="this_year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            {/* 1. Primary KPI Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                            Total Revenue (Paid)
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-stone-900">
                        {formatCurrency(metrics.totalRevenue)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-stone-500">
                        <span className="font-bold text-emerald-600">
                            Filter Range:
                        </span>{' '}
                        {formatCurrency(metrics.rangeRevenue)}
                    </div>
                </div>

                {/* Total Orders */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                            Total Orders
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-stone-900">
                        {metrics.totalOrders}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-stone-500">
                        <span className="font-bold text-blue-600">
                            Filter Range:
                        </span>{' '}
                        {metrics.rangeOrdersCount} orders placed
                    </div>
                </div>

                {/* Registered Customers */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                            Customers
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-stone-900">
                        {metrics.totalCustomers}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>{' '}
                        Verified customer accounts
                    </div>
                </div>

                {/* Products & Inventory */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                            Products & Stock
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Package className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-black text-stone-900">
                        {metrics.totalProducts}{' '}
                        <span className="text-xs font-normal text-stone-400">
                            items
                        </span>
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold">
                        <span className="text-amber-600">
                            {metrics.lowStockCount} Low
                        </span>
                        <span className="text-stone-300">&bull;</span>
                        <span className="text-red-600">
                            {metrics.outOfStockCount} Out of stock
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Order Breakdown & Periodic Revenue Tiers */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Order Status Breakdown */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                    <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                        Order Lifecycle Statuses
                    </h2>
                    <p className="mt-0.5 text-xs text-stone-500">
                        Real-time counts across fulfillment pipeline
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-center">
                            <Clock className="mx-auto mb-1 h-4 w-4 text-amber-600" />
                            <p className="text-lg font-black text-amber-800">
                                {metrics.pendingOrders}
                            </p>
                            <p className="text-[11px] font-bold text-amber-700">
                                Pending
                            </p>
                        </div>
                        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-center">
                            <RefreshCw className="mx-auto mb-1 h-4 w-4 text-blue-600" />
                            <p className="text-lg font-black text-blue-800">
                                {metrics.processingOrders}
                            </p>
                            <p className="text-[11px] font-bold text-blue-700">
                                Processing
                            </p>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-center">
                            <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-600" />
                            <p className="text-lg font-black text-emerald-800">
                                {metrics.completedOrders}
                            </p>
                            <p className="text-[11px] font-bold text-emerald-700">
                                Delivered
                            </p>
                        </div>
                        <div className="rounded-xl border border-red-200 bg-red-50/50 p-3.5 text-center">
                            <XCircle className="mx-auto mb-1 h-4 w-4 text-red-600" />
                            <p className="text-lg font-black text-red-800">
                                {metrics.cancelledOrders}
                            </p>
                            <p className="text-[11px] font-bold text-red-700">
                                Cancelled
                            </p>
                        </div>
                    </div>
                </div>

                {/* Periodic Sales Benchmarks */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                    <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                        Sales Revenue Benchmarks
                    </h2>
                    <p className="mt-0.5 text-xs text-stone-500">
                        Rolling revenue performance milestones
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-center">
                            <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                Daily Sales
                            </span>
                            <p className="mt-1 text-sm font-black text-stone-900">
                                {formatCurrency(metrics.dailySales)}
                            </p>
                            <span className="text-[10px] text-stone-400">
                                Today
                            </span>
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-center">
                            <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                Weekly Sales
                            </span>
                            <p className="mt-1 text-sm font-black text-stone-900">
                                {formatCurrency(metrics.weeklySales)}
                            </p>
                            <span className="text-[10px] text-stone-400">
                                Past 7 Days
                            </span>
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-center">
                            <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                Monthly Sales
                            </span>
                            <p className="mt-1 text-sm font-black text-stone-900">
                                {formatCurrency(metrics.monthlySales)}
                            </p>
                            <span className="text-[10px] text-stone-400">
                                Past 30 Days
                            </span>
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-center">
                            <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                Annual Sales
                            </span>
                            <p className="mt-1 text-sm font-black text-stone-900">
                                {formatCurrency(metrics.annualSales)}
                            </p>
                            <span className="text-[10px] text-stone-400">
                                Year to Date
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Interactive Trends Visualization */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                            Revenue & Order Activity Timeline
                        </h2>
                        <p className="text-xs text-stone-500">
                            Trends grouped by{' '}
                            {filters.range === 'this_year' ? 'month' : 'day'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-xs bg-[#8b9060]"></span>
                            <span className="text-stone-600">
                                Revenue (ZAR)
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-xs bg-stone-400"></span>
                            <span className="text-stone-600">Orders Count</span>
                        </div>
                    </div>
                </div>

                {trends.length === 0 ? (
                    <div className="py-12 text-center text-xs text-stone-500">
                        No transactions recorded for the selected period.
                    </div>
                ) : (
                    <div className="space-y-3 pt-2">
                        {trends.map((point) => {
                            const revPct = Math.min(
                                100,
                                Math.round(
                                    ((Number(point.revenue) || 0) /
                                        maxRevenueTrend) *
                                        100,
                                ),
                            );
                            return (
                                <div
                                    key={point.period}
                                    className="flex items-center gap-4 text-xs"
                                >
                                    <div className="w-24 shrink-0 font-mono text-[11px] text-stone-500">
                                        {point.period}
                                    </div>
                                    <div className="flex h-4 flex-1 overflow-hidden rounded-full bg-stone-100">
                                        <div
                                            className="h-full bg-[#8b9060] transition-all duration-300"
                                            style={{
                                                width: `${Math.max(revPct, 4)}%`,
                                            }}
                                            title={`Revenue: ${formatCurrency(Number(point.revenue) || 0)}`}
                                        />
                                    </div>
                                    <div className="flex w-44 shrink-0 items-center justify-end gap-3 text-right font-semibold">
                                        <span className="text-stone-800">
                                            {formatCurrency(
                                                Number(point.revenue) || 0,
                                            )}
                                        </span>
                                        <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] text-stone-700">
                                            {point.total_orders}{' '}
                                            {point.total_orders === 1
                                                ? 'order'
                                                : 'orders'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 4. Top Selling Products & Best-Selling Categories */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Top Selling Products */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                                Most Purchased Products
                            </h2>
                            <p className="text-xs text-stone-500">
                                Top revenue generating catalogue items
                            </p>
                        </div>
                        <Link
                            href="/admin/products"
                            className="text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            View Catalogue
                        </Link>
                    </div>

                    <div className="divide-y divide-stone-100">
                        {topSelling.length === 0 ? (
                            <p className="py-6 text-center text-xs text-stone-400">
                                No product sales recorded yet.
                            </p>
                        ) : (
                            topSelling.map((item, idx) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-[11px] font-bold text-stone-600">
                                            #{idx + 1}
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold text-stone-900">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-stone-500">
                                                {item.total_sold} units sold
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-stone-900">
                                        {formatCurrency(item.total_revenue)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Best Selling Categories */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                                Best-Selling Categories
                            </h2>
                            <p className="text-xs text-stone-500">
                                Revenue contribution per category
                            </p>
                        </div>
                        <Link
                            href="/admin/categories"
                            className="text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            View Categories
                        </Link>
                    </div>

                    <div className="divide-y divide-stone-100">
                        {salesByCategory.length === 0 ? (
                            <p className="py-6 text-center text-xs text-stone-400">
                                No categories found.
                            </p>
                        ) : (
                            salesByCategory.map((cat) => (
                                <div
                                    key={cat.category}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                                            <FolderTree className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-stone-900">
                                                {cat.category}
                                            </p>
                                            <p className="text-[11px] text-stone-500">
                                                {cat.products_count} products
                                                &bull; {cat.total_sold} sold
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-stone-900">
                                        {formatCurrency(cat.revenue)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 5. Recent Orders & Stock Level Alerts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Orders (Spans 2 cols) */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                                Recent Store Orders
                            </h2>
                            <p className="text-xs text-stone-500">
                                Latest transactions requiring fulfillment
                            </p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            View All Orders
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                                <tr>
                                    <th className="px-3.5 py-2.5">
                                        Tracking #
                                    </th>
                                    <th className="px-3.5 py-2.5">Customer</th>
                                    <th className="px-3.5 py-2.5">Total</th>
                                    <th className="px-3.5 py-2.5">Payment</th>
                                    <th className="px-3.5 py-2.5">Status</th>
                                    <th className="px-3.5 py-2.5 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-6 text-center text-stone-400"
                                        >
                                            No orders placed yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition hover:bg-stone-50/50"
                                        >
                                            <td className="px-3.5 py-3 font-mono font-bold text-stone-900">
                                                {order.tracking_number}
                                            </td>
                                            <td className="px-3.5 py-3">
                                                <p className="font-semibold text-stone-900">
                                                    {order.customer_name}
                                                </p>
                                                <p className="text-[11px] text-stone-400">
                                                    {order.customer_email}
                                                </p>
                                            </td>
                                            <td className="px-3.5 py-3 font-bold text-stone-900">
                                                {formatCurrency(
                                                    order.total_amount,
                                                )}
                                            </td>
                                            <td className="px-3.5 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                        order.payment_status ===
                                                        'paid'
                                                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : 'border border-amber-200 bg-amber-50 text-amber-700'
                                                    }`}
                                                >
                                                    {order.payment_status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                        order.status ===
                                                        'delivered'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : order.status ===
                                                                'cancelled'
                                                              ? 'bg-red-50 text-red-700'
                                                              : order.status ===
                                                                  'processing'
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                    }`}
                                                >
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-3 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="rounded-lg bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-700 transition hover:bg-[#8b9060] hover:text-white"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Level Alert Panel */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                                Inventory Alerts
                            </h2>
                            <p className="text-xs text-stone-500">
                                Low & out-of-stock items
                            </p>
                        </div>
                        <Link
                            href="/admin/inventory"
                            className="text-xs font-bold text-[#8b9060] hover:underline"
                        >
                            Manage Stock
                        </Link>
                    </div>

                    <div className="divide-y divide-stone-100">
                        {stockAlertProducts.length === 0 ? (
                            <p className="py-6 text-center text-xs font-semibold text-emerald-600">
                                All products are well stocked!
                            </p>
                        ) : (
                            stockAlertProducts.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="truncate pr-2">
                                        <p className="truncate text-xs font-bold text-stone-900">
                                            {prod.name}
                                        </p>
                                        <p className="text-[11px] text-stone-500">
                                            {formatCurrency(prod.price)}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                            prod.stock_quantity <= 0
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {prod.stock_quantity <= 0
                                            ? 'Out of Stock'
                                            : `${prod.stock_quantity} left`}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 6. Recent Customer Registrations */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold tracking-wider text-stone-900 uppercase">
                            Recent Customer Registrations
                        </h2>
                        <p className="text-xs text-stone-500">
                            Newly joined customers on the storefront
                        </p>
                    </div>
                    <Link
                        href="/admin/customers"
                        className="text-xs font-bold text-[#8b9060] hover:underline"
                    >
                        View All Customers
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                            <tr>
                                <th className="px-3.5 py-2.5">Customer Name</th>
                                <th className="px-3.5 py-2.5">Email Address</th>
                                <th className="px-3.5 py-2.5">Phone Number</th>
                                <th className="px-3.5 py-2.5">Status</th>
                                <th className="px-3.5 py-2.5">
                                    Registered Date
                                </th>
                                <th className="px-3.5 py-2.5 text-right">
                                    Profile
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {recentCustomers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-6 text-center text-stone-400"
                                    >
                                        No customer accounts registered yet.
                                    </td>
                                </tr>
                            ) : (
                                recentCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="transition hover:bg-stone-50/50"
                                    >
                                        <td className="px-3.5 py-3 font-bold text-stone-900">
                                            {customer.name}
                                        </td>
                                        <td className="px-3.5 py-3 text-stone-600">
                                            {customer.email}
                                        </td>
                                        <td className="px-3.5 py-3 font-mono text-stone-600">
                                            {customer.phone}
                                        </td>
                                        <td className="px-3.5 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    customer.is_active
                                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : 'border border-red-200 bg-red-50 text-red-700'
                                                }`}
                                            >
                                                {customer.is_active
                                                    ? 'ACTIVE'
                                                    : 'SUSPENDED'}
                                            </span>
                                        </td>
                                        <td className="px-3.5 py-3 text-stone-500">
                                            {customer.created_at}
                                        </td>
                                        <td className="px-3.5 py-3 text-right">
                                            <Link
                                                href={`/admin/customers/${customer.id}`}
                                                className="rounded-lg bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-700 transition hover:bg-[#8b9060] hover:text-white"
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
            </div>
        </div>
    );
}
