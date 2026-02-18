import { Metadata } from 'next';
import { GraduationCap } from 'lucide-react';
import { StudentEnquiryForm } from '@/components/forms/StudentEnquiryForm';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Student Enquiry',
    description: 'Start your cybersecurity journey with ZecurX. Fill out our enquiry form for internship and training programs.',
    openGraph: {
        title: 'Student Enquiry | ZecurX',
        description: 'Start your cybersecurity journey with ZecurX. Fill out our enquiry form for internship and training programs.',
        type: 'website',
        url: 'https://zecurx.com/enquiry/student',
    },
    alternates: {
        canonical: 'https://zecurx.com/enquiry/student',
    },
};

const cardClass = cn(
    "p-6 sm:p-8 rounded-2xl",
    "bg-background/70 backdrop-blur-xl",
    "border border-white/[0.08] dark:border-white/[0.06]",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
);

export default function StudentEnquiryPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-manrope font-bold tracking-tight text-foreground mb-3">
                            Student Enquiry
                        </h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Take the first step towards your cybersecurity career. Our team will help you choose the right program.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className={cardClass}>
                        <StudentEnquiryForm />
                    </div>

                    {/* Trust signals */}
                    <div className="mt-8 text-center text-sm text-muted-foreground/60">
                        <p>Trusted by 10,000+ students • Response within 24 hours</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
