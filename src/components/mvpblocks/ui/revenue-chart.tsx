import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { Card } from './dashboard-card';

const data = [
    { name: 'Jan', revenue: 45000, payroll: 32000 },
    { name: 'Feb', revenue: 52000, payroll: 32000 },
    { name: 'Mar', revenue: 48000, payroll: 35000 },
    { name: 'Apr', revenue: 61000, payroll: 35000 },
    { name: 'May', revenue: 55000, payroll: 38000 },
    { name: 'Jun', revenue: 67000, payroll: 38000 },
];

export const RevenueChart = () => {
    return (
        <Card title="Financial Overview" description="Revenue vs Payroll for the last 6 months">
            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-primary)"
                            fillOpacity={1}
                            fill="url(#colorRev)"
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="payroll"
                            stroke="#94a3b8"
                            fill="transparent"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
