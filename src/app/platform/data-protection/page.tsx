"use client";

import { ShieldCheck, Lock, Eye, Shield, Database, Zap } from 'lucide-react';
import FeaturePageLayout from "@/components/landing/FeaturePageLayout";

const dataProtectionData = {
    badge: "Data Protection",
    title: "DLP &",
    subtitle: "Encryption",
    description: "Data-centric security with visibility into data usage, movement, and exposure. AI identifies abnormal data access and enforces protection policies.",
    heroImage: "/images/pages/data-protection.jpeg",
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
            points: [
                "Pre-built compliance policies",
                "Automated compliance reporting",
                "Audit trail and logging",
                "Data retention management"
            ]
        },
        {
            title: "Encryption Everywhere",
            description: "Protect data at rest and in transit, ensuring that even if data is stolen, it remains unreadable and useless to attackers.",
            points: [
                "Automated key management and rotation",
                "Transparent database encryption",
                "File and folder level encryption",
                "Secure data sharing and collaboration"
            ]
        }
    ],
    stats: []
};

export default function DataProtectionPage() {
    return <FeaturePageLayout data={dataProtectionData} />;
}
