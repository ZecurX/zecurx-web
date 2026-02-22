"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield, KeyRound, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SudoLoginPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok && data.otpRequired) {
                setStep("otp");
            } else {
                setError(data.error || "Access Denied");
            }
        } catch {
            setError("Connection failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                router.refresh();
                router.push("/admin");
            } else {
                setError(data.error || "Invalid Token");
            }
        } catch {
            setError("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="w-full max-w-[380px] relative z-10">
                <div className={cn(
                    "p-8 rounded-2xl space-y-6",
                    "bg-background/70 backdrop-blur-xl",
                    "border border-white/[0.08] dark:border-white/[0.06]",
                    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.12)]",
                    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.4)]"
                )}>
                    <div className="space-y-4 text-center">
                        <div className="flex justify-center">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="https://zecurx-web.fsn1.your-objectstorage.com/images/zecurx-logo.png"
                                    alt="ZecurX"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-manrope font-bold tracking-tight text-foreground">
                                {step === "email" ? "Super Admin" : "Security Check"}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                {step === "email"
                                    ? "Secure gateway access"
                                    : `Code sent to ${email}`
                                }
                            </p>
                        </div>
                    </div>

                    <form onSubmit={step === "email" ? handleEmailSubmit : handleOtpSubmit} className="space-y-5">
                        <div className="space-y-4">
                            {step === "email" ? (
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="super@zecurx.com"
                                        className={cn(
                                            "flex h-11 w-full rounded-xl px-4 py-2 text-sm",
                                            "bg-white/[0.03] border border-white/[0.08]",
                                            "placeholder:text-muted-foreground/50",
                                            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30",
                                            "transition-all duration-200"
                                        )}
                                        required
                                        autoFocus
                                        disabled={loading}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label htmlFor="otp" className="text-sm font-medium text-foreground">
                                        One-Time Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="otp"
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="123456"
                                            className={cn(
                                                "flex h-11 w-full rounded-xl px-4 py-2 text-sm pl-10",
                                                "bg-white/[0.03] border border-white/[0.08]",
                                                "placeholder:text-muted-foreground/50",
                                                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30",
                                                "transition-all duration-200",
                                                "tracking-widest font-mono"
                                            )}
                                            required
                                            autoFocus
                                            disabled={loading}
                                            maxLength={6}
                                        />
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                    <Shield className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200",
                                "bg-foreground text-background",
                                "hover:opacity-90 active:scale-[0.98]",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                step === "email" ? "Verify Identity" : "Confirm Access"
                            )}
                        </button>

                        {step === "otp" && (
                            <button
                                type="button"
                                onClick={() => setStep("email")}
                                disabled={loading}
                                className="w-full h-10 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Change Email
                            </button>
                        )}
                    </form>

                    <p className="text-xs text-center text-muted-foreground/50">
                        Restricted Gateway. Super Admins Only.
                    </p>
                </div>
            </div>
        </div>
    );
}
