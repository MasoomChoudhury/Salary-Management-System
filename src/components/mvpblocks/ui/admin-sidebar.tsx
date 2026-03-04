import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    Activity,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    DollarSign,
    FileText
} from 'lucide-react';
import { Button } from './button';

interface SidebarItem {
    name: string;
    href: string;
    icon: any;
}

interface AdminSidebarProps {
    role: 'admin' | 'employee';
    onLogout: () => void;
    user: { name: string };
}

export const AdminSidebar = ({ role, onLogout, user }: AdminSidebarProps) => {
    const [collapsed, setCollapsed] = React.useState(false);

    const items: SidebarItem[] = role === 'admin' ? [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Employees', href: '/admin/employees', icon: Users },
        { name: 'Payroll', href: '/admin/payroll', icon: DollarSign },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
        { name: 'System Status', href: '/admin/status', icon: ShieldCheck },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ] : [
        { name: 'My Dashboard', href: '/employee', icon: LayoutDashboard },
        { name: 'My Performance', href: '/employee/performance', icon: BarChart3 },
        { name: 'Tasks', href: '/employee/tasks', icon: Activity },
        { name: 'Settings', href: '/employee/settings', icon: Settings },
    ];

    return (
        <div
            className={cn(
                'glass h-screen sticky top-0 flex flex-col transition-all duration-300 border-r border-border/50',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-lg text-primary-foreground">
                            P
                        </div>
                        <span className="font-bold text-xl tracking-tight gradient-text">PayPulse</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </Button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {items.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end
                        className={({ isActive }) => cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group',
                            isActive
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        )}
                    >
                        <item.icon size={20} className={cn('min-w-[20px]', !collapsed && 'group-hover:scale-110 transition-transform')} />
                        {!collapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border/50">
                <div className={cn('flex items-center gap-3 mb-4', collapsed ? 'justify-center' : 'px-3')}>
                    <UserCircle size={24} className="text-primary" />
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{role}</p>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    className={cn('w-full justify-start text-muted-foreground hover:text-rose-400', collapsed && 'justify-center p-0')}
                    onClick={onLogout}
                >
                    <LogOut size={20} className={cn(!collapsed && 'mr-2')} />
                    {!collapsed && <span>Logout</span>}
                </Button>
            </div>
        </div>
    );
};
