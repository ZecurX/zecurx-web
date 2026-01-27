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
    Shield
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
        title: `Certificate - ${data.certificate.recipientName} | ZecurX`,
        description: `Certificate of participation for ${data.certificate.recipientName} in ${data.certificate.seminarTitle}`,
        openGraph: {
            title: `Certificate of Participation - ${data.certificate.recipientName}`,
            description: `Verified certificate for ${data.certificate.seminarTitle}`,
            type: "website",
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
        <div className="min-h-screen bg-background">
            <div className="bg-green-500/5 border-b border-green-500/20">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-600 dark:text-green-400">
                                Verified Certificate
                            </p>
                            <p className="text-sm text-muted-foreground">
                                This certificate has been verified as authentic by ZecurX
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 sm:p-12 border-b border-border">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/images/zecurx-logo.png"
                                    alt="ZecurX"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">ZecurX</h1>
                                <p className="text-sm text-muted-foreground">Cybersecurity Education</p>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                                Certificate of Participation
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                {certificate.recipientName}
                            </h2>
                            <p className="text-muted-foreground">
                                has successfully participated in
                            </p>
                        </div>

                        <div className="bg-background/50 rounded-2xl p-6 mb-6">
                            <h3 className="text-xl sm:text-2xl font-semibold text-foreground text-center">
                                {certificate.seminarTitle}
                            </h3>
                        </div>
                    </div>

                    <div className="p-8 sm:p-12">
                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Seminar Date</p>
                                    <p className="font-medium text-foreground">{formattedDate}</p>
                                </div>
                            </div>

                            {certificate.speakerName && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Speaker</p>
                                        <p className="font-medium text-foreground">{certificate.speakerName}</p>
                                    </div>
                                </div>
                            )}

                            {certificate.organization && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Host Organization</p>
                                        <p className="font-medium text-foreground">{certificate.organization}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Award className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Issued On</p>
                                    <p className="font-medium text-foreground">{issuedDate}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl mb-8">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">Certificate ID</p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        {certificate.certificateId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={`/api/certificates/${certificateId}/download`}
                                className="flex-1"
                            >
                                <Button className="w-full h-12 rounded-xl font-semibold">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </Button>
                            </Link>

                            <ShareButton
                                title={`Certificate - ${certificate.recipientName}`}
                                text={`Check out my certificate from ${certificate.seminarTitle}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/resources/seminars"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Explore more seminars at ZecurX
                    </Link>
                </div>
            </div>
        </div>
    );
}
