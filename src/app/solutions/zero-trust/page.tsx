"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Lock, Shield, Eye, KeyRound, Users, Globe } from "lucide-react";

const zeroTrustData = {
    badge: "Security Solution",
    title: "Zero Trust",
    subtitle: "Architecture",
    description: "Move beyond perimeter-based security to continuous verification and least-privilege access. Implement a Zero Trust framework that protects your organization in a world where threats can come from anywhere—inside or outside your network.",
    capabilities: [
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Never Trust, Always Verify",
            description: "Continuous authentication and authorization for every user, device, and application access request."
        },
        {
            icon: <KeyRound className="w-6 h-6" />,
            title: "Least Privilege Access",
            description: "Dynamic access policies that grant the minimum permissions needed for the task at hand."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Continuous Monitoring",
            description: "Real-time visibility into all access patterns with behavioral analytics to detect anomalies."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Microsegmentation",
            description: "Granular network segmentation that limits lateral movement and contains breaches."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Identity-Centric Security",
            description: "Identity as the new perimeter with strong authentication and adaptive access controls."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Secure Access Service Edge",
            description: "Unified security stack that protects users regardless of location or device."
        }
    ],
    features: [
        {
            title: "Eliminate Implicit Trust",
            description: "Traditional network security assumes everything inside the perimeter is trusted. Zero Trust assumes breach and verifies explicitly, protecting your organization from both external attackers and compromised insiders.",
            image: "/images/features/zero-trust.png",
            points: [
                "Strong identity verification with multi-factor authentication",
                "Device posture assessment before granting access",
                "Context-aware policies based on user, device, location, and risk",
                "Encrypted communications for all internal traffic"
            ]
        },
        {
            title: "Protect Your Critical Assets",
            description: "Not all assets require the same level of protection. Our Zero Trust framework enables you to define and enforce differentiated security controls based on data sensitivity and business criticality.",
            image: "/images/features/identity-security.png",
            points: [
                "Data classification and labeling for sensitive information",
                "Privileged access management for high-value systems",
                "Just-in-time access for administrative functions",
                "Comprehensive audit logging for compliance and forensics"
            ]
        },
        {
            title: "Transform Your Security Architecture",
            description: "Zero Trust is a journey, not a destination. Our phased approach helps you incrementally adopt Zero Trust principles while minimizing disruption to your business operations.",
            image: "/images/features/network-security.png",
            points: [
                "Maturity assessment and gap analysis",
                "Prioritized roadmap based on risk and business impact",
                "Integration with existing infrastructure and tools",
                "Continuous improvement through measurable outcomes"
            ]
        }
    ],
    stats: [
        { value: "100%", label: "Verification" },
        { value: "85%", label: "Attack Surface Reduction" },
        { value: "50%", label: "Breach Containment" },
        { value: "Zero", label: "Implicit Trust" }
    ]
};

export default function ZeroTrustPage() {
    return <FeaturePageLayout data={zeroTrustData} />;
}
