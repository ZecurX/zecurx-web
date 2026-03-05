'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    EDUCATION_LEVELS,
    FIELDS_OF_INTEREST,
    StudentLeadFormData
} from '@/types/lead-types';
import { Send, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function StudentEnquiryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<StudentLeadFormData>({
        full_name: '',
        email: '',
        phone: '',
        current_education: '',
        field_of_interest: '',
        preferred_course: '',
        intake_year: '',
        message: '',
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
            const response = await fetch('/api/leads/student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    lead_source: 'Website Form',
                    source_page: typeof window !== 'undefined' ? window.location.href : '',
                    enquiry_type: 'Student Enquiry',
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
        "bg-muted border border-border",
        "text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring focus:bg-card",
        "transition-all duration-200"
    );

    const labelClass = "block text-sm font-bold text-foreground/80 mb-2 ml-1";

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-8 bg-card border border-border rounded-[2.5rem] shadow-xl"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Application Received</h3>
                <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                    Thank you for your interest. Our academic counselors will review your application and contact you shortly.
                </p>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                            full_name: '',
                            email: '',
                            phone: '',
                            current_education: '',
                            field_of_interest: '',
                            preferred_course: '',
                            intake_year: '',
                            message: '',
                        });
                    }}
                    className="h-14 px-8 text-sm font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    Submit Another Application
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-12 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            {error && (
                <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm font-bold">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Personal Profile</h4>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="full_name" className={labelClass}>Full Name *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder="Full Name"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClass}>Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="current_education" className={labelClass}>Current Education *</label>
                        <select
                            id="current_education"
                            name="current_education"
                            value={formData.current_education}
                            onChange={handleChange}
                            required
                            className={cn(inputClass, "appearance-none bg-muted")}
                        >
                            <option value="" className="text-muted-foreground">Select level</option>
                            {EDUCATION_LEVELS.map(level => (
                                <option key={level} value={level} className="text-foreground">{level}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="field_of_interest" className={labelClass}>Field of Interest *</label>
                        <select
                            id="field_of_interest"
                            name="field_of_interest"
                            value={formData.field_of_interest}
                            onChange={handleChange}
                            required
                            className={cn(inputClass, "appearance-none bg-muted")}
                        >
                            <option value="" className="text-muted-foreground">Select interest</option>
                            {FIELDS_OF_INTEREST.map(field => (
                                <option key={field} value={field} className="text-foreground">{field}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="preferred_course" className={labelClass}>Preferred Course</label>
                        <input
                            type="text"
                            id="preferred_course"
                            name="preferred_course"
                            value={formData.preferred_course}
                            onChange={handleChange}
                            placeholder="e.g. SOC Analyst"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="intake_year" className={labelClass}>Preferred Intake Year</label>
                        <select
                            id="intake_year"
                            name="intake_year"
                            value={formData.intake_year}
                            onChange={handleChange}
                            className={cn(inputClass, "appearance-none bg-muted")}
                        >
                            <option value="" className="text-muted-foreground">Select year</option>
                            <option value="2025" className="text-foreground">2025</option>
                            <option value="2026" className="text-foreground">2026</option>
                            <option value="2027" className="text-foreground">2027</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label htmlFor="message" className={labelClass}>Additional Information</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your career goals and expectations..."
                    className={cn(inputClass, "h-32 resize-none pt-4")}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                    "w-full h-14 text-sm font-bold rounded-xl",
                    "bg-foreground text-background",
                    "hover:bg-foreground/90 active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-300",
                    "flex items-center justify-center gap-3",
                    "shadow-lg hover:shadow-xl"
                )}
            >
                {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Submit Application
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span>Secure and encrypted transmission</span>
            </div>
        </form>
    );
}
