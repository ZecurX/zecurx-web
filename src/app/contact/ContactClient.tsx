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
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">

                        {isSuccess ? (
                            <div className="relative z-10 flex flex-col items-center justify-center text-center py-12">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent</h3>
                                <p className="text-gray-500 mb-10 max-w-[280px] font-medium leading-relaxed">
                                    Thank you for reaching out. Our team will review your message and get back to you shortly.
                                </p>

                                {/* Calendar Options */}
                                {preferredDate && (
                                    <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-10 shadow-sm">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            Sync with Calendar
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <a
                                                href={getGoogleCalendarUrl()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                Google
                                            </a>
                                            <a
                                                href={getOutlookCalendarUrl()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0078D4] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#006cbd] transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                Outlook
                                            </a>
                                        </div>
                                        <p className="text-[10px] font-mono text-gray-400 mt-4 uppercase tracking-[0.1em]">
                                            Scheduled: {preferredDate.toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={() => {
                                        setIsSuccess(false);
                                        setPreferredDate(null);
                                    }}
                                    variant="outline"
                                    className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-bold uppercase tracking-widest px-8 shadow-sm"
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-bold text-gray-700 mb-2 ml-1 block">Full Name</label>
                                            <input
                                                name="name"
                                                id="name"
                                                type="text"
                                                required
                                                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all duration-200"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-bold text-gray-700 mb-2 ml-1 block">Work Email</label>
                                            <input
                                                name="email"
                                                id="email"
                                                type="email"
                                                required
                                                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all duration-200"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-bold text-gray-700 mb-2 ml-1 block">Inquiry Type</label>
                                        <Select value={subject} onValueChange={setSubject} required>
                                            <SelectTrigger className="h-14 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all duration-200">
                                                <SelectValue placeholder="Select a topic" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg">
                                                {/* Select Items need to be generic to avoid TS errors if I assume generic SelectItem content */}
                                                <SelectItem value="Sales Inquiry" className="text-gray-900 focus:bg-gray-50 cursor-pointer">Sales Inquiry</SelectItem>
                                                <SelectItem value="Seminar Booking" className="text-gray-900 focus:bg-gray-50 cursor-pointer">Seminar Booking</SelectItem>
                                                <SelectItem value="Technical Support" className="text-gray-900 focus:bg-gray-50 cursor-pointer">Technical Support</SelectItem>
                                                <SelectItem value="Partnership" className="text-gray-900 focus:bg-gray-50 cursor-pointer">Partnership</SelectItem>
                                                <SelectItem value="Media / Press" className="text-gray-900 focus:bg-gray-50 cursor-pointer">Media / Press</SelectItem>
                                                <SelectItem value="Schedule a Call" className="text-gray-900 focus:bg-gray-50 cursor-pointer">Schedule a Call</SelectItem>
                                                <SelectItem value="Other" className="text-gray-900 focus:bg-gray-50 cursor-pointer">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 mb-2 ml-1 block">Preferred Date & Time (Optional)</label>
                                        <DateTimePicker
                                            name="preferred-date"
                                            onChange={setPreferredDate}
                                            className="bg-gray-50 border-gray-200 text-gray-900"
                                        />
                                        <p className="text-xs text-gray-500 ml-1">Select if you&apos;d like to schedule a call with our team</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-bold text-gray-700 mb-2 ml-1 block">Message</label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            rows={4}
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all duration-200 resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-600 animate-in shake">
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
