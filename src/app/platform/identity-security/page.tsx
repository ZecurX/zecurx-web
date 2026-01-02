"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { KeyRound, Shield, Users, Eye, Lock, Zap } from 'lucide-react';

const identitySecurityData = {
    badge: "Identity Security",
    title: "Zero Trust",
    subtitle: "Identity Protection",
    description: "Focus on identity behavior, privilege usage, and access risk—not just authentication. AI detects identity abuse and triggers automated access restrictions.",
    capabilities: [
        {
            icon: <KeyRound className="w-6 h-6" />,
            title: "Privileged Access Management",
            description: "Secure and monitor privileged accounts with just-in-time access, session recording, and credential vaulting."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Identity Governance",
            description: "Automated access reviews, certification campaigns, and lifecycle management for all identities."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Behavior Analytics",
            description: "AI-powered detection of anomalous identity behavior, impossible travel, and credential abuse patterns."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "MFA Enforcement",
            description: "Adaptive multi-factor authentication that adjusts based on risk context and user behavior."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Single Sign-On",
            description: "Secure SSO for all applications with centralized access policies and real-time visibility."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automated Response",
            description: "Instant response to identity threats—disable accounts, revoke sessions, or require re-authentication."
        },
    ],
    features: [
        {
            title: "Reduced Identity Attacks",
            description: "Identity is the new perimeter. Our platform protects against credential theft, phishing, and account takeover attacks.",
            image: "/images/features/identity-security.png",
            points: [
                "Real-time credential abuse detection",
                "Phishing-resistant authentication",
                "Dark web credential monitoring",
                "Compromised password detection"
            ]
        },
        {
            title: "Improved Access Governance",
            description: "Ensure the right people have the right access to the right resources—no more, no less.",
            image: "/images/features/access-control.png",
            points: [
                "Automated access reviews",
                "Role-based access control",
                "Segregation of duties enforcement",
                "Access certification campaigns"
            ]
        },
    ],
    stats: []
};

export default function IdentitySecurityPage() {
    return <FeaturePageLayout data={identitySecurityData} />;
}
