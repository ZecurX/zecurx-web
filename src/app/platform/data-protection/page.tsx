"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { ShieldCheck, Lock, Eye, Shield, Database, Zap } from 'lucide-react';

const dataProtectionData = {
    badge: "Data Protection",
    title: "DLP &",
    subtitle: "Encryption",
    description: "Data-centric security with visibility into data usage, movement, and exposure. AI identifies abnormal data access and enforces protection policies.",
    capabilities: [
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Data Loss Prevention",
            description: "Prevent sensitive data from leaving your organization through email, cloud storage, or endpoints."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Encryption",
            description: "End-to-end encryption for data at rest and in transit, with centralized key management."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Data Discovery",
            description: "Automatically discover and classify sensitive data across endpoints, cloud, and on-premises systems."
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: "Data Classification",
            description: "AI-powered classification that automatically labels data based on content sensitivity."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Access Controls",
            description: "Granular access controls that ensure only authorized users can access sensitive data."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Incident Response",
            description: "Automated response to data breaches with containment, notification, and remediation."
        },
    ],
    features: [
        {
            title: "Reduced Data Leakage",
            description: "Stop data breaches before they happen with comprehensive visibility and control over sensitive data.",
            image: "/images/features/data-protection.png",
            points: [
                "Content-aware DLP policies",
                "Real-time data monitoring",
                "Automated blocking of violations",
                "User coaching and education"
            ]
        },
        {
            title: "Regulatory Compliance",
            description: "Meet data protection requirements for GDPR, CCPA, HIPAA, PCI-DSS, and other regulations.",
            image: "/images/features/compliance.png",
            points: [
                "Pre-built compliance policies",
                "Automated compliance reporting",
                "Audit trail and logging",
                "Data retention management"
            ]
        },
    ],
    stats: []
};

export default function DataProtectionPage() {
    return <FeaturePageLayout data={dataProtectionData} />;
}
