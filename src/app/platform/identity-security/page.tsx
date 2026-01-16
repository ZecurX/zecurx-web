"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { UserCheck, Shield, Key, Eye, Lock, Fingerprint } from 'lucide-react';
import { CDN_ASSETS } from '@/lib/cdn';

const identitySecurityData = {
    badge: "Platform Feature",
    title: "Identity",
    subtitle: "Security",
    description: "Secure identities across your enterprise. Detect compromised credentials and lateral movement with identity-centric security.",
    heroImage: CDN_ASSETS.pages.identitySecurity,
    capabilities: [
        {
            icon: <UserCheck className="w-6 h-6" />,
            title: "Identity Threat Detection",
            description: "Detect identity-based attacks like credential theft, privilege escalation, and lateral movement in real-time."
        },
        {
            icon: <Key className="w-6 h-6" />,
            title: "Access Management",
            description: "Enforce least privilege access with granular controls and dynamic policies based on user risk."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "MFA Enforcement",
            description: "Adaptive Multi-Factor Authentication that steps up challenges based on risk scoring."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Visibility",
            description: "Complete visibility into all accounts, roles, and entitlements across cloud and on-premises environments."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "SSO Integration",
            description: "Seamless integration with major Identity Providers (IdPs) like Okta, Azure AD, and Ping."
        },
        {
            icon: <Fingerprint className="w-6 h-6" />,
            title: "Biometric Support",
            description: "Support for modern passwordless authentication methods using FIDO2 and biometrics."
        },
    ],
    features: [
        {
            title: "Prevent Account Takeover",
            description: "Stop attackers from using stolen credentials. Our AI analyzes user behavior to detect anomalies and block unauthorized access.",
            points: [
                "Behavioral baseline profiling",
                "Impossible travel detection",
                "Risky IP and device blocking",
                "Automated account lockout"
            ]
        },
        {
            title: "Unified Identity View",
            description: "Get a single view of identity risk across your entire organization. Correlate identity data with endpoint and network telemetry.",
            points: [
                "360-degree user risk scoring",
                "Cross-domain correlation",
                "Privileged user monitoring",
                "Identity hygiene reporting"
            ]
        }
    ],
    stats: []
};

export default function IdentitySecurityPage() {
    return <FeaturePageLayout data={identitySecurityData} />;
}
