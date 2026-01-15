"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Shield, Lock, RefreshCw, Eye, Database, AlertTriangle, HardDrive, Activity, Server, FileText } from "lucide-react";

const ransomwareDefenseData = {
    badge: "Security Solution",
    title: "Ransomware",
    subtitle: "Defense",
    description: "Stop ransomware before it encrypts your data. Our multi-layered defense combines AI-driven prevention, deception technology, and automated recovery to ensure business continuity.",
    heroImage: "/images/pages/ransomware-defense.jpeg",
    capabilities: [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Pre-Execution Prevention",
            description: "Block ransomware variants before they can execute using AI-based static analysis."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Behavioral Blocking",
            description: "Detect and stop encryption behaviors in real-time, even for zero-day ransomware."
        },
        {
            icon: <HardDrive className="w-6 h-6" />,
            title: "Automated Recovery",
            description: "Shadow copy protection and instant rollback to restore data to its pre-encrypted state."
        },
        {
            icon: <Activity className="w-6 h-6" />,
            title: "Deception",
            description: "Deploy ransomware honeypots to detect early lateral movement and intruder activity."
        },
        {
            icon: <Server className="w-6 h-6" />,
            title: "Server Protection",
            description: "Specialized protection for critical servers and databases against targeted ransomware."
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "File Integrity Monitoring",
            description: "Monitor critical files for unauthorized changes or encryption attempts."
        }
    ],
    features: [
        {
            title: "Stop Ransomware at the Door",
            description: "Prevent initial access with advanced exploit protection and AI-driven malware analysis.",
            points: [
                "Block exploit kits and drive-by downloads",
                "Prevent credential theft and abuse",
                "Analyze email attachments and links in a sandbox",
                "Identify and patch vulnerabilities automatically"
            ]
        },
        {
            title: "Detect & Block Encryption",
            description: "Our behavioral engine monitors for encryption activities and kills malicious processes in milliseconds.",
            points: [
                "Real-time analysis of file system activity",
                "Kill malicious processes instantly upon detection",
                "Isolate infected endpoints from the network",
                "Prevent lateral movement to other systems"
            ]
        },
        {
            title: "Recover with Confidence",
            description: "Ensure business resilience with automated backups and instant rollback capabilities.",
            points: [
                "Tamper-proof shadow copy protection",
                "One-click rollback of encrypted files",
                "exclude known safe processes to prevent false positives",
                "Detailed forensics reports for post-incident analysis"
            ]
        }
    ],
    stats: [
        { value: "100%", label: "Ransomware Blocked" },
        { value: "<1ms", label: "Blocking Speed" },
        { value: "0", label: "Data Lost" },
        { value: "24/7", label: "Automated Defense" }
    ]
};

export default function RansomwareDefensePage() {
    return <FeaturePageLayout data={ransomwareDefenseData} />;
}
