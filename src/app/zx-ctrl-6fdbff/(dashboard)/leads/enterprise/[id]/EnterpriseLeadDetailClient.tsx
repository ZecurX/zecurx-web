'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Mail, Phone, Calendar, Building2, Globe,
    Edit2, Trash2, Save, X, ChevronDown, Check, DollarSign, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnterpriseLead, LeadNote, LeadActivity } from '@/types/lead-types';
import { LeadStatusBadge, getStatusOptions } from '@/components/leads/LeadStatusBadge';
import { LeadPriorityBadge, getPriorityOptions } from '@/components/leads/LeadPriorityBadge';
import { LeadNotesPanel } from '@/components/leads/LeadNotesPanel';
import { LeadActivityTimeline } from '@/components/leads/LeadActivityTimeline';

interface EnterpriseLeadDetailClientProps {
    leadId: string;
}

const cardClass = cn(
    "p-5 rounded-2xl",
    "bg-background/70 backdrop-blur-xl",
    "border border-white/[0.08] dark:border-white/[0.06]",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
);

export default function EnterpriseLeadDetailClient({ leadId }: EnterpriseLeadDetailClientProps) {
    const router = useRouter();
    const [lead, setLead] = useState<EnterpriseLead | null>(null);
    const [notes, setNotes] = useState<LeadNote[]>([]);
    const [activities, setActivities] = useState<LeadActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<EnterpriseLead>>({});
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

    const statusOptions = getStatusOptions();
    const priorityOptions = getPriorityOptions();

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await fetch(`/api/leads/enterprise/${leadId}`);
                if (!response.ok) throw new Error('Lead not found');
                const { data } = await response.json();
                setLead(data);
                setNotes(data.notes || []);
                setActivities(data.activities || []);
                setEditData(data);
            } catch (error) {
                console.error('Error fetching lead:', error);
                router.push('/zx-ctrl-6fdbff/leads/enterprise');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLead();
    }, [leadId, router]);

    const updateStatus = async (newStatus: string) => {
        if (!lead) return;
        try {
            const response = await fetch(`/api/leads/enterprise/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                const { data } = await response.json();
                setLead(prev => prev ? { ...prev, status: data.status } : null);
                const activitiesRes = await fetch(`/api/leads/enterprise/${leadId}`);
                const activitiesData = await activitiesRes.json();
                setActivities(activitiesData.data.activities || []);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
        setStatusDropdownOpen(false);
    };

    const updatePriority = async (newPriority: string) => {
        if (!lead) return;
        try {
            const response = await fetch(`/api/leads/enterprise/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priority: newPriority }),
            });
            if (response.ok) {
                const { data } = await response.json();
                setLead(prev => prev ? { ...prev, priority: data.priority } : null);
                const activitiesRes = await fetch(`/api/leads/enterprise/${leadId}`);
                const activitiesData = await activitiesRes.json();
                setActivities(activitiesData.data.activities || []);
            }
        } catch (error) {
            console.error('Error updating priority:', error);
        }
        setPriorityDropdownOpen(false);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/leads/enterprise/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (response.ok) {
                const { data } = await response.json();
                setLead(data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving lead:', error);
            alert('Failed to save changes.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            const response = await fetch(`/api/leads/enterprise/${leadId}`, { method: 'DELETE' });
            if (response.ok) router.push('/zx-ctrl-6fdbff/leads/enterprise');
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const handleNoteAdded = (note: LeadNote) => {
        setNotes(prev => [note, ...prev]);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading...</p></div>;
    }

    if (!lead) {
        return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Lead not found.</p></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link href="/zx-ctrl-6fdbff/leads/enterprise" className="p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground mt-1">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                            {lead.contact_person_name}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {lead.designation} at {lead.company_name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button onClick={() => { setIsEditing(false); setEditData(lead); }} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <button onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setPriorityDropdownOpen(false); }}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <LeadStatusBadge status={lead.status} />
                                <ChevronDown className={cn("w-4 h-4 text-muted-foreground", statusDropdownOpen && "rotate-180")} />
                            </button>
                            {statusDropdownOpen && (
                                <ul className="absolute top-full left-0 mt-2 z-50 bg-background border border-white/[0.08] rounded-lg py-1 shadow-lg min-w-[160px]">
                                    {statusOptions.map(opt => (
                                        <li key={opt.value} onClick={() => updateStatus(opt.value)} className="px-4 py-2 text-sm cursor-pointer hover:bg-white/[0.04] flex items-center justify-between">
                                            <span>{opt.label}</span>{lead.status === opt.value && <Check className="w-4 h-4 text-primary" />}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="relative">
                            <button onClick={() => { setPriorityDropdownOpen(!priorityDropdownOpen); setStatusDropdownOpen(false); }}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <LeadPriorityBadge priority={lead.priority} />
                                <ChevronDown className={cn("w-4 h-4 text-muted-foreground", priorityDropdownOpen && "rotate-180")} />
                            </button>
                            {priorityDropdownOpen && (
                                <ul className="absolute top-full left-0 mt-2 z-50 bg-background border border-white/[0.08] rounded-lg py-1 shadow-lg min-w-[140px]">
                                    {priorityOptions.map(opt => (
                                        <li key={opt.value} onClick={() => updatePriority(opt.value)} className="px-4 py-2 text-sm cursor-pointer hover:bg-white/[0.04] flex items-center justify-between">
                                            <span>{opt.label}</span>{lead.priority === opt.value && <Check className="w-4 h-4 text-primary" />}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className={cardClass}>
                        <h3 className="font-manrope font-semibold text-foreground mb-4">Contact Information</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Contact Person</p>
                                <p className="text-sm font-medium text-foreground">{lead.contact_person_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Designation</p>
                                <p className="text-sm text-foreground">{lead.designation}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Email</p>
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline"><Mail className="w-3.5 h-3.5" />{lead.email}</a>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-foreground"><Phone className="w-3.5 h-3.5" />{lead.phone}</a>
                            </div>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className={cardClass}>
                        <h3 className="font-manrope font-semibold text-foreground mb-4">Company Information</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Company Name</p>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground"><Building2 className="w-3.5 h-3.5" />{lead.company_name}</div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Industry</p>
                                <p className="text-sm text-foreground">{lead.industry}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Company Size</p>
                                <div className="flex items-center gap-1.5 text-sm text-foreground"><Users className="w-3.5 h-3.5" />{lead.company_size} employees</div>
                            </div>
                            {lead.company_website && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Website</p>
                                    <a href={lead.company_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                                        <Globe className="w-3.5 h-3.5" />{lead.company_website}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Requirements */}
                    <div className={cardClass}>
                        <h3 className="font-manrope font-semibold text-foreground mb-4">Service Requirements</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Service Type</p>
                                <p className="text-sm font-medium text-foreground">{lead.service_type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                                <p className="text-sm text-foreground">{lead.budget_range || 'Not specified'}</p>
                            </div>
                            {lead.deal_value && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Deal Value</p>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-500"><DollarSign className="w-3.5 h-3.5" />₹{lead.deal_value.toLocaleString()}</div>
                                </div>
                            )}
                            {lead.probability !== null && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Win Probability</p>
                                    <p className="text-sm text-foreground">{lead.probability}%</p>
                                </div>
                            )}
                        </div>
                        {lead.requirements && (
                            <div className="mt-4 pt-4 border-t border-white/[0.06]">
                                <p className="text-xs text-muted-foreground mb-1">Requirements</p>
                                <p className="text-sm text-foreground whitespace-pre-wrap">{lead.requirements}</p>
                            </div>
                        )}
                    </div>

                    <LeadNotesPanel notes={notes} leadId={leadId} leadType="enterprise" onNoteAdded={handleNoteAdded} />
                </div>

                <div className="space-y-6">
                    <div className={cardClass}>
                        <h3 className="font-manrope font-semibold text-foreground mb-4">Timeline</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Created:</span>
                                <span className="text-foreground">{new Date(lead.created_at).toLocaleDateString('en-IN')}</span>
                            </div>
                            {lead.expected_close_date && (
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    <span className="text-muted-foreground">Expected Close:</span>
                                    <span className="text-emerald-500 font-medium">{new Date(lead.expected_close_date).toLocaleDateString('en-IN')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <LeadActivityTimeline activities={activities} />
                </div>
            </div>
        </div>
    );
}
