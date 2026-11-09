import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import StoreNavbar from '@/components/store/store-navbar';
import StoreFooter from '@/components/store/store-footer';

type SharedProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    errors?: Record<string, string>;
};

export default function StoreLayout({ children }: { children: ReactNode }) {
    const { flash, errors } = usePage<SharedProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (errors?.cart) {
            toast.error(errors.cart);
        }
    }, [flash, errors]);

    return (
        <div className="flex min-h-screen flex-col bg-[#faf9f6] text-[#252820]">
            <StoreNavbar />

            <main className="flex-1">
                {children}
            </main>

            <StoreFooter />
        </div>
    );
}
