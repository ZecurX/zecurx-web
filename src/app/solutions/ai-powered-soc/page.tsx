"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Brain, Eye, Zap, Target, Shield, Settings } from "lucide-react";

const aiPoweredSocData = {
    badge: "Security Solution",
    title: "AI-Powered",
    subtitle: "SOC",
    description: "Modernize your security operations with intelligence-driven detection and AI-powered response. Transform your SOC from reactive to proactive, reducing mean time to detect and respond while empowering analysts to focus on strategic threats.",
    heroImage: "/images/pages/ai-powered-soc.jpeg",
    capabilities: [
        {
            icon: <Brain className="w-6 h-6" />,
            title: "AI-Driven Detection",
            description: "Machine learning models that detect sophisticated attacks, behavioral anomalies, and zero-day threats in real time."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Autonomous Investigation",
            description: "Automated alert triage and investigation that surfaces the context analysts need to make faster decisions."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Accelerated Response",
            description: "AI-orchestrated response playbooks that contain threats in seconds, not hours."
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Threat Hunting",
            description: "Proactive threat hunting powered by global threat intelligence and behavioral analytics."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Alert Correlation",
            description: "Intelligent correlation engine that reduces alert fatigue and surfaces high-fidelity incidents."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Workflow Automation",
            description: "Customizable SOAR capabilities that automate repetitive tasks and standardize response procedures."
        }
    ],
    features: [
        {
            title: "Turn Every Analyst Into a Force Multiplier",
            description: "Security talent is scarce and expensive. Our AI augments your team's capabilities, enabling junior analysts to perform at senior levels and freeing senior analysts to focus on advanced threats.",
            points: [
                "AI-assisted investigations that provide instant context and recommendations",
                "Automated documentation and reporting that saves hours of manual work",
                "Natural language querying across your entire security data lake",
                "Guided response workflows based on best practices and tribal knowledge"
            ]
        },
        {
            title: "Detect What Others Miss",
            description: "Traditional signature-based detection can't keep pace with modern threats. Our AI continuously learns from global threat intelligence and your environment to detect sophisticated attacks that evade conventional tools.",
            points: [
                "Behavioral analytics that detect living-off-the-land attacks",
                "Entity behavior analysis for insider threat detection",
                "Cross-platform correlation for advanced persistent threats",
                "Real-time threat intelligence integration and enrichment"
            ]
        },
        {
            title: "Respond at Machine Speed",
            description: "When every second counts, manual response isn't enough. Our AI-orchestrated response capabilities contain threats automatically while keeping humans in control of critical decisions.",
            points: [
                "Sub-second automated containment of confirmed threats",
                "Intelligent escalation based on threat severity and business context",
                "Rollback and recovery automation for ransomware scenarios",
                "Continuous improvement through machine learning feedback loops"
            ]
        }
    ],
    stats: [
        { value: "95%", label: "Faster Response" },
        { value: "80%", label: "Alert Reduction" },
        { value: "10x", label: "Analyst Efficiency" },
        { value: "24/7", label: "Autonomous Coverage" }
    ]
};

export default function AIPoweredSOCPage() {
    return <FeaturePageLayout data={aiPoweredSocData} />;
}
