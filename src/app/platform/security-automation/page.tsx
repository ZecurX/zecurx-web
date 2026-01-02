"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Settings, Zap, Shield, Code, Eye, Target } from 'lucide-react';

const securityAutomationData = {
    badge: "Security Automation",
    title: "SOAR",
    subtitle: "Capabilities",
    description: "Automation embedded across detection, investigation, and response workflows. AI-driven playbooks automate repetitive tasks for strategic focus.",
    capabilities: [
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Playbook Automation",
            description: "Pre-built and custom playbooks that automate common security operations tasks and workflows."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Orchestration",
            description: "Connect and orchestrate actions across your entire security stack through unified workflows."
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: "No-Code Builder",
            description: "Visual playbook builder that enables security teams to create automations without coding."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Case Management",
            description: "Centralized case management with automated evidence collection and collaboration tools."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Integration Hub",
            description: "500+ pre-built integrations with security tools, IT systems, and business applications."
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Metrics & Reporting",
            description: "Real-time dashboards and reports on automation ROI, MTTR, and team efficiency."
        },
    ],
    features: [
        {
            title: "Lower Operational Costs",
            description: "Automate the repetitive tasks that consume analyst time, allowing your team to focus on high-value work.",
            image: "/images/features/security-dashboard.png",
            points: [
                "80% reduction in manual tasks",
                "Automated ticket creation and routing",
                "Self-healing infrastructure",
                "Automated compliance reporting"
            ]
        },
        {
            title: "Faster Response Cycles",
            description: "Automation enables response at machine speed, containing threats before they can cause damage.",
            image: "/images/features/ai-detection.png",
            points: [
                "Sub-second automated actions",
                "24/7 automated response",
                "Consistent execution every time",
                "Reduced human error"
            ]
        },
    ],
    stats: []
};

export default function SecurityAutomationPage() {
    return <FeaturePageLayout data={securityAutomationData} />;
}
