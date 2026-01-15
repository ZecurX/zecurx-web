'use client';

import { cn } from '@/lib/utils';
import { LeadPriority, LEAD_PRIORITY } from '@/types/lead-types';

interface LeadPriorityBadgeProps {
    priority: LeadPriority;
    className?: string;
}

const priorityConfig: Record<LeadPriority, { label: string; className: string }> = {
    [LEAD_PRIORITY.LOW]: {
        label: 'Low',
        className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    },
    [LEAD_PRIORITY.MEDIUM]: {
        label: 'Medium',
        className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    },
    [LEAD_PRIORITY.HIGH]: {
        label: 'High',
        className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    },
    [LEAD_PRIORITY.URGENT]: {
        label: 'Urgent',
        className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
};

export function LeadPriorityBadge({ priority, className }: LeadPriorityBadgeProps) {
    const config = priorityConfig[priority] || priorityConfig[LEAD_PRIORITY.MEDIUM];

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
}

export function getPriorityOptions() {
    return Object.entries(LEAD_PRIORITY).map(([key, value]) => ({
        value,
        label: priorityConfig[value]?.label || key,
    }));
}
