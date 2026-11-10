import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, FolderTree, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products_count: number;
};

type Props = {
    categories: Category[];
    filters?: {
        search?: string;
    };
};

export default function AdminCategoriesIndex({ categories }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const openCreate = () => {
        setEditingCategory(null);
        reset();
        setIsModalOpen(true);
    };

    const openEdit = (cat: Category) => {
        setEditingCategory(cat);
        setData({
            name: cat.name,
            description: cat.description ?? '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (cat: Category) => {
        if (cat.products_count > 0) {
            alert(
                `Cannot delete '${cat.name}' because it contains ${cat.products_count} products. Reassign those products first.`,
            );
            return;
        }

        if (
            confirm(`Are you sure you want to delete category "${cat.name}"?`)
        ) {
            router.delete(`/admin/categories/${cat.id}`);
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Product Categories Management | Admin" />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-900">
                        Product Categories
                    </h1>
                    <p className="mt-1 text-xs text-stone-500">
                        Create, modify, and manage product departmental
                        categories safely.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[#8b9060] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create Category</span>
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs transition hover:border-stone-300"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                                    <FolderTree className="h-5 w-5" />
                                </div>
                                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-700">
                                    {cat.products_count}{' '}
                                    {cat.products_count === 1
                                        ? 'product'
                                        : 'products'}
                                </span>
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-stone-900">
                                {cat.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs text-stone-500">
                                {cat.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-3">
                            <span className="font-mono text-[10px] text-stone-400">
                                /{cat.slug}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => openEdit(cat)}
                                    className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                                    title="Edit category"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(cat)}
                                    className={`rounded-lg p-1.5 ${
                                        cat.products_count > 0
                                            ? 'cursor-not-allowed text-stone-300'
                                            : 'text-stone-400 hover:bg-red-50 hover:text-red-600'
                                    }`}
                                    title={
                                        cat.products_count > 0
                                            ? 'Contains products (Protected)'
                                            : 'Delete category'
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                            <h2 className="text-base font-bold text-stone-900">
                                {editingCategory
                                    ? `Edit: ${editingCategory.name}`
                                    : 'New Category'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-bold text-stone-700">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
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
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
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
                                        : editingCategory
                                          ? 'Save Changes'
                                          : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
