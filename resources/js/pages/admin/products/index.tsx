import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    Edit,
    Edit2,
    Eye,
    FolderPlus,
    Package,
    Plus,
    Power,
    Search,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: number | string;
    stock_quantity: number;
    image: string | null;
    is_active: boolean;
    description: string | null;
    category?: {
        id: number;
        name: string;
    } | null;
};

type Category = {
    id: number;
    name: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    filters: {
        search: string;
        category_id: string;
        stock_filter: string;
    };
};

function getProductImage(image: string | null): string {
    if (!image) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    return `/storage/${image}`;
}

export default function AdminProductsIndex({
    products,
    categories,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category_id,
    );
    const [selectedStockFilter, setSelectedStockFilter] = useState(
        filters.stock_filter,
    );

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Quick stock edit state
    const [editingStockId, setEditingStockId] = useState<number | null>(null);
    const [tempStock, setTempStock] = useState<number>(0);

    const { data, setData, post, put, processing, errors, reset } = useForm<{
        name: string;
        category_id: string | number;
        sku: string;
        price: string | number;
        stock_quantity: string | number;
        description: string;
        image: string;
        image_file: File | null;
        is_active: boolean;
    }>({
        name: '',
        category_id: categories[0]?.id ?? '',
        sku: '',
        price: '',
        stock_quantity: 10,
        description: '',
        image: '',
        image_file: null,
        is_active: true,
    });

    const handleFilterChange = (
        newSearch: string,
        newCat: string,
        newStock: string,
    ) => {
        router.get(
            '/admin/products',
            {
                search: newSearch,
                category_id: newCat,
                stock_filter: newStock,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setData({
            name: '',
            category_id: categories[0]?.id ?? '',
            sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
            price: '',
            stock_quantity: 15,
            description: '',
            image: '',
            image_file: null,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (prod: Product) => {
        setEditingProduct(prod);
        setData({
            name: prod.name,
            category_id: prod.category?.id ?? categories[0]?.id ?? '',
            sku: prod.sku,
            price: prod.price,
            stock_quantity: prod.stock_quantity,
            description: prod.description ?? '',
            image: prod.image ?? '',
            image_file: null,
            is_active: prod.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/admin/products/${editingProduct.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/products', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleSaveStock = (productId: number) => {
        router.patch(
            `/admin/products/${productId}/stock`,
            { stock_quantity: tempStock },
            {
                preserveScroll: true,
                onSuccess: () => setEditingStockId(null),
            },
        );
    };

    const handleToggleActive = (productId: number) => {
        router.patch(
            `/admin/products/${productId}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (prod: Product) => {
        if (
            confirm(
                `Are you sure you want to permanently delete product "${prod.name}"? This action cannot be undone.`,
            )
        ) {
            router.delete(`/admin/products/${prod.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Products Catalogue & Inventory | Admin" />

            {/* Header & Create Button */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Product Catalogue Management
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        Add, update, adjust prices, stock levels, upload images,
                        and control catalogue visibility.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="flex items-center gap-2 rounded-xl bg-[#8b9060] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs sm:grid-cols-4">
                <div className="relative sm:col-span-2">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search products by title, SKU, description..."
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilterChange(
                                    search,
                                    selectedCategory,
                                    selectedStockFilter,
                                );
                            }
                        }}
                        className="w-full rounded-xl border border-stone-300 py-2 pr-4 pl-9 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    />
                </div>

                <div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            handleFilterChange(
                                search,
                                e.target.value,
                                selectedStockFilter,
                            );
                        }}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <select
                        value={selectedStockFilter}
                        onChange={(e) => {
                            setSelectedStockFilter(e.target.value);
                            handleFilterChange(
                                search,
                                selectedCategory,
                                e.target.value,
                            );
                        }}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                    >
                        <option value="">All Stock Levels</option>
                        <option value="low">Low Stock (&le; 10)</option>
                        <option value="out">Out of Stock (= 0)</option>
                        <option value="in">In Stock (&gt; 10)</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-stone-200 bg-stone-50/80 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Stock Quantity</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-stone-400"
                                    >
                                        No products found matching your filter
                                        criteria.
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((prod) => (
                                    <tr
                                        key={prod.id}
                                        className="transition hover:bg-stone-50/50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getProductImage(
                                                        prod.image,
                                                    )}
                                                    alt={prod.name}
                                                    className="h-10 w-10 shrink-0 rounded-lg border border-stone-200 object-cover"
                                                />
                                                <div>
                                                    <p className="font-bold text-stone-900">
                                                        {prod.name}
                                                    </p>
                                                    <p className="font-mono text-[10px] text-stone-400">
                                                        SKU: {prod.sku}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                            {prod.category?.name ??
                                                'Uncategorized'}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-stone-900">
                                            R {Number(prod.price).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {editingStockId === prod.id ? (
                                                <div className="flex items-center gap-1.5">
                                                    <input
                                                        type="number"
                                                        value={tempStock}
                                                        min={0}
                                                        onChange={(e) =>
                                                            setTempStock(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                            )
                                                        }
                                                        className="w-16 rounded border border-stone-300 px-2 py-1 text-xs font-bold text-stone-900"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSaveStock(
                                                                prod.id,
                                                            )
                                                        }
                                                        className="rounded bg-emerald-600 p-1 text-white hover:bg-emerald-700"
                                                        title="Save stock"
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingStockId(
                                                                null,
                                                            )
                                                        }
                                                        className="rounded bg-stone-300 p-1 text-stone-700 hover:bg-stone-400"
                                                        title="Cancel"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`font-mono font-bold ${
                                                            prod.stock_quantity <=
                                                            0
                                                                ? 'text-red-600'
                                                                : prod.stock_quantity <=
                                                                    10
                                                                  ? 'text-amber-600'
                                                                  : 'text-stone-800'
                                                        }`}
                                                    >
                                                        {prod.stock_quantity}{' '}
                                                        units
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingStockId(
                                                                prod.id,
                                                            );
                                                            setTempStock(
                                                                prod.stock_quantity,
                                                            );
                                                        }}
                                                        className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                                                        title="Quick edit stock"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleActive(prod.id)
                                                }
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                                                    prod.is_active
                                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : 'border border-stone-300 bg-stone-100 text-stone-600'
                                                }`}
                                            >
                                                <Power className="h-3 w-3" />
                                                <span>
                                                    {prod.is_active
                                                        ? 'ACTIVE'
                                                        : 'DRAFT'}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <a
                                                    href={`/shop/${prod.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                                                    title="View on public shop"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(prod)
                                                    }
                                                    className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-[#8b9060]"
                                                    title="Edit product"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(prod)
                                                    }
                                                    className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
                                                    title="Delete product"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 px-4 py-3 text-xs">
                        <span className="text-stone-500">
                            Showing {products.data.length} of {products.total}{' '}
                            products
                        </span>
                        <div className="flex items-center gap-1">
                            {products.links.map((link, idx) => (
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

            {/* Product Modal (Create / Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                            <h2 className="text-base font-bold text-stone-900">
                                {editingProduct
                                    ? `Edit Product: ${editingProduct.name}`
                                    : 'Add New Product'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        required
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[11px] text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700">
                                        Category *
                                    </label>
                                    <select
                                        value={data.category_id}
                                        required
                                        onChange={(e) =>
                                            setData(
                                                'category_id',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-[11px] text-red-600">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700">
                                        SKU / Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sku}
                                        required
                                        onChange={(e) =>
                                            setData('sku', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 font-mono text-xs font-semibold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                    />
                                    {errors.sku && (
                                        <p className="mt-1 text-[11px] text-red-600">
                                            {errors.sku}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700">
                                        Price (ZAR) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        value={data.price}
                                        required
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-[11px] text-red-600">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.stock_quantity}
                                        required
                                        onChange={(e) =>
                                            setData(
                                                'stock_quantity',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                    />
                                    {errors.stock_quantity && (
                                        <p className="mt-1 text-[11px] text-red-600">
                                            {errors.stock_quantity}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700">
                                        Catalogue Status
                                    </label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    'is_active',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-stone-300 text-[#8b9060] focus:ring-[#8b9060]"
                                        />
                                        <label
                                            htmlFor="is_active"
                                            className="text-xs font-semibold text-stone-800"
                                        >
                                            Active (Visible in client
                                            storefront)
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700">
                                    Image URL or Upload
                                </label>
                                <input
                                    type="text"
                                    value={data.image}
                                    placeholder="https://images.unsplash.com/..."
                                    onChange={(e) =>
                                        setData('image', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 font-mono text-xs text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                />
                                <div className="mt-2 flex items-center gap-2">
                                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-[11px] font-bold text-stone-700 hover:bg-stone-100">
                                        <Upload className="h-3.5 w-3.5" />
                                        <span>Or choose image file</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setData(
                                                        'image_file',
                                                        e.target.files[0],
                                                    );
                                                }
                                            }}
                                        />
                                    </label>
                                    {data.image_file && (
                                        <span className="truncate text-[11px] font-semibold text-stone-600">
                                            {data.image_file.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Detailed product descriptions, features, specifications..."
                                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-900 focus:border-[#8b9060] focus:ring-1 focus:ring-[#8b9060]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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
                                        ? 'Saving...'
                                        : editingProduct
                                          ? 'Save Changes'
                                          : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
