"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, CheckCircle2, AlertCircle, Shield, Award, BookOpen, MapPin, Monitor, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";


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

const CDN_BASE = "https://zecurx-web.fsn1.your-objectstorage.com/partners";

const partnerLogos = [
    { name: "RIBS", light: `${CDN_BASE}/ribs.png`, dark: `${CDN_BASE}/ribs.png` },
    { name: "Sapthagiri", light: `${CDN_BASE}/sapthagiri.png`, dark: `${CDN_BASE}/sapthagiri.png` },
    { name: "IIBS", light: `${CDN_BASE}/iibs-logo-02.png`, dark: `${CDN_BASE}/iibs-logo-02.png` },
    { name: "Mount Carmel", light: `${CDN_BASE}/250px-mount_carmel_college_bangalore_logo.png`, dark: `${CDN_BASE}/250px-mount_carmel_college_bangalore_logo.png` },
];

const DURATION_OPTIONS = [
    "60 min",
    "90 min",
    "2 hrs",
    "3 hrs",
    "Half Day",
    "Full Day"
];

const SEMINAR_TYPES = [
    "Threat Briefing",
    "Technical Workshop",
    "Deep Dive",
    "Hands-on Lab",
    "Guest Lecture",
    "Keynote",
    "Panel Discussion"
];

const bookingSchema = z.object({
    // Contact Information
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    organization: z.string().min(2, "Organization name is required"),

    // Seminar Details
    title: z.string().min(5, "Seminar title is required").max(100),
    description: z.string().min(20, "Please provide a brief description (min 20 chars)").max(500),
    seminarType: z.string().min(1, "Please select a seminar type"),
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

    // Logistics
    duration: z.string().min(1, "Please select duration"),
    locationType: z.enum(["online", "onsite"]),
    venueAddress: z.string().optional(),
    attendees: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Please enter a valid number of attendees",
    }),
    date: z.string().min(1, "Please select a preferred date").refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }, {
        message: "Date cannot be in the past"
    }),

    // Additional
    message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
    privacyPolicy: z.boolean().refine(val => val === true, {
        message: "You must accept the privacy policy to continue"
    }),
    marketingConsent: z.boolean().optional()
}).refine((data) => {
    if (data.locationType === "onsite" && !data.venueAddress) {
        return false;
    }
    return true;
}, {
    message: "Venue address is required for on-site seminars",
    path: ["venueAddress"]
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function SeminarBookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [, setPreferredDate] = useState<Date | null>(null);

    // Multi-step state
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { id: 'contact', title: 'Contact Info', fields: ['name', 'email', 'phone', 'organization'] },
        { id: 'details', title: 'Seminar Details', fields: ['title', 'description', 'seminarType', 'topic'] },
        { id: 'logistics', title: 'Logistics', fields: ['duration', 'attendees', 'locationType', 'venueAddress', 'date'] },
        { id: 'finalize', title: 'Finalize', fields: ['message', 'privacyPolicy'] }
    ];



    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        trigger,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            organization: "",
            title: "",
            description: "",
            seminarType: "",
            duration: "",
            locationType: "onsite",
            venueAddress: "",
            attendees: "",
            message: "",
            privacyPolicy: false,
            marketingConsent: false
        },
    });

    const locationType = watch("locationType");

    const nextStep = async () => {
        const fields = steps[currentStep].fields as (keyof BookingFormValues)[];
        const isValid = await trigger(fields);
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/seminars/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Contact info
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    organization: data.organization,

                    // Seminar details
                    title: data.title,
                    description: data.description,
                    seminarType: data.seminarType,
                    topic: data.topic,

                    // Logistics
                    duration: data.duration,
                    locationType: data.locationType,
                    venueAddress: data.venueAddress || '',
                    attendees: parseInt(data.attendees),
                    preferredDate: data.date,

                    // Additional
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
            setCurrentStep(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <section className="pt-8 pb-12 md:pt-10 md:pb-24 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Context & Benefits - RESTORED */}
                    <div className="lg:col-span-2 lg:sticky lg:top-8 space-y-12 relative hidden lg:block">
                        <div className="space-y-12">
                            {/* Partner Logos - Moved to Top for immediate trust and height balancing */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Trusted by Top Institutions</p>
                                <div className="flex items-center gap-6">
                                    {partnerLogos.map((partner, i) => (
                                        <div key={i} className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                            <Image
                                                src={partner.light}
                                                alt={partner.name}
                                                width={32}
                                                height={32}
                                                className="h-8 w-auto object-contain dark:hidden"
                                                unoptimized
                                            />
                                            <Image
                                                src={partner.dark}
                                                alt={partner.name}
                                                width={32}
                                                height={32}
                                                className="h-8 w-auto object-contain hidden dark:block"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                                    Book a <br />
                                    <span className="text-muted-foreground">Seminar.</span>
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Empower your institution with industry-leading cybersecurity training. From hands-on workshops to expert briefings.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    {
                                        icon: Shield,
                                        title: "Expert-Led Sessions",
                                        desc: "Led by active penetration testers and security architects with deep industry experience."
                                    },
                                    {
                                        icon: Award,
                                        title: "Hands-on Learning",
                                        desc: "Access to practical labs and real-world attack simulations for deep technical skill development."
                                    },
                                    {
                                        icon: BookOpen,
                                        title: "Customized Content",
                                        desc: "Curriculum tailored to your specific needs, from academic fundamentals to corporate defense."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors shadow-sm">
                                            <item.icon className="w-6 h-6 text-foreground/80 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: The Form */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Mobile Header (visible only on small screens) */}
                        <div className="lg:hidden mb-8">
                            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Book a Seminar</h2>
                            <p className="text-muted-foreground">Schedule expert-led cybersecurity training.</p>
                        </div>

                        <div className="bg-card border border-border rounded-[2.5rem] p-6 md:px-10 md:py-8 shadow-xl relative md:h-[760px] flex flex-col">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12 flex flex-col items-center justify-center h-full"
                                >
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-8 border border-border shadow-sm relative">
                                        <CheckCircle2 className="w-10 h-10 text-foreground" />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                                            <Shield className="w-3 h-3 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        <h3 className="text-3xl font-bold text-foreground tracking-tight">Booking Received</h3>
                                        <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                                            Your seminar request is being processed. Our technical leads will review your requirements and reach out within 24 hours.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-sm bg-muted rounded-2xl border border-border p-6 mb-10 text-left">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reference ID</span>
                                            <span className="text-xs font-mono font-bold text-foreground uppercase tracking-tighter">SEM-{(Math.random() * 10000).toFixed(0).padStart(5, '0')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 py-3 border-y border-border">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Validation in progress</p>
                                        </div>
                                        <p className="mt-4 text-[10px] text-muted-foreground leading-tight">
                                            A confirmation email with the session timeline and technical prerequisites has been sent to your primary contact.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        Submit Another Request
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Stepper Header */}
                                    <div className="mb-8 flex items-center justify-between relative">
                                        <div className="absolute top-4 left-12 right-12 h-0.5 bg-muted -z-0"></div>
                                        <div
                                            className="absolute top-4 left-12 right-12 h-0.5 bg-foreground transition-all duration-500 z-0 origin-left"
                                            style={{ transform: `scaleX(${currentStep / (steps.length - 1)})` }}
                                        ></div>
                                        {steps.map((step, idx) => (
                                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 w-24">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep >= idx
                                                    ? "bg-foreground text-background shadow-lg scale-110"
                                                    : "bg-muted text-muted-foreground"
                                                    }`}>
                                                    {currentStep > idx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                                </div>
                                                <span className={`text-[10px] uppercase font-bold tracking-wider hidden md:block ${currentStep === idx ? "text-foreground" : "text-muted-foreground/60"
                                                    }`}>
                                                    {step.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col">
                                        <div className="flex-grow flex flex-col justify-center">
                                            <AnimatePresence mode="wait">
                                                {currentStep === 0 && (
                                                    <motion.div
                                                        key="step1"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="space-y-6 flex flex-col"
                                                    >
                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
                                                            <p className="text-sm text-muted-foreground">Who should we contact regarding this seminar?</p>
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="name" className="text-sm font-bold text-foreground/80 ml-1">Full Name *</Label>
                                                                <Input
                                                                    id="name"
                                                                    placeholder="Enter your name"
                                                                    {...register("name")}
                                                                    className={`h-14 px-5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-200 ${errors.name ? "border-red-500 bg-red-50" : ""}`}
                                                                />
                                                                {errors.name && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.name.message}</p>}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="email" className="text-sm font-bold text-foreground/80 ml-1">Email Address *</Label>
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    placeholder="you@institution.edu"
                                                                    {...register("email")}
                                                                    className={`h-14 px-5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : ""}`}
                                                                />
                                                                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.email.message}</p>}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="phone" className="text-sm font-bold text-foreground/80 ml-1">Phone Number</Label>
                                                                <Input
                                                                    id="phone"
                                                                    type="tel"
                                                                    placeholder="Include country code"
                                                                    {...register("phone")}
                                                                    className="h-14 px-5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-200"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="organization" className="text-sm font-bold text-foreground/80 ml-1">Organization Name *</Label>
                                                                <Input
                                                                    id="organization"
                                                                    placeholder="Institution/Company Name"
                                                                    {...register("organization")}
                                                                    className={`h-14 px-5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-200 ${errors.organization ? "border-red-500 bg-red-50" : ""}`}
                                                                />
                                                                {errors.organization && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.organization.message}</p>}
                                                            </div>
                                                        </div>
                                                        <div className="pt-6">
                                                            <div className="rounded-2xl bg-muted border border-border p-5 flex gap-4 items-start shadow-sm border-dashed">
                                                                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                                                                    <Shield className="w-5 h-5 text-muted-foreground" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">Privacy & Coordination</p>
                                                                    <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">Your institutional data is protected. We use these details solely to coordinate technical logistics with your team.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {currentStep === 1 && (
                                                    <motion.div
                                                        key="step2"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="space-y-6 flex flex-col"
                                                    >
                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold text-foreground">Seminar Details</h3>
                                                            <p className="text-sm text-muted-foreground">What kind of session are you looking for?</p>
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="title" className="text-sm font-bold text-foreground/80 ml-1">Seminar Topic / Title *</Label>
                                                                <Input
                                                                    id="title"
                                                                    placeholder="Enter the proposed title"
                                                                    {...register("title")}
                                                                    className={`h-14 px-5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-200 ${errors.title ? "border-red-500 bg-red-50" : ""}`}
                                                                />
                                                                {errors.title && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.title.message}</p>}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="seminarType" className="text-sm font-bold text-foreground/80 ml-1">Session Type *</Label>
                                                                <Controller
                                                                    name="seminarType"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <SelectTrigger className={`h-14 rounded-xl bg-muted border-border text-foreground focus:ring-1 focus:ring-ring focus:border-ring ${errors.seminarType ? "border-red-500 bg-red-50" : ""}`}>
                                                                                <SelectValue placeholder="Select type" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="bg-card border-border">
                                                                                {SEMINAR_TYPES.map(type => (
                                                                                    <SelectItem key={type} value={type} className="text-foreground focus:bg-muted cursor-pointer">{type}</SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />
                                                                {errors.seminarType && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.seminarType.message}</p>}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="topic" className="text-sm font-bold text-foreground/80 ml-1">Primary Focus Area *</Label>
                                                            <Controller
                                                                name="topic"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger className={`h-14 rounded-xl bg-muted border-border text-foreground focus:ring-1 focus:ring-ring focus:border-ring ${errors.topic ? "border-red-500 bg-red-50" : ""}`}>
                                                                            <SelectValue placeholder="Select focus" />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="bg-card border-border">
                                                                            <SelectItem value="Generative AI Security & Defense" className="text-foreground focus:bg-muted">Generative AI Security</SelectItem>
                                                                            <SelectItem value="Ransomware Response & Resilience" className="text-foreground focus:bg-muted">Ransomware Response</SelectItem>
                                                                            <SelectItem value="Zero Trust Network Architecture" className="text-foreground focus:bg-muted">Zero Trust Architecture</SelectItem>
                                                                            <SelectItem value="Cloud Security Posture (CSPM)" className="text-foreground focus:bg-muted">Cloud Security</SelectItem>
                                                                            <SelectItem value="API Security & DevSecOps" className="text-foreground focus:bg-muted">API / DevSecOps</SelectItem>
                                                                            <SelectItem value="Ethical Hacking & Red Teaming" className="text-foreground focus:bg-muted">Ethical Hacking</SelectItem>
                                                                            <SelectItem value="Offensive Security" className="text-foreground focus:bg-muted">Offensive Security</SelectItem>
                                                                            <SelectItem value="Technological Awareness" className="text-foreground focus:bg-muted">Tech Awareness</SelectItem>
                                                                            <SelectItem value="Other" className="text-foreground focus:bg-muted">Other Area</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.topic && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.topic.message}</p>}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="description" className="text-sm font-bold text-foreground/80 ml-1">Brief Description *</Label>
                                                            <Textarea
                                                                id="description"
                                                                placeholder="Describe the learning objectives and key focus areas..."
                                                                {...register("description")}
                                                                className={`min-h-[120px] rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-300 resize-none p-5 ${errors.description ? "border-red-500 bg-red-50" : ""}`}
                                                            />
                                                            {errors.description && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.description.message}</p>}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {currentStep === 2 && (
                                                    <motion.div
                                                        key="step3"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="space-y-6 flex flex-col"
                                                    >
                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold text-foreground">Logistics & Schedule</h3>
                                                            <p className="text-sm text-muted-foreground">When and where should this take place?</p>
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="duration" className="text-sm font-bold text-foreground/80 ml-1">Planned Duration *</Label>
                                                                <Controller
                                                                    name="duration"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <SelectTrigger className={`h-14 rounded-xl bg-muted border-border text-foreground focus:ring-1 focus:ring-ring focus:border-ring ${errors.duration ? "border-red-500 bg-red-50" : ""}`}>
                                                                                <SelectValue placeholder="Select duration" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="bg-card border-border">
                                                                                {DURATION_OPTIONS.map(dur => (
                                                                                    <SelectItem key={dur} value={dur} className="text-foreground focus:bg-muted cursor-pointer">{dur}</SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />
                                                                {errors.duration && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.duration.message}</p>}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="attendees" className="text-sm font-bold text-foreground/80 ml-1">Expected Attendees *</Label>
                                                                <Input
                                                                    id="attendees"
                                                                    type="number"
                                                                    min="1"
                                                                    placeholder="Estimated count"
                                                                    {...register("attendees")}
                                                                    className={`h-14 px-5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-200 ${errors.attendees ? "border-red-500 bg-red-50" : ""}`}
                                                                />
                                                                {errors.attendees && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.attendees.message}</p>}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <Label className="text-sm font-bold text-foreground/80 ml-1">Preferred Location *</Label>
                                                            <Controller
                                                                name="locationType"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => field.onChange("onsite")}
                                                                            className={`h-14 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 text-sm font-bold ${field.value === "onsite"
                                                                                ? "bg-foreground border-foreground text-background shadow-lg"
                                                                                : "bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-card hover:border-border"
                                                                                }`}
                                                                        >
                                                                            <MapPin className="w-5 h-5" />
                                                                            On-site (In Person)
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => field.onChange("online")}
                                                                            className={`h-14 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 text-sm font-bold ${field.value === "online"
                                                                                ? "bg-foreground border-foreground text-background shadow-lg"
                                                                                : "bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-card hover:border-border"
                                                                                }`}
                                                                        >
                                                                            <Monitor className="w-5 h-5" />
                                                                            Virtual / Online
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-6 items-start">
                                                            {locationType === "onsite" && (
                                                                <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
                                                                    <Label htmlFor="venueAddress" className="text-sm font-bold text-foreground/80 ml-1">Venue Address / Details *</Label>
                                                                    <Input
                                                                        id="venueAddress"
                                                                        placeholder="Enter venue details"
                                                                        {...register("venueAddress")}
                                                                        className={`h-14 px-5 rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-200 ${errors.venueAddress ? "border-red-500 bg-red-50" : ""}`}
                                                                    />
                                                                    {errors.venueAddress && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.venueAddress.message}</p>}
                                                                </div>
                                                            )}

                                                            <div className={`space-y-2 ${locationType !== "onsite" ? "md:col-span-2" : ""}`}>
                                                                <Label htmlFor="date" className="text-sm font-bold text-foreground/80 ml-1">Preferred Date *</Label>
                                                                <Controller
                                                                    name="date"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <DateTimePicker
                                                                            name="date"
                                                                            minDate={new Date()}
                                                                            onChange={(date) => {
                                                                                field.onChange(date?.toISOString());
                                                                                setPreferredDate(date);
                                                                            }}
                                                                            className="bg-muted border-border text-foreground h-14 rounded-xl"
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.date && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.date.message}</p>}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {currentStep === 3 && (
                                                    <motion.div
                                                        key="step4"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="space-y-6 flex flex-col"
                                                    >
                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold text-foreground">Final Details</h3>
                                                            <p className="text-sm text-muted-foreground">Anything else we should know?</p>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="message" className="text-sm font-bold text-foreground/80 ml-1">Additional Requirements</Label>
                                                                <Textarea
                                                                    id="message"
                                                                    placeholder="Enter any specific requests or technical requirements..."
                                                                    className={`min-h-[120px] rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:bg-card transition-all duration-300 resize-none p-5 ${errors.message ? "border-red-500 bg-red-50" : ""}`}
                                                                    {...register("message")}
                                                                />
                                                                {errors.message && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.message.message}</p>}
                                                            </div>

                                                            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
                                                                <label className="flex items-start gap-3 cursor-pointer group">
                                                                    <input
                                                                        type="checkbox"
                                                                        {...register("privacyPolicy")}
                                                                        className="w-4 h-4 mt-0.5 rounded border-border text-foreground focus:ring-ring cursor-pointer accent-foreground"
                                                                    />
                                                                    <div className="space-y-1">
                                                                        <span className="text-xs text-muted-foreground leading-tight block group-hover:text-foreground transition-colors">
                                                                            I agree to the <a href="/privacy-policy" className="text-foreground font-bold hover:underline underline-offset-4">Privacy Framework</a> and consent to data processing. *
                                                                        </span>
                                                                        {errors.privacyPolicy && <span className="text-xs text-red-500 font-bold block">{errors.privacyPolicy.message}</span>}
                                                                    </div>
                                                                </label>

                                                                <label className="flex items-start gap-3 cursor-pointer group">
                                                                    <input
                                                                        type="checkbox"
                                                                        {...register("marketingConsent")}
                                                                        className="w-4 h-4 mt-0.5 rounded border-border text-foreground focus:ring-ring cursor-pointer accent-foreground"
                                                                    />
                                                                    <span className="text-xs text-muted-foreground leading-tight block group-hover:text-foreground transition-colors">
                                                                        Notify me about future <span className="text-foreground font-bold">Training Sessions</span> and events.
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="pt-4">
                                                            <div className="rounded-2xl bg-muted border border-border p-5 flex gap-4 items-start shadow-sm border-dashed">
                                                                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                                                                    <Shield className="w-5 h-5 text-muted-foreground" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">Secure Processing</p>
                                                                    <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">Once submitted, your request is routed to our technical leads for a feasibility review within 24 hours.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>


                                        </div>

                                        {/* Form Footer / Navigation Actions */}
                                        <div className="pt-6 mt-auto flex items-center justify-between border-t border-border">
                                            <div className="w-24">
                                                {currentStep > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 px-2 py-2"
                                                    >
                                                        <ArrowLeft className="w-4 h-4" />
                                                        Back
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex-1 max-w-[200px]">
                                                {currentStep < steps.length - 1 ? (
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                                                    >
                                                        Next Step
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                        Submit Request
                                                    </button>
                                                )}
                                            </div>
                                            <div className="w-24"></div> {/* spacer for centering */}
                                        </div>

                                        {error && (
                                            <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 animate-in shake duration-500">
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                <p className="text-xs font-bold text-red-700">{error}</p>
                                            </div>
                                        )}
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div >
            </div >
        </section >
    );
}
