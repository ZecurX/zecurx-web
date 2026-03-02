"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    GraduationCap,
    CheckCircle2,
    Briefcase,
    MoveRight,
    ArrowLeft,
    AlertCircle,
    MapPin,
    Loader2,
    Calendar,
    Mail
} from "lucide-react";
import Link from "next/link";

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
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Loading registration details...</p>
                </div>
            </div>
        );
    }

    if (error && !seminar) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.02)_0%,_transparent_70%)] pointer-events-none" />
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100 shadow-sm">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Seminar Not Found</h1>
                    <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium leading-relaxed">{error}</p>
                    <Link href="/resources/seminars">
                        <button className="h-14 px-10 rounded-lg bg-background border border-border text-foreground text-sm font-bold hover:bg-background transition-all duration-300 flex items-center gap-3 mx-auto shadow-sm hover:shadow-md">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Seminars
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const isPast = seminar ? new Date(seminar.date) < new Date() : false;
    const registrationClosed = seminar && (isPast || !seminar.registration_enabled);

    if (registrationClosed && step !== 'success') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.02)_0%,_transparent_70%)] pointer-events-none" />
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-8 border border-border shadow-sm">
                        <AlertCircle className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Registration Closed</h1>
                    <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium leading-relaxed">
                        {isPast
                            ? 'This seminar has already taken place. Registration is no longer available.'
                            : 'Registration for this seminar has been closed by the administration.'}
                    </p>
                    <Link href="/resources/seminars">
                        <button className="h-14 px-10 rounded-lg bg-background border border-border text-foreground text-sm font-bold hover:bg-background transition-all duration-300 flex items-center gap-3 mx-auto shadow-sm hover:shadow-md">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Seminars
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'Asia/Kolkata' });
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 relative overflow-hidden text-foreground">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.02)_0%,_transparent_70%)] pointer-events-none" />

            <div className={`mx-auto px-6 relative z-10 ${step === 'success' ? 'max-w-4xl' : 'max-w-7xl'}`}>
                {step !== 'success' && (
                    <div className="grid lg:grid-cols-5 gap-16 items-start">
                        {/* Left Column: Seminar Details */}
                        <div className="lg:col-span-2 space-y-12 lg:sticky lg:top-32 group">
                            <Link
                                href="/resources/seminars"
                                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-muted-foreground mb-8 transition-colors group/link"
                            >
                                <ArrowLeft className="w-3 h-3 group-hover/link:-translate-x-1 transition-transform" />
                                Cancel Registration
                            </Link>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8 bg-border" />
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Seminar Summary</p>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
                                    {seminar?.title}
                                </h2>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
                                    Complete the form to register for this session. Your information will be used for attendance and certification purposes.
                                </p>
                            </div>

                            {seminar && (
                                <div className="space-y-6 pt-12 border-t border-border">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                                            <Calendar className="w-4 h-4 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Date & Time</p>
                                            <p className="text-foreground font-bold">{formatDate(seminar.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                                            <MapPin className="w-4 h-4 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                                            <p className="text-foreground font-bold">{seminar.location_type === 'online' ? 'Online Session' : seminar.venue_address || seminar.organization_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-foreground font-bold italic">Verified Participation Eligible</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-12">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Registration Open</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Registration Card */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden"
                            >
                                {step === 'form' && (
                                    <div className="relative z-10">
                                        <div className="space-y-2 mb-12">
                                            <h1 className="text-3xl font-bold text-foreground tracking-tight">Registration Form</h1>
                                            <p className="text-muted-foreground text-sm font-medium">Complete the details below to secure your spot.</p>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                                            {/* Section 01: Personal Details */}
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-foreground" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Personal Information</h4>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="fullName" className="text-sm font-bold text-foreground ml-1">Full Name *</Label>
                                                        <div className="relative group">
                                                            <Input
                                                                id="fullName"
                                                                placeholder="Enter your name"
                                                                {...register("fullName")}
                                                                className={`h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-200 ${errors.fullName ? 'border-red-500' : ''}`}
                                                            />
                                                        </div>
                                                        {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.fullName.message}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address *</Label>
                                                        <div className="relative group">
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder="you@company.com"
                                                                {...register("email")}
                                                                className={`h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-200 ${errors.email ? 'border-red-500' : ''}`}
                                                            />
                                                        </div>
                                                        {errors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.email.message}</p>}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-bold text-foreground ml-1">Phone Number</Label>
                                                    <div className="relative group">
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            placeholder="Include country code"
                                                            {...register("phone")}
                                                            className="h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 02: Classification */}
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-foreground" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Organization</h4>
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-sm font-bold text-foreground ml-1">Registration Type</Label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setParticipantType('student');
                                                                setValue('collegeName', '');
                                                                setValue('year', '');
                                                            }}
                                                            className={`flex items-center justify-center gap-3 h-12 rounded-lg border transition-all duration-300 text-sm font-bold ${participantType === 'student'
                                                                ? 'bg-foreground border-foreground text-background shadow-lg scale-[1.02]'
                                                                : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:bg-background hover:border-border'
                                                                }`}
                                                        >
                                                            <GraduationCap className="w-4 h-4" />
                                                            Academic
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setParticipantType('professional');
                                                                setValue('collegeName', '');
                                                                setValue('year', '');
                                                            }}
                                                            className={`flex items-center justify-center gap-3 h-12 rounded-lg border transition-all duration-300 text-sm font-bold ${participantType === 'professional'
                                                                ? 'bg-foreground border-foreground text-background shadow-lg scale-[1.02]'
                                                                : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:bg-background hover:border-border'
                                                                }`}
                                                        >
                                                            <Briefcase className="w-4 h-4" />
                                                            Corporate
                                                        </button>
                                                    </div>
                                                </div>

                                                {participantType === 'student' ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="collegeName" className="text-sm font-bold text-foreground ml-1">University / College</Label>
                                                            <Input
                                                                id="collegeName"
                                                                placeholder="Institution Name"
                                                                {...register("collegeName")}
                                                                className="h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-200"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="year" className="text-sm font-bold text-foreground ml-1">Year of Study</Label>
                                                            <Select onValueChange={(value) => setValue("year", value)}>
                                                                <SelectTrigger className="h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground focus:ring-1 focus:border-foreground focus:ring-foreground">
                                                                    <SelectValue placeholder="Select Year" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-background border-border">
                                                                    {YEAR_OPTIONS.map(year => (
                                                                        <SelectItem key={year} value={year} className="text-foreground focus:bg-muted">{year}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="collegeName" className="text-sm font-bold text-foreground ml-1">Company / Organization</Label>
                                                            <Input
                                                                id="collegeName"
                                                                placeholder="Company Name"
                                                                {...register("collegeName")}
                                                                className="h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-200"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="year" className="text-sm font-bold text-foreground ml-1">Designation</Label>
                                                            <Input
                                                                id="year"
                                                                placeholder="Current job title"
                                                                {...register("year")}
                                                                className="h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-200"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Section 03: Location */}
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-foreground" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</h4>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="cityState" className="text-sm font-bold text-foreground ml-1">City / State</Label>
                                                    <div className="relative group">
                                                        <Input
                                                            id="cityState"
                                                            placeholder="Enter your location"
                                                            {...register("cityState")}
                                                            className="h-12 px-5 rounded-lg bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="bg-red-50 border border-red-100 rounded-lg p-5 flex items-center gap-3 text-red-600 animate-in shake">
                                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                                    <p className="text-sm font-medium">{error}</p>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className="w-full h-14 text-sm font-bold rounded-lg bg-foreground text-background hover:bg-foreground active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Register for Seminar
                                                        <MoveRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {step === 'otp' && (
                                    <div className="relative z-10 text-center py-10">
                                        <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm animate-in zoom-in duration-500">
                                            <Mail className="w-10 h-10 text-foreground" />
                                        </div>
                                        <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">Verify Email</h1>
                                        <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium leading-relaxed">
                                            We have sent a verification code to:<br />
                                            <span className="text-foreground font-bold">{email}</span>
                                        </p>

                                        <div className="space-y-10 max-w-sm mx-auto">
                                            <div className="space-y-4 text-center">
                                                <Label htmlFor="otp" className="text-xs font-bold text-muted-foreground mb-4 block uppercase tracking-widest text-center">Verification Code</Label>
                                                <Input
                                                    id="otp"
                                                    type="text"
                                                    placeholder="000 000"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    className="h-20 text-center text-3xl font-bold tracking-[0.5em] bg-muted/50 border-border focus:border-foreground focus:ring-foreground rounded-2xl transition-all duration-300 text-foreground placeholder:text-border"
                                                    maxLength={6}
                                                />
                                            </div>

                                            {otpError && (
                                                <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-600 animate-in shake">
                                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                                    <p className="text-xs font-bold font-sans">{otpError}</p>
                                                </div>
                                            )}

                                            <button
                                                onClick={verifyOtp}
                                                className="w-full h-14 text-sm font-bold rounded-lg bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl"
                                                disabled={isSubmitting || otp.length !== 6}
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                                                ) : (
                                                    'Verify Code'
                                                )}
                                            </button>

                                            <div className="space-y-8 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={resendOtp}
                                                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                                    disabled={isSubmitting}
                                                >
                                                    Code not received? <span className="text-foreground underline underline-offset-8">Resend</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setStep('form')}
                                                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ArrowLeft className="w-3 h-3" />
                                                    Update Information
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-[2.5rem] p-12 lg:p-20 shadow-2xl relative overflow-hidden text-center min-h-[600px] flex flex-col items-center justify-center"
                    >
                        <div className="relative z-10 max-w-xl">
                            <div className="w-24 h-24 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm animate-in zoom-in duration-1000">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight">Registration Successful</h1>
                            <p className="text-muted-foreground text-lg font-medium mb-12 leading-relaxed">
                                You have been registered successfully. We have sent the seminar details and access link to <span className="text-foreground font-bold">{email}</span>.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                                <Link href="/resources/seminars" className="w-full sm:w-auto">
                                    <button className="h-14 px-12 rounded-lg bg-background border border-border text-foreground text-sm font-bold hover:bg-muted transition-all duration-300 flex items-center justify-center gap-3 group/btn">
                                        <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                                        Back to Seminars
                                    </button>
                                </Link>
                                {seminar?.blog_slug && (
                                    <Link href={`/blog/${seminar.blog_slug}`} target="_blank" className="w-full sm:w-auto">
                                        <button className="h-14 px-12 rounded-lg bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                                            Read Blog
                                            <MoveRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
