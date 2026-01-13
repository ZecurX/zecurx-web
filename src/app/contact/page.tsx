"use client";

import React, { useState } from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { Mail, MapPin, Phone, Loader2, CheckCircle2, Send, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/DateTimePicker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [subject, setSubject] = useState('');
    const [preferredDate, setPreferredDate] = useState<Date | null>(null);

    // Calendar Event Generators
    const getGoogleCalendarUrl = () => {
        if (!preferredDate) return '#';
        const start = preferredDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = new Date(preferredDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const title = encodeURIComponent("ZecurX Meeting");
        const details = encodeURIComponent("Meeting with ZecurX Team.");
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
    };

    const getOutlookCalendarUrl = () => {
        if (!preferredDate) return '#';
        const start = preferredDate.toISOString();
        const end = new Date(preferredDate.getTime() + 60 * 60 * 1000).toISOString();
        const title = encodeURIComponent("ZecurX Meeting");
        const details = encodeURIComponent("Meeting with ZecurX Team.");
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&startdt=${start}&enddt=${end}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: subject,
            message: formData.get('message'),
            preferredDate: preferredDate ? preferredDate.toISOString() : null,
            formType: 'contact'
        };

        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
            setSubject('');
        } catch {
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: Mail,
            title: "Email",
            value: "official@zecurx.com",
            href: "mailto:official@zecurx.com",
        },
        {
            icon: Phone,
            title: "Phone",
            value: "+91 7488813601",
            href: "tel:+917488813601",
        },
        {
            icon: MapPin,
            title: "Office",
            value: "Bengaluru, India",
            href: null,
        }
    ];

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30">
            <CreativeNavBar />

            <section className="w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Content */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold tracking-tight text-foreground">
                                Contact Us
                            </h1>
                            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-md">
                                We help enterprises secure their digital assets. Reach out to discuss how we can help you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="h-px w-full bg-border" />

                            <div className="grid gap-8">
                                {contactMethods.map((method) => (
                                    <div key={method.title} className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background group-hover:border-primary/50 transition-colors">
                                            <method.icon className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium block mb-1">
                                                {method.title}
                                            </span>
                                            {method.href ? (
                                                <Link
                                                    href={method.href}
                                                    className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                                                >
                                                    {method.value}
                                                </Link>
                                            ) : (
                                                <span className="text-lg font-medium text-foreground">{method.value}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-muted/5 border border-border rounded-2xl p-8 lg:p-10">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center text-center py-12">
                                <CheckCircle2 className="w-12 h-12 text-foreground mb-4" />
                                <h3 className="text-xl font-medium mb-2">Message Sent</h3>
                                <p className="text-muted-foreground mb-8">
                                    We&apos;ll get back to you shortly.
                                </p>

                                {/* Calendar Options */}
                                {preferredDate && (
                                    <div className="w-full bg-muted/30 rounded-2xl p-6 border border-border/50 mb-6">
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

                                <Button
                                    onClick={() => {
                                        setIsSuccess(false);
                                        setPreferredDate(null);
                                    }}
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    Send Another
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                                    <input
                                        name="name"
                                        id="name"
                                        type="text"
                                        required
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                                    <input
                                        name="email"
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-all"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
                                    <Select value={subject} onValueChange={setSubject} required>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Select a topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sales Inquiry">Sales Inquiry</SelectItem>
                                            <SelectItem value="Technical Support">Technical Support</SelectItem>
                                            <SelectItem value="Partnership">Partnership</SelectItem>
                                            <SelectItem value="Media / Press">Media / Press</SelectItem>
                                            <SelectItem value="Schedule a Call">Schedule a Call</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred Date &amp; Time (Optional)</label>
                                    <DateTimePicker 
                                        name="preferred-date"
                                        onChange={setPreferredDate}
                                    />
                                    <p className="text-xs text-muted-foreground/60">Select if you&apos;d like to schedule a call</p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        required
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-all resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium text-base transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
