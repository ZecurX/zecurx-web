"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Shield, Cpu, Eye, Zap, Lock, Target } from 'lucide-react';
import { StaticIdentityVerification } from "@/components/diagrams/static/StaticIdentityVerification";
import { StaticNetworkDefense } from "@/components/diagrams/static/StaticNetworkDefense";

const endpointSecurityData = {
    badge: "Endpoint Security",
    title: "Behavior-Based",
    subtitle: "Endpoint Protection",
    description: "Continuous endpoint visibility and behavior-based protection rather than relying only on signatures. AI models detect abnormal behavior, lateral movement, and zero-day activity.",
    capabilities: [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Advanced Threat Protection",
            description: "Real-time detection and prevention of malware, ransomware, and fileless attacks using AI-powered behavioral analysis."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Continuous Visibility",
            description: "Complete visibility into endpoint activity, processes, and network connections across your entire fleet."
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "AI-Powered Detection",
            description: "Machine learning models trained on millions of samples to detect zero-day threats and sophisticated attacks."
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Lateral Movement Detection",
            description: "Identify and block attackers attempting to move laterally through your network after initial compromise."
        },
    ],
    features: [
        {
            title: "Prevent Malware Execution",
            description: "Stop known and unknown threats with AI-driven static analysis and behavioral blocking.",
            points: [
                "Pre-execution blocking of malware and ransomware",
                "Script control to prevent fileless attacks",
                "Device control for USB and peripheral security",
                "Memory protection against exploit techniques"
            ]
        },
        {
            title: "Faster Incident Containment",
            description: "Isolate compromised devices instantly to stop the spread of attacks.",
            component: <StaticNetworkDefense />,
            points: [
                "One-click network isolation",
                "Automated quarantine of malicious files",
                "Remote sheel for investigation and remediation",
                "Real-time query of endpoint state"
            ]
        }
    ],
    stats: []
};

export default function EndpointSecurityPage() {
    return <FeaturePageLayout data={endpointSecurityData} />;
}
