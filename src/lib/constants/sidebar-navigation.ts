import { Calendar, File, Home, Inbox, LogOut, Search, Settings, ShoppingBag } from 'lucide-react';

export const SIDEBAR_NAVIGATIONS = [
    {
        title: 'Home',
        url: '/dashboard',
        icon: Home,
        roles: ['administrator', 'seller'],
    },
    {
        title: 'App Pages',
        url: '/app-pages',
        icon: File,
        roles: ['administrator'],
    },
    {
        title: 'Permissions ',
        url: '/permissions',
        icon: File,
        roles: ['administrator'],
    },
    {
        title: 'Manage Products',
        url: '/products/manage',
        icon: Inbox,
        roles: ['seller'],
    },
    {
        title: 'Manage Orders',
        url: '/orders/manage',
        icon: ShoppingBag,
        roles: ['seller'],
    },
    {
        title: 'Settings',
        url: '#',
        icon: Settings,
        roles: ['administrator', 'seller'],
    },
];
