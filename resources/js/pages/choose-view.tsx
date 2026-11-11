import { Head, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    LogOut,
    Shield,
    ShoppingBag,
    User,
} from 'lucide-react';

type Props = {
    user: {
        name: string;
        email: string;
    };
};

export default function ChooseView() {
    const { user } = usePage<Props>().props;

    function goAdmin() {
        router.visit('/admin');
    }

    function goCustomer() {
        router.post('/choose-view/customer');
    }

    function logout() {
        router.post('/logout');
    }

    return (
        <>
            <Head title="Choose View" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                {/* Card */}
                <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                    {/* Header */}
                    <div className="rounded-t-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="mt-1 text-sm text-indigo-200">
                            {user.email}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                            <Shield className="h-3 w-3" />
                            Administrator Account
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-8 py-8">
                        <p className="mb-6 text-center text-sm text-slate-500">
                            Your account has administrator privileges. Choose
                            how you'd like to continue.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Admin panel button */}
                            <button
                                onClick={goAdmin}
                                className="group flex flex-col items-center gap-3 rounded-xl border-2 border-indigo-100 bg-indigo-50 p-6 text-center transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-100 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110">
                                    <LayoutDashboard className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        Admin Panel
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Manage the store, orders &amp; products
                                    </p>
                                </div>
                            </button>

                            {/* Customer view button */}
                            <button
                                onClick={goCustomer}
                                className="group flex flex-col items-center gap-3 rounded-xl border-2 border-emerald-100 bg-emerald-50 p-6 text-center transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-100 hover:shadow-md focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-110">
                                    <ShoppingBag className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        Customer View
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Browse &amp; shop as a customer
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Also browse storefront */}
                        <div className="mt-4">
                            <a
                                href="/"
                                className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                            >
                                <User className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                Browse the Storefront (public)
                            </a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="rounded-b-2xl border-t border-slate-100 px-8 py-4">
                        <button
                            onClick={logout}
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-50 hover:text-red-500"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
