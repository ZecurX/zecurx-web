import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    CheckCircle2,
    Download,
    Calendar,
    Award,
    ExternalLink,
    ArrowLeft,
} from "lucide-react";

import { CertificateVerification } from "@/types/seminar";
import { ShareButton } from "./ShareButton";
import { Button } from "@/components/ui/button";

import { CoursePromoCard } from "./CoursePromoCard";

interface Props {
    params: Promise<{ id: string; certId: string }>;
}

async function getCertificate(certId: string): Promise<CertificateVerification | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/certificates/${certId}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, certId } = await params;
    const data = await getCertificate(certId);

    if (!data?.valid || !data.certificate) {
        return {
            title: "Certificate Not Found | ZecurX",
            description: "The certificate you are looking for could not be found.",
        };
    }

    return {
        title: `Certificate - ${data.certificate.recipientName}`,
        description: `Certificate of participation for ${data.certificate.recipientName} in ${data.certificate.seminarTitle}`,
        openGraph: {
            title: `Certificate of Participation - ${data.certificate.recipientName}`,
            description: `Certificate for ${data.certificate.seminarTitle}`,
            type: "website",
        },
        alternates: {
            canonical: `https://zecurx.com/seminars/${id}/certificate/${certId}`,
        },
    };
}

export default async function CertificatePage({ params }: Props) {
    const { id: _id, certId } = await params;
    const data = await getCertificate(certId);

    if (!data?.valid || !data.certificate) {
        notFound();
    }

    const { certificate } = data;
    const formattedDate = new Date(certificate.seminarDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-zinc-900/10 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-400 opacity-20 blur-[100px]"></div>
            <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-zinc-400 opacity-20 blur-[100px]"></div>

            <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                            <Image src="/images/zecurx-logo.png" alt="ZecurX" fill className="object-contain" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-foreground">ZecurX</span>
                    </Link>

                    <Link 
                        href="/resources/seminars" 
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Seminars
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 flex flex-col items-center justify-center relative z-10">
                
                <div className="w-full max-w-7xl">
                    <h1 className="text-3xl font-bold text-foreground mb-8 text-center tracking-tight">Your Certificate</h1>

                    <div className="bg-card rounded-3xl shadow-2xl shadow-border/50 border border-border overflow-hidden">
                        
                        <div className="p-8 lg:p-12 pb-8 lg:pb-0">
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                                
                                <div className="w-full lg:w-[55%] relative group perspective-1000">
                                    <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-border transform transition-all duration-500 hover:scale-[1.01] hover:shadow-xl">
                                        <Image
                                            src={`/api/certificates/${certId}/preview`}
                                            alt={`Certificate for ${certificate.recipientName}`}
                                            width={1440}
                                            height={810}
                                            className="w-full h-auto object-contain"
                                            unoptimized
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                        
                                        <a 
                                            href={`/api/certificates/${certId}/preview`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            <div className="bg-background/90 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 text-foreground transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <ExternalLink className="w-4 h-4" />
                                                View Full Size
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between min-w-0 py-2 h-full">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Presented to</p>
                                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                                                {certificate.recipientName}
                                            </h2>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">For completing the course</p>
                                            <h3 className="text-2xl font-bold text-foreground leading-tight">
                                                {certificate.seminarTitle}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 pt-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">Issue Date</p>
                                                <div className="flex items-center gap-2.5">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-base font-semibold text-foreground">{formattedDate}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">Certificate ID</p>
                                                <div className="flex items-center gap-2.5">
                                                    <Award className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-base font-mono font-medium text-foreground">{certificate.certificateId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-700 shadow-sm">
                                            <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                                            <span className="text-xs font-bold uppercase tracking-wide">Certificate Issued</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border flex flex-col gap-6 pb-4">
                                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                            <div className="w-full sm:w-auto">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-center sm:text-left">Share Achievement</p>
                                                <ShareButton 
                                                    title={`Certificate - ${certificate.recipientName}`}
                                                    text={`I've completed ${certificate.seminarTitle} with ZecurX!`}
                                                    compact
                                                    className="justify-center sm:justify-start"
                                                />
                                            </div>
                                            <Button 
                                                asChild
                                                className="w-full sm:w-auto h-12 px-8 bg-foreground hover:bg-foreground/90 text-background rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold text-sm"
                                            >
                                                <a href={`/api/certificates/${certId}/download`}>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download PDF
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-border/50">
                            <CoursePromoCard className="rounded-none border-0 shadow-none" />
                        </div>

                    </div>
                    
                    <div className="mt-8 text-center text-xs text-muted-foreground font-medium">
                        <p>&copy; {new Date().getFullYear()} ZecurX Academy. All rights reserved.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
