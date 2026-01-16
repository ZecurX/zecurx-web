"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Target, Eye, Shield, Globe, Zap, Brain } from 'lucide-react';
import { CDN_ASSETS } from '@/lib/cdn';

const threatIntelligenceData = {
    badge: "Threat Intelligence",
    title: "Proactive",
    subtitle: "Threat Hunting",
    description: "Global threat intelligence combined with proactive threat hunting tailored to your organization. AI correlates threat data to surface hidden threats early.",
    heroImage: CDN_ASSETS.pages.threatIntelligence,
    capabilities: [
        {
            icon: <Target className="w-6 h-6" />,
            title: "Threat Hunting",
            description: "Proactive hunting for threats that evade automated detection, led by our expert security researchers."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Global Threat Feed",
            description: "Real-time intelligence from global threat sensors, honeypots, and security research community."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "IOC Management",
            description: "Automated ingestion and correlation of indicators of compromise across your security stack."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Dark Web Monitoring",
            description: "Monitor dark web forums, marketplaces, and paste sites for mentions of your organization."
        },
    ], // Added comma here and fixed the syntax error from '}' to ']'
    features: [
        {
            title: "Real-Time Threat Feeds",
            description: "Stay ahead of attackers with continuously updated threat indicators sourced from millions of global sensors.",
            points: [
                "Automated ingestion of IOCs (Indicators of Compromise)",
                "Correlation with your internal telemetry",
                "Contextualized threat scoring",
                "Integration with third-party feeds"
            ]
        },
        {
            title: "Reduced Dwell Time",
            description: "Detect hidden threats faster by matching your network activity against known adversary tactics, techniques, and procedures (TTPs).",
            points: [
                "Mapping to MITRE ATT&CK framework",
                "Proactive hunting for dormant threats",
                "Automated retrospective analysis",
                "Detailed adversary profiles"
            ]
        }
    ],
    stats: []
};

export default function ThreatIntelligencePage() {
    return <FeaturePageLayout data={threatIntelligenceData} />;
}
