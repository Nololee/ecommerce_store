import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    FolderTree,
    Home,
    LayoutDashboard,
    MapPin,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Store,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, User } from '@/types';

export function AppSidebar() {
    const page = usePage<{ auth?: { user?: User | null } }>();
    const user = page.props.auth?.user;
    const isAdmin = Boolean(user?.is_admin);

    const mainNavItems: NavItem[] = isAdmin
        ? [
              {
                  title: 'Admin Dashboard',
                  href: '/admin',
                  icon: LayoutDashboard,
              },
              {
                  title: 'Products',
                  href: '/admin/products',
                  icon: Package,
              },
              {
                  title: 'Categories',
                  href: '/admin/categories',
                  icon: FolderTree,
              },
              {
                  title: 'Orders',
                  href: '/admin/orders',
                  icon: ShoppingBag,
              },
              {
                  title: 'Sales & Analytics',
                  href: '/admin/reports',
                  icon: BarChart3,
              },
              {
                  title: 'Customers',
                  href: '/admin/customers',
                  icon: Users,
              },
          ]
        : [
              {
                  title: 'Store Dashboard',
                  href: '/customer/dashboard',
                  icon: LayoutDashboard,
              },
              {
                  title: 'My Orders',
                  href: '/customer/orders',
                  icon: Package,
              },
              {
                  title: 'Purchase History',
                  href: '/customer/purchase-history',
                  icon: ShoppingBag,
              },
              {
                  title: 'Track Orders',
                  href: '/customer/tracking',
                  icon: MapPin,
              },
              {
                  title: 'Delivery Addresses',
                  href: '/customer/addresses',
                  icon: Home,
              },
          ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Browse Store',
            href: '/',
            icon: Store,
        },
        {
            title: 'Shopping Cart',
            href: '/cart',
            icon: ShoppingCart,
        },
        {
            title: 'Account Settings',
            href: '/settings/profile',
            icon: Settings,
        },
    ];

    const logoHref = isAdmin ? '/admin' : '/customer/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
