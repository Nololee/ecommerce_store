import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, MapPin, Plus, Star, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import CustomerLayout from '@/layouts/customer/customer-layout';

type Address = {
    id: number;
    label: string;
    recipient_name: string;
    phone: string;
    street_address: string;
    suburb?: string | null;
    city: string;
    province?: string | null;
    postal_code: string;
    country: string;
    is_default: boolean;
};

type Props = {
    addresses: Address[];
};

export default function CustomerAddressesIndex({ addresses }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            label: 'Home',
            recipient_name: '',
            phone: '',
            street_address: '',
            suburb: '',
            city: '',
            province: 'Gauteng',
            postal_code: '',
            country: 'South Africa',
            is_default: false,
        });

    const openCreate = () => {
        setEditingAddress(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEdit = (addr: Address) => {
        setEditingAddress(addr);
        clearErrors();
        setData({
            label: addr.label,
            recipient_name: addr.recipient_name,
            phone: addr.phone,
            street_address: addr.street_address,
            suburb: addr.suburb ?? '',
            city: addr.city,
            province: addr.province ?? '',
            postal_code: addr.postal_code,
            country: addr.country,
            is_default: addr.is_default,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingAddress) {
            put(`/customer/addresses/${editingAddress.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/customer/addresses', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (addr: Address) => {
        if (
            confirm(
                `Are you sure you want to remove the address "${addr.label}"?`,
            )
        ) {
            router.delete(`/customer/addresses/${addr.id}`);
        }
    };

    const handleSetDefault = (addr: Address) => {
        router.patch(`/customer/addresses/${addr.id}/default`);
    };

    return (
        <CustomerLayout
            title="My Addresses"
            subtitle="Manage your saved shipping and billing destinations for rapid checkout."
            activeTab="addresses"
        >
            <Head title="My Addresses | Customer Dashboard" />

            <div className="space-y-6">
                {/* Header Action Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#8b9060] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                    >
                        <Plus className="h-4 w-4" /> Add New Address
                    </button>
                </div>

                {/* Addresses Grid */}
                {addresses.length === 0 ? (
                    <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
                        <MapPin className="mx-auto h-12 w-12 text-stone-300" />
                        <h3 className="mt-4 text-base font-bold text-stone-800">
                            No delivery addresses saved
                        </h3>
                        <p className="mt-1 text-xs text-stone-500">
                            Save your home or office address to make future
                            checkouts faster.
                        </p>
                        <button
                            type="button"
                            onClick={openCreate}
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#8b9060] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53]"
                        >
                            <Plus className="h-4 w-4" /> Add Your First Address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`flex flex-col justify-between rounded-3xl border p-6 shadow-xs transition ${
                                    addr.is_default
                                        ? 'border-[#8b9060] bg-white ring-1 ring-[#8b9060]/20'
                                        : 'border-stone-200/80 bg-white hover:border-stone-300'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                                            {addr.label}
                                        </span>

                                        {addr.is_default && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#8b9060]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#696d42]">
                                                <Star className="h-3 w-3 fill-current" />{' '}
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 space-y-1 text-xs text-stone-600">
                                        <p className="text-sm font-bold text-stone-900">
                                            {addr.recipient_name}
                                        </p>
                                        <p>{addr.street_address}</p>
                                        {addr.suburb && <p>{addr.suburb}</p>}
                                        <p>
                                            {addr.city}, {addr.province}{' '}
                                            {addr.postal_code}
                                        </p>
                                        <p className="text-stone-400">
                                            {addr.country}
                                        </p>
                                        <p className="pt-2 font-medium text-stone-800">
                                            Phone: {addr.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                                    {!addr.is_default ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSetDefault(addr)
                                            }
                                            className="text-xs font-bold text-[#8b9060] hover:underline"
                                        >
                                            Set as Default
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(addr)}
                                            className="rounded-xl p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-700"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(addr)}
                                            className="rounded-xl p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Modal (Create / Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <h3 className="text-base font-black text-stone-900">
                                {editingAddress
                                    ? 'Edit Address'
                                    : 'Add New Address'}
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                                        Label
                                    </label>
                                    <input
                                        type="text"
                                        value={data.label}
                                        onChange={(e) =>
                                            setData('label', e.target.value)
                                        }
                                        placeholder="Home, Office, etc."
                                        required
                                        className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-xs text-stone-900 focus:border-[#8b9060] focus:bg-white focus:outline-none"
                                    />
                                    {errors.label && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.label}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                                        Recipient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.recipient_name}
                                        onChange={(e) =>
                                            setData(
                                                'recipient_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Full Name"
                                        required
                                        className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-xs text-stone-900 focus:border-[#8b9060] focus:bg-white focus:outline-none"
                                    />
                                    {errors.recipient_name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.recipient_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    placeholder="+27 82 123 4567"
                                    required
                                    className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-xs text-stone-900 focus:border-[#8b9060] focus:bg-white focus:outline-none"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    value={data.street_address}
                                    onChange={(e) =>
                                        setData(
                                            'street_address',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="House/Apartment #, Street Name"
                                    required
                                    className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-xs text-stone-900 focus:border-[#8b9060] focus:bg-white focus:outline-none"
                                />
                                {errors.street_address && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.street_address}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData('city', e.target.value)
                                        }
                                        placeholder="Johannesburg, Cape Town"
                                        required
                                        className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-xs text-stone-900 focus:border-[#8b9060] focus:bg-white focus:outline-none"
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        value={data.postal_code}
                                        onChange={(e) =>
                                            setData(
                                                'postal_code',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="2000"
                                        required
                                        className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-xs text-stone-900 focus:border-[#8b9060] focus:bg-white focus:outline-none"
                                    />
                                    {errors.postal_code && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.postal_code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    checked={data.is_default}
                                    onChange={(e) =>
                                        setData('is_default', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-stone-300 text-[#8b9060] focus:ring-[#8b9060]"
                                />
                                <label
                                    htmlFor="is_default"
                                    className="text-xs font-semibold text-stone-700"
                                >
                                    Set as my default shipping address
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-2xl border border-stone-200 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-2xl bg-[#8b9060] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53] disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : editingAddress
                                          ? 'Update Address'
                                          : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
