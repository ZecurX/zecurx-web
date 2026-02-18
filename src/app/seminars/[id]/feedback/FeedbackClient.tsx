"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Mail,
    User,
    Phone,
    GraduationCap,
    MapPin,
    Star,
    Award,
    Sparkles,
    Briefcase,
    ExternalLink,
    BookOpen,
    Linkedin,
    Instagram,
    Clock,
    Download,
    Shield,
    Check
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    PublicSeminar,
    CertificateVerification,
    YEAR_OPTIONS,
    CAREER_INTERESTS,
    OFFENSIVE_SECURITY_INTEREST,
} from "@/types/seminar";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/app/verify/[certificateId]/ShareButton";

// --- Form Schemas ---
const step1Schema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    collegeName: z.string().min(2, "College name is required"),
    year: z.string().min(1, "Year is required"),
    cityState: z.string().min(2, "City/State is required"),
    reminderContact: z
        .string()
        .min(10, "Phone/WhatsApp number is required")
        .transform((val) => val.replace(/\D/g, "")) // Strip non-digits
        .refine(
            (val) => {
                if (val.startsWith("91") && val.length === 12) {
                    return /^91[6-9]\d{9}$/.test(val);
                }
                return /^[6-9]\d{9}$/.test(val);
            },
            { message: "Please enter a valid 10-digit Indian phone/WhatsApp number" }
        ),
});

const step2Schema = z.object({
    careerInterest: z.string().min(1, "Please select your career interest"),
    offensiveSecurityReason: z.string().optional(),
}).refine((data) => {
    if (data.careerInterest === OFFENSIVE_SECURITY_INTEREST) {
        if (!data.offensiveSecurityReason || data.offensiveSecurityReason.trim().length < 10) {
            return false;
        }
        const wordCount = data.offensiveSecurityReason.trim().split(/\s+/).length;
        return wordCount >= 3;
    }
    return true;
}, {
    message: "Please share what excites you about offensive security (minimum 10 characters and 3 words)",
    path: ["offensiveSecurityReason"],
});

const step3Schema = z.object({
    seminarRating: z.number().min(1, "Please rate the seminar").max(5),
    mostValuablePart: z
        .string()
        .min(10, "Please share what you found most valuable (minimum 10 characters)")
        .refine((val) => val.trim().split(/\s+/).length >= 3, {
            message: "Please provide at least 3 words",
        }),
    futureSuggestions: z
        .string()
        .min(10, "Please suggest topics for future seminars (minimum 10 characters)")
        .refine((val) => val.trim().split(/\s+/).length >= 3, {
            message: "Please provide at least 3 words",
        }),
    joinZecurx: z.boolean().optional(),
});

const step4Schema = z.object({
    certificateName: z.string().min(2, "Please confirm your name for the certificate"),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;
type Step4Values = z.infer<typeof step4Schema>;

const STEPS = [
    { id: 1, title: "Identity", icon: User },
    { id: 2, title: "Interests", icon: Briefcase },
    { id: 3, title: "Insights", icon: Sparkles },
    { id: 4, title: "Certification", icon: Award },
];

function PageBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-background">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('/grid-pattern.svg')] bg-[size:60px_60px]"
                style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl" />
        </div>
    );
}

export default function FeedbackPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const seminarId = params.id as string;
    const registrationId = searchParams.get("registration");
    const prefillEmail = searchParams.get("email");
    const prefillName = searchParams.get("name");

    const [seminar, setSeminar] = useState<PublicSeminar | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [certificateId, setCertificateId] = useState<string | null>(null);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [registeredName, setRegisteredName] = useState<string | null>(null);
    const [nameChangeReason, setNameChangeReason] = useState('');
    const [showNameChangeReason, setShowNameChangeReason] = useState(false);
    const [nameChangeSubmitted, setNameChangeSubmitted] = useState(false);
    const [certData, setCertData] = useState<CertificateVerification["certificate"]>(null);
    const [certLoading, setCertLoading] = useState(false);

    const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
    const [step2Data, setStep2Data] = useState<Step2Values | null>(null);
    const [step3Data, setStep3Data] = useState<Step3Values | null>(null);

    const step1Form = useForm<Step1Values>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            fullName: prefillName || "",
            email: prefillEmail || "",
            collegeName: "",
            year: "",
            cityState: "",
            reminderContact: "",
        },
    });

    const step2Form = useForm<Step2Values>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            careerInterest: "",
            offensiveSecurityReason: "",
        },
    });

    const step3Form = useForm<Step3Values>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            seminarRating: 0,
            mostValuablePart: "",
            futureSuggestions: "",
            joinZecurx: false,
        },
    });

    const step4Form = useForm<Step4Values>({
        resolver: zodResolver(step4Schema),
        defaultValues: {
            certificateName: prefillName || "",
        },
    });

    const fetchCertificateData = useCallback(async (certId: string) => {
        setCertLoading(true);
        try {
            const response = await fetch(`/api/certificates/${certId}`);
            const data: CertificateVerification = await response.json();
            if (data.valid && data.certificate) {
                setCertData(data.certificate);
            }
        } catch {
            // Preview failure is non-critical
        } finally {
            setCertLoading(false);
        }
    }, []);

    useEffect(() => {
        async function fetchSeminar() {
            try {
                const response = await fetch(`/api/seminars/${seminarId}`);
                const data = await response.json();
                if (data.success) {
                    setSeminar(data.seminar);
                } else {
                    setError("Seminar not found");
                }
            } catch {
                setError("Failed to load seminar");
            } finally {
                setLoading(false);
            }
        }
        fetchSeminar();
    }, [seminarId]);

    useEffect(() => {
        if (prefillName && step1Data === null) {
            step1Form.setValue("fullName", prefillName);
            step4Form.setValue("certificateName", prefillName);
        }
        if (prefillEmail && step1Data === null) {
            step1Form.setValue("email", prefillEmail);
        }
        if (prefillName) {
            setRegisteredName(prefillName);
        }
    }, [prefillName, prefillEmail, step1Data, step1Form, step4Form]);

    const watchedCertName = step4Form.watch("certificateName");

    useEffect(() => {
        if (registeredName && watchedCertName) {
            const differs = watchedCertName.trim().toLowerCase() !== registeredName.trim().toLowerCase();
            setShowNameChangeReason(differs);
        } else {
            setShowNameChangeReason(false);
        }
    }, [watchedCertName, registeredName]);

    const handleStep1Submit = (data: Step1Values) => {
        setStep1Data(data);
        step4Form.setValue("certificateName", data.fullName);
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStep2Submit = (data: Step2Values) => {
        setStep2Data(data);
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStep3Submit = (data: Step3Values) => {
        setStep3Data(data);
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFinalSubmit = async (data: Step4Values) => {
        if (!step1Data || !step2Data || !step3Data) return;

        if (showNameChangeReason && nameChangeReason.trim().length < 10) {
            setError("Please provide a reason for the name change (minimum 10 characters)");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const feedbackPayload = {
                fullName: step1Data.fullName,
                email: step1Data.email,
                collegeName: step1Data.collegeName,
                year: step1Data.year,
                cityState: step1Data.cityState,
                reminderContact: step1Data.reminderContact || "",
                careerInterest: step2Data.careerInterest,
                offensiveSecurityReason: step2Data.offensiveSecurityReason || "",
                seminarRating: step3Data.seminarRating,
                mostValuablePart: step3Data.mostValuablePart || "",
                futureSuggestions: step3Data.futureSuggestions || "",
                joinZecurx: step3Data.joinZecurx || false,
                certificateName: data.certificateName,
                seminarId,
                registrationId: registrationId || undefined,
                nameChangeReason: showNameChangeReason ? nameChangeReason.trim() : undefined,
            };

            const response = await fetch(`/api/seminars/${seminarId}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackPayload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Submission failed");
            }

            if (result.nameChangeRequested) {
                setNameChangeSubmitted(true);
                setCurrentStep(5);
            } else {
                const certId = result.certificate?.certificateId;
                setCertificateId(certId);
                if (certId) {
                    fetchCertificateData(certId);
                }
                setCurrentStep(5);
                setShowSocialModal(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Syncing Feedback Data...</span>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden font-inter text-foreground">
            <PageBackground />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-6 mb-16">
                    <Link
                        href="/resources/seminars"
                        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Seminars
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-manrope font-bold tracking-tight text-foreground leading-[0.9]"
                    >
                        Session <br />
                        <span className="opacity-40 italic font-medium">Briefing.</span>
                    </motion.h1>

                    {seminar && currentStep < 5 && (
                        <p className="max-w-md text-muted-foreground text-sm font-medium">
                            Briefing completed for &ldquo;{seminar.title}&rdquo;. <br />
                            Provide final insights to unlock your Certification.
                        </p>
                    )}
                </div>

                {currentStep < 5 && (
                    <div className="flex items-center justify-between max-w-xl mx-auto mb-16 px-4">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center group relative">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 relative z-10",
                                            currentStep === step.id
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110 ring-4 ring-primary/10"
                                                : currentStep > step.id
                                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                                    : "bg-muted text-muted-foreground border border-border"
                                        )}
                                    >
                                        {currentStep > step.id ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            <step.icon className="w-5 h-5 opacity-60" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "absolute -bottom-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                        currentStep === step.id ? "text-foreground opacity-100" : "text-muted-foreground opacity-40"
                                    )}>
                                        {step.title}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className="flex-1 px-4 relative -top-4">
                                        <div className={cn(
                                            "h-0.5 w-full rounded-full transition-all duration-500",
                                            currentStep > step.id ? "bg-emerald-500" : "bg-border"
                                        )} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={currentStep}
                    className={cn(
                        "bg-card border border-border overflow-hidden shadow-2xl backdrop-blur-sm",
                        currentStep === 5 ? "rounded-[3rem] p-12" : "rounded-[2.5rem] p-8 md:p-12"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="space-y-2 border-b border-border/50 pb-6">
                                    <h3 className="text-2xl font-manrope font-bold tracking-tight">Identity Confirmation</h3>
                                    <p className="text-muted-foreground text-sm">Verify your institutional credentials.</p>
                                </div>

                                <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-8">
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-sm font-semibold ml-1">Full Name *</Label>
                                            <Input
                                                id="fullName"
                                                placeholder="Dr. John Doe"
                                                {...step1Form.register("fullName")}
                                                className={cn("h-12 bg-muted/30 border-border rounded-xl", step1Form.formState.errors.fullName && "border-red-500/50")}
                                            />
                                            {step1Form.formState.errors.fullName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step1Form.formState.errors.fullName.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold ml-1">Work/Institutional Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.edu"
                                                {...step1Form.register("email")}
                                                className={cn("h-12 bg-muted/30 border-border rounded-xl", step1Form.formState.errors.email && "border-red-500/50")}
                                            />
                                            {step1Form.formState.errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step1Form.formState.errors.email.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="collegeName" className="text-sm font-semibold ml-1">Current Institution / Organization *</Label>
                                        <Input
                                            id="collegeName"
                                            placeholder="University or Entity Name"
                                            {...step1Form.register("collegeName")}
                                            className={cn("h-12 bg-muted/30 border-border rounded-xl", step1Form.formState.errors.collegeName && "border-red-500/50")}
                                        />
                                        {step1Form.formState.errors.collegeName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step1Form.formState.errors.collegeName.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="year" className="text-sm font-semibold ml-1">Status / Year *</Label>
                                            <Select onValueChange={(value) => step1Form.setValue("year", value)} defaultValue={step1Form.getValues("year")}>
                                                <SelectTrigger className={cn("h-12 bg-muted/30 border-border rounded-xl", step1Form.formState.errors.year && "border-red-500/50")}>
                                                    <SelectValue placeholder="Select Cycle" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl bg-card border-border">
                                                    {YEAR_OPTIONS.map((year) => (
                                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {step1Form.formState.errors.year && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step1Form.formState.errors.year.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cityState" className="text-sm font-semibold ml-1">Regional Scope *</Label>
                                            <Input
                                                id="cityState"
                                                placeholder="City, State"
                                                {...step1Form.register("cityState")}
                                                className={cn("h-12 bg-muted/30 border-border rounded-xl", step1Form.formState.errors.cityState && "border-red-500/50")}
                                            />
                                            {step1Form.formState.errors.cityState && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step1Form.formState.errors.cityState.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reminderContact" className="text-sm font-semibold ml-1">Communication Channel (WhatsApp/Phone) *</Label>
                                        <Input
                                            id="reminderContact"
                                            placeholder="+91 00000 00000"
                                            {...step1Form.register("reminderContact")}
                                            className={cn("h-12 bg-muted/30 border-border rounded-xl", step1Form.formState.errors.reminderContact && "border-red-500/50")}
                                        />
                                        {step1Form.formState.errors.reminderContact && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step1Form.formState.errors.reminderContact.message}</p>}
                                    </div>

                                    <Button type="submit" className="w-full h-16 rounded-full bg-primary text-primary-foreground font-bold tracking-widest uppercase text-base shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
                                        <div className="flex items-center gap-3">
                                            <span>CONTINUE BRIEFING</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </Button>
                                </form>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="space-y-2 border-b border-border/50 pb-6">
                                    <h3 className="text-2xl font-manrope font-bold tracking-tight">Career Alignment</h3>
                                    <p className="text-muted-foreground text-sm">Define your trajectory in the security offensive.</p>
                                </div>

                                <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-10">
                                    <div className="space-y-6">
                                        <Label className="text-sm font-semibold ml-1">Primary Domain of Interest *</Label>
                                        <RadioGroup
                                            onValueChange={(value: string) => step2Form.setValue("careerInterest", value)}
                                            className="grid gap-4"
                                            defaultValue={step2Data?.careerInterest}
                                        >
                                            {CAREER_INTERESTS.map((interest) => (
                                                <label
                                                    key={interest}
                                                    htmlFor={interest}
                                                    className={cn(
                                                        "group flex items-center justify-between p-5 rounded-[1.5rem] border transition-all cursor-pointer",
                                                        step2Form.watch("careerInterest") === interest
                                                            ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                                                            : "bg-muted/10 border-border hover:bg-muted/30"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                            step2Form.watch("careerInterest") === interest ? "border-primary bg-primary" : "border-border"
                                                        )}>
                                                            {step2Form.watch("careerInterest") === interest && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={cn("text-sm font-bold transition-colors", step2Form.watch("careerInterest") === interest ? "text-primary" : "text-foreground/70 group-hover:text-foreground")}>{interest}</span>
                                                    </div>
                                                    <RadioGroupItem value={interest} id={interest} className="sr-only" />
                                                </label>
                                            ))}
                                        </RadioGroup>
                                        {step2Form.formState.errors.careerInterest && (
                                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step2Form.formState.errors.careerInterest.message}</p>
                                        )}
                                    </div>

                                    {step2Form.watch("careerInterest") === OFFENSIVE_SECURITY_INTEREST && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-4"
                                        >
                                            <Label htmlFor="offensiveSecurityReason" className="text-sm font-semibold ml-1 text-primary">
                                                Strategic Motivation *
                                            </Label>
                                            <Textarea
                                                id="offensiveSecurityReason"
                                                placeholder="Define what drives your pursuit of offensive system analysis..."
                                                {...step2Form.register("offensiveSecurityReason")}
                                                className={cn("min-h-[140px] bg-muted/30 border-border rounded-2xl p-5 text-sm resize-none", step2Form.formState.errors.offensiveSecurityReason && "border-red-500/50")}
                                            />
                                            {step2Form.formState.errors.offensiveSecurityReason && (
                                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step2Form.formState.errors.offensiveSecurityReason.message}</p>
                                            )}
                                        </motion.div>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <Button type="button" variant="outline" onClick={goBack} className="flex-1 h-16 rounded-full border-border font-extrabold uppercase tracking-widest text-xs hover:bg-muted transition-all">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            PREVIOUS
                                        </Button>
                                        <Button type="submit" className="flex-[2] h-16 rounded-full bg-primary text-primary-foreground font-bold tracking-widest text-base shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
                                            <div className="flex items-center gap-3">
                                                <span>PROCEED TO INSIGHTS</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="space-y-2 border-b border-border/50 pb-6">
                                    <h3 className="text-2xl font-manrope font-bold tracking-tight">Performance Review</h3>
                                    <p className="text-muted-foreground text-sm">Synchronize your experience with our training vectors.</p>
                                </div>

                                <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-12">
                                    <div className="space-y-6 text-center">
                                        <Label className="text-sm font-black uppercase tracking-[0.2em] opacity-40">Session Rating Index</Label>
                                        <div className="flex gap-4 justify-center">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() => step3Form.setValue("seminarRating", rating)}
                                                    className="group transition-all duration-300 transform active:scale-90"
                                                >
                                                    <Star
                                                        className={cn(
                                                            "w-12 h-12 transition-all drop-shadow-sm",
                                                            step3Form.watch("seminarRating") >= rating
                                                                ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]"
                                                                : "text-muted-foreground/30 hover:text-muted-foreground/60"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {step3Form.formState.errors.seminarRating && (
                                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{step3Form.formState.errors.seminarRating.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <Label htmlFor="mostValuablePart" className="text-sm font-semibold ml-1">Most Valuable Theoretical Vector *</Label>
                                            <Textarea
                                                id="mostValuablePart"
                                                placeholder="Define your core learnings from this session..."
                                                {...step3Form.register("mostValuablePart")}
                                                className={cn("min-h-[120px] bg-muted/30 border-border rounded-2xl p-5 text-sm resize-none", step3Form.formState.errors.mostValuablePart && "border-red-500/50")}
                                            />
                                            {step3Form.formState.errors.mostValuablePart && (
                                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step3Form.formState.errors.mostValuablePart.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <Label htmlFor="futureSuggestions" className="text-sm font-semibold ml-1">Future Research Topics *</Label>
                                            <Textarea
                                                id="futureSuggestions"
                                                placeholder="What should we target in the next deployment?"
                                                {...step3Form.register("futureSuggestions")}
                                                className={cn("min-h-[120px] bg-muted/30 border-border rounded-2xl p-5 text-sm resize-none", step3Form.formState.errors.futureSuggestions && "border-red-500/50")}
                                            />
                                            {step3Form.formState.errors.futureSuggestions && (
                                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{step3Form.formState.errors.futureSuggestions.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => step3Form.setValue("joinZecurx", !step3Form.watch("joinZecurx"))}
                                        className={cn(
                                            "flex items-start gap-5 p-6 rounded-[1.5rem] border transition-all cursor-pointer",
                                            step3Form.watch("joinZecurx") ? "bg-primary/5 border-primary ring-1 ring-primary/20" : "bg-muted/10 border-border hover:bg-muted/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-1 shadow-sm",
                                            step3Form.watch("joinZecurx") ? "bg-primary border-primary" : "border-border"
                                        )}>
                                            {step3Form.watch("joinZecurx") && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className={cn("text-base font-bold transition-colors", step3Form.watch("joinZecurx") ? "text-primary" : "text-foreground")}>Join the ZecurX Intelligence Network</p>
                                            <p className="text-xs text-muted-foreground">Receive prioritized updates on courses, red-team briefings, and career pipelines.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button type="button" variant="outline" onClick={goBack} className="flex-1 h-16 rounded-full border-border font-extrabold uppercase tracking-widest text-xs hover:bg-muted transition-all">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            PREVIOUS
                                        </Button>
                                        <Button type="submit" className="flex-[2] h-16 rounded-full bg-primary text-primary-foreground font-bold tracking-widest text-base shadow-xl shadow-primary/20 hover:opacity-95 transition-all">
                                            <div className="flex items-center gap-3">
                                                <span>FINALIZE DOSSIER</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
                                        <Award className="w-10 h-10 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h1 className="text-4xl font-manrope font-bold">Credentialing</h1>
                                        <p className="text-muted-foreground text-lg">Confirm identity for official certificate issuance.</p>
                                    </div>
                                </div>

                                <form onSubmit={step4Form.handleSubmit(handleFinalSubmit)} className="space-y-10">
                                    <div className="space-y-4">
                                        <Label htmlFor="certificateName" className="text-sm font-black uppercase tracking-[0.2em] opacity-40 block text-center">Name on Certificate</Label>
                                        <Input
                                            id="certificateName"
                                            placeholder="Your Full Legal Name"
                                            {...step4Form.register("certificateName")}
                                            className={cn("h-20 text-center text-3xl font-manrope font-extrabold rounded-2xl bg-muted/40 border-border focus:ring-primary/20 transition-all", step4Form.formState.errors.certificateName && "border-red-500/50")}
                                        />
                                        {step4Form.formState.errors.certificateName && (
                                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{step4Form.formState.errors.certificateName.message}</p>
                                        )}
                                    </div>

                                    <div className="bg-muted/30 border border-border p-8 rounded-[1.5rem] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Award className="w-16 h-16" />
                                        </div>
                                        <div className="space-y-2 relative z-10">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Preview Rendering</p>
                                            <div className="h-0.5 bg-primary/20 w-12 rounded-full mb-4" />
                                            <p className="text-muted-foreground text-sm font-medium">
                                                This is to certify that <span className="text-foreground font-black border-b-2 border-primary/20 px-1">{step4Form.watch("certificateName") || "Recpient Name"}</span> has participated in the session briefing &ldquo;<span className="font-bold text-foreground/80">{seminar?.title}</span>&rdquo;.
                                            </p>
                                        </div>
                                    </div>

                                    {showNameChangeReason && registeredName && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
                                                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">Mismatch Detected</p>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        Your name differs from the registration record (<span className="text-foreground/80 font-bold">{registeredName}</span>). Certification issuance will require administrative validation.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="nameChangeReason" className="text-xs font-bold uppercase tracking-widest ml-1 opacity-60">Validation Briefing *</Label>
                                                <Textarea
                                                    id="nameChangeReason"
                                                    placeholder="Provide justification for current name mismatch (minimum 10 characters)..."
                                                    value={nameChangeReason}
                                                    onChange={(e) => setNameChangeReason(e.target.value)}
                                                    className={cn("min-h-[100px] bg-muted/30 border-border rounded-2xl p-5 text-sm resize-none", nameChangeReason.trim().length > 0 && nameChangeReason.trim().length < 10 && "border-red-500/50")}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-center gap-3 text-red-500">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={goBack} className="flex-1 h-16 rounded-full border-border font-extrabold uppercase tracking-widest text-xs hover:bg-muted transition-all">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            PREVIOUS
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-[2] h-16 rounded-full bg-primary text-primary-foreground font-bold tracking-widest text-base shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <Sparkles className="w-5 h-5" />
                                                    <span>{showNameChangeReason ? "REQUEST APPROVAL" : "GENERATE CERTIFICATE"}</span>
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {currentStep === 5 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full space-y-12"
                            >
                                {nameChangeSubmitted ? (
                                    <div className="text-center space-y-12 py-8">
                                        <div className="space-y-6">
                                            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
                                                <Clock className="w-12 h-12 text-amber-500" />
                                            </div>
                                            <div className="space-y-3">
                                                <h1 className="text-4xl font-manrope font-bold">Request Pending.</h1>
                                                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                                    Your name change request has been logged. Admin review is required before certification dispatch.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 inline-block max-w-md">
                                            <p className="text-sm text-amber-600 font-bold leading-relaxed uppercase tracking-wide">
                                                A briefing notification will be dispatched to your email once validated.
                                            </p>
                                        </div>

                                        <div className="pt-8 border-t border-border/50">
                                            <Button asChild className="rounded-full px-12 h-16 bg-foreground text-background font-black tracking-[0.2em] text-xs hover:opacity-90">
                                                <Link href="/resources/seminars">
                                                    <div className="flex items-center gap-3">
                                                        <ArrowLeft className="w-4 h-4" />
                                                        <span>BACK TO LIST</span>
                                                    </div>
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : certLoading ? (
                                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                        <span className="text-xs font-black uppercase tracking-[0.4em] opacity-40">Compiling Certification PDF...</span>
                                    </div>
                                ) : certData ? (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                        <div className="text-center space-y-6">
                                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                                                <Check className="w-12 h-12 text-emerald-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <h1 className="text-5xl font-manrope font-bold">Congratulations.</h1>
                                                <p className="text-muted-foreground text-lg">
                                                    Achievement unlocked for <span className="text-foreground font-black">{seminar?.title}</span>.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative group max-w-3xl mx-auto">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                            <div className="relative rounded-[1.5rem] overflow-hidden bg-muted/30 border border-border shadow-2xl transition-all hover:scale-[1.01]">
                                                <img
                                                    src={`/api/certificates/${certificateId}/preview`}
                                                    alt="Certification Render"
                                                    className="w-full h-auto block"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Recipient Entity</p>
                                                <p className="font-bold text-lg text-foreground truncate">{certData.recipientName}</p>
                                            </div>
                                            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Certification ID</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="font-mono text-sm font-black text-primary uppercase">{certData.certificateId}</code>
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto pb-8 border-b border-border">
                                            <Button asChild className="flex-1 h-16 rounded-full bg-primary text-primary-foreground font-black tracking-[0.2em] text-xs shadow-xl shadow-primary/20">
                                                <Link href={`/api/certificates/${certificateId}/download`}>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    DOWNLOAD PDF
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="flex-1 h-16 rounded-full border-border font-black tracking-[0.2em] text-xs hover:bg-muted">
                                                <Link href={`/verify/${certificateId}`}>
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    VERIFY LIVE
                                                </Link>
                                            </Button>
                                        </div>

                                        <div className="space-y-8">
                                            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Share Achievement</p>
                                            <div className="max-w-md mx-auto">
                                                <ShareButton
                                                    title={`Certification - ${certData.recipientName}`}
                                                    text={`Official accomplishment logged. I just received my certificate from ${certData.seminarTitle} by ZecurX.`}
                                                    certificateId={certData.certificateId}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-center pt-8">
                                            <Link href="/resources/seminars">
                                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                                                    <ArrowLeft className="w-3 h-3 mr-2" />
                                                    Return to Seminar List
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-16 space-y-12">
                                        <div className="space-y-6">
                                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                                                <Mail className="w-12 h-12 text-emerald-500" />
                                            </div>
                                            <div className="space-y-3">
                                                <h1 className="text-4xl font-manrope font-bold">Dossier Dispatched.</h1>
                                                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                                                    Your certification has been sent to your email. Access records maintained securely.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 inline-block max-w-md w-full">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Certification Reference</p>
                                            <code className="font-mono font-black text-primary uppercase text-lg">{certificateId}</code>
                                        </div>

                                        <div className="flex flex-col gap-4 max-w-sm mx-auto">
                                            <Button asChild className="h-16 rounded-full bg-primary font-black tracking-[0.2em] text-xs">
                                                <Link href={`/api/certificates/${certificateId}/download`}>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    DOWNLOAD PDF
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="h-16 rounded-full border-border font-black tracking-[0.2em] text-xs">
                                                <Link href={`/verify/${certificateId}`}>
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    VERIFY LIVE
                                                </Link>
                                            </Button>
                                        </div>

                                        <div className="max-w-sm mx-auto pt-4">
                                            <ShareButton
                                                title="Certification Logged"
                                                text="Official accomplishment secured via ZecurX."
                                                certificateId={certificateId || ""}
                                            />
                                        </div>

                                        <div className="pt-8 border-t border-border/50">
                                            <Link href="/resources/seminars">
                                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                                                    <ArrowLeft className="w-3 h-3 mr-2" />
                                                    Back to Resources
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Social Media Follow Modal */}
            <Dialog open={showSocialModal} onOpenChange={setShowSocialModal}>
                <DialogContent className="sm:max-w-md p-10 rounded-[2.5rem] border-border bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                    <DialogHeader className="text-center space-y-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
                            <Sparkles className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-3xl font-manrope font-bold">The Journey Continues.</DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm">
                                Elevate your offensive tactical capabilities with our advanced training modules.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="space-y-8 mt-10">
                        <Button
                            asChild
                            className="w-full h-16 rounded-full font-black tracking-[0.2em] text-xs bg-primary hover:opacity-90 shadow-xl shadow-primary/20"
                        >
                            <a href="/academy" target="_blank" rel="noopener noreferrer" onClick={() => setShowSocialModal(false)}>
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-4 h-4" />
                                    <span>EXPLORE ACADEMY</span>
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </a>
                        </Button>

                        <div className="space-y-6 pt-4 border-t border-border/50">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center">Intelligence Channels</p>
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="https://www.linkedin.com/company/zecurx/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-all font-bold text-xs"
                                >
                                    <Linkedin className="w-5 h-5 text-[#0077B5]" />
                                    LINKEDIN
                                </a>
                                <a
                                    href="https://www.instagram.com/zecurx?igsh=YWF3c3V5NHUxNGhu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-all font-bold text-xs"
                                >
                                    <Instagram className="w-5 h-5 text-[#E4405F]" />
                                    INSTAGRAM
                                </a>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                        onClick={() => setShowSocialModal(false)}
                    >
                        CLOSE BRIEFING
                    </Button>
                </DialogContent>
            </Dialog>
        </main>
    );
}
