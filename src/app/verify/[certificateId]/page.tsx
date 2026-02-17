import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    CheckCircle2,
    Download,
    Calendar,
    User,
    Building2,
    Award,
    Shield,
    Share2,
    ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CertificateVerification } from "@/types/seminar";
import { ShareButton } from "./ShareButton";

interface Props {
    params: Promise<{ certificateId: string }>;
}

async function getCertificate(certificateId: string): Promise<CertificateVerification | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/certificates/${certificateId}`, {
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
    const { certificateId } = await params;
    const data = await getCertificate(certificateId);

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
            description: `Verified certificate for ${data.certificate.seminarTitle}`,
            type: "website",
        },
        alternates: {
            canonical: `https://zecurx.com/verify/${certificateId}`,
        },
    };
}

export default async function CertificateVerifyPage({ params }: Props) {
    const { certificateId } = await params;
    const data = await getCertificate(certificateId);

    if (!data?.valid || !data.certificate) {
        notFound();
    }

    const { certificate } = data;
    const formattedDate = new Date(certificate.seminarDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-12">
                    <Link href="/" className="mb-6 relative w-12 h-12">
                        <Image src="/images/zecurx-logo.png" alt="ZecurX" fill className="object-contain" />
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-600 text-sm font-medium mb-4">
                        <Shield className="w-4 h-4 fill-green-500/20" />
                        Verified Certificate
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Preview */}
                    <div className="order-2 lg:order-1 perspective-1000 group">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white dark:border-white/5 bg-background transform transition-all duration-500 hover:rotate-y-1 hover:scale-[1.01]">
                            <div className="aspect-[1.414/1] bg-muted relative">
                                {/* Use an iframe or image for preview */}
                                <Image
                                    src={`/api/certificates/${certificateId}/preview`}
                                    alt={`Certificate preview for ${certificate.recipientName}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <Link href="/resources/seminars" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> Verify another certificate
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold font-space-grotesk mb-2 text-foreground">
                                {certificate.recipientName}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                has been awarded this certificate for
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 font-space-grotesk">{certificate.seminarTitle}</h2>

                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-background/50 border border-border/50">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                                        <p className="font-medium">{formattedDate}</p>
                                    </div>
                                </div>

                                {certificate.speakerName && (
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-background/50 border border-border/50">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Speaker</p>
                                            <p className="font-medium">{certificate.speakerName}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 p-3 rounded-xl bg-background/50 border border-border/50">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Certificate ID</p>
                                        <code className="font-mono font-medium text-primary">{certificate.certificateId}</code>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="flex-1 h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                <Link href={`/api/certificates/${certificateId}/download`}>
                                    <Download className="w-5 h-5 mr-2" />
                                    Download PDF
                                </Link>
                            </Button>

                            <ShareButton
                                title={`Certificate - ${certificate.recipientName}`}
                                text={`Check out my certificate for ${certificate.seminarTitle} from ZecurX!`}
                                className="flex-1 h-12 rounded-xl font-bold text-base border-border bg-background hover:bg-muted"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


