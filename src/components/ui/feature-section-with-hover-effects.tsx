import { cn } from "@/lib/utils";
import {
    Zap,
    Brain,
    Shield,
    Lock,
    Cloud,
    ClipboardCheck,
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
    const features = [
        {
            title: "Application Security Testing",
            description:
                "Find vulnerabilities in your web, mobile, and API applications before attackers do.",
            icon: <Zap className="w-6 h-6" />,
        },
        {
            title: "AI & LLM Security",
            description:
                "Secure your AI applications against prompt injection, jailbreaks, and model vulnerabilities.",
            icon: <Brain className="w-6 h-6" />,
        },
        {
            title: "Cloud Security Assessment",
            description:
                "Review your AWS, GCP, or Azure configurations for misconfigurations and security gaps.",
            icon: <Shield className="w-6 h-6" />,
        },
        {
            title: "Secure Development Training",
            description:
                "Train your developers to write secure code and catch vulnerabilities early.",
            icon: <Lock className="w-6 h-6" />,
        },
        {
            title: "DevSecOps Integration",
            description:
                "Embed security into your CI/CD pipelines without slowing down releases.",
            icon: <Cloud className="w-6 h-6" />,
        },
        {
            title: "Compliance Readiness",
            description:
                "Get audit-ready for SOC 2, ISO 27001, HIPAA, and other frameworks.",
            icon: <ClipboardCheck className="w-6 h-6" />,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r py-10 relative group/feature border-border",
                (index === 0 || index === 3) && "lg:border-l border-border",
                index < 3 && "lg:border-b border-border"
            )}
        >
            {index < 3 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-muted to-transparent pointer-events-none" />
            )}
            {index >= 3 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-muted to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-blue-500">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-muted-foreground/30 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
                    {title}
                </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};

export default FeaturesSectionWithHoverEffects;
