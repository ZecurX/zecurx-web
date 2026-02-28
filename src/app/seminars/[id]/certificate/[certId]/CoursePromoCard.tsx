import { ArrowRight, ShieldCheck, Terminal, Award, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CDN_ASSETS } from "@/lib/cdn";

interface PromoContent {
    id: string;
    headline: string;
    courseName: string;
    description: string;
    ctaLink: string;
    ctaText: string;
    Icon: React.ComponentType<{ className?: string }>;
    imagePath: string;
}

const PROMOS: PromoContent[] = [
    {
        id: "cppt",
        headline: "Break In Before They Do",
        courseName: "zxCPPT — Certified Professional Pen Tester",
        description: "Go beyond scanning — learn red teaming methodology, custom exploit development, and advanced evasion techniques used by elite pen testers. 80 hours of hands-on labs with ISO-verified certification.",
        ctaLink: "/academy",
        ctaText: "View Curriculum",
        Icon: Award,
        imagePath: CDN_ASSETS.courses.cppt,
    },
    {
        id: "cpeh",
        headline: "Think Like an Adversary",
        courseName: "zxCPEH — Certified Professional Ethical Hacker",
        description: "Master advanced exploitation, Active Directory attacks, and privilege escalation through project-based learning. 60 hours of real-world offensive security training with ISO certification.",
        ctaLink: "/academy",
        ctaText: "Start Learning",
        Icon: Terminal,
        imagePath: CDN_ASSETS.courses.cpeh,
    },
    {
        id: "gaip",
        headline: "Weaponize AI for Defense",
        courseName: "zxGAIP — Generative AI Professional",
        description: "Harness LLMs for automated threat hunting, secure AI deployment, and next-gen security operations. 40 hours of cutting-edge AI security training with real-world case studies and ISO certification.",
        ctaLink: "/academy",
        ctaText: "Explore Course",
        Icon: Cpu,
        imagePath: CDN_ASSETS.courses.gaip,
    },
    {
        id: "bundle-ai",
        headline: "The Complete Cyber + AI Arsenal",
        courseName: "CyberSecurity + Generative AI Bundle",
        description: "Three ISO certifications, one program. Combine core cybersecurity skills with Generative AI defense strategies — from threat detection to prompt engineering for security ops. Includes internship opportunity.",
        ctaLink: "/academy",
        ctaText: "View Bundle",
        Icon: ShieldCheck,
        imagePath: CDN_ASSETS.courses["bundle-ai"],
    }
];

export function CoursePromoCard({ className }: { className?: string }) {
    const promo = (() => {
        const rand = Math.random();
        if (rand < 0.4) return PROMOS[0];
        if (rand < 0.6) return PROMOS[1];
        if (rand < 0.8) return PROMOS[2];
        return PROMOS[3];
    })();

    return (
        <div className={cn("relative overflow-hidden bg-zinc-950 group", className)}>
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="relative px-8 py-6 lg:px-12 lg:py-8 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md text-zinc-400">
                            <promo.Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight uppercase opacity-80">
                            Recommended Next Step
                        </h3>
                    </div>
                    
                    <div className="space-y-2">
                        <h4 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                            {promo.headline}
                        </h4>
                        <p className="text-xs lg:text-sm font-semibold tracking-wide uppercase text-zinc-500">
                            {promo.courseName}
                        </p>
                        <p className="text-sm lg:text-base text-zinc-400 max-w-2xl leading-relaxed">
                            {promo.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-6 shrink-0">
                    <Link 
                        href={promo.ctaLink}
                        className="shrink-0 group/btn px-8 py-3.5 bg-white text-zinc-900 font-bold text-sm lg:text-base rounded-xl shadow-xl hover:shadow-2xl hover:bg-zinc-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                    >
                        {promo.ctaText}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <div className="relative w-72 h-32 hidden sm:block opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105 origin-right">
                         <Image
                            src={promo.imagePath}
                            alt={promo.courseName}
                            fill
                            className="object-contain object-right"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
