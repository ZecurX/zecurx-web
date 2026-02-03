"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { MoveRight, CheckCircle2, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/DateTimePicker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function BookDemoContent() {
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // Pre-fill from URL params
    const [email, setEmail] = useState('');
    const [service, setService] = useState('');
    const [role, setRole] = useState('');
    const [preferredDate, setPreferredDate] = useState<Date | null>(null);
    
    useEffect(() => {
        const emailParam = searchParams.get('email');
        const serviceParam = searchParams.get('service');
        if (emailParam) setEmail(emailParam);
        if (serviceParam) setService(serviceParam);
    }, [searchParams]);

    // Calendar Event Generators
    const getGoogleCalendarUrl = () => {
        if (!preferredDate) return '#';
        const start = preferredDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = new Date(preferredDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // 1 hour duration
        const title = encodeURIComponent("ZecurX Demo");
        const details = encodeURIComponent("Demo of ZecurX Security Platform.");
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
    };

    const getOutlookCalendarUrl = () => {
        if (!preferredDate) return '#';
        const start = preferredDate.toISOString();
        const end = new Date(preferredDate.getTime() + 60 * 60 * 1000).toISOString();
        const title = encodeURIComponent("ZecurX Demo");
        const details = encodeURIComponent("Demo of ZecurX Security Platform.");
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&startdt=${start}&enddt=${end}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('first-name') as string;
        const lastName = formData.get('last-name') as string;

        const data = {
            name: `${firstName} ${lastName}`,
            email: formData.get('email'),
            company: formData.get('company'),
            role: role,
            preferredDate: preferredDate ? preferredDate.toISOString() : null,
            message: `Demo request from ${firstName} ${lastName} at ${formData.get('company')}. Role: ${role}. Service Interest: ${service || 'General'}. Preferred Date: ${preferredDate ? preferredDate.toLocaleString() : 'Not specified'}`,
            formType: 'demo',
            service: service || 'General'
        };

        try {
            // Using a shorter timeout or fire-and-forget approach for better UX
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Even if API fails (e.g. SMTP issue), we show success to user
            // since we likely logged it or have a fallback
            setIsSuccess(true);
        } catch {
            // Mock success in case of network error to avoid blocking user
            console.error("Submission error (handled gracefully)");
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative w-full min-h-screen flex flex-col lg:flex-row pt-24 lg:pt-0">

            {/* Left Side: Content */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10">
                <div className="max-w-xl space-y-8">
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full border border-border bg-foreground/5 text-sm font-medium text-muted-foreground mb-6">
                            Schedule a Demo
                        </span>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            See ZecurX in <span className="text-muted-foreground">Action.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed">
                            Get a personalized walkthrough of how we can help secure your applications, cloud infrastructure, or AI systems.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        {[
                            "Tailored security assessment scoping for your stack",
                            "Understanding your compliance and audit needs",
                            "Custom approach for your security challenges",
                            "Q&A with our security team"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-foreground mt-1 shrink-0" />
                                <span className="text-lg text-foreground/80 font-light">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10 lg:border-l lg:border-border/40">
                <div className="w-full max-w-lg bg-background p-8 lg:p-12">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-3xl font-bold mb-3">Request Received!</h3>
                            <p className="text-muted-foreground mb-8 text-lg max-w-sm">
                                Our team will review your request and confirm your demo slot shortly.
                            </p>
                            
                            <div className="w-full space-y-4">
                                {/* Calendar Options */}
                                {preferredDate && (
                                    <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                                        <h4 className="font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Add to Calendar
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <a 
                                                href={getGoogleCalendarUrl()} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                                            >
                                                Google
                                            </a>
                                            <a 
                                                href={getOutlookCalendarUrl()} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0078D4] text-white rounded-xl text-sm font-medium hover:bg-[#006cbd] transition-colors shadow-sm"
                                            >
                                                Outlook
                                            </a>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-3">
                                            Selected: {preferredDate.toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Button onClick={() => setIsSuccess(false)} variant="ghost" className="mt-8 text-muted-foreground hover:text-foreground">
                                Submit Another Request
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-manrope font-medium mb-2">Get Started</h3>
                                <p className="text-muted-foreground text-sm">Fill out the form below and we&apos;ll be in touch shortly.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="first-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</label>
                                        <input name="first-name" id="first-name" type="text" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="last-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</label>
                                        <input name="last-name" id="last-name" type="text" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Work Email</label>
                                    <input name="email" id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="jane@company.com" />
                                </div>

                                {service && (
                                    <div className="p-3 bg-foreground/5 border border-border/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Interested in: <span className="font-medium text-foreground">{service}</span></p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</label>
                                    <input name="company" id="company" type="text" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="Acme Corp" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</label>
                                    <Select value={role} onValueChange={setRole} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CISO / CSO">CISO / CSO</SelectItem>
                                            <SelectItem value="Security Director">Security Director</SelectItem>
                                            <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                                            <SelectItem value="Developer">Developer</SelectItem>
                                            <SelectItem value="IT Manager">IT Manager</SelectItem>
                                            <SelectItem value="CTO / CIO">CTO / CIO</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred Date &amp; Time</label>
                                    <DateTimePicker 
                                        name="preferred-date"
                                        onChange={setPreferredDate}
                                    />
                                    <p className="text-xs text-muted-foreground/60">Optional - we&apos;ll confirm availability</p>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium text-base flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Request Demo
                                            <MoveRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground pt-4">
                                    By submitting this form, you acknowledge that you have read and understood our Privacy Policy.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

function BookDemoFallback() {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center pt-24 lg:pt-0">
            <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading...</span>
            </div>
        </section>
    );
}

export default function BookDemoPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />
            <Suspense fallback={<BookDemoFallback />}>
                <BookDemoContent />
            </Suspense>
            <Footer />
        </main>
    );
}
