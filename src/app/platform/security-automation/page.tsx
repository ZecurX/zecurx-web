"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Settings, Zap, Shield, Code, Eye, Target } from 'lucide-react';
import { StaticCicdPipeline } from "@/components/diagrams/static/StaticCicdPipeline";
import { StaticAutomationFlow } from "@/components/diagrams/static/StaticAutomationFlow";

const securityAutomationData = {
    badge: "Platform Feature",
    title: "Security",
    subtitle: "Automation",
    description: "Automate repetitive tasks and orchestrate your response to incidents. Reduce MTTD and MTTR while freeing up analysts for high-value work.",
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
            description: "Reduce the manual effort required for alert triage and incident response by up to 80%.",
            component: <StaticAutomationFlow />,
            points: [
                "Automated alert enrichment",
                "Playbook-driven response",
                "Case management integration",
                "Reporting automation"
            ]
        },
        {
            title: "Orchestrate Security",
            description: "Connect your entire security stack and automate workflows across disparate tools.",
            points: [
                "300+ out-of-the-box integrations",
                "Visual playbook builder",
                "Customizable workflow triggers",
                "Multi-tenant support"
            ]
        }
    ],
    stats: []
};

export default function SecurityAutomationPage() {
    return <FeaturePageLayout data={securityAutomationData} />;
}
