"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Shield, Lock, UserCheck, Eye, Network, Key } from "lucide-react";
import { StaticIdentityVerification } from "@/components/diagrams/static/StaticIdentityVerification";
import { StaticNetworkDefense } from "@/components/diagrams/static/StaticNetworkDefense";
import { StaticThreatMesh } from "@/components/diagrams/static/StaticThreatMesh";

const zeroTrustData = {
    badge: "Security Solution",
    title: "Zero",
    subtitle: "Trust",
    description: "Never trust, always verify. Implement a Zero Trust architecture that secures users, devices, and applications regardless of location or network.",
    capabilities: [
        {
            icon: <UserCheck className="w-6 h-6" />,
            title: "Continuous Verification",
            description: "Verify identity and context for every access request, not just at login."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Least Privilege",
            description: "Grant only the minimum access necessary for users to perform their jobs."
        },
        {
            icon: <Network className="w-6 h-6" />,
            title: "Micro-Segmentation",
            description: "Segment your network to prevent lateral movement and contain breaches."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Full Visibility",
            description: "See and monitor all traffic, users, and devices across your environment."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Device Trust",
            description: "Ensure only healthy, managed devices can access corporate resources."
        },
        {
            icon: <Key className="w-6 h-6" />,
            title: "Adaptive Access",
            description: "Dynamically adjust access policies based on real-time risk assessment."
        }
    ],
    features: [
        {
            title: "Protect Critical Assets",
            description: "Zero Trust assumes the network is compromised. We help you define your protect surface and wrap security controls around your most critical data and applications.",
            component: <StaticIdentityVerification />,
            points: [
                "Identify and classify DAAS (Data, Assets, Applications, Services)",
                "Map transaction flows",
                "Architect Zero Trust micro-perimeters",
                "Monitor and maintain security posture"
            ]
        },
        {
            title: "Secure Remote Access",
            description: "VPNs are a security risk. Replace them with Zero Trust Network Access (ZTNA) to provide secure, direct connectivity to applications without network access.",
            points: [
                "Application-level access control",
                "Invisible infrastructure - cloak your apps from the internet",
                "Seamless user experience without VPN agents",
                "granular policy enforcement"
            ]
        },
        {
            title: "Limit Blast Radius",
            description: "If a breach occurs, it shouldn't take down your whole business. Zero Trust limits the impact by preventing lateral movement.",
            points: [
                "East-west traffic inspection",
                "Automated containment of compromised segments",
                "User-to-application segmentation",
                "Real-time breach detection"
            ]
        }
    ],
    stats: [
        { value: "100%", label: "Verified Access" },
        { value: "0", label: "Implicit Trust" },
        { value: "50%", label: "Faster Access" },
        { value: "24/7", label: "Protection" }
    ]
};

export default function ZeroTrustPage() {
    return <FeaturePageLayout data={zeroTrustData} />;
}
