"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Shield, Lock, RefreshCw, Eye, Database, AlertTriangle } from "lucide-react";

const ransomwareDefenseData = {
    badge: "Security Solution",
    title: "Ransomware",
    subtitle: "Defense",
    description: "Multi-layered defense combining prevention, detection, and rapid recovery. Protect your organization from the devastating impact of ransomware with proactive security controls and resilient recovery capabilities.",
    capabilities: [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Attack Prevention",
            description: "AI-powered threat prevention that blocks ransomware at multiple stages of the attack chain."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Early Detection",
            description: "Behavioral analytics that identify ransomware activity before encryption begins."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Endpoint Protection",
            description: "Advanced endpoint security with anti-tampering and rollback capabilities."
        },
        {
            icon: <AlertTriangle className="w-6 h-6" />,
            title: "Threat Intelligence",
            description: "Real-time intelligence on emerging ransomware variants and attack techniques."
        },
        {
            icon: <RefreshCw className="w-6 h-6" />,
            title: "Rapid Recovery",
            description: "Automated recovery workflows that restore operations in hours, not days."
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: "Backup Protection",
            description: "Immutable backup architectures that ensure recoverability even after compromise."
        }
    ],
    features: [
        {
            title: "Stop Ransomware Before It Starts",
            description: "The best ransomware defense is preventing the attack from succeeding in the first place. Our multi-layered prevention approach blocks threats at every stage—from initial access to lateral movement to encryption.",
            image: "/images/features/ransomware-defense.png",
            points: [
                "Email security that blocks phishing and malicious attachments",
                "Endpoint protection with AI-powered threat prevention",
                "Network segmentation that limits blast radius",
                "Vulnerability management to eliminate attack vectors"
            ]
        },
        {
            title: "Detect and Contain at Machine Speed",
            description: "When prevention fails, speed is everything. Our behavioral detection identifies ransomware activity in seconds and automatically contains affected systems to prevent spread.",
            image: "/images/features/threat-hunting.png",
            points: [
                "Behavioral analytics tuned for ransomware TTPs",
                "Automatic endpoint isolation upon detection",
                "Real-time alerts with full attack context",
                "24/7 SOC monitoring and response"
            ]
        },
        {
            title: "Recover with Confidence",
            description: "Ransomware incidents are measured in downtime and data loss. Our recovery capabilities minimize both with protected backups and tested recovery procedures.",
            image: "/images/features/data-protection.png",
            points: [
                "Immutable backup storage immune to encryption",
                "Automated recovery orchestration and validation",
                "Forensic analysis to ensure complete remediation",
                "Post-incident hardening recommendations"
            ]
        }
    ],
    stats: [
        { value: "<4hr", label: "Response SLA" },
        { value: "99.9%", label: "Prevention Rate" },
        { value: "24/7", label: "SOC Coverage" },
        { value: "Zero", label: "Data Loss Goal" }
    ]
};

export default function RansomwareDefensePage() {
    return <FeaturePageLayout data={ransomwareDefenseData} />;
}
