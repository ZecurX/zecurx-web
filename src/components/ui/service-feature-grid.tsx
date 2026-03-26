"use client";

import { 
  Search, 
  Bug, 
  Scan, 
  FileCode, 
  KeyRound, 
  CheckCircle, 
  Code, 
  FileCheck, 
  Award, 
  GitBranch, 
  ShieldCheck,
  LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Search, Bug, Scan, FileCode, KeyRound, CheckCircle, 
  Code, FileCheck, Award, GitBranch, ShieldCheck,
};

interface FeatureItem {
  title: string;
  desc: string;
  icon: string;
}

interface ServiceFeatureGridProps {
  items: FeatureItem[];
}

export function ServiceFeatureGrid({ items }: ServiceFeatureGridProps) {
  return (
    <div className={cn(
      "grid gap-6",
      items.length === 4 
        ? "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto" 
        : items.length >= 3 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
    )}>
      {items.map((item, idx) => {
        const Icon = iconMap[item.icon] || Search;
        
        return (
          <div
            key={idx}
            className="group relative bg-white border border-slate-200/80 rounded-3xl p-8 hover:border-[#4a69e6]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col h-full"
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#4a69e6]/5 rounded-full blur-3xl group-hover:bg-[#4a69e6]/10 transition-colors duration-500" />
            
            {/* Icon Wrapper */}
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-300 z-10">
              <Icon className="w-6 h-6 text-slate-600 group-hover:text-[#4a69e6] transition-colors duration-300" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-bold font-manrope text-[#0c1a2e] mb-3 z-10 group-hover:text-[#4a69e6] transition-colors duration-300">
              {item.title}
            </h3>
            
            <p className="text-slate-600 font-inter text-[15px] leading-relaxed z-10 flex-grow">
              {item.desc}
            </p>
            
            {/* Subtle bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4a69e6] to-[#92c4fd] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
}
