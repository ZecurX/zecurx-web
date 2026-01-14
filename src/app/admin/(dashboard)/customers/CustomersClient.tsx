'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Mail, Phone, Download, FileSpreadsheet, Filter, Users, GraduationCap, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
    created_at: string;
    amount: number;
    plans: {
        name: string;
        type: string;
    } | null;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    college?: string;
    created_at: string;
    transactions: Transaction[];
}

interface CustomersClientProps {
    customers: Customer[];
}

const DOMAINS = [
    'All Domains',
    'Penetration Tester',
    'App Developer',
    'Website Developer',
    'Cybersecurity AI Developer'
];

function extractDomain(planName: string): string {
    const name = planName.toLowerCase();
    if (name.includes('penetration tester')) return 'Penetration Tester';
    if (name.includes('app developer')) return 'App Developer';
    if (name.includes('website developer')) return 'Website Developer';
    if (name.includes('cybersecurity ai')) return 'Cybersecurity AI Developer';
    return 'Other';
}

export default function CustomersClient({ customers }: CustomersClientProps) {
    const [filter, setFilter] = useState<'all' | 'internship'>('all');
    const [domainFilter, setDomainFilter] = useState('All Domains');
    const [isExporting, setIsExporting] = useState(false);
    const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDomainDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const processedCustomers = useMemo(() => {
        return customers.map(customer => {
            const latestTransaction = customer.transactions?.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];

            return {
                ...customer,
                latestPlan: latestTransaction?.plans?.name || 'No Active Plan',
                planType: latestTransaction?.plans?.type || '',
                domain: latestTransaction?.plans?.name ? extractDomain(latestTransaction.plans.name) : '',
                amount: latestTransaction?.amount || 0
            };
        });
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        let result = processedCustomers;

        if (filter === 'internship') {
            result = result.filter(c => c.planType === 'internship');
        }

        if (domainFilter !== 'All Domains') {
            result = result.filter(c => c.domain === domainFilter);
        }

        return result;
    }, [processedCustomers, filter, domainFilter]);

    const stats = useMemo(() => {
        const internshipCustomers = processedCustomers.filter(c => c.planType === 'internship');
        const domainCounts: Record<string, number> = {};
        
        internshipCustomers.forEach(c => {
            if (c.domain) {
                domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1;
            }
        });

        return {
            total: customers.length,
            internships: internshipCustomers.length,
            domainCounts
        };
    }, [processedCustomers, customers.length]);

    const handleExport = async (format: 'xlsx' | 'csv') => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams();
            params.set('format', format);
            params.set('type', filter);
            if (domainFilter !== 'All Domains') {
                params.set('domain', domainFilter);
            }

            const response = await fetch(`/api/admin/export?${params.toString()}`);
            
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zecurx-${filter === 'internship' ? 'internships' : 'customers'}-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const cardClass = cn(
        "p-5 rounded-2xl",
        "bg-background/70 backdrop-blur-xl",
        "border border-white/[0.08] dark:border-white/[0.06]",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
        "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-manrope font-bold tracking-tight text-foreground">
                        Customers
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and export customer data
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => handleExport('xlsx')}
                        disabled={isExporting}
                        aria-label="Export data as Excel file"
                        className={cn(
                            "inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                            "min-h-[44px] min-w-[44px]",
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                            "border border-emerald-500/20",
                            "hover:bg-emerald-500/20 active:scale-[0.98] disabled:opacity-50",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                    >
                        <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Excel'}</span>
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        disabled={isExporting}
                        aria-label="Export data as CSV file"
                        className={cn(
                            "inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                            "min-h-[44px] min-w-[44px]",
                            "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                            "border border-blue-500/20",
                            "hover:bg-blue-500/20 active:scale-[0.98] disabled:opacity-50",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                    >
                        <Download className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">CSV</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={cardClass}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10">
                            <Users className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-foreground font-manrope">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className={cardClass}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10">
                            <GraduationCap className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Internships</p>
                            <p className="text-xl font-bold text-foreground font-manrope">{stats.internships}</p>
                        </div>
                    </div>
                </div>
                {Object.entries(stats.domainCounts).slice(0, 2).map(([domain, count]) => (
                    <div key={domain} className={cardClass}>
                        <p className="text-xs text-muted-foreground truncate">{domain}</p>
                        <p className="text-xl font-bold text-foreground font-manrope mt-1">{count}</p>
                    </div>
                ))}
            </div>

            <div className={cn(cardClass, "space-y-4 relative z-20")} role="group" aria-label="Filter options">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                </div>
                
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Customer type filter">
                    <button
                        onClick={() => setFilter('all')}
                        role="radio"
                        aria-checked={filter === 'all'}
                        className={cn(
                            "flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                            "min-h-[44px]",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            filter === 'all'
                                ? "bg-foreground text-background"
                                : "bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] border border-white/[0.06]"
                        )}
                    >
                        All ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('internship')}
                        role="radio"
                        aria-checked={filter === 'internship'}
                        className={cn(
                            "flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                            "min-h-[44px]",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            filter === 'internship'
                                ? "bg-foreground text-background"
                                : "bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] border border-white/[0.06]"
                        )}
                    >
                        Internships ({stats.internships})
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                            aria-haspopup="listbox"
                            aria-expanded={isDomainDropdownOpen}
                            aria-label="Filter by domain"
                            className={cn(
                                "w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                "min-h-[44px] flex items-center justify-between gap-2",
                                "bg-background border border-white/[0.08] text-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/30"
                            )}
                        >
                            <span className="truncate">
                                {domainFilter} {domainFilter !== 'All Domains' && stats.domainCounts[domainFilter] ? `(${stats.domainCounts[domainFilter]})` : ''}
                            </span>
                            <ChevronDown className={cn(
                                "w-4 h-4 shrink-0 transition-transform duration-200",
                                isDomainDropdownOpen && "rotate-180"
                            )} aria-hidden="true" />
                        </button>
                        
                        {isDomainDropdownOpen && (
                            <ul
                                role="listbox"
                                aria-label="Domain options"
                                className={cn(
                                    "absolute top-full left-0 right-0 mt-2 z-[100]",
                                    "bg-background border border-white/[0.08] rounded-lg",
                                    "shadow-[0_10px_40px_rgba(0,0,0,0.3)]",
                                    "py-1 max-h-[240px] overflow-y-auto"
                                )}
                            >
                                {DOMAINS.map(domain => (
                                    <li
                                        key={domain}
                                        role="option"
                                        aria-selected={domainFilter === domain}
                                        onClick={() => {
                                            setDomainFilter(domain);
                                            setIsDomainDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "px-4 py-3 text-sm cursor-pointer flex items-center justify-between gap-2",
                                            "min-h-[44px] transition-colors",
                                            domainFilter === domain 
                                                ? "bg-primary/10 text-primary" 
                                                : "text-foreground hover:bg-white/[0.04]"
                                        )}
                                    >
                                        <span>
                                            {domain} {domain !== 'All Domains' && stats.domainCounts[domain] ? `(${stats.domainCounts[domain]})` : ''}
                                        </span>
                                        {domainFilter === domain && (
                                            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {(filter !== 'all' || domainFilter !== 'All Domains') && (
                        <button
                            onClick={() => { setFilter('all'); setDomainFilter('All Domains'); }}
                            className={cn(
                                "px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors",
                                "min-h-[44px] flex items-center justify-center",
                                "bg-white/[0.03] border border-white/[0.06]",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            )}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            <div className="hidden md:block">
                <div className={cn(cardClass, "overflow-hidden !p-0")}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left" role="table" aria-label="Customers list">
                            <thead className="bg-white/[0.02] text-muted-foreground border-b border-white/[0.06]">
                                <tr>
                                    <th scope="col" className="px-5 py-4 font-medium">Name</th>
                                    <th scope="col" className="px-5 py-4 font-medium">Email</th>
                                    <th scope="col" className="px-5 py-4 font-medium">Mobile</th>
                                    <th scope="col" className="px-5 py-4 font-medium">College</th>
                                    <th scope="col" className="px-5 py-4 font-medium">Plan</th>
                                    {filter === 'internship' && <th scope="col" className="px-5 py-4 font-medium">Domain</th>}
                                    <th scope="col" className="px-5 py-4 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0" aria-hidden="true">
                                                    {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-foreground">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                                <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                                <span className="truncate max-w-[200px]">{customer.email}</span>
                                            </a>
                                        </td>
                                        <td className="px-5 py-4">
                                            {customer.phone ? (
                                                <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                                    <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                                    {customer.phone}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground/40 text-xs">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "text-sm",
                                                customer.college ? 'text-foreground' : 'text-muted-foreground/40 text-xs'
                                            )}>
                                                {customer.college || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium",
                                                customer.latestPlan !== 'No Active Plan'
                                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                                    : 'bg-white/[0.03] text-muted-foreground border border-white/[0.06]'
                                            )}>
                                                {customer.latestPlan.length > 30 
                                                    ? customer.latestPlan.slice(0, 30) + '...' 
                                                    : customer.latestPlan}
                                            </span>
                                        </td>
                                        {filter === 'internship' && (
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                    {customer.domain}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-5 py-4 text-muted-foreground text-sm">
                                            <time dateTime={customer.created_at}>
                                                {new Date(customer.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </time>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <tr>
                                        <td colSpan={filter === 'internship' ? 7 : 6} className="px-5 py-12 text-center text-muted-foreground">
                                            No customers found matching the filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="md:hidden space-y-3 relative z-10" role="list" aria-label="Customers list">
                {filteredCustomers.map((customer) => (
                    <article key={customer.id} className={cn(cardClass, "!p-4 space-y-3")}>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0" aria-hidden="true">
                                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground">{customer.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{customer.college || 'No college'}</p>
                            </div>
                            <time dateTime={customer.created_at} className="text-xs text-muted-foreground">
                                {new Date(customer.created_at).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </time>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <a 
                                href={`mailto:${customer.email}`}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors min-h-[36px]"
                            >
                                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="truncate max-w-[150px]">{customer.email}</span>
                            </a>
                            {customer.phone && (
                                <a 
                                    href={`tel:${customer.phone}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors min-h-[36px]"
                                >
                                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                                    {customer.phone}
                                </a>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <span className={cn(
                                "inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium",
                                customer.latestPlan !== 'No Active Plan'
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'bg-white/[0.03] text-muted-foreground border border-white/[0.06]'
                            )}>
                                {customer.latestPlan.length > 25 
                                    ? customer.latestPlan.slice(0, 25) + '...' 
                                    : customer.latestPlan}
                            </span>
                            {filter === 'internship' && customer.domain && (
                                <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                    {customer.domain}
                                </span>
                            )}
                        </div>
                    </article>
                ))}
                {filteredCustomers.length === 0 && (
                    <div className={cn(cardClass, "!p-8 text-center text-muted-foreground")}>
                        No customers found matching the filters.
                    </div>
                )}
            </div>

            <p className="text-xs text-muted-foreground/60 text-center">
                Showing {filteredCustomers.length} of {customers.length} customers
            </p>
        </div>
    );
}
