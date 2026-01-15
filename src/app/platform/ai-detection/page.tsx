"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Brain, Search, AlertTriangle, Shield, CheckCircle, Lock } from 'lucide-react';

const aiDetectionData = {
    badge: "Platform Feature",
    title: "AI",
    subtitle: "Detection",
    description: "Stay ahead of sophisticated attacks with AI-driven threat detection. Our models learn your environment to identify anomalies and stop zero-day threats in real-time.",
    heroImage: "/images/pages/ai-detection.jpeg",
    capabilities: [
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Machine Learning",
            description: "Supervised and unsupervised learning models ensuring high fidelity detection."
        },
        {
            icon: <Search className="w-6 h-6" />,
            title: "Anomaly Detection",
            description: "Behavioral analytics to spot deviations from normal user and system activity."
        },
        {
            icon: <AlertTriangle className="w-6 h-6" />,
            title: "Zero-Day Protection",
            description: "Detect never-before-seen threats without relying on signatures."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Automated Triage",
            description: "AI prioritizes alerts to reduce noise and focus analysts on real threats."
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "High Accuracy",
            description: "Continuous model retraining to minimize false positives and negatives."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Insider Threat",
            description: "Detect malicious or negligent insider activity before data leaves."
        },
    ],
    features: [
        {
            title: "Detect the Undetectable",
            description: "Traditional security tools miss what they don't know. Our AI sees patterns and behaviors that signal a threat, even if it has no signature.",
            points: [
                "Behavioral baselining for users and entities",
                "Detection of living-off-the-land attacks",
                "Identification of slow-and-low data exfiltration",
                "Real-time correlation across attack vectors"
            ]
        },
        {
            title: "Explainable AI",
            description: "Don't just get an alert—understand why. Our platform provides transparent reasoning for every AI determination.",
            points: [
                "Natural language explanation of alerts",
                "Visual timeline of contributing events",
                "Mapping to MITRE ATT&CK framework",
                "Confidence scoring for every detection"
            ]
        }
    ],
    stats: []
};

export default function AiDetectionPage() {
    return <FeaturePageLayout data={aiDetectionData} />;
}
