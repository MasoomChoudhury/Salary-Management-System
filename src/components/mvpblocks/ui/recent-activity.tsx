import React from 'react';
import { Card } from './dashboard-card';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';

const activities = [
    {
        id: 1,
        type: 'success',
        icon: CheckCircle2,
        user: 'Sarah Connor',
        action: 'processed payroll for Engineering',
        time: '2 mins ago',
        color: 'text-emerald-400'
    },
    {
        id: 2,
        type: 'alert',
        icon: AlertCircle,
        user: 'System',
        action: 'Login attempt failed from new IP',
        time: '15 mins ago',
        color: 'text-amber-400'
    },
    {
        id: 3,
        type: 'info',
        icon: User,
        user: 'John Doe',
        action: 'updated profile information',
        time: '1 hour ago',
        color: 'text-blue-400'
    },
    {
        id: 4,
        type: 'pending',
        icon: Clock,
        user: 'Admin',
        action: 'Scheduled system maintenance',
        time: '2 hours ago',
        color: 'text-muted-foreground'
    },
];

export const RecentActivity = () => {
    return (
        <Card title="Recent Activity" description="Latest events across the platform">
            <div className="space-y-6 mt-4">
                {activities.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className={cn('mt-1 p-1 rounded-full bg-white/5', item.color)}>
                            <item.icon size={16} />
                        </div>
                        <div className="flex-1 border-b border-border/30 pb-4 last:border-0 last:pb-0">
                            <p className="text-sm">
                                <span className="font-semibold text-foreground">{item.user}</span>
                                <span className="text-muted-foreground"> {item.action}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
