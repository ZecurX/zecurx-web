"use client";

import React, { useState, useEffect } from "react";
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
    X,
    ExternalLink,
    BookOpen,
    Linkedin,
    Instagram
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
    reminderContact: z.string().min(10, "Phone/WhatsApp number is required"),
});

const step2Schema = z.object({
    careerInterest: z.string().min(1, "Please select your career interest"),
    offensiveSecurityReason: z.string().optional(),
}).refine((data) => {
    if (data.careerInterest === "Ethical Hacking & Offensive Security") {
        return data.offensiveSecurityReason && data.offensiveSecurityReason.trim().length > 0;
    }
    return true;
}, {
    message: "Please tell us what excites you about offensive security",
    path: ["offensiveSecurityReason"],
});

const step3Schema = z.object({
    seminarRating: z.number().min(1, "Please rate the seminar").max(5),
    mostValuablePart: z.string().min(10, "Please share what you found most valuable (minimum 10 characters)"),
    futureSuggestions: z.string().min(10, "Please suggest topics for future seminars (minimum 10 characters)"),
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
    { id: 1, title: "Your Info" },
    { id: 2, title: "Career Interest" },
    { id: 3, title: "Feedback" },
    { id: 4, title: "Certificate" },
];

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
    }, [prefillName, prefillEmail, step1Data, step1Form, step4Form]);

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

    const handleFinalSubmit = async (data: Step4Values) => {
        if (!step1Data || !step2Data || !step3Data) return;

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

            setCertificateId(result.certificateId);
            setCurrentStep(5);
            setShowSocialModal(true);
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Seminar Not Found</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link href="/resources/seminars">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Seminars
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-2xl mx-auto px-6">
                <Link
                    href="/resources/seminars"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Seminars
                </Link>

                {seminar && currentStep < 5 && (
                    <div className="bg-muted/30 rounded-2xl p-6 mb-8 border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-2">{seminar.title}</h2>
                        <p className="text-sm text-muted-foreground">
                            Complete this form to receive your certificate of participation
                        </p>
                    </div>
                )}

                {currentStep < 5 && (
                    <div className="flex items-center justify-between mb-8">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                                            currentStep === step.id
                                                ? "bg-primary text-primary-foreground"
                                                : currentStep > step.id
                                                    ? "bg-green-500 text-white"
                                                    : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {currentStep > step.id ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            step.id
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground mt-2 hidden sm:block">
                                        {step.title}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            "flex-1 h-0.5 mx-2",
                                            currentStep > step.id ? "bg-green-500" : "bg-muted"
                                        )}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-lg"
                >
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold mb-2">Your Information</h1>
                                <p className="text-muted-foreground mb-8">
                                    Please provide your details for the certificate
                                </p>

                                <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="fullName" className="flex items-center gap-2">
                                            <User className="w-4 h-4" /> Full Name *
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            {...step1Form.register("fullName")}
                                            className={`h-12 ${step1Form.formState.errors.fullName ? "border-red-500" : ""}`}
                                        />
                                        {step1Form.formState.errors.fullName && (
                                            <p className="text-xs text-red-500">{step1Form.formState.errors.fullName.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            {...step1Form.register("email")}
                                            className={`h-12 ${step1Form.formState.errors.email ? "border-red-500" : ""}`}
                                        />
                                        {step1Form.formState.errors.email && (
                                            <p className="text-xs text-red-500">{step1Form.formState.errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="collegeName" className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4" /> College/University *
                                        </Label>
                                        <Input
                                            id="collegeName"
                                            placeholder="Your institution"
                                            {...step1Form.register("collegeName")}
                                            className={`h-12 ${step1Form.formState.errors.collegeName ? "border-red-500" : ""}`}
                                        />
                                        {step1Form.formState.errors.collegeName && (
                                            <p className="text-xs text-red-500">{step1Form.formState.errors.collegeName.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="year">Year *</Label>
                                            <Select onValueChange={(value) => step1Form.setValue("year", value)}>
                                                <SelectTrigger className={`h-12 ${step1Form.formState.errors.year ? "border-red-500" : ""}`}>
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {YEAR_OPTIONS.map((year) => (
                                                        <SelectItem key={year} value={year}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {step1Form.formState.errors.year && (
                                                <p className="text-xs text-red-500">{step1Form.formState.errors.year.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="cityState" className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> City/State *
                                            </Label>
                                            <Input
                                                id="cityState"
                                                placeholder="Bangalore, KA"
                                                {...step1Form.register("cityState")}
                                                className={`h-12 ${step1Form.formState.errors.cityState ? "border-red-500" : ""}`}
                                            />
                                            {step1Form.formState.errors.cityState && (
                                                <p className="text-xs text-red-500">{step1Form.formState.errors.cityState.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="reminderContact" className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> WhatsApp/Phone *
                                        </Label>
                                        <Input
                                            id="reminderContact"
                                            placeholder="+91 98765 43210"
                                            {...step1Form.register("reminderContact")}
                                            className={`h-12 ${step1Form.formState.errors.reminderContact ? "border-red-500" : ""}`}
                                        />
                                        {step1Form.formState.errors.reminderContact && (
                                            <p className="text-xs text-red-500">{step1Form.formState.errors.reminderContact.message}</p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full h-12 rounded-xl font-semibold">
                                        Continue
                                        <ArrowRight className="w-4 h-4 ml-2" />
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
                            >
                                <h1 className="text-2xl font-bold mb-2">Career Interests</h1>
                                <p className="text-muted-foreground mb-8">
                                    Help us understand your career path preferences
                                </p>

                                <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
                                    <div className="space-y-4">
                                        <Label>Which career path interests you the most? *</Label>
                                        <RadioGroup
                                            onValueChange={(value: string) => step2Form.setValue("careerInterest", value)}
                                            className="space-y-3"
                                        >
                                            {CAREER_INTERESTS.map((interest) => (
                                                <div
                                                    key={interest}
                                                    className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                                >
                                                    <RadioGroupItem value={interest} id={interest} />
                                                    <Label htmlFor={interest} className="cursor-pointer flex-1">
                                                        {interest}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        {step2Form.formState.errors.careerInterest && (
                                            <p className="text-xs text-red-500">{step2Form.formState.errors.careerInterest.message}</p>
                                        )}
                                    </div>

                                    {step2Form.watch("careerInterest") === "Ethical Hacking & Offensive Security" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-3"
                                        >
                                            <Label htmlFor="offensiveSecurityReason">
                                                What excites you about offensive security? *
                                            </Label>
                                            <Textarea
                                                id="offensiveSecurityReason"
                                                placeholder="Tell us what draws you to this field..."
                                                {...step2Form.register("offensiveSecurityReason")}
                                                className={`min-h-[100px] ${step2Form.formState.errors.offensiveSecurityReason ? "border-red-500" : ""}`}
                                            />
                                            {step2Form.formState.errors.offensiveSecurityReason && (
                                                <p className="text-xs text-red-500">{step2Form.formState.errors.offensiveSecurityReason.message}</p>
                                            )}
                                        </motion.div>
                                    )}

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={goBack} className="flex-1 h-12 rounded-xl">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button type="submit" className="flex-1 h-12 rounded-xl font-semibold">
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
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
                            >
                                <h1 className="text-2xl font-bold mb-2">Seminar Feedback</h1>
                                <p className="text-muted-foreground mb-8">
                                    Your feedback helps us improve future seminars
                                </p>

                                <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-6">
                                    <div className="space-y-4">
                                        <Label>How would you rate this seminar? *</Label>
                                        <div className="flex gap-2 justify-center">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() => step3Form.setValue("seminarRating", rating)}
                                                    className="p-2 transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={cn(
                                                            "w-10 h-10 transition-colors",
                                                            step3Form.watch("seminarRating") >= rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-muted-foreground"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {step3Form.formState.errors.seminarRating && (
                                            <p className="text-xs text-red-500 text-center">
                                                {step3Form.formState.errors.seminarRating.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="mostValuablePart">
                                            What was the most valuable part of this seminar? *
                                        </Label>
                                        <Textarea
                                            id="mostValuablePart"
                                            placeholder="Share what you found most useful..."
                                            {...step3Form.register("mostValuablePart")}
                                            className={`min-h-[80px] ${step3Form.formState.errors.mostValuablePart ? "border-red-500" : ""}`}
                                        />
                                        {step3Form.formState.errors.mostValuablePart && (
                                            <p className="text-xs text-red-500">{step3Form.formState.errors.mostValuablePart.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="futureSuggestions">
                                            What topics would you like us to cover in future seminars? *
                                        </Label>
                                        <Textarea
                                            id="futureSuggestions"
                                            placeholder="Suggest topics for future sessions..."
                                            {...step3Form.register("futureSuggestions")}
                                            className={`min-h-[80px] ${step3Form.formState.errors.futureSuggestions ? "border-red-500" : ""}`}
                                        />
                                        {step3Form.formState.errors.futureSuggestions && (
                                            <p className="text-xs text-red-500">{step3Form.formState.errors.futureSuggestions.message}</p>
                                        )}
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 rounded-xl border border-border bg-primary/5">
                                        <Checkbox
                                            id="joinZecurx"
                                            onCheckedChange={(checked: boolean | "indeterminate") =>
                                                step3Form.setValue("joinZecurx", checked === true)
                                            }
                                        />
                                        <div className="space-y-1">
                                            <Label htmlFor="joinZecurx" className="cursor-pointer font-medium">
                                                I&apos;m interested in joining ZecurX
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Get updates about courses, workshops, and career opportunities
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={goBack} className="flex-1 h-12 rounded-xl">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button type="submit" className="flex-1 h-12 rounded-xl font-semibold">
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
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
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-8 h-8 text-primary" />
                                    </div>
                                    <h1 className="text-2xl font-bold mb-2">Confirm Certificate Name</h1>
                                    <p className="text-muted-foreground">
                                        This name will appear on your certificate exactly as entered
                                    </p>
                                </div>

                                <form onSubmit={step4Form.handleSubmit(handleFinalSubmit)} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="certificateName">Name on Certificate *</Label>
                                        <Input
                                            id="certificateName"
                                            placeholder="Your full name"
                                            {...step4Form.register("certificateName")}
                                            className={`h-14 text-center text-lg font-medium ${step4Form.formState.errors.certificateName ? "border-red-500" : ""}`}
                                        />
                                        {step4Form.formState.errors.certificateName && (
                                            <p className="text-xs text-red-500 text-center">
                                                {step4Form.formState.errors.certificateName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
                                        <p className="font-medium text-foreground mb-2">Certificate Preview</p>
                                        <p>
                                            This is to certify that{" "}
                                            <span className="font-semibold text-foreground">
                                                {step4Form.watch("certificateName") || "Your Name"}
                                            </span>{" "}
                                            has successfully participated in{" "}
                                            <span className="font-semibold text-foreground">{seminar?.title}</span>
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={goBack} className="flex-1 h-12 rounded-xl">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 h-12 rounded-xl font-semibold"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Generating Certificate...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate Certificate
                                                </>
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
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-10 h-10 text-green-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Certificate Sent!</h1>
                                <p className="text-muted-foreground mb-8">
                                    Your certificate has been sent to your email address. Please check your inbox (and spam folder) for the certificate PDF.
                                </p>

                                <div className="bg-muted/50 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-muted-foreground mb-1">Certificate ID</p>
                                    <p className="font-mono font-semibold text-foreground">{certificateId}</p>
                                </div>

                                <div className="space-y-4">
                                    <Link href={`/verify/${certificateId}`}>
                                        <Button variant="outline" className="w-full h-12 rounded-xl">
                                            <Award className="w-4 h-4 mr-2" />
                                            Verify Certificate Online
                                        </Button>
                                    </Link>

                                    <Link href="/resources/seminars">
                                        <Button variant="ghost" className="w-full">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to Seminars
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Social Media Follow Modal */}
            <AnimatePresence>
                {showSocialModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-50"
                            onClick={() => setShowSocialModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                                <button
                                    type="button"
                                    onClick={() => setShowSocialModal(false)}
                                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>

                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Keep Learning with ZecurX!</h2>
                                    <p className="text-muted-foreground">
                                        Continue your cybersecurity journey with our comprehensive courses
                                    </p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <Button
                                        asChild
                                        className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90"
                                    >
                                        <a 
                                            href="/academy" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={() => setShowSocialModal(false)}
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Explore Our Courses
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </a>
                                    </Button>

                                    <div className="border-t border-border pt-4">
                                        <p className="text-sm text-muted-foreground mb-3 text-center">
                                            Stay connected for updates & insights
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <a
                                                href="https://www.linkedin.com/company/zecurx/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border hover:bg-muted transition-colors"
                                            >
                                                <Linkedin className="w-5 h-5 text-[#0077B5]" />
                                                <span className="font-medium text-sm">LinkedIn</span>
                                            </a>
                                            <a
                                                href="https://www.instagram.com/zecurx?igsh=YWF3c3V5NHUxNGhu"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border hover:bg-muted transition-colors"
                                            >
                                                <Instagram className="w-5 h-5 text-[#E4405F]" />
                                                <span className="font-medium text-sm">Instagram</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setShowSocialModal(false)}
                                >
                                    Maybe Later
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
