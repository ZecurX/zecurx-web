"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Mail,
    User,
    Phone,
    GraduationCap,
    Briefcase,
    MapPin,
    Calendar
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PublicSeminar, YEAR_OPTIONS } from "@/types/seminar";

const registrationSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
    collegeName: z.string().optional(),
    year: z.string().optional(),
    cityState: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
    const params = useParams();
    const seminarId = params.id as string;

    const [seminar, setSeminar] = useState<PublicSeminar | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState<string | null>(null);
    const [participantType, setParticipantType] = useState<'student' | 'professional'>('student');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
    });

    useEffect(() => {
        async function fetchSeminar() {
            try {
                const response = await fetch(`/api/seminars/${seminarId}`);
                const data = await response.json();
                if (data.success) {
                    setSeminar(data.seminar);
                } else {
                    setError('Seminar not found');
                }
            } catch {
                setError('Failed to load seminar');
            } finally {
                setLoading(false);
            }
        }
        fetchSeminar();
    }, [seminarId]);

    const onSubmit = async (data: RegistrationFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/seminars/${seminarId}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Registration failed');
            }

            setEmail(data.email);
            setStep('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyOtp = async () => {
        setIsSubmitting(true);
        setOtpError(null);

        try {
            const response = await fetch(`/api/seminars/${seminarId}/register/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Verification failed');
            }

            setStep('success');
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resendOtp = async () => {
        setIsSubmitting(true);
        setOtpError(null);

        try {
            const formData = watch();
            const response = await fetch(`/api/seminars/${seminarId}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to resend OTP');
            }

            setOtpError(null);
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Failed to resend');
        } finally {
            setIsSubmitting(false);
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

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { dateStyle: 'full' });
    };

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

                {seminar && (
                    <div className="bg-muted/30 rounded-2xl p-6 mb-8 border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-4">{seminar.title}</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {formatDate(seminar.date)}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {seminar.location_type === 'online' ? 'Online' : seminar.venue_address || seminar.organization_name}
                            </div>
                        </div>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-lg"
                >
                    {step === 'form' && (
                        <>
                            <h1 className="text-2xl font-bold mb-2">Register for this Seminar</h1>
                            <p className="text-muted-foreground mb-8">Fill in your details to secure your spot.</p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="fullName" className="flex items-center gap-2">
                                        <User className="w-4 h-4" /> Full Name *
                                    </Label>
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        {...register("fullName")}
                                        className={`h-12 ${errors.fullName ? 'border-red-500' : ''}`}
                                    />
                                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email Address *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        {...register("email")}
                                        className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        {...register("phone")}
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2 text-sm text-muted-foreground">I am a</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setParticipantType('student');
                                                setValue('collegeName', '');
                                                setValue('year', '');
                                            }}
                                            className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-medium transition-all ${
                                                participantType === 'student'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-background text-muted-foreground hover:border-foreground/30'
                                            }`}
                                        >
                                            <GraduationCap className="w-4 h-4" />
                                            Student
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setParticipantType('professional');
                                                setValue('collegeName', '');
                                                setValue('year', '');
                                            }}
                                            className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-medium transition-all ${
                                                participantType === 'professional'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-background text-muted-foreground hover:border-foreground/30'
                                            }`}
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            Professional
                                        </button>
                                    </div>
                                </div>

                                {participantType === 'student' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="collegeName" className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" /> College/University
                                            </Label>
                                            <Input
                                                id="collegeName"
                                                placeholder="Your institution"
                                                {...register("collegeName")}
                                                className="h-12"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="year">Year</Label>
                                            <Select onValueChange={(value) => setValue("year", value)}>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {YEAR_OPTIONS.map(year => (
                                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="collegeName" className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" /> Company/Organization
                                            </Label>
                                            <Input
                                                id="collegeName"
                                                placeholder="Your company"
                                                {...register("collegeName")}
                                                className="h-12"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="year">Designation</Label>
                                            <Input
                                                id="year"
                                                placeholder="Your role"
                                                {...register("year")}
                                                className="h-12"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Label htmlFor="cityState" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> City & State
                                    </Label>
                                    <Input
                                        id="cityState"
                                        placeholder="Bangalore, Karnataka"
                                        {...register("cityState")}
                                        className="h-12"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl font-semibold"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        'Continue'
                                    )}
                                </Button>
                            </form>
                        </>
                    )}

                    {step === 'otp' && (
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
                                    <Label htmlFor="otp" className="text-center block">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="h-14 text-center text-2xl tracking-[0.5em] font-mono"
                                        maxLength={6}
                                    />
                                </div>

                                {otpError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm">{otpError}</p>
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
                                        'Verify & Register'
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
                                    onClick={() => setStep('form')}
                                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                                    Back to form
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Registration Confirmed!</h1>
                            <p className="text-muted-foreground mb-8">
                                You&apos;re all set for the seminar. Check your email for confirmation details and calendar invite.
                            </p>
                            <Link href="/resources/seminars">
                                <Button variant="outline" className="rounded-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Seminars
                                </Button>
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
