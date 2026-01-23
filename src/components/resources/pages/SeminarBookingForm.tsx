"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, CheckCircle2, AlertCircle, Shield, Award, BookOpen } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DateTimePicker from "@/components/ui/DateTimePicker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CDN_BASE = "https://zexc.in-maa-1.linodeobjects.com/partners";

const partnerLogos = [
    { name: "RIBS", light: `${CDN_BASE}/ribs.png`, dark: `${CDN_BASE}/ribs.png` },
    { name: "Sapthagiri", light: `${CDN_BASE}/sapthagiri.png`, dark: `${CDN_BASE}/sapthagiri.png` },
    { name: "IIBS", light: `${CDN_BASE}/iibs-logo-02.png`, dark: `${CDN_BASE}/iibs-logo-02.png` },
    { name: "Mount Carmel", light: `${CDN_BASE}/250px-mount_carmel_college_bangalore_logo.png`, dark: `${CDN_BASE}/250px-mount_carmel_college_bangalore_logo.png` },
];

const testimonials = [
    {
        quote: "The ZecurX seminar on Zero Trust Architecture was a game-changer for our students.",
        name: "Dr. Rajesh Kumar",
        role: "HOD, Computer Science",
        org: "MSRIT",
        initials: "RK"
    },
    {
        quote: "An exceptional session covering Generative AI vulnerabilities. Exactly what our learners needed.",
        name: "Prof. Vikram Singh",
        role: "Dean of Technology",
        org: "Presidency University",
        initials: "VS"
    },
    {
        quote: "Our students gained practical skills in ethical hacking that went far beyond the curriculum.",
        name: "Fr. Thomas",
        role: "Principal",
        org: "St. Paul's College",
        initials: "FT"
    },
    {
        quote: "ZecurX brought industry-standard cybersecurity training to our campus. Eye-opening!",
        name: "Dr. Anjali Menon",
        role: "Director",
        org: "RIBS",
        initials: "AM"
    },
    {
        quote: "The depth of knowledge shared during the cyber defense workshop was outstanding.",
        name: "Prof. Suresh Gowda",
        role: "Placement Officer",
        org: "MSRCASC",
        initials: "SG"
    },
    {
        quote: "A comprehensive deep dive into cybersecurity with real-world case studies.",
        name: "Dr. Farhan Ahmed",
        role: "HOD, IT",
        org: "Yenepoya University",
        initials: "FA"
    },
    {
        quote: "The seminar on application security provided critical skills for future careers.",
        name: "Prof. Lakshmi Narayan",
        role: "Principal",
        org: "Nagarjuna Degree College",
        initials: "LN"
    },
    {
        quote: "Excellent training on information security. The practical approach was invaluable.",
        name: "Dr. R. K. Mishra",
        role: "Director",
        org: "IIBS",
        initials: "RM"
    },
];

const bookingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email address"),
    organization: z.string().min(2, "Organization name is required"),
    type: z.enum(["college", "corporate", "keynote"]),
    topic: z.enum([
        "Generative AI Security & Defense",
        "Ransomware Response & Resilience",
        "Zero Trust Network Architecture",
        "Cloud Security Posture (CSPM)",
        "API Security & DevSecOps",
        "Ethical Hacking & Red Teaming",
        "Offensive Security",
        "Technological Awareness",
        "Other"
    ]),
    attendees: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Please enter a valid number of attendees",
    }),
    date: z.string().optional(),
    message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
    privacyPolicy: z.boolean().refine(val => val === true, {
        message: "You must accept the privacy policy to continue"
    }),
    marketingConsent: z.boolean().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function SeminarBookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preferredDate, setPreferredDate] = useState<Date | null>(null);
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    // Auto-rotate testimonials every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            name: "",
            email: "",
            organization: "",
            attendees: "",
            message: "",
            privacyPolicy: false,
            marketingConsent: false
        },
    });

    const handleDateChange = (date: Date | null) => {
        setPreferredDate(date);
        setValue("date", date ? date.toISOString() : "");
    };

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formType: 'seminar_booking',
                    name: data.name,
                    email: data.email,
                    organization: data.organization,
                    seminarType: data.type,
                    topic: data.topic,
                    attendees: data.attendees,
                    preferredDate: data.date || null,
                    message: data.message || '',
                    marketingConsent: data.marketingConsent || false,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit booking request');
            }

            setIsSuccess(true);
            setPreferredDate(null);
            reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-4xl mx-auto p-12 rounded-[2rem] bg-card border border-border text-center shadow-2xl flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Request Confirmed</h3>
                <p className="text-muted-foreground mb-10 max-w-lg text-lg">
                    Thank you for choosing ZecurX. Our training coordinators will review your requirements and send a customized proposal within 24 hours.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="rounded-full h-12 px-8 border-foreground/20 hover:bg-foreground/5"
                >
                    Submit Another Request
                </Button>
            </div>
        );
    }

    return (
        <section className="pt-32 pb-12 md:pt-40 md:pb-24 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Context & Benefits */}
                    <div className="lg:col-span-2 lg:sticky lg:top-32 space-y-12 relative">

                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                                Secure Your <br />
                                <span className="text-muted-foreground">Session.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Empower your institution with industry-leading cybersecurity training. From hands-on red teaming to executive briefings.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                {
                                    icon: Shield,
                                    title: "Industry-Standard Labs",
                                    desc: "Access to ZecurX Cyber Range for real-world attack simulation."
                                },
                                {
                                    icon: Award,
                                    title: "Certified Instructors",
                                    desc: "Led by active penetration testers and security architects."
                                },
                                {
                                    icon: BookOpen,
                                    title: "Custom Curriculum",
                                    desc: "Tailored modules covering Web, Cloud, AI, and Network security."
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors shadow-sm">
                                        <item.icon className="w-6 h-6 text-foreground/80 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-border/50">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {partnerLogos.map((partner, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-white overflow-hidden flex items-center justify-center p-1">
                                            <Image
                                                src={partner.light}
                                                alt={partner.name}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-contain dark:hidden"
                                                unoptimized
                                            />
                                            <Image
                                                src={partner.dark}
                                                alt={partner.name}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-contain hidden dark:block"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold text-foreground block">100+ Sessions</span>
                                    <span className="text-muted-foreground">Delivering sessions across Bengaluru</span>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial - Auto-rotating */}
                        <div className="pt-8 border-t border-border/50">
                            <div className="rounded-2xl bg-muted/30 border border-border p-6 relative overflow-hidden min-h-[140px]">
                                <div className="absolute -top-1 left-4 text-4xl font-serif text-primary/60 select-none">
                                    &ldquo;
                                </div>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={testimonialIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">
                                            {testimonials[testimonialIndex].quote}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {testimonials[testimonialIndex].initials}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground text-sm">{testimonials[testimonialIndex].name}</div>
                                                <div className="text-xs text-muted-foreground">{testimonials[testimonialIndex].role} • {testimonials[testimonialIndex].org}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: The Form */}
                    <div className="lg:col-span-3 bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 relative overflow-hidden">

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Dr. John Doe"
                                        {...register("name")}
                                        className={`h-14 rounded-xl bg-background border-border/60 focus:border-primary/50 transition-all ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-medium ml-1">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-base font-medium">Work Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@university.edu"
                                        {...register("email")}
                                        className={`h-14 rounded-xl bg-background border-border/60 focus:border-primary/50 transition-all ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="organization" className="text-base font-medium">Organization / University</Label>
                                <Input
                                    id="organization"
                                    placeholder="e.g. MSRIT or TechCorp Solutions"
                                    {...register("organization")}
                                    className={`h-14 rounded-xl bg-background border-border/60 focus:border-primary/50 transition-all ${errors.organization ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                />
                                {errors.organization && <p className="text-xs text-red-500 font-medium ml-1">{errors.organization.message}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="type" className="text-base font-medium">Seminar Type</Label>
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className={`h-14 rounded-xl bg-background border-border/60 focus:ring-primary/20 ${errors.type ? "border-red-500" : ""}`}>
                                                    <SelectValue placeholder="Select type..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="college">College Workshop (Hands-on)</SelectItem>
                                                    <SelectItem value="corporate">Corporate Training (Awareness)</SelectItem>
                                                    <SelectItem value="keynote">Keynote / Guest Speaker</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.type && <p className="text-xs text-red-500 font-medium ml-1">{errors.type.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="attendees" className="text-base font-medium">Expected Attendees</Label>
                                    <Input
                                        id="attendees"
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 150"
                                        {...register("attendees")}
                                        className={`h-14 rounded-xl bg-background border-border/60 focus:border-primary/50 transition-all ${errors.attendees ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    />
                                    {errors.attendees && <p className="text-xs text-red-500 font-medium ml-1">{errors.attendees.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="date" className="text-base font-medium">Preferred Date & Time</Label>
                                <DateTimePicker
                                    name="preferred-date"
                                    onChange={handleDateChange}
                                />
                                <p className="text-xs text-muted-foreground/60">Optional - we&apos;ll confirm availability</p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="topic" className="text-base font-medium">Topic of Interest</Label>
                                <Controller
                                    name="topic"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className={`h-14 rounded-xl bg-background border-border/60 focus:ring-primary/20 ${errors.topic ? "border-red-500" : ""}`}>
                                                <SelectValue placeholder="Select a topic..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Generative AI Security & Defense">Generative AI Security & Defense</SelectItem>
                                                <SelectItem value="Ransomware Response & Resilience">Ransomware Response & Resilience</SelectItem>
                                                <SelectItem value="Zero Trust Network Architecture">Zero Trust Network Architecture</SelectItem>
                                                <SelectItem value="Cloud Security Posture (CSPM)">Cloud Security Posture (CSPM)</SelectItem>
                                                <SelectItem value="API Security & DevSecOps">API Security & DevSecOps</SelectItem>
                                                <SelectItem value="Ethical Hacking & Red Teaming">Ethical Hacking & Red Teaming</SelectItem>
                                                <SelectItem value="Offensive Security">Offensive Security</SelectItem>
                                                <SelectItem value="Technological Awareness">Technological Awareness</SelectItem>
                                                <SelectItem value="Other">Other (Specify in message)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.topic && <p className="text-xs text-red-500 font-medium ml-1">{errors.topic.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="message" className="text-base font-medium">Additional Requirements / Custom Topics</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us about specific lab requirements, custom modules, or audience details..."
                                    className={`min-h-[120px] rounded-xl bg-background border-border/60 focus:border-primary/50 transition-all resize-none p-4 ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    {...register("message")}
                                />
                                {errors.message && <p className="text-xs text-red-500 font-medium ml-1">{errors.message.message}</p>}
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="pt-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="privacyPolicy"
                                            type="checkbox"
                                            {...register("privacyPolicy")}
                                            className="w-5 h-5 rounded border-border/60 bg-background text-primary focus:ring-primary/20 transition-colors cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="privacyPolicy" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
                                            I agree to the <a href="/privacy-policy" className="underline hover:text-foreground">privacy policy</a> and consent to being contacted regarding this request.
                                        </Label>
                                        {errors.privacyPolicy && <p className="text-xs text-red-500 font-medium">{errors.privacyPolicy.message}</p>}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="marketingConsent"
                                            type="checkbox"
                                            {...register("marketingConsent")}
                                            className="w-5 h-5 rounded border-border/60 bg-background text-primary focus:ring-primary/20 transition-colors cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="marketingConsent" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
                                            Our organization is open to receiving information about ZecurX corporate training solutions and partnership opportunities. <span className="text-muted-foreground/60">(Optional)</span>
                                        </Label>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Processing Request...
                                        </>
                                    ) : (
                                        <>
                                            Submit Booking Request
                                            <Send className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
