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
        <div className="min-h-screen bg-background relative overflow-hidden font-sans">
            <BackgroundOrbs />
            <AnimatedGridPattern />

            <div className={cn(
                "relative z-10 mx-auto px-4 sm:px-6",
                step === "success" ? "max-w-7xl pt-24 pb-12" : "max-w-[420px] flex flex-col items-center justify-center min-h-screen py-12"
            )}>
                {step === "success" && (
                    <Link
                        href="/resources/seminars"
                        className="inline-flex items-center text-sm text-muted-foreground mb-8"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                        Seminars
                    </Link>
                )}

                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                        step === "success"
                            ? "bg-background/60 backdrop-blur-xl border border-border/30 dark:border-white/5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10"
                            : "w-full"
                    )}
                >
                    {step === "email" && (
                        <div className="w-full">
                            <div className="text-center mb-8">
                                {seminar && (
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-6">{seminar.title}</p>
                                )}
                                <h1 className="text-2xl font-manrope font-bold tracking-tight text-foreground mb-2">Get your certificate</h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your registered email to continue.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 rounded-lg text-sm"
                                        onKeyDown={(e) => e.key === "Enter" && requestOtp()}
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-destructive">{error}</p>
                                )}

                                <Button
                                    onClick={requestOtp}
                                    className="w-full h-11 rounded-lg font-medium text-sm"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending code...
                                        </>
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border/40">
                                <Link
                                    href="/resources/seminars"
                                    className="flex items-center justify-center text-sm text-muted-foreground"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                                    Back to seminars
                                </Link>
                            </div>
                        </div>
                    )}

                    {step === "otp" && (
                        <div className="w-full">
                            <div className="text-center mb-8">
                                {seminar && (
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-6">{seminar.title}</p>
                                )}
                                <h1 className="text-2xl font-manrope font-bold tracking-tight text-foreground mb-2">Check your email</h1>
                                <p className="text-sm text-muted-foreground">
                                    We sent a code to <span className="text-foreground font-medium">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="otp" className="text-sm font-medium text-foreground text-center block">
                                        Verification code
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="h-14 text-center text-2xl tracking-[0.35em] font-mono font-medium rounded-lg"
                                        maxLength={6}
                                        onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && verifyOtp()}
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-destructive">{error}</p>
                                )}

                                <Button
                                    onClick={verifyOtp}
                                    className="w-full h-11 rounded-lg font-medium text-sm"
                                    disabled={isSubmitting || otp.length !== 6}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify"
                                    )}
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-center gap-3 text-sm">
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    className="text-muted-foreground font-medium"
                                    disabled={isSubmitting}
                                >
                                    Resend code
                                </button>
                                <span className="text-border">&middot;</span>
                                <button
                                    type="button"
                                    onClick={() => setStep("email")}
                                    className="text-muted-foreground font-medium"
                                >
                                    Change email
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "status" && status && (
                        <div className="w-full">
                            <div className="text-center mb-8">
                                {seminar && (
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-6">{seminar.title}</p>
                                )}
                                <h1 className="text-2xl font-manrope font-bold tracking-tight text-foreground mb-2">Almost there</h1>
                                <p className="text-sm text-muted-foreground">
                                    {status.hasRegistration
                                        ? "Complete feedback to get your certificate."
                                        : "We couldn\u2019t find a registration for this email."}
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm",
                                    status.hasRegistration ? "border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "border-destructive/20 text-destructive"
                                )}>
                                    {status.hasRegistration ? (
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    ) : (
                                        <XCircle className="w-4 h-4 shrink-0" />
                                    )}
                                    <span className="font-medium">
                                        {status.hasRegistration ? "Registration verified" : "Registration not found"}
                                    </span>
                                </div>

                                {status.hasRegistration && (
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm",
                                        status.hasFeedback ? "border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "border-amber-500/20 text-amber-700 dark:text-amber-400"
                                    )}>
                                        {status.hasFeedback ? (
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                        )}
                                        <span className="font-medium">
                                            {status.hasFeedback ? "Feedback submitted" : "Feedback required"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {status.hasRegistration ? (
                                <Button
                                    onClick={goToFeedback}
                                    className="w-full h-11 rounded-lg font-medium text-sm"
                                >
                                    Complete Feedback
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setStep("email")}
                                    variant="outline"
                                    className="w-full h-11 rounded-lg font-medium text-sm"
                                >
                                    Try a different email
                                </Button>
                            )}

                            <div className="mt-6 pt-6 border-t border-border/40">
                                <Link
                                    href="/resources/seminars"
                                    className="flex items-center justify-center text-sm text-muted-foreground"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                                    Back to seminars
                                </Link>
                            </div>
                        </div>
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
