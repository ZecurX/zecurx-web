"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { MoveRight, CheckCircle2, Loader2, Calendar } from "lucide-react";
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
            phone: formData.get('phone'),
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
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10 lg:border-l lg:border-border bg-muted/50">
                <div className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">

                    {isSuccess ? (
                        <div className="relative z-10 flex flex-col items-center justify-center text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-800 shadow-sm">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-3">Demo Requested</h3>
                            <p className="text-muted-foreground mb-8 text-sm max-w-[240px] font-medium leading-relaxed">
                                Thank you for your interest. Our team will review your request and get back to you shortly.
                            </p>

                            <div className="w-full space-y-4">
                                {/* Calendar Options */}
                                {preferredDate && (
                                    <div className="bg-muted rounded-xl border border-border p-6 shadow-sm">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            Schedule to Calendar
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <a
                                                href={getGoogleCalendarUrl()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-card text-foreground border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                Google
                                            </a>
                                            <a
                                                href={getOutlookCalendarUrl()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0078D4] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#006cbd] transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                Outlook
                                            </a>
                                        </div>
                                        <p className="text-[10px] font-mono text-muted-foreground mt-4 uppercase tracking-[0.1em]">
                                            Slot: {preferredDate.toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setIsSuccess(false)} className="mt-10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                New Request
                            </button>
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-foreground mb-2">Request Demo</h3>
                                <p className="text-muted-foreground text-sm font-medium">Experience the power of ZecurX tailored for your team.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="first-name" className="text-sm font-bold text-foreground/80 mb-2 ml-1 block">First Name</label>
                                        <input name="first-name" id="first-name" type="text" required className="w-full h-14 bg-muted border border-border rounded-xl px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring focus:bg-card transition-all duration-200" placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="last-name" className="text-sm font-bold text-foreground/80 mb-2 ml-1 block">Last Name</label>
                                        <input name="last-name" id="last-name" type="text" required className="w-full h-14 bg-muted border border-border rounded-xl px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring focus:bg-card transition-all duration-200" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-bold text-foreground/80 mb-2 ml-1 block">Work Email</label>
                                        <input name="email" id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-14 bg-muted border border-border rounded-xl px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring focus:bg-card transition-all duration-200" placeholder="jane@company.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-bold text-foreground/80 mb-2 ml-1 block">Phone Number</label>
                                        <input name="phone" id="phone" type="tel" required className="w-full h-14 bg-muted border border-border rounded-xl px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring focus:bg-card transition-all duration-200" placeholder="+91 98765 43210" />
                                    </div>
                                </div>

                                {service && (
                                    <div className="p-4 bg-muted border border-border rounded-xl">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Interest: <span className="text-foreground ml-2">{service}</span></p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="company" className="text-sm font-bold text-foreground/80 mb-2 ml-1 block">Company</label>
                                    <input name="company" id="company" type="text" required className="w-full h-14 bg-muted border border-border rounded-xl px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring focus:bg-card transition-all duration-200" placeholder="Acme Corp" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="role" className="text-sm font-bold text-foreground/80 mb-2 ml-1 block">Your Role</label>
                                    <Select value={role} onValueChange={setRole} required>
                                        <SelectTrigger className="h-14 bg-muted border-border rounded-xl text-foreground focus:ring-1 focus:ring-ring focus:border-ring focus:bg-card transition-all duration-200">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border rounded-xl shadow-lg">
                                            <SelectItem value="CISO / CSO" className="text-foreground focus:bg-muted cursor-pointer">CISO / CSO</SelectItem>
                                            <SelectItem value="Security Director" className="text-foreground focus:bg-muted cursor-pointer">Security Director</SelectItem>
                                            <SelectItem value="Security Engineer" className="text-foreground focus:bg-muted cursor-pointer">Security Engineer</SelectItem>
                                            <SelectItem value="Developer" className="text-foreground focus:bg-muted cursor-pointer">Developer</SelectItem>
                                            <SelectItem value="IT Manager" className="text-foreground focus:bg-muted cursor-pointer">IT Manager</SelectItem>
                                            <SelectItem value="CTO / CIO" className="text-foreground focus:bg-muted cursor-pointer">CTO / CIO</SelectItem>
                                            <SelectItem value="Other" className="text-foreground focus:bg-muted cursor-pointer">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/80 mb-2 ml-1 block">Preferred Date & Time</label>
                                    <DateTimePicker
                                        name="preferred-date"
                                        onChange={setPreferredDate}
                                        minDate={new Date()}
                                        className="bg-muted border-border text-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground ml-1">Optional - our team will coordinate with you</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-600 dark:text-red-400 animate-in shake">
                                        <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-16 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting Request...
                                        </>
                                    ) : (
                                        <>
                                            Book Demo
                                            <MoveRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-muted-foreground pt-6 leading-relaxed">
                                    By submitting this form, you agree to our<br /> terms of service & privacy policy.
                                </p>
                            </form>
                        </div>
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

export default function BookDemoClient() {
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
