"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Mail,
    XCircle,
    Shield,
    Lock,
    Eye,
    Wifi,
    Bug,
    Server,
    Fingerprint,
    Globe,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicSeminar } from "@/types/seminar";
import { cn } from "@/lib/utils";

const CYBER_FACTS = [
    {
        icon: Shield,
        title: "95% of breaches are caused by human error",
        description:
            "According to IBM, the vast majority of cybersecurity incidents trace back to phishing, weak passwords, or misconfiguration — not sophisticated zero-days.",
    },
    {
        icon: Lock,
        title: "A new ransomware attack occurs every 11 seconds",
        description:
            "Ransomware has evolved from a nuisance to a billion-dollar industry, with attacks targeting hospitals, pipelines, and government infrastructure worldwide.",
    },
    {
        icon: Eye,
        title: "The average data breach costs $4.45 million",
        description:
            "IBM's 2023 Cost of a Data Breach report found the global average cost hit an all-time high, with healthcare being the most expensive sector for 13 consecutive years.",
    },
    {
        icon: Wifi,
        title: "43% of cyberattacks target small businesses",
        description:
            "Small businesses are disproportionately targeted because they often lack dedicated security teams and infrastructure to defend against sophisticated threats.",
    },
    {
        icon: Bug,
        title: "There are over 2,200 cyberattacks per day",
        description:
            "That's roughly one attack every 39 seconds. Automated bots scan the internet continuously, probing for unpatched systems and exposed services.",
    },
    {
        icon: Server,
        title: "It takes 277 days to identify a breach on average",
        description:
            "Organizations often don't realize they've been compromised for months. Attackers use this dwell time to move laterally and exfiltrate sensitive data.",
    },
    {
        icon: Fingerprint,
        title: "Stolen credentials are the #1 attack vector",
        description:
            "Compromised usernames and passwords account for over 60% of initial access in breaches. Multi-factor authentication blocks 99.9% of automated attacks.",
    },
    {
        icon: Globe,
        title: "Cybercrime will cost $10.5 trillion by 2025",
        description:
            "If cybercrime were a country, it would have the third-largest economy in the world — surpassing every nation except the United States and China.",
    },
    {
        icon: Shield,
        title: "Only 5% of company folders are properly protected",
        description:
            "Varonis research found that most companies leave the vast majority of their sensitive data — financial records, PII, credentials — accessible to every employee.",
    },
    {
        icon: Lock,
        title: "IoT attacks increased by 87% in 2022",
        description:
            "Smart devices from cameras to thermostats are increasingly weaponized in botnets. Most ship with default credentials and receive few if any security updates.",
    },
];

function shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

type Step = "email" | "otp" | "status";

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

    const displayedFacts = useMemo(() => shuffleArray(CYBER_FACTS).slice(0, 3), []);

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

            setStep("otp");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
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
                router.push(`/seminars/${seminarId}/certificate/${result.certificateId}`);
                return;
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
        const feedbackParams = new URLSearchParams({
            email,
            ...(status?.userName && { name: status.userName }),
            ...(status?.registrationId && { registration: status.registrationId }),
        });
        router.push(`/seminars/${seminarId}/feedback?${feedbackParams.toString()}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            </div>
        );
    }

    if (error && !seminar) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Seminar Not Found</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link href="/resources/seminars">
                    <Button variant="outline" className="rounded-lg h-11 px-6 border-border text-foreground hover:bg-muted">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Seminars
                    </Button>
                </Link>
            </div>
        );
    }

    if (!seminar?.certificate_enabled) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <AlertCircle className="w-10 h-10 text-amber-500 mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Certificates Pending</h1>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                    Certificates for <span className="font-semibold text-foreground">{seminar?.title}</span> are not available yet.
                </p>
                <Link href="/resources/seminars">
                    <Button variant="outline" className="rounded-lg h-11 px-6 border-border text-foreground hover:bg-muted">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Seminars
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden bg-card border border-border shadow-lg">
                {/* Left — Form */}
                <div className="flex flex-col justify-center p-8 md:p-12 bg-card">
                    <AnimatePresence mode="wait">
                        {step === "email" && (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {seminar && (
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-6">
                                        {seminar.title}
                                    </p>
                                )}
                                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                                    Access Your Certificate
                                </h1>
                                <p className="text-sm text-muted-foreground mb-8">
                                    Enter the email you registered with to access your certificate.
                                </p>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Email Address
                                        </Label>
                                        <div className="relative group">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-12 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-foreground focus:border-foreground focus:bg-background transition-all px-4 pr-10"
                                                onKeyDown={(e) => e.key === "Enter" && requestOtp()}
                                            />
                                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2 text-red-600">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <p className="text-xs font-medium">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={requestOtp}
                                        className="w-full h-12 rounded-lg bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 active:scale-[0.98] transition-all"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending Code...
                                            </span>
                                        ) : (
                                            "Continue"
                                        )}
                                    </button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border">
                                    <Link
                                        href="/resources/seminars"
                                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Back to Seminars
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {step === "otp" && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {seminar && (
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-6">
                                        {seminar.title}
                                    </p>
                                )}
                                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                                    Verify Your Email
                                </h1>
                                <p className="text-sm text-muted-foreground mb-8">
                                    We sent a 6-digit code to{" "}
                                    <span className="font-semibold text-foreground">{email}</span>
                                </p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Verification Code
                                        </Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            className="h-14 text-center text-2xl tracking-[0.6em] font-mono bg-muted/50 border-border text-foreground focus:ring-foreground focus:border-foreground focus:bg-background rounded-lg transition-all"
                                            maxLength={6}
                                            onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && verifyOtp()}
                                        />
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2 text-red-600">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <p className="text-xs font-medium">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={verifyOtp}
                                        className="w-full h-12 rounded-lg bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 active:scale-[0.98] transition-all"
                                        disabled={isSubmitting || otp.length !== 6}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                                        ) : (
                                            "Verify & Continue"
                                        )}
                                    </button>

                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setStep("email"); setError(null); }}
                                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <ArrowLeft className="w-3 h-3" />
                                            Change Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resendOtp}
                                            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            Resend Code
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === "status" && status && (
                            <motion.div
                                key="status"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {seminar && (
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-6">
                                        {seminar.title}
                                    </p>
                                )}
                                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                                    Almost There
                                </h1>
                                <p className="text-sm text-muted-foreground mb-8">
                                    {status.hasRegistration
                                        ? "Complete your feedback to unlock the certificate."
                                        : "We couldn\u2019t find a registration for this email."}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium",
                                        status.hasRegistration
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-red-200 bg-red-50 text-red-700"
                                    )}>
                                        {status.hasRegistration ? (
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        ) : (
                                            <XCircle className="w-4 h-4 shrink-0" />
                                        )}
                                        <span>
                                            {status.hasRegistration ? "Registration verified" : "Registration not found"}
                                        </span>
                                    </div>

                                    {status.hasRegistration && (
                                        <div className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium",
                                            status.hasFeedback
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-amber-200 bg-amber-50 text-amber-700"
                                        )}>
                                            {status.hasFeedback ? (
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                            )}
                                            <span>
                                                {status.hasFeedback ? "Feedback submitted" : "Feedback required"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {status.hasRegistration ? (
                                    <Button
                                        onClick={goToFeedback}
                                        className="w-full h-11 rounded-lg font-semibold text-sm bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        Complete Feedback
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => { setStep("email"); setError(null); }}
                                        variant="outline"
                                        className="w-full h-11 rounded-lg font-semibold text-sm border-border text-foreground hover:bg-muted"
                                    >
                                        Try a different email
                                    </Button>
                                )}

                                <div className="mt-8 pt-6 border-t border-border">
                                    <Link
                                        href="/resources/seminars"
                                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Back to Seminars
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right — Cybersecurity Facts */}
                <div className="hidden lg:flex flex-col justify-between bg-card border-l border-border p-10 xl:p-12 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border mb-5">
                                <Shield className="w-3 h-3 text-foreground" />
                                <span className="text-[10px] text-foreground uppercase tracking-[0.18em] font-bold">
                                    Threat Intelligence
                                </span>
                            </div>
                            <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-foreground leading-snug">
                                The Landscape of{" "}
                                <span className="text-primary">
                                    Modern Security
                                </span>
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                While you wait — key facts every professional should know.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {displayedFacts.map((fact, i) => {
                                const Icon = fact.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.12, duration: 0.45 }}
                                        className="group flex gap-4 p-5 rounded-xl bg-background border border-border hover:border-foreground/20 hover:shadow-sm transition-all duration-300"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                                            <Icon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-foreground mb-1 leading-snug">
                                                {fact.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                {fact.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/40 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span>
                                </div>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] font-medium">
                                    Live Telemetry
                                </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] font-medium">
                                Powered by ZecurX
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
