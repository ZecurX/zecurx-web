'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
    Mail, Users, GraduationCap, Building2, Send, Clock,
    Save, Eye, X, CheckCircle2, AlertCircle, Loader2,
    Calendar, ChevronRight, RefreshCw, TriangleAlert,
    Search, UserPlus, UserCheck, Tag as TagIcon,
    UserRoundPlus, CheckSquare, Square, Filter,
    ListFilter, Sparkles, ChevronDown,
    Upload, Download, Paperclip, FileText, Trash2, FileUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EmailBodyEditor = dynamic(() => import('@/components/admin/EmailBodyEditor'), { ssr: false });

// ─── constants ───────────────────────────────────────────────────────────────

const cardClass = cn(
    'p-5 rounded-2xl bg-background/70 backdrop-blur-xl',
    'border border-white/[0.08] dark:border-white/[0.06]',
    'shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]',
    'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]'
);

const AUDIENCE_OPTIONS = [
    { id: 'student_leads',    label: 'Student Leads',    icon: GraduationCap, color: 'blue'   },
    { id: 'enrolled_students',label: 'Enrolled Students',icon: Users,         color: 'emerald'},
    { id: 'enterprise_leads', label: 'Enterprise Leads', icon: Building2,     color: 'violet' },
] as const;

const SOURCE_LABEL: Record<string, string> = {
    student_lead:    'Student Lead',
    enterprise_lead: 'Enterprise Lead',
    enrolled_student:'Enrolled',
    manual:          'Manual',
    csv:             'CSV Import',
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    draft:     { label: 'Draft',     cls: 'bg-muted/60 text-muted-foreground' },
    scheduled: { label: 'Scheduled', cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
    sending:   { label: 'Sending…',  cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    sent:      { label: 'Sent',      cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    failed:    { label: 'Failed',    cls: 'bg-red-500/10 text-red-500' },
};

// ─── email templates ─────────────────────────────────────────────────────────

interface EmailTemplate {
    id: string;
    label: string;
    description: string;
    badge: string;
    badgeCls: string;
    subject: string;
    body: string;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'course-promo',
        label: 'Course Promotion',
        description: 'Invite student leads to enroll in ZecurX Academy certifications.',
        badge: 'Student Leads',
        badgeCls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        subject: '🎓 Kickstart Your Cybersecurity Career, {{first_name}}!',
        body: `<h2>Kickstart Your Cybersecurity Career, {{first_name}}!</h2>
<p>We noticed your interest in cybersecurity and wanted to reach out personally.</p>
<p>At <strong>ZecurX Academy</strong>, we offer industry-recognized certifications that can transform your career:</p>
<ul>
  <li><strong>zxCPEH</strong> — Certified Professional Ethical Hacker</li>
  <li><strong>zxCPT</strong> — Certified Professional Pen Tester</li>
  <li><strong>zxCCE</strong> — Certified Cybersecurity Expert</li>
  <li><strong>zxCCP</strong> — Certified Cybersecurity Practitioner</li>
</ul>
<p>Our programs are designed for beginners and professionals alike — with hands-on labs, live mentorship, and real-world projects.</p>
<p><strong>Limited seats are available for the upcoming batch.</strong> Don't miss your chance to secure your future in one of the fastest-growing industries.</p>
<p>Reply to this email or visit <a href="https://www.zecurx.com/academy">www.zecurx.com/academy</a> to explore all courses and register today.</p>
<p>Warm regards,<br><strong>The ZecurX Academy Team</strong></p>`,
    },
    {
        id: 'enterprise-outreach',
        label: 'Enterprise Security Outreach',
        description: 'Reach enterprise leads with ZecurX security services.',
        badge: 'Enterprise Leads',
        badgeCls: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        subject: 'Strengthen Your Cybersecurity Posture — ZecurX Can Help, {{first_name}}',
        body: `<h2>Protect Your Business from Cyber Threats, {{first_name}}</h2>
<p>In today's threat landscape, a single vulnerability can cost your organization millions. Is your business truly secure?</p>
<p><strong>ZecurX</strong> specializes in helping enterprises stay one step ahead of attackers. Our services include:</p>
<ul>
  <li><strong>Penetration Testing (VAPT)</strong> — Identify vulnerabilities before attackers do</li>
  <li><strong>Cloud Security Assessments</strong> — Secure your AWS, Azure, and GCP environments</li>
  <li><strong>Application Security</strong> — Comprehensive web and mobile app security testing</li>
  <li><strong>Security Awareness Training</strong> — Upskill your team with certified programs</li>
</ul>
<p>We've helped organizations across BFSI, healthcare, and technology sectors significantly strengthen their security posture.</p>
<p>I'd love to schedule a <strong>free 30-minute consultation</strong> to understand your security needs and how we can help.</p>
<p>Simply reply to this email or visit <a href="https://www.zecurx.com/enquiry">www.zecurx.com/enquiry</a> to book a call.</p>
<p>Best regards,<br><strong>ZecurX Enterprise Security Team</strong></p>`,
    },
    {
        id: 'student-update',
        label: 'Student Progress Update',
        description: 'Share important updates and resources with enrolled students.',
        badge: 'Enrolled Students',
        badgeCls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        subject: 'Important Updates for Your ZecurX Course, {{first_name}} 👋',
        body: `<h2>Hey {{first_name}}, an update from ZecurX Academy!</h2>
<p>We hope your cybersecurity learning journey is going great. Here are some important updates just for you:</p>
<ul>
  <li>🆕 <strong>New lab modules</strong> have been added to your course — log in to access them</li>
  <li>📅 <strong>Live doubt-clearing sessions</strong> every Saturday at 7:00 PM IST with your mentor</li>
  <li>📜 <strong>Certificate issuance</strong> is processed within 7 working days of exam completion</li>
  <li>💼 <strong>Job placement assistance</strong> is available — reach out to your course coordinator</li>
  <li>🔗 Join our exclusive <strong>ZecurX Alumni Network</strong> on LinkedIn for networking opportunities</li>
</ul>
<p>If you have any questions about your course, assessments, or need technical support, simply reply to this email — our team responds within 24 hours.</p>
<p>Keep learning, keep growing — the cybersecurity world needs talent like yours!</p>
<p>Best wishes,<br><strong>The ZecurX Academy Team</strong></p>`,
    },
];

// ─── types ───────────────────────────────────────────────────────────────────

interface Recipient { email: string; name: string; source?: string; }

interface Campaign {
    id: string; created_by_name: string; subject: string;
    audience_types: string[]; recipient_count: number; status: string;
    scheduled_at: string | null; sent_at: string | null; created_at: string;
}

// ─── CSV & attachment helpers ─────────────────────────────────────────────────

interface CSVImportError { row: number; email: string; reason: string; }
interface CSVImportStats { total: number; imported: number; duplicates: number; errors: CSVImportError[]; }
interface AttachmentFile  { id: string; file: File; }

const MAX_FILE_SIZE       = 10 * 1024 * 1024;   // 10 MB per file
const MAX_TOTAL_SIZE      = 25 * 1024 * 1024;   // 25 MB combined
const ALLOWED_MIME_TYPES  = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
]);

function formatFileSize(bytes: number): string {
    if (bytes < 1024)            return `${bytes} B`;
    if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let cur = '';
    let inQ = false;
    for (const ch of line) {
        if (ch === '"')               inQ = !inQ;
        else if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = ''; }
        else                          cur += ch;
    }
    fields.push(cur.trim());
    return fields;
}

function parseCSVData(
    text: string,
    existingEmails: Set<string>
): { recipients: Recipient[]; stats: CSVImportStats } {
    const lines  = text.trim().split(/\r?\n/);
    const stats: CSVImportStats = { total: 0, imported: 0, duplicates: 0, errors: [] };
    if (lines.length < 2) return { recipients: [], stats };

    const hdrs      = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, '').trim());
    const emailIdx  = hdrs.findIndex(h => ['email','email address','emailaddress'].includes(h));
    if (emailIdx === -1) {
        stats.errors.push({ row: 1, email: '', reason: 'No "Email" column found in header' });
        return { recipients: [], stats };
    }
    const nameIdx = hdrs.findIndex(h => ['name','full name','fullname'].includes(h));
    const fnIdx   = hdrs.findIndex(h => ['first name','firstname','first_name'].includes(h));
    const lnIdx   = hdrs.findIndex(h => ['last name','lastname','last_name'].includes(h));

    const seenBatch = new Set<string>();
    const recipients: Recipient[] = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].trim();
        if (!row) continue;
        stats.total++;
        const fields = parseCSVLine(row);
        const email  = (fields[emailIdx] ?? '').toLowerCase().replace(/['"]/g, '').trim();
        if (!email) { stats.errors.push({ row: i + 1, email: '', reason: 'Missing email' }); continue; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { stats.errors.push({ row: i + 1, email, reason: 'Invalid email format' }); continue; }
        if (existingEmails.has(email) || seenBatch.has(email)) { stats.duplicates++; continue; }

        let name = '';
        if (nameIdx !== -1) {
            name = (fields[nameIdx] ?? '').replace(/['"]/g, '').trim();
        } else if (fnIdx !== -1 || lnIdx !== -1) {
            const fn = fnIdx !== -1 ? (fields[fnIdx] ?? '').replace(/['"]/g, '').trim() : '';
            const ln = lnIdx !== -1 ? (fields[lnIdx] ?? '').replace(/['"]/g, '').trim() : '';
            name = [fn, ln].filter(Boolean).join(' ');
        }
        seenBatch.add(email);
        recipients.push({ email, name: name || email, source: 'csv' });
        stats.imported++;
    }
    return { recipients, stats };
}

function downloadSampleCSV() {
    const csv = 'Name,Email,Company,Phone\nJohn Doe,john.doe@example.com,Acme Corp,+1234567890\nJane Smith,jane.smith@example.com,Tech Ltd,+0987654321\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a   = Object.assign(document.createElement('a'), { href: url, download: 'recipients_sample.csv' });
    a.click();
    URL.revokeObjectURL(url);
}

// ─── TemplatePickerModal ─────────────────────────────────────────────────────

function TemplatePickerModal({
    onSelect,
    onClose,
}: {
    onSelect: (t: EmailTemplate) => void;
    onClose:  () => void;
}) {
    const [preview, setPreview] = useState<EmailTemplate | null>(null);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className={cn(cardClass, 'w-full max-w-2xl max-h-[85vh] flex flex-col !p-0 overflow-hidden')}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
                    <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Email Templates
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Select a template to pre-fill the subject and body
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Template list */}
                    <div className="w-full sm:w-72 shrink-0 border-r border-white/[0.06] overflow-y-auto p-3 space-y-2">
                        {EMAIL_TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setPreview(t)}
                                className={cn(
                                    'w-full text-left p-3.5 rounded-xl border transition-all',
                                    preview?.id === t.id
                                        ? 'border-primary/30 bg-primary/5'
                                        : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                                )}
                            >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <p className={cn(
                                        'text-sm font-medium',
                                        preview?.id === t.id ? 'text-foreground' : 'text-muted-foreground'
                                    )}>
                                        {t.label}
                                    </p>
                                    <ChevronDown className={cn(
                                        'w-3.5 h-3.5 shrink-0 mt-0.5 -rotate-90 transition-colors',
                                        preview?.id === t.id ? 'text-primary' : 'text-muted-foreground/40'
                                    )} />
                                </div>
                                <p className="text-[11px] text-muted-foreground/70 leading-relaxed mb-2">
                                    {t.description}
                                </p>
                                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', t.badgeCls)}>
                                    {t.badge}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Preview pane */}
                    <div className="flex-1 overflow-y-auto">
                        {preview ? (
                            <div className="p-5 space-y-4">
                                <div className={cn(cardClass, '!p-4')}>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Subject</p>
                                    <p className="text-sm font-medium text-foreground">{preview.subject}</p>
                                </div>
                                <div className={cn(cardClass, '!p-4')}>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Body Preview</p>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                                        dangerouslySetInnerHTML={{ __html: preview.body }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                                <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground/60">Select a template to preview</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                        {preview
                            ? 'This will replace your current subject and body.'
                            : 'Choose a template from the list'}
                    </p>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-xl bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all">
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={!preview}
                            onClick={() => { if (preview) { onSelect(preview); onClose(); } }}
                            className={cn(
                                'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all',
                                'bg-foreground text-background hover:opacity-90 active:scale-[0.98]',
                                'disabled:opacity-40 disabled:cursor-not-allowed'
                            )}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Use This Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── AddRecipientForm ─────────────────────────────────────────────────────────

function AddRecipientForm({ onAdd }: { onAdd: (r: Recipient) => void }) {
    const [name, setName]   = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        if (!email.trim()) { setError('Email is required'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Invalid email address'); return; }
        onAdd({ email: email.trim().toLowerCase(), name: name.trim() || email.trim(), source: 'manual' });
        setName(''); setEmail(''); setError('');
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Full name (optional)"
                    className={cn(
                        'flex-1 px-3 py-2.5 text-sm rounded-xl bg-background border border-white/[0.08]',
                        'text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30'
                    )}
                />
                <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    placeholder="Email address *"
                    className={cn(
                        'flex-1 px-3 py-2.5 text-sm rounded-xl bg-background text-foreground',
                        'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
                        error ? 'border border-red-500/40' : 'border border-white/[0.08]'
                    )}
                />
                <button
                    type="button" onClick={handleAdd}
                    className={cn(
                        'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap',
                        'bg-primary/10 text-primary border border-primary/20',
                        'hover:bg-primary/20 active:scale-[0.98] transition-all'
                    )}
                >
                    <UserRoundPlus className="w-4 h-4" /> Add
                </button>
            </div>
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{error}
                </p>
            )}
        </div>
    );
}

// ─── RecipientListModal ───────────────────────────────────────────────────────

interface RecipientListModalProps {
    audienceTypes:    string[];
    customRecipients: Recipient[];
    onApply: (selected: Recipient[], newAudienceTypes: string[]) => void;
    onClose: () => void;
}

function RecipientListModal({ audienceTypes, customRecipients, onApply, onClose }: RecipientListModalProps) {
    const [allRecipients,  setAllRecipients]  = useState<Recipient[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
    const [isLoading,      setIsLoading]      = useState(true);
    const [filter,         setFilter]         = useState('');

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                let audienceRecs: Recipient[] = [];
                if (audienceTypes.length > 0) {
                    const res  = await fetch(`/api/admin/bulk-email/recipients?audience_types=${audienceTypes.join(',')}&all=true`);
                    const data = await res.json();
                    audienceRecs = data.recipients ?? [];
                }
                // Merge with custom, dedupe
                const seen   = new Set(audienceRecs.map(r => r.email.toLowerCase()));
                const merged = [...audienceRecs];
                for (const r of customRecipients) {
                    if (!seen.has(r.email.toLowerCase())) { merged.push(r); seen.add(r.email.toLowerCase()); }
                }
                setAllRecipients(merged);
                setSelectedEmails(new Set(merged.map(r => r.email)));
            } finally { setIsLoading(false); }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = allRecipients.filter(r =>
        !filter ||
        r.name.toLowerCase().includes(filter.toLowerCase()) ||
        r.email.toLowerCase().includes(filter.toLowerCase())
    );

    const toggleOne = (email: string) =>
        setSelectedEmails(prev => {
            const next = new Set(prev);
            if (next.has(email)) next.delete(email); else next.add(email);
            return next;
        });

    const allFilteredSelected = filtered.length > 0 && filtered.every(r => selectedEmails.has(r.email));

    const toggleAllFiltered = () => {
        setSelectedEmails(prev => {
            const next = new Set(prev);
            if (allFilteredSelected) filtered.forEach(r => next.delete(r.email));
            else                     filtered.forEach(r => next.add(r.email));
            return next;
        });
    };

    const selectedCount = allRecipients.filter(r => selectedEmails.has(r.email)).length;

    const handleApply = () => {
        const selected = allRecipients.filter(r => selectedEmails.has(r.email));
        // After manual curation the audience groups are no longer relevant —
        // the explicit list IS the audience, so clear group selectors.
        onApply(selected, []);
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className={cn(cardClass, 'w-full max-w-xl max-h-[85vh] flex flex-col !p-0 overflow-hidden')}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
                    <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <ListFilter className="w-4 h-4 text-primary" />
                            Recipient List
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Select or remove recipients before sending
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Filter + bulk toggle */}
                {!isLoading && (
                    <div className="px-5 pt-4 pb-3 border-b border-white/[0.06] space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="text" value={filter} onChange={e => setFilter(e.target.value)}
                                placeholder="Filter by name or email…"
                                className={cn(
                                    'w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-background',
                                    'border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/30'
                                )}
                            />
                            {filter && (
                                <button onClick={() => setFilter('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <button type="button" onClick={toggleAllFiltered}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                {allFilteredSelected
                                    ? <CheckSquare className="w-3.5 h-3.5 text-primary" />
                                    : <Square className="w-3.5 h-3.5" />}
                                {allFilteredSelected ? 'Deselect all' : 'Select all'}
                                {filter && <span className="text-muted-foreground/60">({filtered.length} shown)</span>}
                            </button>
                            <span className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">{selectedCount}</span> / {allRecipients.length} selected
                            </span>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Loading recipients…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground">No recipients match your filter</p>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {filtered.map((r, i) => {
                                const checked = selectedEmails.has(r.email);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => toggleOne(r.email)}
                                        className={cn(
                                            'flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors select-none',
                                            checked ? 'hover:bg-white/[0.03]' : 'opacity-40 hover:opacity-60 hover:bg-white/[0.02]'
                                        )}
                                    >
                                        {/* Checkbox */}
                                        <div className={cn(
                                            'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all',
                                            checked ? 'bg-primary border-primary' : 'border-white/[0.3]'
                                        )}>
                                            {checked && (
                                                <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                                            {(r.name || r.email).charAt(0).toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{r.name || '—'}</p>
                                            <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                                        </div>

                                        {/* Source badge */}
                                        {r.source && (
                                            <span className={cn(
                                                'text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0',
                                                r.source === 'manual'
                                                    ? 'bg-orange-500/10 text-orange-500'
                                                    : 'bg-white/[0.05] text-muted-foreground'
                                            )}>
                                                {SOURCE_LABEL[r.source] ?? r.source}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? '' : (
                            selectedCount === 0
                                ? <span className="text-red-400">No recipients selected</span>
                                : <><span className="font-semibold text-foreground">{selectedCount}</span> recipient{selectedCount !== 1 ? 's' : ''} will receive this email</>
                        )}
                    </p>
                    <div className="flex gap-2 shrink-0">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-xl bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all">
                            Cancel
                        </button>
                        <button
                            type="button" onClick={handleApply}
                            disabled={isLoading || selectedCount === 0}
                            className={cn(
                                'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all',
                                'bg-foreground text-background hover:opacity-90 active:scale-[0.98]',
                                'disabled:opacity-40 disabled:cursor-not-allowed'
                            )}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Apply Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── ConfirmSendModal ─────────────────────────────────────────────────────────

interface ConfirmSendModalProps {
    subject: string; emailBody: string;
    audienceTypes: string[]; customRecipients: Recipient[];
    sendType: 'immediate' | 'scheduled'; scheduledAt: string;
    attachments: AttachmentFile[];
    onClose: () => void;
    onSent:  (count: number) => void;
}

function ConfirmSendModal({
    subject, emailBody, audienceTypes, customRecipients,
    sendType, scheduledAt, attachments, onClose, onSent,
}: ConfirmSendModalProps) {
    const [tab,            setTab]            = useState<'preview' | 'recipients' | 'attachments'>('preview');
    const [allRecipients,  setAllRecipients]  = useState<Recipient[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
    const [isLoading,      setIsLoading]      = useState(true);
    const [isSending,      setIsSending]      = useState(false);
    const [sendError,      setSendError]      = useState('');
    const [filter,         setFilter]         = useState('');

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                let audienceRecs: Recipient[] = [];
                if (audienceTypes.length > 0) {
                    const res  = await fetch(`/api/admin/bulk-email/recipients?audience_types=${audienceTypes.join(',')}&all=true`);
                    const data = await res.json();
                    audienceRecs = data.recipients ?? [];
                }
                const seen   = new Set(audienceRecs.map(r => r.email.toLowerCase()));
                const merged = [...audienceRecs];
                for (const r of customRecipients) {
                    if (!seen.has(r.email.toLowerCase())) { merged.push(r); seen.add(r.email.toLowerCase()); }
                }
                setAllRecipients(merged);
                setSelectedEmails(new Set(merged.map(r => r.email)));
            } finally { setIsLoading(false); }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = allRecipients.filter(r =>
        !filter ||
        r.name.toLowerCase().includes(filter.toLowerCase()) ||
        r.email.toLowerCase().includes(filter.toLowerCase())
    );

    const toggleOne = (email: string) =>
        setSelectedEmails(prev => {
            const next = new Set(prev);
            if (next.has(email)) next.delete(email); else next.add(email);
            return next;
        });

    const allFilteredSelected = filtered.length > 0 && filtered.every(r => selectedEmails.has(r.email));

    const toggleAllFiltered = () => {
        setSelectedEmails(prev => {
            const next = new Set(prev);
            if (allFilteredSelected) filtered.forEach(r => next.delete(r.email));
            else                     filtered.forEach(r => next.add(r.email));
            return next;
        });
    };

    const selectedCount = allRecipients.filter(r => selectedEmails.has(r.email)).length;

    const handleSend = async () => {
        setSendError('');
        if (selectedCount === 0) { setSendError('Select at least one recipient'); return; }
        setIsSending(true);
        try {
            const finalList = allRecipients
                .filter(r => selectedEmails.has(r.email))
                .map(({ email, name }) => ({ email, name }));

            let res: Response;
            if (attachments.length > 0) {
                const fd = new FormData();
                fd.append('subject',           subject);
                fd.append('email_body',        emailBody);
                fd.append('audience_types',    JSON.stringify([]));
                fd.append('custom_recipients', JSON.stringify(finalList));
                fd.append('send_type', sendType === 'scheduled' ? 'scheduled' : 'immediate');
                if (sendType === 'scheduled') fd.append('scheduled_at', scheduledAt);
                attachments.forEach(a => fd.append('attachments', a.file, a.file.name));
                res = await fetch('/api/admin/bulk-email/campaigns', { method: 'POST', body: fd });
            } else {
                res = await fetch('/api/admin/bulk-email/campaigns', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({
                        subject, email_body: emailBody,
                        audience_types:    [],
                        custom_recipients: finalList,
                        send_type:    sendType === 'scheduled' ? 'scheduled' : 'immediate',
                        scheduled_at: sendType === 'scheduled' ? scheduledAt : undefined,
                    }),
                });
            }
            const data = await res.json();
            if (!res.ok) { setSendError(data.error || 'Send failed'); return; }
            onSent(data.campaign?.recipient_count ?? selectedCount);
        } catch { setSendError('Network error. Please try again.'); }
        finally { setIsSending(false); }
    };

    const previewBody = emailBody
        .replace(/\{\{first_name\}\}/gi, 'Alex')
        .replace(/\{\{full_name\}\}/gi, 'Alex Johnson')
        .replace(/\{\{email\}\}/gi, 'alex.johnson@example.com');

    return (
        <div
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget && !isSending) onClose(); }}
        >
            <div className={cn(cardClass, 'w-full max-w-3xl max-h-[90vh] flex flex-col !p-0 overflow-hidden')}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
                    <div>
                        <h3 className="font-semibold text-foreground">Review &amp; Send Campaign</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                            Subject: <span className="text-foreground">{subject}</span>
                        </p>
                    </div>
                    <button onClick={onClose} disabled={isSending}
                        className="p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/[0.06] px-5">
                    {(['preview', 'recipients', ...(attachments.length > 0 ? ['attachments'] : [])] as Array<'preview' | 'recipients' | 'attachments'>).map(t => (
                        <button key={t} type="button" onClick={() => setTab(t)}
                            className={cn(
                                'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                                tab === t
                                    ? 'border-foreground text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            )}>
                            {t === 'preview'
                                ? 'Email Preview'
                                : t === 'recipients'
                                    ? `Recipients${!isLoading ? ` (${selectedCount}/${allRecipients.length})` : ''}`
                                    : `Attachments (${attachments.length})`}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto min-h-0">

                    {tab === 'preview' && (
                        <div className="p-5 space-y-4">
                            <div className={cn(cardClass, '!p-4')}>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Subject</p>
                                <p className="text-sm font-medium text-foreground">{subject || '(no subject)'}</p>
                            </div>
                            <div className={cn(cardClass, '!p-4')}>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Body</p>
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                                    dangerouslySetInnerHTML={{ __html: previewBody || '<p class="italic text-muted-foreground">No content</p>' }}
                                />
                            </div>
                            <p className="text-xs text-center text-muted-foreground/60">
                                Previewed with sample data — Alex Johnson &lt;alex.johnson@example.com&gt;
                            </p>
                        </div>
                    )}

                    {tab === 'recipients' && (
                        <div className="flex flex-col h-full">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-16 gap-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Loading recipients…</span>
                                </div>
                            ) : (
                                <>
                                    <div className="px-5 pt-4 pb-3 space-y-3 border-b border-white/[0.06]">
                                        <div className="relative">
                                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                            <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
                                                placeholder="Filter by name or email…"
                                                className={cn(
                                                    'w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-background',
                                                    'border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50',
                                                    'focus:outline-none focus:ring-2 focus:ring-primary/30'
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button type="button" onClick={toggleAllFiltered}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                                {allFilteredSelected
                                                    ? <CheckSquare className="w-3.5 h-3.5 text-primary" />
                                                    : <Square className="w-3.5 h-3.5" />}
                                                {allFilteredSelected ? 'Deselect all' : 'Select all'}
                                                {filter && <span className="opacity-60">({filtered.length} shown)</span>}
                                            </button>
                                            <span className="text-xs text-muted-foreground">
                                                <span className="font-semibold text-foreground">{selectedCount}</span> of {allRecipients.length} selected
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                                        {filtered.length === 0 ? (
                                            <p className="py-8 text-center text-sm text-muted-foreground">No recipients match</p>
                                        ) : filtered.map((r, i) => {
                                            const checked = selectedEmails.has(r.email);
                                            return (
                                                <div key={i} onClick={() => toggleOne(r.email)}
                                                    className={cn(
                                                        'flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors select-none',
                                                        checked ? 'hover:bg-white/[0.03]' : 'opacity-40 hover:opacity-60'
                                                    )}>
                                                    <div className={cn(
                                                        'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all',
                                                        checked ? 'bg-primary border-primary' : 'border-white/[0.3]'
                                                    )}>
                                                        {checked && <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
                                                        {(r.name || r.email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{r.name || '—'}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                                                    </div>
                                                    {r.source && (
                                                        <span className={cn(
                                                            'text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0',
                                                            r.source === 'manual'
                                                                ? 'bg-orange-500/10 text-orange-500'
                                                                : 'bg-white/[0.05] text-muted-foreground'
                                                        )}>
                                                            {SOURCE_LABEL[r.source] ?? r.source}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {tab === 'attachments' && (
                        <div className="p-5 space-y-3">
                            {attachments.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-8">No attachments</p>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        {attachments.map(a => (
                                            <div key={a.id} className={cn(cardClass, '!p-3 flex items-center gap-3')}>
                                                <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{a.file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{formatFileSize(a.file.size)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground text-right">
                                        {attachments.length} file{attachments.length !== 1 ? 's' : ''} · {formatFileSize(attachments.reduce((s, a) => s + a.file.size, 0))} total
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-white/[0.08] space-y-2">
                    {sendError && (
                        <p className="text-xs text-red-500 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{sendError}
                        </p>
                    )}
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            {isLoading ? 'Loading…' : (
                                sendType === 'scheduled'
                                    ? <>Scheduled for <span className="font-medium text-foreground">{new Date(scheduledAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></>
                                    : <>Sending to <span className="font-medium text-foreground">{selectedCount}</span> recipient{selectedCount !== 1 ? 's' : ''}</>
                            )}
                        </p>
                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} disabled={isSending}
                                className="px-4 py-2.5 text-sm font-medium rounded-xl bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all disabled:opacity-40">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSend} disabled={isSending || isLoading || selectedCount === 0}
                                className={cn(
                                    'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all',
                                    'bg-foreground text-background shadow-lg shadow-foreground/10',
                                    'hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
                                )}>
                                {isSending
                                    ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                                    : sendType === 'scheduled'
                                        ? <><Clock className="w-4 h-4" />Schedule Campaign</>
                                        : <><Send className="w-4 h-4" />Send to {selectedCount} recipient{selectedCount !== 1 ? 's' : ''}</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

interface BulkEmailClientProps {
    initialCampaigns: Campaign[];
    totalCount: number;
}

export default function BulkEmailClient({ initialCampaigns, totalCount }: BulkEmailClientProps) {
    // Composer
    const [audienceTypes,     setAudienceTypes]     = useState<string[]>([]);
    const [customRecipients,  setCustomRecipients]  = useState<Recipient[]>([]);
    const [subject,           setSubject]           = useState('');
    const [emailBody,         setEmailBody]         = useState('');
    const [sendType,          setSendType]          = useState<'immediate' | 'scheduled'>('immediate');
    const [scheduledAt,       setScheduledAt]       = useState('');
    const [attachments,       setAttachments]       = useState<AttachmentFile[]>([]);
    const [csvStats,          setCsvStats]          = useState<CSVImportStats | null>(null);
    const csvInputRef        = useRef<HTMLInputElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    // Audience count (for badge only — no inline list)
    const [recipientCount,    setRecipientCount]    = useState<number | null>(null);
    const [recipientsLoading, setRecipientsLoading] = useState(false);

    // Modals
    const [showRecipientModal, setShowRecipientModal] = useState(false);
    const [showConfirmModal,   setShowConfirmModal]   = useState(false);
    const [showTemplateModal,  setShowTemplateModal]  = useState(false);

    // Search dropdown
    const [searchQuery,    setSearchQuery]    = useState('');
    const [searchResults,  setSearchResults]  = useState<Recipient[]>([]);
    const [searchLoading,  setSearchLoading]  = useState(false);
    const searchRef    = useRef<HTMLDivElement>(null);
    const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

    // UI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast,        setToast]        = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // History
    const [campaigns,     setCampaigns]     = useState<Campaign[]>(initialCampaigns);
    const [total,         setTotal]         = useState(totalCount);
    const [page,          setPage]          = useState(1);
    const [historyLoading,setHistoryLoading]= useState(false);
    const [sendingId,     setSendingId]     = useState<string | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    };

    // Fetch audience count only (no full list — that's handled by modals)
    const fetchCount = useCallback(async (types: string[]) => {
        if (types.length === 0) { setRecipientCount(null); return; }
        setRecipientsLoading(true);
        try {
            const res  = await fetch(`/api/admin/bulk-email/recipients?audience_types=${types.join(',')}`);
            const data = await res.json();
            setRecipientCount(data.count ?? 0);
        } catch { setRecipientCount(0); }
        finally { setRecipientsLoading(false); }
    }, []);

    useEffect(() => { fetchCount(audienceTypes); }, [audienceTypes, fetchCount]);

    // Debounced search
    useEffect(() => {
        if (searchDebounce.current) clearTimeout(searchDebounce.current);
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        setSearchLoading(true);
        searchDebounce.current = setTimeout(async () => {
            try {
                const res  = await fetch(`/api/admin/bulk-email/recipients?search=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(data.recipients ?? []);
            } catch { setSearchResults([]); }
            finally { setSearchLoading(false); }
        }, 300);
    }, [searchQuery]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchResults([]); setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleAudience = (id: string) =>
        setAudienceTypes(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

    const addCustomRecipient = (r: Recipient) => {
        if (customRecipients.some(c => c.email === r.email)) return;
        setCustomRecipients(prev => [...prev, r]);
        setSearchQuery(''); setSearchResults([]);
    };

    const removeCustomRecipient = (email: string) =>
        setCustomRecipients(prev => prev.filter(c => c.email !== email));

    const totalRecipients = (recipientCount ?? 0) + customRecipients.length;

    const fetchHistory = async (p = 1) => {
        setHistoryLoading(true);
        try {
            const res  = await fetch(`/api/admin/bulk-email/campaigns?page=${p}`);
            const data = await res.json();
            setCampaigns(data.campaigns ?? []); setTotal(data.pagination?.total ?? 0);
        } catch { /* keep */ }
        finally { setHistoryLoading(false); }
    };

    const resetComposer = () => {
        setSubject(''); setEmailBody(''); setAudienceTypes([]);
        setCustomRecipients([]); setScheduledAt(''); setSendType('immediate');
        setAttachments([]); setCsvStats(null);
    };

    const handleSaveDraft = async () => {
        if (!subject.trim()) { showToast('error', 'Subject is required'); return; }
        if (!emailBody.trim()) { showToast('error', 'Email body is required'); return; }
        if (audienceTypes.length === 0 && customRecipients.length === 0) {
            showToast('error', 'Select at least one audience or add recipients'); return;
        }
        setIsSubmitting(true);
        try {
            const recipients = customRecipients.map(({ email, name }) => ({ email, name }));
            let res: Response;
            if (attachments.length > 0) {
                const fd = new FormData();
                fd.append('subject',           subject);
                fd.append('email_body',        emailBody);
                fd.append('audience_types',    JSON.stringify(audienceTypes));
                fd.append('custom_recipients', JSON.stringify(recipients));
                fd.append('send_type',         'draft');
                attachments.forEach(a => fd.append('attachments', a.file, a.file.name));
                res = await fetch('/api/admin/bulk-email/campaigns', { method: 'POST', body: fd });
            } else {
                res = await fetch('/api/admin/bulk-email/campaigns', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({
                        subject, email_body: emailBody,
                        audience_types:    audienceTypes,
                        custom_recipients: recipients,
                        send_type: 'draft',
                    }),
                });
            }
            const data = await res.json();
            if (!res.ok) { showToast('error', data.error || 'Failed to save draft'); return; }
            showToast('success', 'Draft saved successfully');
            fetchHistory(1); setPage(1);
        } catch { showToast('error', 'Network error. Please try again.'); }
        finally { setIsSubmitting(false); }
    };

    const handleOpenSendModal = () => {
        if (!subject.trim()) { showToast('error', 'Subject is required'); return; }
        if (!emailBody.trim()) { showToast('error', 'Email body is required'); return; }
        if (audienceTypes.length === 0 && customRecipients.length === 0) {
            showToast('error', 'Select at least one audience or add recipients'); return;
        }
        if (sendType === 'scheduled' && !scheduledAt) {
            showToast('error', 'Please set a schedule date/time'); return;
        }
        setShowConfirmModal(true);
    };

    const handleSendCampaign = async (id: string) => {
        setSendingId(id);
        try {
            const res  = await fetch(`/api/admin/bulk-email/campaigns/${id}/send`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) showToast('error', data.error || 'Send failed');
            else { showToast('success', `Sent to ${data.campaign?.recipient_count ?? 0} recipients`); fetchHistory(page); }
        } catch { showToast('error', 'Network error'); }
        finally { setSendingId(null); }
    };

    const minScheduleStr = new Date(Date.now() + 5 * 60_000).toISOString().slice(0, 16);

    return (
        <div className="space-y-6">

            {/* Toast */}
            {toast && (
                <div className={cn(
                    'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium',
                    'border backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-200',
                    toast.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                )}>
                    {toast.type === 'success'
                        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                        : <AlertCircle  className="w-4 h-4 shrink-0" />}
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-1 opacity-60 hover:opacity-100">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Template picker */}
            {showTemplateModal && (
                <TemplatePickerModal
                    onClose={() => setShowTemplateModal(false)}
                    onSelect={t => {
                        setSubject(t.subject);
                        setEmailBody(t.body);
                    }}
                />
            )}

            {/* Recipient list popup */}
            {showRecipientModal && (
                <RecipientListModal
                    audienceTypes={audienceTypes}
                    customRecipients={customRecipients}
                    onClose={() => setShowRecipientModal(false)}
                    onApply={(selected, newAudienceTypes) => {
                        setCustomRecipients(selected);
                        setAudienceTypes(newAudienceTypes);
                        setRecipientCount(null); // will re-fetch if groups are set
                        setShowRecipientModal(false);
                        showToast('success', `${selected.length} recipient${selected.length !== 1 ? 's' : ''} applied`);
                    }}
                />
            )}

            {/* Confirm & send popup */}
            {showConfirmModal && (
                <ConfirmSendModal
                    subject={subject} emailBody={emailBody}
                    audienceTypes={audienceTypes} customRecipients={customRecipients}
                    sendType={sendType} scheduledAt={scheduledAt}
                    attachments={attachments}
                    onClose={() => setShowConfirmModal(false)}
                    onSent={count => {
                        setShowConfirmModal(false);
                        showToast('success',
                            sendType === 'scheduled'
                                ? 'Campaign scheduled successfully'
                                : `Campaign sent to ${count} recipients`
                        );
                        resetComposer();
                        fetchHistory(1); setPage(1);
                    }}
                />
            )}

            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                    Bulk Email Campaigns
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Send personalized emails to leads and enrolled students
                </p>
            </div>

            {/* ── Section 1: Audience ── */}
            <div className={cn(cardClass, 'space-y-5')}>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</div>
                    <h2 className="text-sm font-semibold text-foreground">Select Audience</h2>
                </div>

                {/* Group checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {AUDIENCE_OPTIONS.map(opt => {
                        const Icon     = opt.icon;
                        const selected = audienceTypes.includes(opt.id);
                        const colorMap: Record<string, string> = {
                            blue:   'border-blue-500/30 bg-blue-500/5',
                            emerald:'border-emerald-500/30 bg-emerald-500/5',
                            violet: 'border-violet-500/30 bg-violet-500/5',
                        };
                        const iconColorMap: Record<string, string> = {
                            blue: 'text-blue-500', emerald: 'text-emerald-500', violet: 'text-violet-500',
                        };
                        return (
                            <button key={opt.id} type="button" onClick={() => toggleAudience(opt.id)}
                                className={cn(
                                    'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                                    selected ? colorMap[opt.color] : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                                )}>
                                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', selected ? 'bg-background/60' : 'bg-white/[0.04]')}>
                                    <Icon className={cn('w-5 h-5', selected ? iconColorMap[opt.color] : 'text-muted-foreground')} />
                                </div>
                                <p className={cn('text-sm font-medium flex-1', selected ? 'text-foreground' : 'text-muted-foreground')}>{opt.label}</p>
                                <div className={cn('w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all', selected ? 'bg-primary border-primary' : 'border-white/[0.2]')}>
                                    {selected && <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Count + Preview list button */}
                {(audienceTypes.length > 0 || customRecipients.length > 0) && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            {recipientsLoading
                                ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                : <Mail className="w-4 h-4 text-muted-foreground" />}
                            <span className="text-muted-foreground">
                                {recipientsLoading ? 'Counting…' : (
                                    <>
                                        <span className="font-semibold text-foreground">{totalRecipients}</span> total recipients
                                    </>
                                )}
                                {customRecipients.length > 0 && (
                                    <span className="ml-1 text-muted-foreground/60">({customRecipients.length} custom)</span>
                                )}
                            </span>
                        </div>

                        {/* ← This is now a popup trigger */}
                        <button
                            type="button"
                            onClick={() => setShowRecipientModal(true)}
                            className={cn(
                                'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                                'bg-white/[0.04] border border-white/[0.08] text-muted-foreground',
                                'hover:bg-white/[0.08] hover:text-foreground active:scale-[0.97]'
                            )}
                        >
                            <ListFilter className="w-3.5 h-3.5" />
                            Preview list
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Search existing records */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">Search &amp; Add from Existing Records</p>
                        <span className="text-[10px] text-muted-foreground/50">by name, email, or phone</span>
                    </div>

                    <div className="relative" ref={searchRef}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search student, enterprise lead, or enrolled user…"
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-background border border-white/[0.08]',
                                'text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30'
                            )}
                        />
                        {searchLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}

                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-white/[0.08] bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden">
                                <div className="max-h-56 overflow-y-auto divide-y divide-white/[0.04]">
                                    {searchResults.map((r, i) => {
                                        const added = customRecipients.some(c => c.email === r.email);
                                        return (
                                            <button key={i} type="button" onClick={() => !added && addCustomRecipient(r)} disabled={added}
                                                className={cn('w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors', added ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/[0.04]')}>
                                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
                                                    {(r.name || r.email).charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{r.name || '—'}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {r.source && <span className="text-[10px] text-muted-foreground/60">{SOURCE_LABEL[r.source] ?? r.source}</span>}
                                                    {added ? <UserCheck className="w-4 h-4 text-emerald-500" /> : <UserPlus className="w-4 h-4 text-muted-foreground" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {searchQuery.trim() && !searchLoading && searchResults.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-white/[0.08] bg-background/95 backdrop-blur-xl shadow-xl px-4 py-3">
                                <p className="text-sm text-muted-foreground text-center">No results for &ldquo;{searchQuery}&rdquo;</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add new recipient manually */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <UserRoundPlus className="w-4 h-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">Add New Recipient Manually</p>
                        <span className="text-[10px] text-muted-foreground/50">anyone not in your database</span>
                    </div>
                    <AddRecipientForm onAdd={addCustomRecipient} />
                </div>

                {/* ── Import from CSV ── */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <FileUp className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs font-medium text-muted-foreground">Import from CSV</p>
                            <span className="text-[10px] text-muted-foreground/50">Name, Email, Company, Phone…</span>
                        </div>
                        <button
                            type="button"
                            onClick={downloadSampleCSV}
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Download className="w-3 h-3" />
                            Sample CSV
                        </button>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = ev => {
                                const text = ev.target?.result as string;
                                const existingEmails = new Set(customRecipients.map(r => r.email));
                                const { recipients: parsed, stats } = parseCSVData(text, existingEmails);
                                if (parsed.length > 0) {
                                    setCustomRecipients(prev => [...prev, ...parsed]);
                                }
                                setCsvStats(stats);
                            };
                            reader.readAsText(file);
                            e.target.value = '';
                        }}
                    />

                    {/* Drop zone */}
                    <div
                        onClick={() => csvInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary/40', 'bg-primary/5'); }}
                        onDragLeave={e => { e.currentTarget.classList.remove('border-primary/40', 'bg-primary/5'); }}
                        onDrop={e => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-primary/40', 'bg-primary/5');
                            const file = e.dataTransfer.files[0];
                            if (!file || !file.name.endsWith('.csv')) return;
                            const reader = new FileReader();
                            reader.onload = ev => {
                                const text = ev.target?.result as string;
                                const existingEmails = new Set(customRecipients.map(r => r.email));
                                const { recipients: parsed, stats } = parseCSVData(text, existingEmails);
                                if (parsed.length > 0) setCustomRecipients(prev => [...prev, ...parsed]);
                                setCsvStats(stats);
                            };
                            reader.readAsText(file);
                        }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all',
                            'border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]'
                        )}
                    >
                        <Upload className="w-5 h-5 text-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground">Click to browse or drag &amp; drop a <strong>.csv</strong> file</p>
                    </div>

                    {/* Import stats */}
                    {csvStats && (
                        <div className={cn(
                            'rounded-xl border p-4 space-y-2',
                            csvStats.errors.length > 0
                                ? 'bg-yellow-500/5 border-yellow-500/20'
                                : 'bg-emerald-500/5 border-emerald-500/20'
                        )}>
                            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Import Complete
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                <div className="space-y-0.5">
                                    <p className="text-muted-foreground/60">Total rows</p>
                                    <p className="font-semibold text-foreground">{csvStats.total}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-muted-foreground/60">Imported</p>
                                    <p className="font-semibold text-emerald-500">{csvStats.imported}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-muted-foreground/60">Duplicates skipped</p>
                                    <p className="font-semibold text-yellow-500">{csvStats.duplicates}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-muted-foreground/60">Errors</p>
                                    <p className="font-semibold text-red-500">{csvStats.errors.length}</p>
                                </div>
                            </div>
                            {csvStats.errors.length > 0 && (
                                <details className="mt-1">
                                    <summary className="text-[11px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                                        Show {csvStats.errors.length} error{csvStats.errors.length !== 1 ? 's' : ''}
                                    </summary>
                                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                        {csvStats.errors.map((e, i) => (
                                            <p key={i} className="text-[11px] text-red-500 flex items-start gap-1.5">
                                                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                                Row {e.row}{e.email ? ` (${e.email})` : ''}: {e.reason}
                                            </p>
                                        ))}
                                    </div>
                                </details>
                            )}
                            <button
                                type="button"
                                onClick={() => setCsvStats(null)}
                                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}
                </div>

                {/* Custom recipient chips */}
                {customRecipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {customRecipients.map(r => (
                            <span key={r.email} className={cn(
                                'inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-medium rounded-full border',
                                r.source === 'manual'
                                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                                    : 'bg-primary/10 text-primary border-primary/20'
                            )}>
                                <TagIcon className="w-3 h-3" />
                                <span className="max-w-[140px] truncate">{r.name || r.email}</span>
                                <button type="button" onClick={() => removeCustomRecipient(r.email)}
                                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </span>
                        ))}
                        <button type="button" onClick={() => setCustomRecipients([])}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors self-center">
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* ── Section 2: Email Composer ── */}
            <div className={cn(cardClass, 'space-y-4')}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
                        <h2 className="text-sm font-semibold text-foreground">Email Composer</h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowTemplateModal(true)}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                            'bg-primary/10 text-primary border border-primary/20',
                            'hover:bg-primary/20 active:scale-[0.97]'
                        )}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Templates
                    </button>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject Line</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. Exclusive cybersecurity offer for {{first_name}}" maxLength={200}
                        className={cn(
                            'w-full px-4 py-3 text-sm rounded-xl bg-background border border-white/[0.08]',
                            'text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30'
                        )}
                    />
                    <p className="text-[11px] text-muted-foreground/60 text-right">{subject.length}/200</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Body</label>
                    <EmailBodyEditor content={emailBody} onChange={setEmailBody} />
                    <p className="text-[11px] text-muted-foreground/50">
                        Use{' '}
                        <code className="bg-white/[0.05] px-1 rounded">{'{{first_name}}'}</code>,{' '}
                        <code className="bg-white/[0.05] px-1 rounded">{'{{full_name}}'}</code>,{' '}
                        <code className="bg-white/[0.05] px-1 rounded">{'{{email}}'}</code> for personalization.
                    </p>
                </div>

                {/* ── Attachments ── */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">Email Attachments</p>
                        <span className="text-[10px] text-muted-foreground/50">Max 10 MB/file · 25 MB total · PDF, DOCX, XLSX, JPG, PNG…</span>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={attachmentInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                        className="hidden"
                        onChange={e => {
                            const files = Array.from(e.target.files ?? []);
                            const currentTotal = attachments.reduce((s, a) => s + a.file.size, 0);
                            const errors: string[] = [];
                            const toAdd: AttachmentFile[] = [];
                            let running = currentTotal;

                            for (const file of files) {
                                if (attachments.some(a => a.file.name === file.name && a.file.size === file.size)) {
                                    errors.push(`${file.name}: already attached`);
                                    continue;
                                }
                                if (!ALLOWED_MIME_TYPES.has(file.type)) {
                                    errors.push(`${file.name}: unsupported file type`);
                                    continue;
                                }
                                if (file.size > MAX_FILE_SIZE) {
                                    errors.push(`${file.name}: exceeds 10 MB limit`);
                                    continue;
                                }
                                if (running + file.size > MAX_TOTAL_SIZE) {
                                    errors.push(`${file.name}: would exceed 25 MB total limit`);
                                    continue;
                                }
                                running += file.size;
                                toAdd.push({ id: `${Date.now()}-${Math.random()}`, file });
                            }
                            if (toAdd.length > 0) setAttachments(prev => [...prev, ...toAdd]);
                            if (errors.length > 0) showToast('error', errors.join('; '));
                            e.target.value = '';
                        }}
                    />

                    {/* Drop zone */}
                    <div
                        onClick={() => attachmentInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary/40', 'bg-primary/5'); }}
                        onDragLeave={e => { e.currentTarget.classList.remove('border-primary/40', 'bg-primary/5'); }}
                        onDrop={e => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-primary/40', 'bg-primary/5');
                            const files = Array.from(e.dataTransfer.files);
                            const currentTotal = attachments.reduce((s, a) => s + a.file.size, 0);
                            const errors: string[] = [];
                            const toAdd: AttachmentFile[] = [];
                            let running = currentTotal;
                            for (const file of files) {
                                if (!ALLOWED_MIME_TYPES.has(file.type)) { errors.push(`${file.name}: unsupported type`); continue; }
                                if (file.size > MAX_FILE_SIZE) { errors.push(`${file.name}: exceeds 10 MB`); continue; }
                                if (running + file.size > MAX_TOTAL_SIZE) { errors.push(`${file.name}: would exceed 25 MB total`); continue; }
                                running += file.size;
                                toAdd.push({ id: `${Date.now()}-${Math.random()}`, file });
                            }
                            if (toAdd.length > 0) setAttachments(prev => [...prev, ...toAdd]);
                            if (errors.length > 0) showToast('error', errors.join('; '));
                        }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all',
                            'border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]'
                        )}
                    >
                        <Upload className="w-5 h-5 text-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground">Click to attach files or drag &amp; drop</p>
                    </div>

                    {/* Attached file list */}
                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            {attachments.map(a => (
                                <div key={a.id} className={cn(cardClass, '!p-3 flex items-center gap-3')}>
                                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{a.file.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatFileSize(a.file.size)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAttachments(prev => prev.filter(x => x.id !== a.id))}
                                        className="p-1 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            <p className="text-[11px] text-muted-foreground text-right">
                                {attachments.length} file{attachments.length !== 1 ? 's' : ''} · {formatFileSize(attachments.reduce((s, a) => s + a.file.size, 0))} / {formatFileSize(MAX_TOTAL_SIZE)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Section 3: Sending Options ── */}
            <div className={cn(cardClass, 'space-y-4')}>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</div>
                    <h2 className="text-sm font-semibold text-foreground">Sending Options</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { value: 'immediate', icon: Send,  label: 'Send Now', desc: 'Deliver immediately to all recipients' },
                        { value: 'scheduled', icon: Clock, label: 'Schedule',  desc: 'Set a specific date and time to send' },
                    ].map(opt => {
                        const Icon = opt.icon; const selected = sendType === opt.value;
                        return (
                            <button key={opt.value} type="button" onClick={() => setSendType(opt.value as 'immediate' | 'scheduled')}
                                className={cn(
                                    'flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                                    selected ? 'border-primary/30 bg-primary/5' : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                                )}>
                                <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', selected ? 'text-primary' : 'text-muted-foreground')} />
                                <div>
                                    <p className={cn('text-sm font-medium', selected ? 'text-foreground' : 'text-muted-foreground')}>{opt.label}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-0.5">{opt.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {sendType === 'scheduled' && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />Schedule Date &amp; Time
                        </label>
                        <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} min={minScheduleStr}
                            className={cn(
                                'w-full sm:w-72 px-4 py-3 text-sm rounded-xl bg-background border border-white/[0.08]',
                                'text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'
                            )}
                        />
                        <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
                            <TriangleAlert className="w-3 h-3" />
                            Scheduled campaigns are saved and can be sent manually from the history below.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={handleSaveDraft} disabled={isSubmitting}
                    className={cn(
                        'inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-all min-h-[44px]',
                        'bg-white/[0.04] border border-white/[0.08] text-muted-foreground',
                        'hover:bg-white/[0.08] hover:text-foreground active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
                    )}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Draft
                </button>

                <button type="button" onClick={handleOpenSendModal}
                    disabled={audienceTypes.length === 0 && customRecipients.length === 0}
                    className={cn(
                        'inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-all min-h-[44px]',
                        'bg-foreground text-background shadow-lg shadow-foreground/10',
                        'hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
                    )}>
                    <Eye className="w-4 h-4" />
                    {sendType === 'scheduled' ? 'Review & Schedule' : 'Review & Send'}
                </button>
            </div>

            {/* ── Campaign History ── */}
            <div className={cn(cardClass, 'space-y-4')}>
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Campaign History</h2>
                    <button type="button" onClick={() => fetchHistory(page)} disabled={historyLoading}
                        className="p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
                        <RefreshCw className={cn('w-4 h-4', historyLoading && 'animate-spin')} />
                    </button>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-muted-foreground border-b border-white/[0.06]">
                            <tr>
                                <th className="pb-3 pr-4 font-medium">Subject</th>
                                <th className="pb-3 pr-4 font-medium">Audience</th>
                                <th className="pb-3 pr-4 font-medium">Recipients</th>
                                <th className="pb-3 pr-4 font-medium">Date</th>
                                <th className="pb-3 pr-4 font-medium">Status</th>
                                <th className="pb-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {historyLoading ? (
                                <tr><td colSpan={6} className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                            ) : campaigns.length === 0 ? (
                                <tr><td colSpan={6} className="py-10 text-center text-muted-foreground text-sm">No campaigns yet</td></tr>
                            ) : campaigns.map(c => (
                                <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="py-3 pr-4">
                                        <p className="font-medium text-foreground truncate max-w-[200px]">{c.subject}</p>
                                        <p className="text-xs text-muted-foreground">{c.created_by_name}</p>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <div className="flex flex-wrap gap-1">
                                            {c.audience_types.map(t => (
                                                <span key={t} className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/[0.04] border border-white/[0.06] text-muted-foreground">
                                                    {t.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-muted-foreground">{c.recipient_count.toLocaleString()}</td>
                                    <td className="py-3 pr-4 text-muted-foreground text-xs">
                                        {c.sent_at
                                            ? new Date(c.sent_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : c.scheduled_at
                                                ? `Sched: ${new Date(c.scheduled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                                                : new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full', STATUS_CONFIG[c.status]?.cls ?? 'bg-muted/60 text-muted-foreground')}>
                                            {STATUS_CONFIG[c.status]?.label ?? c.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {(c.status === 'draft' || c.status === 'scheduled') && (
                                            <button type="button" onClick={() => handleSendCampaign(c.id)} disabled={sendingId === c.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-foreground text-background hover:opacity-80 disabled:opacity-40 transition-all">
                                                {sendingId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                                Send Now
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-3">
                    {campaigns.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground py-6">No campaigns yet</p>
                    ) : campaigns.map(c => (
                        <div key={c.id} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-foreground text-sm truncate flex-1">{c.subject}</p>
                                <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full shrink-0', STATUS_CONFIG[c.status]?.cls ?? 'bg-muted/60 text-muted-foreground')}>
                                    {STATUS_CONFIG[c.status]?.label ?? c.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {c.audience_types.map(t => (
                                    <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-white/[0.04] border border-white/[0.06] text-muted-foreground">{t.replace(/_/g, ' ')}</span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    {c.recipient_count} recipients · {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                                {(c.status === 'draft' || c.status === 'scheduled') && (
                                    <button type="button" onClick={() => handleSendCampaign(c.id)} disabled={sendingId === c.id}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-foreground text-background hover:opacity-80 disabled:opacity-40">
                                        {sendingId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                        Send
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {total > 20 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <button onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchHistory(p); }} disabled={page === 1}
                            className="px-4 py-2 text-sm rounded-lg bg-white/[0.03] border border-white/[0.06] disabled:opacity-40">Previous</button>
                        <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 20)}</span>
                        <button onClick={() => { const p = page + 1; setPage(p); fetchHistory(p); }} disabled={page >= Math.ceil(total / 20)}
                            className="px-4 py-2 text-sm rounded-lg bg-white/[0.03] border border-white/[0.06] disabled:opacity-40">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}
