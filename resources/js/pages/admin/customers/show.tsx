import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Mail,
    Phone,
    Power,
    Shield,
    ShoppingBag,
    User,
} from 'lucide-react';

type OrderItem = {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    line_total: number;
};

type Order = {
    id: number;
    tracking_number: string;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
};

type ActivityLog = {
    id: number;
    activity_type: string;
    description: string;
    ip_address: string | null;
    created_at: string;
};

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

type Props = {
    customer: Customer;
    orders: {
        data: Order[];
        total: number;
    };
    activities: ActivityLog[];
};

export default function AdminCustomerShow({
    customer,
    orders,
    activities,
}: Props) {
    const formatCurrency = (val: number | string | null) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(Number(val) || 0);
    };

    const handleToggleStatus = () => {
        router.patch(
            `/admin/customers/${customer.id}/toggle-status`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="space-y-6">
            <Head title={`Customer: ${customer.name} | Admin`} />

            {/* Back link & Header */}
            <div>
                <Link
                    href="/admin/customers"
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 transition hover:text-stone-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Customers Directory</span>
                </Link>

                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b9060]/20 text-xl font-black text-[#676c3f]">
                            {customer.name[0]?.toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-stone-900">
                                    {customer.name}
                                </h1>
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                        customer.is_active
                                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border border-red-200 bg-red-50 text-red-700'
                                    }`}
                                >
                                    {customer.is_active
                                        ? 'ACTIVE'
                                        : 'SUSPENDED'}
                                </span>
                            </div>
                            <p className="text-xs text-stone-500">
                                Registered customer ID #{customer.id} &bull;
                                Joined on{' '}
                                {new Date(
                                    customer.created_at,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition ${
                            customer.is_active
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                    >
                        <Power className="h-4 w-4" />
                        <span>
                            {customer.is_active
                                ? 'Suspend Customer Account'
                                : 'Reactivate Account'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Total Lifetime Spend
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {formatCurrency(customer.total_spent)}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Paid purchases
                    </span>
                </div>

                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Total Orders Placed
                    </span>
                    <p className="mt-2 text-2xl font-black text-stone-900">
                        {customer.orders_count}
                    </p>
                    <span className="text-[11px] text-stone-400">
                        Order count
                    </span>
                </div>

                <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs">
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                        Contact Details
                    </span>
                    <p className="mt-2 truncate text-xs font-bold text-stone-900">
                        {customer.email}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-stone-500">
                        {customer.phone || 'No phone number'}
                    </p>
                </div>
            </div>

            {/* Orders & Activity Logs */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Orders History */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs lg:col-span-2">
                    <h2 className="mb-4 text-sm font-bold tracking-wider text-stone-900 uppercase">
                        Order History ({orders.total})
                    </h2>

                    <div className="divide-y divide-stone-100">
                        {orders.data.length === 0 ? (
                            <p className="py-6 text-center text-xs text-stone-400">
                                No orders placed by this customer.
                            </p>
                        ) : (
                            orders.data.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between py-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-stone-900">
                                                {order.tracking_number}
                                            </span>
                                            <span
                                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                                    order.status === 'delivered'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : order.status ===
                                                            'cancelled'
                                                          ? 'bg-red-50 text-red-700'
                                                          : 'bg-blue-50 text-blue-700'
                                                }`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-stone-500">
                                            {order.items.length} items &bull;
                                            Placed{' '}
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs font-bold text-stone-900">
                                            {formatCurrency(order.total_amount)}
                                        </p>
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-[11px] font-bold text-[#8b9060] hover:underline"
                                        >
                                            View Order &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Customer Activity Log Timeline */}
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
                    <h2 className="mb-4 text-sm font-bold tracking-wider text-stone-900 uppercase">
                        Activity Timeline
                    </h2>

                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <p className="py-6 text-center text-xs text-stone-400">
                                No activity recorded yet.
                            </p>
                        ) : (
                            activities.map((act) => (
                                <div
                                    key={act.id}
                                    className="border-l-2 border-[#8b9060] py-1 pl-3"
                                >
                                    <p className="text-xs font-semibold text-stone-800">
                                        {act.description}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-[10px] text-stone-400">
                                        <span>
                                            {new Date(
                                                act.created_at,
                                            ).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        {act.ip_address && (
                                            <span>
                                                &bull; IP: {act.ip_address}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
