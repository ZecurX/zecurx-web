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
import { Send, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

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
                    source_page: typeof window !== 'undefined' ? window.location.href : '',
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
        "w-full h-14 px-5 py-3 text-sm rounded-xl font-medium",
        "bg-gray-50 border border-gray-200",
        "text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white",
        "transition-all duration-200"
    );

    const labelClass = "block text-sm font-bold text-gray-700 mb-2 ml-1";

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-8 bg-white border border-gray-200 rounded-[2.5rem] shadow-xl"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Request Received</h3>
                <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Our team will review your requirements and get back to you within 24 business hours.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="h-14 px-8 text-sm font-bold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    Back to Form
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-12 bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            {error && (
                <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm font-bold">
                    {error}
                </div>
            )}

            {/* Contact Information */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Contact Information</h4>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="contact_person_name" className={labelClass}>Contact Person *</label>
                        <input type="text" id="contact_person_name" name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} required placeholder="Enter full name" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="designation" className={labelClass}>Designation *</label>
                        <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g. CTO / Product Manager" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelClass}>Work Email *</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@company.com" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Include country code" className={inputClass} />
                    </div>
                </div>
            </div>

            {/* Company Information */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Company Profile</h4>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="company_name" className={labelClass}>Company Name *</label>
                        <input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Enterprise Name" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="company_website" className={labelClass}>Company Website</label>
                        <input type="url" id="company_website" name="company_website" value={formData.company_website} onChange={handleChange} placeholder="https://www.example.com" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="industry" className={labelClass}>Industry *</label>
                        <select id="industry" name="industry" value={formData.industry} onChange={handleChange} required className={cn(inputClass, "appearance-none bg-grey-50")}>
                            <option value="" className="text-gray-500">Select industry</option>
                            {INDUSTRIES.map(industry => (<option key={industry} value={industry} className="text-gray-900">{industry}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="company_size" className={labelClass}>Company Size *</label>
                        <select id="company_size" name="company_size" value={formData.company_size} onChange={handleChange} required className={cn(inputClass, "appearance-none bg-grey-50")}>
                            <option value="" className="text-gray-500">Select size</option>
                            {COMPANY_SIZES.map(size => (<option key={size} value={size} className="text-gray-900">{size} employees</option>))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Service Requirements */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Service Requirements</h4>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="service_type" className={labelClass}>Service Type *</label>
                        <select id="service_type" name="service_type" value={formData.service_type} onChange={handleChange} required className={cn(inputClass, "appearance-none bg-grey-50")}>
                            <option value="" className="text-gray-500">Select service</option>
                            {SERVICE_TYPES.map(type => (<option key={type} value={type} className="text-gray-900">{type}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="budget_range" className={labelClass}>Budget Range</label>
                        <select id="budget_range" name="budget_range" value={formData.budget_range} onChange={handleChange} className={cn(inputClass, "appearance-none bg-grey-50")}>
                            <option value="" className="text-gray-500">Select budget</option>
                            {BUDGET_RANGES.map(range => (<option key={range} value={range} className="text-gray-900">{range}</option>))}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Project Urgency *</label>
                        <div className="grid grid-cols-3 gap-3">
                            {URGENCY_LEVELS.map(level => (
                                <label key={level} className={cn(
                                    "h-12 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center cursor-pointer transition-all duration-300 border",
                                    formData.urgency === level
                                        ? "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                                        : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white hover:border-gray-300"
                                )}>
                                    <input type="radio" name="urgency" value={level} checked={formData.urgency === level} onChange={handleChange} className="sr-only" />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label htmlFor="requirements" className={labelClass}>Project Brief</label>
                <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows={4} placeholder="Describe your requirements and security goals..." className={cn(inputClass, "h-32 resize-none pt-4")} />
            </div>

            <button type="submit" disabled={isSubmitting} className={cn(
                "w-full h-14 text-sm font-bold rounded-xl",
                "bg-zinc-900 text-white",
                "hover:bg-zinc-800 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-300",
                "flex items-center justify-center gap-3",
                "shadow-lg hover:shadow-xl"
            )}>
                {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                    <><Send className="w-5 h-5" /> Send Request</>
                )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                <Shield className="w-3 h-3 text-gray-400" />
                <span>Your details are protected by enterprise-grade security</span>
            </div>
        </form>
    );
}
