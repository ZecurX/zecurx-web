"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { FileText, Shield, CheckCircle, Eye, Settings, Lock } from "lucide-react";
import { StaticAnalystDashboard } from "@/components/diagrams/static/StaticAnalystDashboard";
import { StaticAutomationFlow } from "@/components/diagrams/static/StaticAutomationFlow";
import { StaticComplianceGrid } from "@/components/diagrams/static/StaticComplianceGrid";

const complianceData = {
    badge: "Security Solution",
    title: "Compliance &",
    subtitle: "Regulatory Alignment",
    description: "Achieve and maintain compliance with industry regulations and security frameworks. Our automated compliance platform reduces audit burden, demonstrates due diligence, and ensures continuous adherence to required standards.",
    capabilities: [
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Framework Coverage",
            description: "Pre-built policies for NIST, ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR, and more."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Continuous Monitoring",
            description: "Real-time compliance posture tracking with automated drift detection and alerts."
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Automated Evidence",
            description: "Automatic collection and organization of audit evidence for faster certification."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Risk Management",
            description: "Integrated risk assessment and treatment tracking aligned with compliance objectives."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Policy Management",
            description: "Centralized policy library with version control, approval workflows, and attestation."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Vendor Assessment",
            description: "Third-party risk management with automated questionnaires and continuous monitoring."
        }
    ],
    features: [
        {
            title: "Streamline Your Compliance Program",
            description: "Manual compliance is expensive and error-prone. Our automated platform reduces the burden on your team while improving accuracy and consistency.",
            points: [
                "Unified dashboard for all compliance frameworks",
                "Automated control testing and evidence collection",
                "Gap analysis with prioritized remediation guidance",
                "Audit-ready reports generated on demand"
            ]
        },
        {
            title: "Map Controls Once, Comply Many Times",
            description: "Most compliance frameworks share common control requirements. Our platform leverages this overlap, allowing you to map controls once and demonstrate compliance across multiple standards.",
            component: <StaticComplianceGrid />,
            points: [
                "Cross-framework control mapping and inheritance",
                "Reusable evidence across multiple audits",
                "Common Controls Framework integration",
                "Custom framework support for internal policies"
            ]
        },
        {
            title: "Demonstrate Continuous Compliance",
            description: "Point-in-time audits don’t reflect your true security posture. Our continuous monitoring capabilities demonstrate ongoing compliance and help you catch issues before auditors do.",
            component: <StaticAutomationFlow />,
            points: [
                "Real-time compliance score and trending",
                "Automated alerts for compliance drift",
                "Continuous control effectiveness testing",
                "Board-ready compliance reporting"
            ]
        }
    ],
    stats: [
        { value: "20+", label: "Frameworks Supported" },
        { value: "80%", label: "Audit Time Reduction" },
        { value: "100%", label: "Evidence Coverage" },
        { value: "Real-time", label: "Compliance Status" }
    ]
};

export default function CompliancePage() {
    return <FeaturePageLayout data={complianceData} />;
}
