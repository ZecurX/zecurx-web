'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    COMPANY_SIZES,
    INDUSTRIES,
    SERVICE_TYPES,
    BUDGET_RANGES,
    URGENCY_LEVELS,
    EnterpriseLeadFormData
} from '@/types/lead-types';
import { Building2, Send, CheckCircle2 } from 'lucide-react';

export function EnterpriseEnquiryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<EnterpriseLeadFormData>({
        contact_person_name: '',
        email: '',
        phone: '',
        company_name: '',
        company_website: '',
        company_size: '',
        industry: '',
        designation: '',
        service_type: '',
        budget_range: '',
        urgency: 'MEDIUM',
        requirements: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/leads/enterprise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    lead_source: 'Website Form',
                    source_page: window.location.href,
                    enquiry_type: 'Enterprise Enquiry',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit form');
            }

            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = cn(
        "w-full px-4 py-3 text-sm rounded-xl",
        "bg-white/[0.05] border border-white/[0.1]",
        "text-foreground placeholder:text-muted-foreground/50",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
        "transition-all duration-200"
    );

    const labelClass = "block text-sm font-medium text-foreground mb-2";

    if (isSuccess) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Thank You! 💼</h3>
                <p className="text-muted-foreground mb-6">
                    Our enterprise team will contact you within 24 hours to discuss your requirements.
                </p>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                            contact_person_name: '',
                            email: '',
                            phone: '',
                            company_name: '',
                            company_website: '',
                            company_size: '',
                            industry: '',
                            designation: '',
                            service_type: '',
                            budget_range: '',
                            urgency: 'MEDIUM',
                            requirements: '',
                        });
                    }}
                    className="px-6 py-3 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                    Submit Another Enquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* Contact Information */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">1</span>
                    Contact Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="contact_person_name" className={labelClass}>Contact Person *</label>
                        <input type="text" id="contact_person_name" name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="designation" className={labelClass}>Designation *</label>
                        <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g., CTO, IT Manager" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelClass}>Work Email *</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@company.com" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className={inputClass} />
                    </div>
                </div>
            </div>

            {/* Company Information */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">2</span>
                    Company Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="company_name" className={labelClass}>Company Name *</label>
                        <input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Your company name" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="company_website" className={labelClass}>Company Website</label>
                        <input type="url" id="company_website" name="company_website" value={formData.company_website} onChange={handleChange} placeholder="https://yourcompany.com" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="industry" className={labelClass}>Industry *</label>
                        <select id="industry" name="industry" value={formData.industry} onChange={handleChange} required className={inputClass}>
                            <option value="">Select industry</option>
                            {INDUSTRIES.map(industry => (<option key={industry} value={industry}>{industry}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="company_size" className={labelClass}>Company Size *</label>
                        <select id="company_size" name="company_size" value={formData.company_size} onChange={handleChange} required className={inputClass}>
                            <option value="">Select size</option>
                            {COMPANY_SIZES.map(size => (<option key={size} value={size}>{size} employees</option>))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Service Requirements */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">3</span>
                    Service Requirements
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="service_type" className={labelClass}>Service Type *</label>
                        <select id="service_type" name="service_type" value={formData.service_type} onChange={handleChange} required className={inputClass}>
                            <option value="">Select service</option>
                            {SERVICE_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="budget_range" className={labelClass}>Budget Range</label>
                        <select id="budget_range" name="budget_range" value={formData.budget_range} onChange={handleChange} className={inputClass}>
                            <option value="">Select budget</option>
                            {BUDGET_RANGES.map(range => (<option key={range} value={range}>{range}</option>))}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="urgency" className={labelClass}>Project Urgency</label>
                        <div className="flex flex-wrap gap-2">
                            {URGENCY_LEVELS.map(level => (
                                <label key={level} className={cn(
                                    "flex-1 min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium text-center cursor-pointer transition-all",
                                    formData.urgency === level
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-white/[0.05] border border-white/[0.1] text-muted-foreground hover:text-foreground hover:bg-white/[0.08]"
                                )}>
                                    <input type="radio" name="urgency" value={level} checked={formData.urgency === level} onChange={handleChange} className="sr-only" />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="requirements" className={labelClass}>Project Requirements</label>
                <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows={4} placeholder="Please describe your requirements, goals, and any specific challenges you're facing..." className={cn(inputClass, "resize-none")} />
            </div>

            <button type="submit" disabled={isSubmitting} className={cn(
                "w-full px-6 py-4 text-sm font-medium rounded-xl",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200",
                "flex items-center justify-center gap-2"
            )}>
                {isSubmitting ? 'Submitting...' : (<><Send className="w-4 h-4" />Request Consultation</>)}
            </button>

            <p className="text-xs text-muted-foreground/60 text-center">
                Your information is secure and will only be used to contact you regarding your enquiry.
            </p>
        </form>
    );
}
