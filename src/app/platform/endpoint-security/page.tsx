"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Shield, Cpu, Eye, Zap, Lock, Target } from 'lucide-react';

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
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automated Response",
            description: "Instant remediation actions to contain threats before they cause damage—isolate, quarantine, or rollback."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Device Control",
            description: "Granular control over USB devices, peripherals, and removable media to prevent data exfiltration."
        },
    ],
    features: [
        {
            title: "Reduced Breach Probability",
            description: "Our behavior-based approach catches threats that signature-based solutions miss, significantly reducing the probability of a successful breach.",
            image: "/images/features/endpoint-protection.png",
            points: [
                "Zero-day threat detection without signatures",
                "Behavioral analysis of processes and applications",
                "Proactive threat hunting capabilities",
                "Real-time risk scoring for all endpoints"
            ]
        },
        {
            title: "Faster Incident Containment",
            description: "When threats are detected, our platform enables rapid containment to minimize impact and prevent spread across your environment.",
            image: "/images/features/security-dashboard.png",
            points: [
                "One-click endpoint isolation",
                "Automated remediation playbooks",
                "Forensic data collection for investigation",
                "Rollback capabilities for ransomware attacks"
            ]
        },
    ],
    stats: []
};

export default function EndpointSecurityPage() {
    return <FeaturePageLayout data={endpointSecurityData} />;
}
