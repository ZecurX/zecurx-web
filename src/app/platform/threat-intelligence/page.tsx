"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Target, Eye, Shield, Globe, Zap, Brain } from 'lucide-react';

const threatIntelligenceData = {
    badge: "Threat Intelligence",
    title: "Proactive",
    subtitle: "Threat Hunting",
    description: "Global threat intelligence combined with proactive threat hunting tailored to your organization. AI correlates threat data to surface hidden threats early.",
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
        {
            icon: <Brain className="w-6 h-6" />,
            title: "AI Correlation",
            description: "Machine learning models that correlate threat data to identify campaigns targeting your industry."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Threat Briefings",
            description: "Regular intelligence briefings on emerging threats and recommended defensive actions."
        },
    ],
    features: [
        {
            title: "Early Attack Detection",
            description: "Identify attacks in their early stages before they cause significant impact. Intelligence-driven detection catches what automated tools miss.",
            image: "/images/features/threat-hunting.png",
            points: [
                "Pre-attack reconnaissance detection",
                "Campaign tracking and attribution",
                "Industry-specific threat profiles",
                "Attack chain analysis"
            ]
        },
        {
            title: "Reduced Dwell Time",
            description: "The average attacker dwells in networks for months. Our threat hunting reduces this to hours or days.",
            image: "/images/features/incident-response.png",
            points: [
                "Scheduled and on-demand hunting",
                "Hypothesis-driven investigations",
                "Behavioral anomaly detection",
                "Historical data analysis"
            ]
        },
    ],
    stats: []
};

export default function ThreatIntelligencePage() {
    return <FeaturePageLayout data={threatIntelligenceData} />;
}
