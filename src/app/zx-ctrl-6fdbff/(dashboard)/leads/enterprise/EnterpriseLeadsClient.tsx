'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, Filter, Download, FileSpreadsheet, ChevronDown, Check,
    Eye, Trash2, Building2, Mail, Phone, Calendar, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnterpriseLead, LEAD_STATUS, LEAD_PRIORITY } from '@/types/lead-types';
import { LeadStatusBadge, getStatusOptions } from '@/components/leads/LeadStatusBadge';
import { LeadPriorityBadge, getPriorityOptions } from '@/components/leads/LeadPriorityBadge';

interface EnterpriseLeadsClientProps {
    initialLeads: EnterpriseLead[];
    totalCount: number;
}

const cardClass = cn(
    "p-5 rounded-2xl",
    "bg-background/70 backdrop-blur-xl",
    "border border-white/[0.08] dark:border-white/[0.06]",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
);

export default function EnterpriseLeadsClient({ initialLeads, totalCount }: EnterpriseLeadsClientProps) {
    const [leads, setLeads] = useState<EnterpriseLead[]>(initialLeads);
    const [total, setTotal] = useState(totalCount);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

    const statusOptions = getStatusOptions();
    const priorityOptions = getPriorityOptions();

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter) params.set('status', statusFilter);
            if (priorityFilter) params.set('priority', priorityFilter);
            params.set('page', page.toString());
            params.set('limit', '20');

            const response = await fetch(`/api/leads/enterprise?${params.toString()}`);
            const { data, pagination } = await response.json();
            setLeads(data || []);
            setTotal(pagination?.total || 0);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (search || statusFilter || priorityFilter || page > 1) {
                fetchLeads();
            }
        }, 300);
        return () => clearTimeout(debounce);
    }, [search, statusFilter, priorityFilter, page]);

    const stats = useMemo(() => {
        const byStatus: Record<string, number> = {};
        Object.values(LEAD_STATUS).forEach(s => byStatus[s] = 0);
        initialLeads.forEach(lead => {
            byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
        });
        const totalDealValue = initialLeads.reduce((sum, lead) => sum + (lead.deal_value || 0), 0);
        return {
            total: totalCount,
            new: byStatus[LEAD_STATUS.NEW] || 0,
            proposal: byStatus[LEAD_STATUS.PROPOSAL] || 0,
            converted: byStatus[LEAD_STATUS.CONVERTED] || 0,
            totalDealValue,
        };
    }, [initialLeads, totalCount]);

    const handleExport = async (format: 'xlsx' | 'csv') => {
        setIsExporting(true);
        try {
            const exportData = leads.map(lead => ({
                'Contact Name': lead.contact_person_name,
                'Company': lead.company_name,
                'Email': lead.email,
                'Phone': lead.phone,
                'Industry': lead.industry,
                'Service Type': lead.service_type,
                'Deal Value': lead.deal_value || '',
                'Status': lead.status,
                'Priority': lead.priority,
                'Created At': new Date(lead.created_at).toLocaleDateString(),
            }));

            const headers = Object.keys(exportData[0] || {});
            const csv = [
                headers.join(','),
                ...exportData.map(row => headers.map(h => `"${(row as Record<string, string | number>)[h] || ''}"`).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `enterprise-leads-${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'csv' : format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            const response = await fetch(`/api/leads/enterprise/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setLeads(prev => prev.filter(l => l.id !== id));
                setTotal(prev => prev - 1);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                        Enterprise Leads
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage B2B enquiries and enterprise sales pipeline
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => handleExport('xlsx')}
                        disabled={isExporting}
                        className={cn(
                            "inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl",
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                            "hover:bg-emerald-500/20 disabled:opacity-50"
                        )}
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Excel'}</span>
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        disabled={isExporting}
                        className={cn(
                            "inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl",
                            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                            "hover:bg-blue-500/20 disabled:opacity-50"
                        )}
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">CSV</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className={cardClass}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10">
                            <Building2 className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Leads</p>
                            <p className="text-xl font-bold text-foreground font-manrope">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className={cardClass}>
                    <p className="text-xs text-muted-foreground">New</p>
                    <p className="text-xl font-bold text-foreground font-manrope mt-1">{stats.new}</p>
                </div>
                <div className={cardClass}>
                    <p className="text-xs text-muted-foreground">Proposal</p>
                    <p className="text-xl font-bold text-foreground font-manrope mt-1">{stats.proposal}</p>
                </div>
                <div className={cardClass}>
                    <p className="text-xs text-muted-foreground">Converted</p>
                    <p className="text-xl font-bold text-emerald-500 font-manrope mt-1">{stats.converted}</p>
                </div>
                <div className={cardClass}>
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <p className="text-xs text-muted-foreground">Pipeline Value</p>
                    </div>
                    <p className="text-xl font-bold text-foreground font-manrope mt-1">
                        ₹{stats.totalDealValue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className={cn(cardClass, "space-y-4 overflow-visible relative z-20")}>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, company, email..."
                            className={cn(
                                "w-full pl-10 pr-4 py-2.5 text-sm rounded-lg",
                                "bg-background border border-white/[0.08] text-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/30"
                            )}
                        />
                    </div>

                    <div className="relative z-30">
                        <button
                            onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setPriorityDropdownOpen(false); }}
                            className="w-full sm:w-40 px-4 py-2.5 text-sm rounded-lg bg-background border border-white/[0.08] flex items-center justify-between"
                        >
                            <span>{statusFilter ? statusOptions.find(s => s.value === statusFilter)?.label : 'All Status'}</span>
                            <ChevronDown className={cn("w-4 h-4", statusDropdownOpen && "rotate-180")} />
                        </button>
                        {statusDropdownOpen && (
                            <ul className="absolute top-full left-0 right-0 mt-2 bg-background border border-white/[0.08] rounded-lg py-1 shadow-xl max-h-60 overflow-y-auto overscroll-contain z-50" onWheel={(e) => e.stopPropagation()}>
                                <li onClick={() => { setStatusFilter(''); setStatusDropdownOpen(false); setPage(1); }}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-white/[0.04] flex items-center justify-between">
                                    <span>All Status</span>
                                    {!statusFilter && <Check className="w-4 h-4" />}
                                </li>
                                {statusOptions.map(opt => (
                                    <li key={opt.value} onClick={() => { setStatusFilter(opt.value); setStatusDropdownOpen(false); setPage(1); }}
                                        className="px-4 py-2 text-sm cursor-pointer hover:bg-white/[0.04] flex items-center justify-between">
                                        <span>{opt.label}</span>
                                        {statusFilter === opt.value && <Check className="w-4 h-4" />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative z-30">
                        <button
                            onClick={() => { setPriorityDropdownOpen(!priorityDropdownOpen); setStatusDropdownOpen(false); }}
                            className="w-full sm:w-40 px-4 py-2.5 text-sm rounded-lg bg-background border border-white/[0.08] flex items-center justify-between"
                        >
                            <span>{priorityFilter ? priorityOptions.find(p => p.value === priorityFilter)?.label : 'All Priority'}</span>
                            <ChevronDown className={cn("w-4 h-4", priorityDropdownOpen && "rotate-180")} />
                        </button>
                        {priorityDropdownOpen && (
                            <ul className="absolute top-full left-0 right-0 mt-2 bg-background border border-white/[0.08] rounded-lg py-1 shadow-xl max-h-60 overflow-y-auto overscroll-contain z-50" onWheel={(e) => e.stopPropagation()}>
                                <li onClick={() => { setPriorityFilter(''); setPriorityDropdownOpen(false); setPage(1); }}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-white/[0.04] flex items-center justify-between">
                                    <span>All Priority</span>
                                    {!priorityFilter && <Check className="w-4 h-4" />}
                                </li>
                                {priorityOptions.map(opt => (
                                    <li key={opt.value} onClick={() => { setPriorityFilter(opt.value); setPriorityDropdownOpen(false); setPage(1); }}
                                        className="px-4 py-2 text-sm cursor-pointer hover:bg-white/[0.04] flex items-center justify-between">
                                        <span>{opt.label}</span>
                                        {priorityFilter === opt.value && <Check className="w-4 h-4" />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {(search || statusFilter || priorityFilter) && (
                        <button
                            onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); setPage(1); }}
                            className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg bg-white/[0.03] border border-white/[0.06]"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block relative z-10">
                <div className={cn(cardClass, "overflow-hidden !p-0")}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/[0.02] text-muted-foreground border-b border-white/[0.06]">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Contact</th>
                                    <th className="px-5 py-4 font-medium">Company</th>
                                    <th className="px-5 py-4 font-medium">Service</th>
                                    <th className="px-5 py-4 font-medium">Deal Value</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Priority</th>
                                    <th className="px-5 py-4 font-medium">Created</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {isLoading ? (
                                    <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">Loading...</td></tr>
                                ) : leads.length === 0 ? (
                                    <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">No leads found.</td></tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-xs font-semibold">
                                                        {lead.contact_person_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-foreground block">{lead.contact_person_name}</span>
                                                        <span className="text-xs text-muted-foreground">{lead.designation}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <span className="font-medium text-foreground block">{lead.company_name}</span>
                                                        <span className="text-xs text-muted-foreground">{lead.industry}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-foreground">{lead.service_type}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-emerald-500">
                                                {lead.deal_value ? `₹${lead.deal_value.toLocaleString()}` : '-'}
                                            </td>
                                            <td className="px-5 py-4"><LeadStatusBadge status={lead.status} /></td>
                                            <td className="px-5 py-4"><LeadPriorityBadge priority={lead.priority} /></td>
                                            <td className="px-5 py-4 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/zx-ctrl-6fdbff/leads/enterprise/${lead.id}`} className="p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(lead.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden space-y-3">
                {isLoading ? (
                    <div className={cn(cardClass, "!p-8 text-center text-muted-foreground")}>Loading...</div>
                ) : leads.length === 0 ? (
                    <div className={cn(cardClass, "!p-8 text-center text-muted-foreground")}>No leads found.</div>
                ) : (
                    leads.map((lead) => (
                        <article key={lead.id} className={cn(cardClass, "!p-4 space-y-3")}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-sm font-semibold">
                                        {lead.contact_person_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{lead.contact_person_name}</h3>
                                        <p className="text-xs text-muted-foreground">{lead.company_name}</p>
                                    </div>
                                </div>
                                <Link href={`/zx-ctrl-6fdbff/leads/enterprise/${lead.id}`} className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <LeadStatusBadge status={lead.status} />
                                <LeadPriorityBadge priority={lead.priority} />
                                {lead.deal_value && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        ₹{lead.deal_value.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground">{lead.service_type} • {lead.industry}</div>
                        </article>
                    ))
                )}
            </div>

            {total > 20 && (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 text-sm rounded-lg bg-white/[0.03] border border-white/[0.06] disabled:opacity-50">Previous</button>
                    <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 20)}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}
                        className="px-4 py-2 text-sm rounded-lg bg-white/[0.03] border border-white/[0.06] disabled:opacity-50">Next</button>
                </div>
            )}

            <p className="text-xs text-muted-foreground/60 text-center">Showing {leads.length} of {total} leads</p>
        </div>
    );
}
