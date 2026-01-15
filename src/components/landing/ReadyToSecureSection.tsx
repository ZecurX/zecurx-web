"use client";

import CTASection from "@/components/landing/CTASection";

export default function ReadyToSecureSection() {
    return (
        <CTASection
            title="Ready to Secure Your Business?"
            description="Schedule a consultation with our security architects and see how ZecurX can transform your defense posture."
            primaryLabel="Talk to a Security Expert"
            primaryHref="/contact"
            secondaryLabel="Request Assessment"
            secondaryHref="/book-demo"
        />
    );
}
