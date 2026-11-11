import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Package, ShoppingBag } from 'lucide-react';
import CustomerLayout from '@/layouts/customer/customer-layout';

type PurchasedItem = {
    id: number;
    product_id: number;
    product_name: string;
    product_slug?: string | null;
    product_sku: string;
    product_image?: string | null;
    category_name?: string | null;
    price_paid: number;
    quantity: number;
    line_total: number;
    order_tracking_number: string;
    order_status: string;
    purchased_at: string;
};

type PaginatedPurchases = {
    data: PurchasedItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Props = {
    purchases: PaginatedPurchases;
};

export default function CustomerPurchaseHistory({ purchases }: Props) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    return (
        <CustomerLayout
            title="Purchase History"
            subtitle="Historical snapshot of every product item purchased, exact price paid, and associated order."
            activeTab="purchases"
        >
            <Head title="Purchase History | Customer Dashboard" />

            <div className="space-y-6">
                {purchases.data.length === 0 ? (
                    <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
                        <ShoppingBag className="mx-auto h-12 w-12 text-stone-300" />
                        <h3 className="mt-4 text-base font-bold text-stone-800">
                            No purchases recorded
                        </h3>
                        <p className="mt-1 text-xs text-stone-500">
                            You have not completed any purchases yet.
                        </p>
                        <Link
                            href="/shop"
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#8b9060] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                        >
                            <ShoppingBag className="h-4 w-4" /> Browse Shop
                            Catalogue
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-stone-600">
                                <thead className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3">
                                            Purchased Date
                                        </th>
                                        <th className="px-4 py-3">Quantity</th>
                                        <th className="px-4 py-3">
                                            Price Paid
                                        </th>
                                        <th className="px-4 py-3">
                                            Line Total
                                        </th>
                                        <th className="px-4 py-3">
                                            Related Order
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {purchases.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-stone-50/40"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                                                        {item.product_image ? (
                                                            <img
                                                                src={
                                                                    item.product_image
                                                                }
                                                                alt={
                                                                    item.product_name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-stone-300">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-stone-900">
                                                            {item.product_name}
                                                        </h4>
                                                        {item.category_name && (
                                                            <span className="text-[11px] text-stone-400">
                                                                {
                                                                    item.category_name
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 font-mono font-medium text-stone-600">
                                                {item.product_sku}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-stone-500">
                                                {item.purchased_at}
                                            </td>
                                            <td className="px-4 py-4 font-bold text-stone-900">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-4 font-bold text-stone-900">
                                                {formatCurrency(
                                                    item.price_paid,
                                                )}
                                            </td>
                                            <td className="px-4 py-4 font-black text-stone-900">
                                                {formatCurrency(
                                                    item.line_total,
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/customer/orders/${item.order_tracking_number}`}
                                                    className="font-mono text-xs font-bold text-[#8b9060] hover:underline"
                                                >
                                                    {item.order_tracking_number}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {item.product_slug ? (
                                                    <Link
                                                        href={`/shop/${item.product_slug}`}
                                                        className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-1 font-bold text-stone-700 shadow-2xs hover:border-stone-400"
                                                    >
                                                        <span>Buy Again</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                ) : (
                                                    <span className="text-[11px] text-stone-300">
                                                        Unavailable
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {purchases.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6">
                                {purchases.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url ?? '#'}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                            link.active
                                                ? 'bg-[#8b9060] text-white'
                                                : link.url
                                                  ? 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                                  : 'cursor-not-allowed text-stone-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
