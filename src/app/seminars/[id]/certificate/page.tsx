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
    Award,
    ExternalLink,
    FileText,
    XCircle,
    Download,
    Shield
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicSeminar, CertificateVerification } from "@/types/seminar";
import CoursePromoModal from "@/components/marketing/CoursePromoModal";
import { ShareButton } from "@/app/verify/[certificateId]/ShareButton";

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
    const [showPromo, setShowPromo] = useState(false);
    const [certData, setCertData] = useState<CertificateVerification["certificate"]>(null);
    const [certLoading, setCertLoading] = useState(false);

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
                fetchCertificateData(result.certificateId);
                setStep("success");
                setShowPromo(true);
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

    if (!seminar?.certificate_enabled) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Certificates Not Available Yet</h1>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                    Certificates for this seminar are not available yet. Please check back after the seminar has been completed.
                </p>
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
            <div className={`mx-auto px-6 ${step === "success" ? "max-w-4xl" : "max-w-md"}`}>
                <Link
                    href="/resources/seminars"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Seminars
                </Link>

                {seminar && (
                    <div className="bg-muted/30 rounded-2xl p-6 mb-8 border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-2">{seminar.title}</h2>
                        <p className="text-sm text-muted-foreground">
                            Get your certificate of participation
                        </p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-lg"
                >
                    {step === "email" && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Get Your Certificate</h1>
                                <p className="text-muted-foreground">
                                    Enter your email to access your certificate
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12"
                                        onKeyDown={(e) => e.key === "Enter" && requestOtp()}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={requestOtp}
                                    className="w-full h-12 rounded-xl font-semibold"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending OTP...
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
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
                                <p className="text-muted-foreground">
                                    We&apos;ve sent a 6-digit code to<br />
                                    <span className="text-foreground font-medium">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="otp" className="text-center block">
                                        Enter OTP
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="h-14 text-center text-2xl tracking-[0.5em] font-mono"
                                        maxLength={6}
                                        onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && verifyOtp()}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={verifyOtp}
                                    className="w-full h-12 rounded-xl font-semibold"
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

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={resendOtp}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Didn&apos;t receive code? <span className="underline">Resend</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep("email")}
                                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                                    Change email
                                </button>
                            </div>
                        </>
                    )}

                    {step === "status" && status && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Complete Your Feedback</h1>
                                <p className="text-muted-foreground">
                                    {status.hasRegistration
                                        ? "Please complete the feedback form to receive your certificate."
                                        : "You can still get a certificate by completing the feedback form."}
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className={`flex items-center gap-3 p-4 rounded-xl ${status.hasRegistration ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                    {status.hasRegistration ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    <span className="text-sm">
                                        {status.hasRegistration
                                            ? "Registration Verified"
                                            : "Registration Not Found"}
                                    </span>
                                </div>

                                {!status.hasRegistration && (
                                    <div className="p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                                        <p>
                                            We couldn&apos;t find a registration for <strong>{email}</strong> for this seminar. 
                                            Certificates are only available to registered participants.
                                        </p>
                                        <p className="mt-2">
                                            If you believe this is an error, please try a different email address or contact support.
                                        </p>
                                    </div>
                                )}

                                {status.hasRegistration && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                                        {status.hasFeedback ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                                        )}
                                        <span className="text-sm">
                                            {status.hasFeedback
                                                ? "Feedback submitted"
                                                : "Feedback required for certificate"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {status.hasRegistration ? (
                                <Button
                                    onClick={goToFeedback}
                                    className="w-full h-12 rounded-xl font-semibold"
                                >
                                    Complete Feedback Form
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setStep("email")}
                                    variant="outline"
                                    className="w-full h-12 rounded-xl"
                                >
                                    Try Different Email
                                </Button>
                            )}
                        </>
                    )}

                    {step === "success" && status?.certificateId && (
                        certLoading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
                            </div>
                        ) : certData ? (
                            <div>
                                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                                            <Shield className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-600 dark:text-green-400">
                                                Certificate Sent!
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Your certificate has been emailed. You can also download it below.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-border overflow-hidden mb-6">
                                    <img
                                        src={`/api/certificates/${status.certificateId}/preview`}
                                        alt="Certificate Preview"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl mb-6">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Certificate ID</p>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {certData.certificateId}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <Link
                                        href={`/api/certificates/${status.certificateId}/download`}
                                        className="flex-1"
                                    >
                                        <Button className="w-full h-12 rounded-xl font-semibold">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download PDF
                                        </Button>
                                    </Link>

                                    <Link href={`/verify/${status.certificateId}`} className="flex-1">
                                        <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Verify Online
                                        </Button>
                                    </Link>
                                </div>

                                <ShareButton
                                    title={`Certificate - ${certData.recipientName}`}
                                    text={`I just received my certificate of participation from ${certData.seminarTitle} by ZecurX!`}
                                    certificateId={status.certificateId}
                                />

                                <div className="text-center mt-8">
                                    <Link href="/resources/seminars">
                                        <Button variant="ghost">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to Seminars
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-10 h-10 text-green-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Certificate Sent!</h1>
                                <p className="text-muted-foreground mb-8">
                                    Your certificate has been sent to your email address.
                                </p>

                                <div className="bg-muted/50 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-muted-foreground mb-1">Certificate ID</p>
                                    <p className="font-mono font-semibold text-foreground">{status.certificateId}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <Link
                                        href={`/api/certificates/${status.certificateId}/download`}
                                        className="flex-1"
                                    >
                                        <Button className="w-full h-12 rounded-xl font-semibold">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download PDF
                                        </Button>
                                    </Link>

                                    <Link href={`/verify/${status.certificateId}`} className="flex-1">
                                        <Button variant="outline" className="w-full h-12 rounded-xl">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Verify Online
                                        </Button>
                                    </Link>
                                </div>

                                <ShareButton
                                    title={`Certificate - ZecurX`}
                                    text="I just received my certificate of participation from ZecurX!"
                                    certificateId={status.certificateId}
                                />

                                <div className="mt-6">
                                    <Link href="/resources/seminars">
                                        <Button variant="ghost">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to Seminars
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    )}
                </motion.div>
            </div>
            
            <CoursePromoModal 
                isOpen={showPromo} 
                onClose={() => setShowPromo(false)} 
            />
        </div>
    );
}
