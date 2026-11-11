import { Head } from '@inertiajs/react';
import { ExternalLink, Lock, ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import StoreLayout from '@/layouts/store-layout';

type Props = {
    order: {
        tracking_number: string;
        total_amount: number;
        customer_name: string;
    };
    payload: Record<string, string>;
    processUrl: string;
};

export default function PayFastRedirect({ order, payload, processUrl }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        // Auto-submit after 1.2 seconds to give user visual feedback
        const timer = setTimeout(() => {
            if (formRef.current) {
                formRef.current.submit();
            }
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    return (
        <StoreLayout>
            <Head title="Connecting to PayFast Sandbox..." />

            <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
                <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-lg">
                    {/* PayFast Sandbox Badge */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs">
                        <Lock className="h-8 w-8" />
                    </div>

                    <span className="mt-4 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold tracking-wider text-red-800 uppercase">
                        PayFast Sandbox Gateway
                    </span>

                    <h1 className="mt-3 text-2xl font-black text-stone-900">
                        Transferring to PayFast
                    </h1>

                    <p className="mt-2 text-xs text-stone-500">
                        Please wait while we redirect you to PayFast&apos;s
                        secure sandbox portal to complete payment for Order{' '}
                        <span className="font-mono font-bold text-stone-800">
                            #{order.tracking_number}
                        </span>
                        .
                    </p>

                    {/* Amount Card */}
                    <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50 p-4">
                        <span className="text-[11px] font-bold text-stone-400 uppercase">
                            Total Due (ZAR)
                        </span>
                        <div className="text-3xl font-black text-stone-900">
                            {formatCurrency(order.total_amount)}
                        </div>
                    </div>

                    {/* Hidden Auto-Submit Form */}
                    <form ref={formRef} action={processUrl} method="POST">
                        {Object.entries(payload).map(([key, value]) => (
                            <input
                                key={key}
                                type="hidden"
                                name={key}
                                value={value}
                            />
                        ))}

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ea1c24] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#c9141c]"
                            >
                                <span>Continue to PayFast Sandbox Now</span>
                                <ExternalLink className="h-4 w-4" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>
                            Secured with 256-bit encryption &bull; Sandbox Test
                            Mode
                        </span>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
