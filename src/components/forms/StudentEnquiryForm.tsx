'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    EDUCATION_LEVELS,
    FIELDS_OF_INTEREST,
    StudentLeadFormData
} from '@/types/lead-types';
import { Send, CheckCircle2 } from 'lucide-react';

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
                    source_page: window.location.href,
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
                <h3 className="text-2xl font-bold text-foreground mb-2">Thank You! 🎉</h3>
                <p className="text-muted-foreground mb-6">
                    We&apos;ve received your enquiry and will contact you within 24 hours.
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
                        placeholder="Enter your full name"
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
                        placeholder="your.email@example.com"
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
                        placeholder="+91 98765 43210"
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
                        className={inputClass}
                    >
                        <option value="">Select your education level</option>
                        {EDUCATION_LEVELS.map(level => (
                            <option key={level} value={level}>{level}</option>
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
                        className={inputClass}
                    >
                        <option value="">Select your interest</option>
                        {FIELDS_OF_INTEREST.map(field => (
                            <option key={field} value={field}>{field}</option>
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
                        placeholder="e.g., Cybersecurity Internship"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="intake_year" className={labelClass}>Intake Year</label>
                    <select
                        id="intake_year"
                        name="intake_year"
                        value={formData.intake_year}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="">Select year</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="message" className={labelClass}>Message (Optional)</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your career goals or any specific questions..."
                    className={cn(inputClass, "resize-none")}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                    "w-full px-6 py-4 text-sm font-medium rounded-xl",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200",
                    "flex items-center justify-center gap-2"
                )}
            >
                {isSubmitting ? (
                    'Submitting...'
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Submit Enquiry
                    </>
                )}
            </button>

            <p className="text-xs text-muted-foreground/60 text-center">
                By submitting this form, you agree to receive communications from Zecurx.
            </p>
        </form>
    );
}
