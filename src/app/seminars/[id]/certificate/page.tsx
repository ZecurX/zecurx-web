"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Mail,
    FileText,
    XCircle,
    Award
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicSeminar, CertificateVerification } from "@/types/seminar";
import { ShareButton } from "@/app/verify/[certificateId]/ShareButton";
import { cn } from "@/lib/utils";

// --- Components adapted from HeroSectionV3 for Brand Consistency ---

function AnimatedGridPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div 
        className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
    </div>
  );
}

function BackgroundOrbs() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-30 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] opacity-30 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen" />
        </div>
    );
}

// --- Logic & Page Component ---

type Step = "email" | "otp" | "status" | "success";

interface CertificateStatus {
    hasRegistration: boolean;
    hasFeedback: boolean;
    hasCertificate: boolean;
    certificateId?: string;
    registrationId?: string;
    userName?: string;
}

export default function CertificatePage() {
    const params = useParams();
    const router = useRouter();
    const seminarId = params.id as string;

    const [seminar, setSeminar] = useState<PublicSeminar | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<Step>("email");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [status, setStatus] = useState<CertificateStatus | null>(null);
    const [certData, setCertData] = useState<CertificateVerification["certificate"]>(null);
    const [certLoading, setCertLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchCertificateData = useCallback(async (certId: string) => {
        setCertLoading(true);
        try {
            const response = await fetch(`/api/certificates/${certId}`);
            const data: CertificateVerification = await response.json();
            if (data.valid && data.certificate) {
                setCertData(data.certificate);
            }
        } catch {
            // Non-critical — preview just won't show
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

    const requestOtp = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/seminars/${seminarId}/certificate/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to send OTP");
            }

            if (result.bypass) {
                await verifyBypass();
            } else {
                setStep("otp");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyBypass = async () => {
        try {
            const response = await fetch(`/api/seminars/${seminarId}/certificate/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: "000000" }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Verification failed");
            }

            setStatus(result);

            if (result.hasCertificate && result.certificateId) {
                fetchCertificateData(result.certificateId);
                setStep("success");
            } else {
                setStep("status");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed");
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/seminars/${seminarId}/certificate/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Verification failed");
            }

            setStatus(result);

            if (result.hasCertificate && result.certificateId) {
                fetchCertificateData(result.certificateId);
                setStep("success");
            } else {
                setStep("status");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resendOtp = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/seminars/${seminarId}/certificate/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to resend OTP");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to resend");
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToFeedback = () => {
        const params = new URLSearchParams({
            email,
            ...(status?.userName && { name: status.userName }),
            ...(status?.registrationId && { registration: status.registrationId }),
        });
        router.push(`/seminars/${seminarId}/feedback?${params.toString()}`);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
                <BackgroundOrbs />
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground relative z-10" />
            </div>
        );
    }

    if (error && !seminar) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <BackgroundOrbs />
                <AnimatedGridPattern />
                <div className="relative z-10 text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mb-4 mx-auto" />
                    <h1 className="text-3xl font-manrope font-bold mb-2 tracking-tight">Seminar Not Found</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Link href="/resources/seminars">
                        <Button variant="outline" className="rounded-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Seminars
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!seminar?.certificate_enabled) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <BackgroundOrbs />
                <AnimatedGridPattern />
                <div className="relative z-10 text-center max-w-md">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-yellow-500/20">
                        <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h1 className="text-3xl font-manrope font-bold mb-3 tracking-tight">Certificates Pending</h1>
                    <p className="text-muted-foreground mb-8 text-center leading-relaxed">
                        Certificates for <span className="text-foreground font-medium">{seminar?.title}</span> are not available yet. Please check back after the seminar has concluded.
                    </p>
                    <Link href="/resources/seminars">
                        <Button variant="outline" className="rounded-full h-12 px-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Seminars
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <BackgroundOrbs />
            <AnimatedGridPattern />

            <div className={`relative z-10 mx-auto px-6 ${step === "success" ? "max-w-7xl" : "max-w-md"}`}>
                <Link
                    href="/resources/seminars"
                    className="inline-flex items-center text-sm text-muted-foreground mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Seminars
                </Link>

                {seminar && step !== "success" && (
                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-manrope font-semibold text-foreground mb-2 tracking-tight">{seminar.title}</h2>
                        <p className="text-sm text-muted-foreground">
                            Certificate Portal
                        </p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                        "bg-background/60 backdrop-blur-xl border border-border/30 dark:border-white/5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-10",
                        step === "success" ? "rounded-2xl sm:rounded-3xl" : "rounded-2xl sm:rounded-3xl"
                    )}
                >
                    {step === "email" && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]">
                                    <Award className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-4xl font-manrope font-bold mb-3 tracking-tighter text-foreground">Get Your Certificate</h1>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    Enter your registered email address to access your certificate of participation.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 rounded-2xl bg-background/50 border-border/60 focus:ring-primary/20 transition-all text-lg px-4"
                                        onKeyDown={(e) => e.key === "Enter" && requestOtp()}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-4 flex items-center gap-3 text-destructive text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={requestOtp}
                                    className="w-full h-14 rounded-full font-manrope font-bold text-lg shadow-[0_0_30px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.6)] transition-all"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>
                            </div>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                                    <Mail className="w-8 h-8 text-blue-500" />
                                </div>
                                <h1 className="text-4xl font-manrope font-bold mb-3 tracking-tighter text-foreground">Verify Email</h1>
                                <p className="text-muted-foreground text-lg">
                                    We&apos;ve sent a 6-digit code to <span className="text-foreground font-semibold">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="otp" className="text-center block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Enter Verification Code
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="h-20 text-center text-4xl tracking-[0.5em] font-mono font-medium rounded-2xl bg-background/50 border-border/60 focus:ring-primary/20 transition-all"
                                        maxLength={6}
                                        onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && verifyOtp()}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-4 flex items-center gap-3 text-destructive text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={verifyOtp}
                                    className="w-full h-14 rounded-full font-manrope font-bold text-lg shadow-[0_0_30px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.6)] transition-all"
                                    disabled={isSubmitting || otp.length !== 6}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </Button>

                                <div className="flex flex-col gap-3 text-center pt-4">
                                    <button
                                        type="button"
                                        onClick={resendOtp}
                                        className="text-sm text-primary hover:text-primary/80 transition-colors font-semibold"
                                        disabled={isSubmitting}
                                    >
                                        Resend Code
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep("email")}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Change email address
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {step === "status" && status && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-amber-500/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]">
                                    <FileText className="w-8 h-8 text-amber-500" />
                                </div>
                                <h1 className="text-4xl font-manrope font-bold mb-3 tracking-tighter text-foreground">Almost There</h1>
                                <p className="text-muted-foreground text-lg">
                                    {status.hasRegistration
                                        ? "Complete the feedback form to unlock your certificate."
                                        : "Certificate eligibility status."}
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className={cn(
                                    "flex items-center gap-4 p-5 rounded-2xl border transition-colors",
                                    status.hasRegistration ? "bg-emerald-500/5 border-emerald-500/20" : "bg-destructive/5 border-destructive/20"
                                )}>
                                    {status.hasRegistration ? (
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                                            <XCircle className="w-5 h-5 text-destructive" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className={cn("font-bold text-base", status.hasRegistration ? "text-emerald-700 dark:text-emerald-300" : "text-destructive")}>
                                            {status.hasRegistration ? "Registration Verified" : "Registration Not Found"}
                                        </p>
                                    </div>
                                </div>

                                {status.hasRegistration && (
                                    <div className={cn(
                                        "flex items-center gap-4 p-5 rounded-2xl border transition-colors",
                                        status.hasFeedback ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
                                    )}>
                                        {status.hasFeedback ? (
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className={cn("font-bold text-base", status.hasFeedback ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300")}>
                                                {status.hasFeedback ? "Feedback Submitted" : "Feedback Required"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {status.hasRegistration ? (
                                <Button
                                    onClick={goToFeedback}
                                    className="w-full h-14 rounded-full font-manrope font-bold text-lg shadow-[0_0_30px_-10px_rgba(245,158,11,0.4)] bg-amber-600 text-white border-0"
                                >
                                    Complete Feedback Form
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setStep("email")}
                                    variant="outline"
                                    className="w-full h-14 rounded-full border-border/60 font-semibold"
                                >
                                    Try Different Email
                                </Button>
                            )}
                        </>
                    )}

                    {step === "success" && status?.certificateId && (
                        certLoading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                    <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
                                </div>
                                <p className="text-muted-foreground animate-pulse font-manrope font-medium mt-6 text-lg">Issuing your certificate...</p>
                            </div>
                        ) : certData ? (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                                    
                                    <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                                        <div className="mb-8">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                Verified
                                            </div>
                                            
                                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-bold tracking-tighter mb-4 text-foreground leading-[0.95]">
                                                <span className="block mb-1">Congratulations,</span>
                                                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
                                                    {certData.recipientName.split(' ')[0]}!
                                                </span>
                                            </h1>
                                            
                                            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                                                You have successfully completed the <span className="text-foreground font-semibold">{seminar?.title}</span> seminar.
                                            </p>
                                        </div>

                                        <div className="space-y-6 mb-10">
                                            <div className="flex items-center justify-between py-4 px-5 rounded-2xl bg-muted/30 border border-border/50">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-0.5">Certificate ID</p>
                                                    <code className="font-mono text-lg sm:text-xl text-foreground font-bold tracking-tight">{certData.certificateId}</code>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(certData.certificateId)}
                                                    className="text-xs text-muted-foreground font-semibold px-3 py-1.5 rounded-full border border-border/60 bg-background/50"
                                                >
                                                    {copied ? "Copied!" : "Copy"}
                                                </button>
                                            </div>

                                            <Button 
                                                asChild 
                                                className="w-full h-14 sm:h-16 rounded-full font-manrope font-bold text-lg sm:text-xl shadow-[0_0_40px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-12px_rgba(255,255,255,0.15)] bg-primary text-primary-foreground border-0"
                                            >
                                                <Link href={`/api/certificates/${status.certificateId}/download`}>
                                                    Download Certificate
                                                </Link>
                                            </Button>
                                        </div>

                                        <div className="pt-8 border-t border-border/40">
                                            <p className="text-xs text-center text-muted-foreground uppercase tracking-widest font-bold mb-4">Share Your Achievement</p>
                                            <div className="flex justify-center">
                                                <ShareButton
                                                    title={`Certificate - ${certData.recipientName}`}
                                                    text={`I just received my certificate of participation from ${certData.seminarTitle} by ZecurX! 🎓 #Cybersecurity #Learning`}
                                                    certificateId={status.certificateId}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Preview & Upsell */}
                                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 sm:space-y-8">
                                        <div className="relative sm:pl-4 sm:pt-4">
                                            <div className="absolute top-0 right-0 -inset-4 bg-gradient-to-tr from-primary/20 via-blue-500/10 to-violet-500/20 rounded-[3rem] blur-3xl opacity-50" />
                                            <div className="relative rounded-2xl overflow-hidden bg-card border-[6px] border-card shadow-2xl ring-1 ring-border/30">
                                                <img
                                                    src={`/api/certificates/${status.certificateId}/preview?v=${Date.now()}`}
                                                    alt="Certificate Preview"
                                                    className="w-full h-auto block"
                                                />
                                                <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-background/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border/50 shadow-sm flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground/70">Digitally Verified</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Native Next Steps Card */}
                                        <div className="bg-background/40 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">What&apos;s Next</p>
                                            <h3 className="text-2xl font-manrope font-bold mb-3 tracking-tight">
                                                Advance Your Career
                                            </h3>
                                            <p className="text-muted-foreground mb-8 max-w-lg text-lg leading-relaxed">
                                                Master advanced cybersecurity skills with our industry-recognized certifications and hands-on labs.
                                            </p>
                                            <Button asChild size="lg" className="rounded-full h-12 px-8 font-semibold bg-foreground text-background shadow-lg">
                                                <Link href="/academy">
                                                    Explore Academy
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Fallback if preview fails (unlikely)
                             <div className="text-center py-12">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Certificate Issued</h2>
                                <p className="text-muted-foreground mb-6">Your certificate has been sent to {email}</p>
                                <Button asChild className="rounded-full">
                                    <Link href={`/api/certificates/${status.certificateId}/download`}>Download PDF</Link>
                                </Button>
                             </div>
                        )
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
