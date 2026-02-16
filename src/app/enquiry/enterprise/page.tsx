import { Metadata } from 'next';
import { Building2 } from 'lucide-react';
import { EnterpriseEnquiryForm } from '@/components/forms/EnterpriseEnquiryForm';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Enterprise Solutions',
    description: 'Secure your organization with ZecurX enterprise cybersecurity solutions. Request a consultation for penetration testing and security assessments.',
    openGraph: {
        title: 'Enterprise Solutions | ZecurX',
        description: 'Secure your organization with ZecurX enterprise cybersecurity solutions. Request a consultation.',
        type: 'website',
        url: 'https://zecurx.com/enquiry/enterprise',
    },
    alternates: {
        canonical: 'https://zecurx.com/enquiry/enterprise',
    },
};

const cardClass = cn(
    "p-6 sm:p-8 rounded-2xl",
    "bg-background/70 backdrop-blur-xl",
    "border border-white/[0.08] dark:border-white/[0.06]",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
);

export default function EnterpriseEnquiryPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-purple-500" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-manrope font-bold tracking-tight text-foreground mb-3">
                            Enterprise Solutions
                        </h1>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            Protect your business with our comprehensive cybersecurity services. Request a consultation and we&apos;ll tailor a solution for your needs.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className={cardClass}>
                        <EnterpriseEnquiryForm />
                    </div>

                    {/* Trust signals */}
                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground/60">
                        <p>🔒 Enterprise-grade Security</p>
                        <p>⚡ 24-hour Response Time</p>
                        <p>🏆 100+ Enterprise Clients</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
