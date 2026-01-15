'use client';

import { cn } from '@/lib/utils';
import { LeadStatus, LEAD_STATUS } from '@/types/lead-types';

interface LeadStatusBadgeProps {
    status: LeadStatus;
    className?: string;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
    [LEAD_STATUS.NEW]: {
        label: 'New',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    [LEAD_STATUS.CONTACTED]: {
        label: 'Contacted',
        className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    },
    [LEAD_STATUS.QUALIFIED]: {
        label: 'Qualified',
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
    [LEAD_STATUS.PROPOSAL]: {
        label: 'Proposal',
        className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
    [LEAD_STATUS.NEGOTIATION]: {
        label: 'Negotiation',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    [LEAD_STATUS.CONVERTED]: {
        label: 'Converted',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    [LEAD_STATUS.LOST]: {
        label: 'Lost',
        className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    [LEAD_STATUS.ON_HOLD]: {
        label: 'On Hold',
        className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    },
};

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig[LEAD_STATUS.NEW];

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

export function getStatusOptions() {
    return Object.entries(LEAD_STATUS).map(([key, value]) => ({
        value,
        label: statusConfig[value]?.label || key,
    }));
}
