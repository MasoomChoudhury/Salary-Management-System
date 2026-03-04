import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './dashboard-card';
import { MoreVertical, UserPlus, FileText, Settings, CreditCard } from 'lucide-react';
import { Button } from './button';

const actions = [
    { icon: UserPlus, label: 'Add Employee', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: FileText, label: 'Generate Report', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { icon: CreditCard, label: 'Run Payroll', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { icon: Settings, label: 'System Config', color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

export const QuickActions = () => {
    return (
        <Card title="Quick Actions" className="h-full">
            <div className="grid grid-cols-2 gap-4 mt-2">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        className="flex flex-col items-center justify-center p-4 rounded-xl glass hover:bg-white/10 transition-all group"
                    >
                        <div className={cn('p-3 rounded-lg mb-2 group-hover:scale-110 transition-transform', action.bg, action.color)}>
                            <action.icon size={20} />
                        </div>
                        <span className="text-xs font-semibold text-center">{action.label}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};
