import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

type ActivityLog = {
    id: number;
    actor_type: string;
    activity_type: string;
    description: string;
    properties: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    logs: {
        data: ActivityLog[];
        links: PaginationLink[];
        total: number;
    };
    filters: {
        actor_type: string;
        activity_type: string;
        search: string;
    };
};

export default function AdminActivityLogsIndex({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [actorType, setActorType] = useState(filters.actor_type);
    const [activityType, setActivityType] = useState(filters.activity_type);

    const handleFilter = (
        newSearch: string,
        newActor: string,
        newAct: string,
    ) => {
        router.get(
            '/admin/activity-logs',
            { search: newSearch, actor_type: newActor, activity_type: newAct },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="space-y-6">
            <Head title="Audit Trails & Activity Logs | Admin" />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Audit Trail & Activity Monitoring
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        POPIA-compliant monitoring of customer actions and
                        administrative modifications.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs sm:grid-cols-4">
                <div className="relative sm:col-span-2">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search logs by description, IP address, user name..."
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilter(search, actorType, activityType);
                            }
                        }}
                        className="w-full rounded-xl border border-stone-300 py-2 pr-4 pl-9 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    />
                </div>

                <div>
                    <select
                        value={actorType}
                        onChange={(e) => {
                            setActorType(e.target.value);
                            handleFilter(search, e.target.value, activityType);
                        }}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Actors (Customer & Admin)</option>
                        <option value="admin">Administrator Only</option>
                        <option value="customer">Customer Only</option>
                    </select>
                </div>

                <div>
                    <select
                        value={activityType}
                        onChange={(e) => {
                            setActivityType(e.target.value);
                            handleFilter(search, actorType, e.target.value);
                        }}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Activity Types</option>
                        <option value="order_status_updated">
                            Order Status Updates
                        </option>
                        <option value="payment_status_changed">
                            Payment Status Updates
                        </option>
                        <option value="product_created">Product Created</option>
                        <option value="product_updated">Product Updated</option>
                        <option value="product_deleted">Product Deleted</option>
                        <option value="inventory_adjusted">
                            Inventory Adjustments
                        </option>
                        <option value="category_created">
                            Category Created
                        </option>
                        <option value="customer_status_updated">
                            Customer Status Changes
                        </option>
                    </select>
                </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                            <tr>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">Actor</th>
                                <th className="px-4 py-3">Activity Type</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">IP Address</th>
                                <th className="px-4 py-3">Properties</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-stone-400"
                                    >
                                        No audit entries found matching
                                        criteria.
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="transition hover:bg-stone-50/50"
                                    >
                                        <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-stone-500">
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                                        log.actor_type ===
                                                        'admin'
                                                            ? 'bg-[#8b9060]/20 text-[#676c3f]'
                                                            : 'bg-blue-50 text-blue-700'
                                                    }`}
                                                >
                                                    {log.actor_type}
                                                </span>
                                                <span className="max-w-[120px] truncate font-semibold text-stone-900">
                                                    {log.user?.name ??
                                                        'Anonymous'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-[11px] text-stone-600">
                                            {log.activity_type}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-stone-900">
                                            {log.description}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                                            {log.ip_address || 'Local'}
                                        </td>
                                        <td className="max-w-xs truncate px-4 py-3 font-mono text-[10px] text-stone-500">
                                            {log.properties
                                                ? JSON.stringify(log.properties)
                                                : '-'}
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
                            Total log entries: {logs.total}
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
        </div>
    );
}
