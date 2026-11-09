import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import StoreLayout from '@/layouts/store-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name.startsWith('shop/'):
            case name.startsWith('cart/'):
            case name.startsWith('checkout/'):
            case name.startsWith('orders/'):
                return StoreLayout;

            case name.startsWith('admin/'):
                return AdminLayout;

            case name.startsWith('auth/'):
                return [StoreLayout, AuthLayout];

            case name.startsWith('settings/'):
            case name.startsWith('teams/'):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },

    progress: {
        color: '#8b9060',
    },
});
