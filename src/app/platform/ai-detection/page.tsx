"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Brain, Eye, Shield, Zap, Target, Settings } from 'lucide-react';

const aiDetectionData = {
    badge: "AI Detection & Response",
    title: "ML-Powered",
    subtitle: "Security Analytics",
    description: "High-confidence detections with contextual intelligence, not alert volume. AI-driven correlation reduces false positives and automates response actions.",
    capabilities: [
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Machine Learning Detection",
            description: "Advanced ML models trained on real-world attacks to detect sophisticated threats with high accuracy."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Behavioral Analytics",
            description: "Baseline normal behavior and detect anomalies that indicate compromise or insider threats."
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Alert Correlation",
            description: "AI correlates related alerts into unified incidents, reducing alert fatigue by 90%."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Contextual Enrichment",
            description: "Automatic enrichment of detections with threat intelligence, asset context, and risk scoring."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automated Response",
            description: "AI-driven response actions that contain threats automatically based on confidence levels."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Continuous Learning",
            description: "Models that continuously learn from analyst feedback to improve detection accuracy over time."
        },
    ],
    features: [
        {
            title: "Faster Incident Response",
            description: "AI accelerates every phase of incident response—from detection to investigation to remediation.",
            image: "/images/features/ai-detection.png",
            points: [
                "Automated initial triage",
                "AI-generated investigation summaries",
                "Recommended response actions",
                "One-click remediation"
            ]
        },
        {
            title: "Reduced Alert Fatigue",
            description: "Stop chasing false positives. Our AI ensures your team focuses only on real threats.",
            image: "/images/features/security-analytics.png",
            points: [
                "99% reduction in false positives",
                "Unified incident view",
                "Priority-based alert queue",
                "Noise suppression for known-good activity"
            ]
        },
    ],
    stats: []
};

export default function AIDetectionPage() {
    return <FeaturePageLayout data={aiDetectionData} />;
}
