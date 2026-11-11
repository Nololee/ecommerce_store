import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Mail, Phone, User } from 'lucide-react';
import CustomerLayout from '@/layouts/customer/customer-layout';

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    email_verified: boolean;
};

type Props = {
    customer: Customer;
    mustVerifyEmail: boolean;
    status?: string | null;
};

export default function CustomerProfile({
    customer,
    mustVerifyEmail,
    status,
}: Props) {
    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/customer/profile');
    };

    return (
        <CustomerLayout
            title="My Profile"
            subtitle="Manage your personal account information and contact preferences."
            activeTab="profile"
        >
            <Head title="My Profile | Customer Dashboard" />

            <div className="max-w-2xl rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
                <form onSubmit={submit} className="space-y-6">
                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            <span>
                                Your profile has been successfully updated.
                            </span>
                        </div>
                    )}

                    {status === 'verification-link-sent' && (
                        <div className="rounded-2xl bg-amber-50 p-4 text-xs font-semibold text-amber-800">
                            A new verification link has been sent to your email
                            address.
                        </div>
                    )}

                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-stone-700 uppercase">
                            Full Name
                        </label>
                        <div className="relative mt-2">
                            <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pr-4 pl-11 text-xs font-medium text-stone-900 transition focus:border-[#8b9060] focus:bg-white focus:ring-2 focus:ring-[#8b9060]/20 focus:outline-none"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-stone-700 uppercase">
                            Email Address
                        </label>
                        <div className="relative mt-2">
                            <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pr-4 pl-11 text-xs font-medium text-stone-900 transition focus:border-[#8b9060] focus:bg-white focus:ring-2 focus:ring-[#8b9060]/20 focus:outline-none"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.email}
                            </p>
                        )}

                        {mustVerifyEmail && !customer.email_verified && (
                            <p className="mt-2 text-xs text-amber-600">
                                Your email address is unverified. Please check
                                your inbox for verification.
                            </p>
                        )}
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-stone-700 uppercase">
                            Contact Phone Number
                        </label>
                        <div className="relative mt-2">
                            <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                placeholder="e.g. +27 82 123 4567"
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pr-4 pl-11 text-xs font-medium text-stone-900 transition focus:border-[#8b9060] focus:bg-white focus:ring-2 focus:ring-[#8b9060]/20 focus:outline-none"
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.phone}
                            </p>
                        )}
                        <p className="mt-1 text-[11px] text-stone-400">
                            Used by delivery couriers for delivery updates and
                            dispatch notices.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end border-t border-stone-100 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-2xl bg-[#8b9060] px-6 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#787c53] disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}
