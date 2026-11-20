import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, ExternalLink, Lock, Pause, Play, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import StoreLayout from '@/layouts/store-layout';

type Props = {
    order: {
        tracking_number: string;
        total_amount: number;
        customer_name: string;
        customer_email?: string;
    };
    payload: Record<string, string>;
    processUrl: string;
    sandbox?: boolean;
    returnUrl: string;
    cancelUrl: string;
};

export default function PayFastRedirect({
    order,
    payload,
    processUrl,
    sandbox = true,
    returnUrl,
    cancelUrl,
}: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [secondsLeft, setSecondsLeft] = useState<number>(3);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        if (isPaused || secondsLeft <= 0) {
            if (secondsLeft === 0 && formRef.current) {
                formRef.current.submit();
            }
            return;
        }

        const timer = setTimeout(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [secondsLeft, isPaused]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(val);
    };

    const handleManualSubmit = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleSimulateApproval = () => {
        router.visit(returnUrl);
    };

    return (
        <StoreLayout>
            <Head title="PayFast Sandbox Payment Gateway | ARENOLO STORE" />

            <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
                    {/* Header Badge */}
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#ea1c24] shadow-xs">
                            <Lock className="h-8 w-8" />
                        </div>

                        <span className="mt-4 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold tracking-wider text-red-800 uppercase">
                            PayFast Sandbox Gateway
                        </span>

                        <h1 className="mt-3 text-2xl font-black text-stone-900">
                            Transferring to PayFast
                        </h1>

                        <p className="mt-2 text-xs leading-relaxed text-stone-500">
                            You are being redirected to PayFast&apos;s secure
                            sandbox portal to complete payment for Order{' '}
                            <span className="font-mono font-bold text-stone-800">
                                #{order.tracking_number}
                            </span>
                            .
                        </p>
                    </div>

                    {/* Order Summary Card */}
                    <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50 p-4">
                        <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
                            <span className="text-xs text-stone-500">Customer:</span>
                            <span className="text-xs font-bold text-stone-800">
                                {order.customer_name}
                            </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-400 uppercase">
                                Total Due (ZAR)
                            </span>
                            <div className="text-2xl font-black text-stone-900">
                                {formatCurrency(order.total_amount)}
                            </div>
                        </div>
                    </div>

                    {/* Auto-redirect Countdown Notice */}
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-900">
                            <span>
                                {isPaused
                                    ? 'Auto-redirect paused.'
                                    : `Redirecting to PayFast in ${secondsLeft} second${secondsLeft === 1 ? '' : 's'}...`}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsPaused(!isPaused)}
                                className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-bold text-amber-800 hover:bg-amber-100"
                            >
                                {isPaused ? (
                                    <>
                                        <Play className="h-3 w-3" /> Resume
                                    </>
                                ) : (
                                    <>
                                        <Pause className="h-3 w-3" /> Pause
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sandbox Tip Banner */}
                    {sandbox && (
                        <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50/70 p-3 text-left">
                            <p className="text-[11px] font-bold text-sky-900">
                                PayFast Sandbox Mode Active:
                            </p>
                            <p className="mt-0.5 text-[11px] text-sky-800">
                                PayFast prevents paying yourself with your merchant login. Buyer email is set to{' '}
                                <span className="font-mono font-bold">{payload.email_address}</span> so payments work for all users.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 space-y-3">
                        {/* 1. Official Gateway Submit Button */}
                        <button
                            type="button"
                            onClick={handleManualSubmit}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ea1c24] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#c9141c]"
                        >
                            <span>Proceed to PayFast Sandbox Portal</span>
                            <ExternalLink className="h-4 w-4" />
                        </button>

                        {/* 2. Sandbox Simulation Shortcut (Instant Approval for Dev/Testing) */}
                        {sandbox && (
                            <button
                                type="button"
                                onClick={handleSimulateApproval}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                            >
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>Simulate Instant Sandbox Payment Approval</span>
                            </button>
                        )}

                        {/* 3. Cancel link */}
                        <div className="text-center pt-2">
                            <Link
                                href={cancelUrl}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-red-600 hover:underline"
                            >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Cancel payment and return to order</span>
                            </Link>
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
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 border-t border-stone-100 pt-4 text-[11px] text-stone-400">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>
                            Secured with 256-bit encryption &bull; PayFast Test Mode
                        </span>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
