'use client';

import { History, MessageSquare, Mail, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadActivity } from '@/types/lead-types';

interface LeadActivityTimelineProps {
    activities: LeadActivity[];
}

const cardClass = cn(
    "p-5 rounded-2xl",
    "bg-background/70 backdrop-blur-xl",
    "border border-white/[0.08] dark:border-white/[0.06]",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
);

const activityIcons: Record<string, React.ReactNode> = {
    LEAD_CREATED: <UserPlus className="w-3.5 h-3.5" />,
    STATUS_CHANGED: <RefreshCw className="w-3.5 h-3.5" />,
    PRIORITY_CHANGED: <AlertCircle className="w-3.5 h-3.5" />,
    NOTE_ADDED: <MessageSquare className="w-3.5 h-3.5" />,
    EMAIL_SENT: <Mail className="w-3.5 h-3.5" />,
    EMAIL_QUEUED: <Mail className="w-3.5 h-3.5" />,
    ASSIGNED: <UserPlus className="w-3.5 h-3.5" />,
};

const activityColors: Record<string, string> = {
    LEAD_CREATED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    STATUS_CHANGED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    PRIORITY_CHANGED: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    NOTE_ADDED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    EMAIL_SENT: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    EMAIL_QUEUED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    ASSIGNED: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
};

export function LeadActivityTimeline({ activities }: LeadActivityTimelineProps) {
    return (
        <div className={cardClass}>
            <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-primary" />
                <h3 className="font-manrope font-semibold text-foreground">Activity</h3>
                <span className="text-xs text-muted-foreground">({activities.length})</span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground/60 text-center py-4">
                        No activity yet.
                    </p>
                ) : (
                    activities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className="relative flex gap-3"
                        >
                            {/* Timeline line */}
                            {index !== activities.length - 1 && (
                                <div className="absolute left-[13px] top-7 w-px h-[calc(100%+4px)] bg-white/[0.06]" />
                            )}

                            {/* Icon */}
                            <div
                                className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border",
                                    activityColors[activity.activity_type] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                )}
                            >
                                {activityIcons[activity.activity_type] || <History className="w-3.5 h-3.5" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pb-3">
                                <p className="text-sm text-foreground">
                                    {activity.description}
                                </p>
                                {(activity.old_value || activity.new_value) && (
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                                        {activity.old_value && <span className="line-through">{activity.old_value}</span>}
                                        {activity.old_value && activity.new_value && ' → '}
                                        {activity.new_value && <span className="font-medium">{activity.new_value}</span>}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground/50 mt-1">
                                    {new Date(activity.created_at).toLocaleString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
