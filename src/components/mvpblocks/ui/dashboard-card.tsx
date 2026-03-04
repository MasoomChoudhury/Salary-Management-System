import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export const Card = ({ className, title, description, children, footer, ...props }: CardProps) => {
    return (
        <div className={cn('glass-card p-6 flex flex-col', className)} {...props}>
            {(title || description) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold gradient-text leading-none tracking-tight">{title}</h3>}
                    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                </div>
            )}
            <div className="flex-1">{children}</div>
            {footer && <div className="mt-4 pt-4 border-t border-border/50">{footer}</div>}
        </div>
    );
};

export const StatCard = ({ title, value, subValue, icon: Icon, trend }: {
    title: string;
    value: string;
    subValue?: string;
    icon?: any;
    trend?: { value: string; positive: boolean };
}) => {
    return (
        <Card className="hover:scale-[1.02] transform transition-transform">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-foreground">{value}</h3>
                    {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
                    {trend && (
                        <div className={cn('flex items-center mt-2 text-xs font-medium', trend.positive ? 'text-emerald-400' : 'text-rose-400')}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </Card>
    );
};
