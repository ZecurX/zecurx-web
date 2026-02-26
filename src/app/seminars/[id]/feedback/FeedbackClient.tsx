"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Star,
    Clock,
} from "lucide-react";
import Link from "next/link";

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
    PublicSeminar,
    YEAR_OPTIONS,
    CAREER_INTERESTS,
} from "@/types/seminar";
import { cn } from "@/lib/utils";



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
                // Handle +91 prefix or standalone 10-digit number
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
    if (data.careerInterest) {
        if (!data.offensiveSecurityReason || data.offensiveSecurityReason.trim().length < 10) {
            return false;
        }
        const wordCount = data.offensiveSecurityReason.trim().split(/\s+/).length;
        return wordCount >= 3;
    }
    return true;
}, {
    message: "Please share what interests you about this field (minimum 10 characters and at least 3 words)",
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
    { id: 1, title: "Your Profile" },
    { id: 2, title: "Interests" },
    { id: 3, title: "Feedback" },
    { id: 4, title: "Certificate" },
    { id: 5, title: "Follow Us" },
];

export default function FeedbackPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const seminarId = params.id as string;
    const registrationId = searchParams.get("registration");
    const prefillEmail = searchParams.get("email");
    const prefillName = searchParams.get("name");

    const [seminar, setSeminar] = useState<PublicSeminar | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [registeredName, setRegisteredName] = useState<string | null>(null);
    const [nameChangeReason, setNameChangeReason] = useState('');
    const [showNameChangeReason, setShowNameChangeReason] = useState(false);
    const [nameChangeSubmitted, setNameChangeSubmitted] = useState(false);

    const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
    const [step2Data, setStep2Data] = useState<Step2Values | null>(null);
    const [step3Data, setStep3Data] = useState<Step3Values | null>(null);
    const [step4Data, setStep4Data] = useState<Step4Values | null>(null);

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
    };

    const handleStep2Submit = (data: Step2Values) => {
        setStep2Data(data);
        setCurrentStep(3);
    };

    const handleStep3Submit = (data: Step3Values) => {
        setStep3Data(data);
        setCurrentStep(4);
    };

    const handleStep4Submit = (data: Step4Values) => {
        setStep4Data(data);
        setCurrentStep(5);
    };

    const handleFinalSubmit = async () => {
        if (!step1Data || !step2Data || !step3Data || !step4Data) return;

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

                certificateName: step4Data.certificateName,
                seminarId,
                registrationId: registrationId || undefined,
                nameChangeReason: showNameChangeReason ? nameChangeReason.trim() : undefined,
            };

            const response = await fetch(`/api/seminars/${seminarId}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackPayload),
            });

            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error("Server error: Invalid response format");
            }

            if (!response.ok) {
                throw new Error(result.error || "Submission failed");
            }

            if (result.nameChangeRequested) {
                setNameChangeSubmitted(true);
                setCurrentStep(6);
            } else {
                const certId = result.certificate?.certificateId;
                if (certId) {
                    router.push(`/seminars/${seminarId}/certificate/${certId}`);
                    return;
                }
                setCurrentStep(6);
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
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error && !seminar) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Seminar Not Found</h1>
                <p className="text-muted-foreground font-medium mb-6 max-w-md">{error}</p>
                <Link href="/resources/seminars">
                    <button className="h-12 px-6 bg-card border border-border text-foreground hover:bg-muted rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Return to Seminars
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden py-12 md:py-24">
            {/* Background elements to match main form style if needed */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-card border border-border rounded-[2rem] p-5 md:px-8 md:py-6 shadow-xl relative flex flex-col">
                        {currentStep < 6 && (
                            <div className="mb-6 flex items-center justify-between relative px-2">
                                {/* Stepper Logic with fixed line offsets */}
                                <div className="absolute top-6 left-12 right-12 h-0.5 bg-muted -z-0"></div>
                                <div
                                    className="absolute top-6 left-12 right-12 h-0.5 bg-foreground transition-all duration-500 z-0 origin-left"
                                    style={{ transform: `scaleX(${(currentStep - 1) / (STEPS.length - 1)})` }}
                                ></div>
                                {STEPS.map((step, idx) => (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 w-24">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-sm transition-all duration-500 border",
                                            currentStep === step.id
                                                ? "bg-foreground border-foreground text-background shadow-lg scale-110"
                                                : currentStep > step.id
                                                    ? "bg-muted border-border text-foreground"
                                                    : "bg-background border-muted text-border"
                                        )}>
                                            {currentStep > idx + 1 ? <CheckCircle2 className="w-5 h-5" /> : `0${step.id}`}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold tracking-wider hidden md:block",
                                            currentStep === step.id ? "text-foreground" : "text-border"
                                        )}>
                                            {step.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="w-full">

                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full"
                                    >
                                        <div className="space-y-1 mb-6">
                                            <h3 className="text-lg font-bold text-foreground">Personal Details</h3>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Please provide your information for accurate certificate issuance.
                                            </p>
                                        </div>

                                        <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-5 relative z-10 w-full">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="fullName" className="text-xs font-bold text-foreground ml-1">Full Name *</Label>
                                                    <Input
                                                        id="fullName"
                                                        placeholder="Enter your full name"
                                                        {...step1Form.register("fullName")}
                                                        className={cn(
                                                            "h-10 px-3 bg-muted/50 border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-300 text-foreground placeholder:text-muted-foreground text-sm",
                                                            step1Form.formState.errors.fullName && "border-red-500 bg-red-50"
                                                        )}
                                                    />
                                                    {step1Form.formState.errors.fullName && (
                                                        <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step1Form.formState.errors.fullName.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="email" className="text-xs font-bold text-foreground ml-1">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="you@email.com"
                                                        {...step1Form.register("email")}
                                                        className={cn(
                                                            "h-10 px-3 bg-muted/50 border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-300 text-foreground placeholder:text-muted-foreground text-sm",
                                                            step1Form.formState.errors.email && "border-red-500 bg-red-50"
                                                        )}
                                                    />
                                                    {step1Form.formState.errors.email && (
                                                        <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step1Form.formState.errors.email.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="collegeName" className="text-xs font-bold text-foreground ml-1">College / Organization Name *</Label>
                                                <Input
                                                    id="collegeName"
                                                    placeholder="Enter institution name"
                                                    {...step1Form.register("collegeName")}
                                                    className={cn(
                                                        "h-10 px-3 bg-muted/50 border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-300 text-foreground placeholder:text-muted-foreground text-sm",
                                                        step1Form.formState.errors.collegeName && "border-red-500 bg-red-50"
                                                    )}
                                                />
                                                {step1Form.formState.errors.collegeName && (
                                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step1Form.formState.errors.collegeName.message}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="year" className="text-xs font-bold text-foreground ml-1">Current Year of Study *</Label>
                                                    <Select onValueChange={(value) => step1Form.setValue("year", value)}>
                                                        <SelectTrigger className={cn(
                                                            "h-10 bg-muted/50 border-border rounded-lg focus:ring-1 focus:ring-foreground focus:border-foreground focus:bg-background transition-all duration-300 text-foreground text-sm",
                                                            step1Form.formState.errors.year && "border-red-500 bg-red-50"
                                                        )}>
                                                            <SelectValue placeholder="Select Year" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-background border-border text-foreground">
                                                            {YEAR_OPTIONS.map((year) => (
                                                                <SelectItem key={year} value={year} className="focus:bg-muted cursor-pointer">
                                                                    {year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {step1Form.formState.errors.year && (
                                                        <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step1Form.formState.errors.year.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="cityState" className="text-xs font-bold text-foreground ml-1">Your Location (City, State) *</Label>
                                                    <Input
                                                        id="cityState"
                                                        placeholder="e.g. Mumbai, Maharashtra"
                                                        {...step1Form.register("cityState")}
                                                        className={cn(
                                                            "h-10 px-3 bg-muted/50 border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-300 text-foreground placeholder:text-muted-foreground text-sm",
                                                            step1Form.formState.errors.cityState && "border-red-500 bg-red-50"
                                                        )}
                                                    />
                                                    {step1Form.formState.errors.cityState && (
                                                        <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step1Form.formState.errors.cityState.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="reminderContact" className="text-xs font-bold text-foreground ml-1">Contact Number (WhatsApp) *</Label>
                                                <Input
                                                    id="reminderContact"
                                                    placeholder="Enter 10-digit number"
                                                    {...step1Form.register("reminderContact")}
                                                    className={cn(
                                                        "h-10 px-3 bg-muted/50 border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-300 text-foreground placeholder:text-muted-foreground text-sm",
                                                        step1Form.formState.errors.reminderContact && "border-red-500 bg-red-50"
                                                    )}
                                                />
                                                {step1Form.formState.errors.reminderContact && (
                                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step1Form.formState.errors.reminderContact.message}</p>
                                                )}
                                            </div>

                                            <div className="pt-6 flex items-center justify-center border-t border-border mt-2">
                                                <div className="w-full max-w-[280px]">
                                                    <button
                                                        type="submit"
                                                        className="w-full h-10 rounded-lg bg-foreground text-background font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 group"
                                                    >
                                                        Next Step
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full"
                                    >
                                        <div className="space-y-1 mb-6">
                                            <h3 className="text-lg font-bold text-foreground">Professional Interests</h3>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Help us tailor our future training according to your interests.
                                            </p>
                                        </div>

                                        <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-5 relative z-10 w-full">
                                            <div className="space-y-4">
                                                <Label className="text-xs font-bold text-foreground ml-1 block">Primary Career Interest *</Label>
                                                <RadioGroup
                                                    onValueChange={(value) => step2Form.setValue("careerInterest", value)}
                                                    className="grid gap-3"
                                                >
                                                    {CAREER_INTERESTS.map((interest) => (
                                                        <div
                                                            key={interest}
                                                            className={cn(
                                                                "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer group",
                                                                step2Form.watch("careerInterest") === interest
                                                                    ? "bg-foreground border-foreground shadow-md ring-1 ring-foreground"
                                                                    : "bg-background border-border hover:bg-muted hover:border-border"
                                                            )}
                                                        >
                                                            <RadioGroupItem value={interest} id={interest} className="border-muted-foreground text-background data-[state=checked]:border-background data-[state=checked]:text-background scale-75" />
                                                            <Label
                                                                htmlFor={interest}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 font-bold select-none transition-colors text-sm",
                                                                    step2Form.watch("careerInterest") === interest ? "text-background" : "text-foreground group-hover:text-foreground"
                                                                )}
                                                            >
                                                                {interest}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                                {step2Form.formState.errors.careerInterest && (
                                                    <p className="text-xs text-red-500 font-medium ml-1">{step2Form.formState.errors.careerInterest.message}</p>
                                                )}
                                            </div>

                                            {!!step2Form.watch("careerInterest") && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="space-y-2"
                                                >
                                                    <Label htmlFor="offensiveSecurityReason" className="text-xs font-bold text-foreground mb-1 ml-1 block">
                                                        Why are you interested in this field?
                                                    </Label>
                                                    <Textarea
                                                        id="offensiveSecurityReason"
                                                        placeholder="What specifically interests you about this field?"
                                                        {...step2Form.register("offensiveSecurityReason")}
                                                        className={cn(
                                                            "min-h-[80px] bg-muted/50 border-border rounded-lg px-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-foreground focus:border-foreground focus:bg-background transition-all duration-300 resize-none text-sm",
                                                            step2Form.formState.errors.offensiveSecurityReason && "border-red-500 bg-red-50"
                                                        )}
                                                    />
                                                    {step2Form.formState.errors.offensiveSecurityReason && (
                                                        <p className="text-xs text-red-500 font-medium ml-1">{step2Form.formState.errors.offensiveSecurityReason.message}</p>
                                                    )}
                                                </motion.div>
                                            )}

                                            <div className="pt-6 flex flex-col items-center gap-3 border-t border-border mt-2">
                                                <div className="w-full max-w-[280px]">
                                                    <button
                                                        type="submit"
                                                        className="w-full h-10 rounded-lg bg-foreground text-background font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 group"
                                                    >
                                                        Next Step
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={goBack}
                                                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                                                >
                                                    Go Back
                                                </button>
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
                                        transition={{ duration: 0.3 }}
                                        className="w-full"
                                    >
                                        <div className="space-y-1 mb-6 text-center">
                                            <h3 className="text-lg font-bold text-foreground">Seminar Feedback</h3>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Your feedback helps us improve future sessions.
                                            </p>
                                        </div>

                                        <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-5 relative z-10 w-full">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-bold text-foreground block text-center">Overall Session Rating (1-5) *</Label>
                                                <div className="flex gap-3 justify-center">
                                                    {[1, 2, 3, 4, 5].map((rating) => (
                                                        <button
                                                            key={rating}
                                                            type="button"
                                                            onClick={() => step3Form.setValue("seminarRating", rating)}
                                                            className="group relative"
                                                        >
                                                            <Star
                                                                className={cn(
                                                                    "w-8 h-8 transition-all duration-300",
                                                                    step3Form.watch("seminarRating") >= rating
                                                                        ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-md"
                                                                        : "text-muted-foreground group-hover:text-amber-200"
                                                                )}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                {step3Form.formState.errors.seminarRating && (
                                                    <p className="text-xs text-red-500 font-medium text-center">
                                                        {step3Form.formState.errors.seminarRating.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="mostValuablePart" className="text-xs font-bold text-foreground ml-1 block">
                                                    What did you find most valuable? *
                                                </Label>
                                                <Textarea
                                                    id="mostValuablePart"
                                                    placeholder="Share your key takeaways..."
                                                    {...step3Form.register("mostValuablePart")}
                                                    className={cn(
                                                        "min-h-[80px] bg-muted/50 border-border rounded-lg px-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground focus:bg-background transition-all duration-300 resize-none text-sm",
                                                        step3Form.formState.errors.mostValuablePart && "border-red-500 bg-red-50"
                                                    )}
                                                />
                                                {step3Form.formState.errors.mostValuablePart && (
                                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step3Form.formState.errors.mostValuablePart.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="futureSuggestions" className="text-xs font-bold text-foreground ml-1 block">
                                                    Suggestions for Future Topics *
                                                </Label>
                                                <Textarea
                                                    id="futureSuggestions"
                                                    placeholder="What would you like us to cover next?"
                                                    {...step3Form.register("futureSuggestions")}
                                                    className={cn(
                                                        "min-h-[80px] bg-muted/50 border-border rounded-lg px-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground focus:bg-background transition-all duration-300 resize-none text-sm",
                                                        step3Form.formState.errors.futureSuggestions && "border-red-500 bg-red-50"
                                                    )}
                                                />
                                                {step3Form.formState.errors.futureSuggestions && (
                                                    <p className="text-xs text-red-500 font-bold mt-1 ml-1">{step3Form.formState.errors.futureSuggestions.message}</p>
                                                )}
                                            </div>

                                            <Controller
                                                name="joinZecurx"
                                                control={step3Form.control}
                                                render={({ field }) => (
                                                    <label
                                                        className={cn(
                                                            "flex items-start space-x-4 p-5 rounded-xl border cursor-pointer transition-all duration-300",
                                                            field.value
                                                                    ? "bg-foreground border-foreground shadow-md"
                                                                    : "bg-background border-border hover:bg-muted hover:border-border"
                                                        )}
                                                    >
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="mt-1 border-muted-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground"
                                                        />
                                                        <div className="space-y-1">
                                                            <span className={cn("cursor-pointer font-bold text-xs block", field.value ? "text-background" : "text-foreground")}>
                                                                Join the ZecurX Community
                                                            </span>
                                                            <p className={cn("text-[10px]", field.value ? "text-muted-foreground" : "text-muted-foreground")}>
                                                                Receive updates on workshops, career opportunities, and advanced modules.
                                                            </p>
                                                        </div>
                                                    </label>
                                                )}
                                            />

                                            <div className="pt-6 flex flex-col items-center gap-3 border-t border-border mt-2">
                                                <div className="w-full max-w-[280px]">
                                                    <button
                                                        type="submit"
                                                        className="w-full h-10 rounded-lg bg-foreground text-background font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 group"
                                                    >
                                                        Next Step
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={goBack}
                                                    className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                                                >
                                                    Go Back
                                                </button>
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
                                        transition={{ duration: 0.3 }}
                                        className="w-full"
                                    >
                                        <div className="space-y-1 mb-6 text-center">
                                            <h3 className="text-lg font-bold text-foreground">Certificate Details</h3>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Confirm your name as it should appear on your certificate.
                                            </p>
                                        </div>

                                        <form onSubmit={step4Form.handleSubmit(handleStep4Submit)} className="space-y-6 relative z-10 w-full">
                                            <div className="space-y-3 text-center">
                                                <Label htmlFor="certificateName" className="text-xs font-bold text-foreground mb-2 block text-center">Name on Certificate</Label>
                                                <Input
                                                    id="certificateName"
                                                    placeholder="Your full name"
                                                    {...step4Form.register("certificateName")}
                                                    className={cn(
                                                        "h-16 text-center text-2xl font-bold bg-muted/50 border-border rounded-xl focus:border-foreground focus:ring-foreground focus:bg-background transition-all duration-300 px-4 text-foreground placeholder:text-border",
                                                        step4Form.formState.errors.certificateName && "border-red-500 text-red-500 bg-red-50"
                                                    )}
                                                />
                                                {step4Form.formState.errors.certificateName && (
                                                    <p className="text-xs text-red-500 font-medium text-center">
                                                        {step4Form.formState.errors.certificateName.message}
                                                    </p>
                                                )}
                                            </div>

                                            {showNameChangeReason && registeredName && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="space-y-4"
                                                >
                                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                                        <div className="flex items-start gap-4">
                                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                                                                    Name Confirmation Required
                                                                </p>
                                                                <p className="text-sm leading-relaxed text-muted-foreground">
                                                                    The name provided differs from your registered name (<span className="text-foreground font-bold">{registeredName}</span>).
                                                                    Please provide a reason for this change for our records.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label htmlFor="nameChangeReason" className="text-xs font-bold text-foreground mb-1 ml-1 block">
                                                            Reason for Name Change
                                                        </Label>
                                                        <Textarea
                                                            id="nameChangeReason"
                                                            placeholder="e.g. Correction of spelling, legal name change..."
                                                            value={nameChangeReason}
                                                            onChange={(e) => setNameChangeReason(e.target.value)}
                                                            className={cn(
                                                                "min-h-[80px] bg-muted/50 border-border rounded-lg px-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-foreground focus:border-foreground focus:ring-1 focus:bg-background transition-all duration-300 resize-none text-sm",
                                                                nameChangeReason.trim().length > 0 && nameChangeReason.trim().length < 10 && "border-red-500 bg-red-50"
                                                            )}
                                                        />
                                                        {nameChangeReason.trim().length > 0 && nameChangeReason.trim().length < 10 && (
                                                            <p className="text-xs text-red-500 font-medium ml-1">
                                                                Please provide at least 10 characters ({nameChangeReason.trim().length}/10)
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="pt-6 flex flex-col items-center gap-3 border-t border-border mt-2">
                                                <div className="w-full max-w-[280px]">
                                                    <button
                                                        type="submit"
                                                        className="w-full h-10 rounded-lg bg-foreground text-background font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 group"
                                                    >
                                                        Next Step
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={goBack}
                                                    className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                                                >
                                                    Go Back
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {currentStep === 5 && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full"
                                    >
                                        <div className="space-y-1 mb-6 text-center">
                                            <h3 className="text-lg font-bold text-foreground">Stay Connected</h3>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Follow us on social media to stay updated on cybersecurity news and upcoming events.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {[
                                                {
                                                    name: "LinkedIn",
                                                    url: "https://www.linkedin.com/company/zecurx",
                                                    color: "bg-[#0A66C2]",
                                                    icon: (
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                                    ),
                                                },
                                                {
                                                    name: "Instagram",
                                                    url: "https://www.instagram.com/zecurx",
                                                    color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
                                                    icon: (
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                                    ),
                                                },
                                                {
                                                    name: "X (Twitter)",
                                                    url: "https://x.com/zecurx",
                                                    color: "bg-black",
                                                    icon: (
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                                    ),
                                                },
                                            ].map((social) => (
                                                <a
                                                    key={social.name}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-300 group"
                                                >
                                                    <div className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center shrink-0`}>
                                                        {social.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm text-foreground">{social.name}</p>
                                                        <p className="text-[11px] text-muted-foreground">@zecurx</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                                                </a>
                                            ))}
                                        </div>

                                        <div className="pt-6 flex flex-col items-center gap-3 border-t border-border mt-6">
                                            <div className="w-full max-w-[280px]">
                                                <button
                                                    type="button"
                                                    onClick={handleFinalSubmit}
                                                    disabled={isSubmitting}
                                                    className="w-full h-10 rounded-lg bg-foreground text-background font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Submit Feedback
                                                            <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleFinalSubmit}
                                                disabled={isSubmitting}
                                                className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                                            >
                                                Skip & Submit
                                            </button>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-600 mt-6">
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                <p className="text-[11px] font-mono uppercase tracking-widest font-bold">{error}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {currentStep === 6 && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full"
                                >
                                    {nameChangeSubmitted ? (
                                        <div className="bg-card border border-border rounded-[2.5rem] p-12 shadow-xl relative overflow-hidden text-center">
                                            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100 shadow-sm">
                                                <Clock className="w-12 h-12 text-amber-500" />
                                            </div>
                                            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">Request Received</h1>
                                            <p className="text-muted-foreground text-sm font-medium mb-10 max-w-md mx-auto leading-relaxed">
                                                Your name change request has been submitted for review.
                                                The certificate will be issued once the request is approved by our administration team.
                                            </p>

                                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-10 inline-block w-full max-w-md">
                                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                                                    Review in Progress
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-2 font-medium">
                                                    You will receive an email notification once your certificate is ready.
                                                </p>
                                            </div>

                                            <Link href="/resources/seminars">
                                                <button className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
                                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                                    Back to Seminars
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="bg-card border border-border rounded-[2.5rem] p-12 shadow-xl relative overflow-hidden text-center">
                                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
                                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                            </div>
                                            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">Feedback Received</h1>
                                            <p className="text-muted-foreground text-sm font-medium mb-10 max-w-md mx-auto leading-relaxed">
                                                Thank you for your feedback. Your certificate will be available shortly.
                                            </p>

                                            <Link href="/resources/seminars">
                                                <button className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
                                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                                    Back to Seminars
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}


