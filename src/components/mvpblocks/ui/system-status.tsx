import React from 'react';
import { Card } from './dashboard-card';
import { Activity, Cpu, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const systems = [
    { name: 'API Server', status: 'Online', health: 98, icon: Globe, color: 'text-emerald-400' },
    { name: 'Database', status: 'Online', health: 100, icon: Database, color: 'text-emerald-400' },
    { name: 'Background Jobs', status: 'Processing', health: 85, icon: Activity, color: 'text-blue-400' },
    { name: 'AI Engine', status: 'Idle', health: 100, icon: Cpu, color: 'text-muted-foreground' },
];

export const SystemStatus = () => {
    return (
        <Card title="System Monitoring">
            <div className="grid grid-cols-1 gap-4 mt-2">
                {systems.map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-3 rounded-lg glass border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={cn('p-2 rounded-lg bg-white/5', s.color)}>
                                <s.icon size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{s.name}</p>
                                <p className="text-xs text-muted-foreground">{s.status}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-foreground">{s.health}%</p>
                            <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div
                                    className={cn('h-full transition-all duration-1000', s.health > 90 ? 'bg-emerald-400' : 'bg-blue-400')}
                                    style={{ width: `${s.health}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
