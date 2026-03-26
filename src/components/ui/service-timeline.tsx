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

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
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
};

interface TimelineItem {
  title: string;
  desc: string;
  icon: string; // Icon name as string
}

interface ServiceTimelineProps {
  items: TimelineItem[];
}

export function ServiceTimeline({ items }: ServiceTimelineProps) {
  return (
    <div className="w-full max-w-4xl mx-auto relative pt-4">
      {/* Central Line */}
      <div className="absolute left-[39px] sm:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent -translate-x-1/2 hidden sm:block" />
      
      {/* Left Line for Mobile */}
      <div className="absolute left-[39px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent sm:hidden" />

      <div className="space-y-12 sm:space-y-16">
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon] || Search;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={cn(
                "relative flex items-center group",
                isEven ? "sm:flex-row" : "sm:flex-row-reverse",
                "flex-row" // Mobile is always row (icon left, text right)
              )}
            >
              {/* Icon Node */}
              <div 
                className={cn(
                  "absolute left-[39px] sm:left-1/2 -translate-x-1/2 flex-shrink-0 z-10",
                  "w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center",
                  "transition-all duration-300 group-hover:border-[#4a69e6]/30 group-hover:shadow-[0_0_20px_rgba(74,111,250,0.15)] group-hover:scale-110"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#4a69e6]/10">
                  <Icon className="w-5 h-5 text-slate-500 transition-colors duration-300 group-hover:text-[#4a69e6]" />
                </div>
              </div>

              {/* Content Card container */}
              <div 
                className={cn(
                  "w-full sm:w-1/2 flex",
                  isEven ? "sm:justify-end sm:pr-16" : "sm:justify-start sm:pl-16",
                  "pl-20 pr-0" // Mobile padding
                )}
              >
                {/* The Card */}
                <div className="w-full relative bg-white/60 hover:bg-white backdrop-blur-sm border border-slate-200/60 hover:border-slate-300/80 p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  {/* Subtle active indicator dot */}
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4a69e6] opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden sm:block",
                    isEven ? "-right-3" : "-left-3"
                  )} />
                  
                  <h3 className="text-xl sm:text-2xl font-bold font-manrope text-[#0c1a2e] mb-3 group-hover:text-[#4a69e6] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-inter text-[15px] sm:text-[16px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}