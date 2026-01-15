"use client";

import React from 'react';
import CTASection from '@/components/landing/CTASection';

interface ServiceCTAProps {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
}

export default function ServiceCTA({ title, description, ctaLabel, ctaHref }: ServiceCTAProps) {
    return (
        <CTASection
            title={title}
            description={description}
            primaryLabel={ctaLabel}
            primaryHref={ctaHref}
            secondaryLabel="Contact Sales"
            secondaryHref="/contact"
        />
    );
}
