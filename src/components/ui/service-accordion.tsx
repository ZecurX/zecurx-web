"use client";

import { useState } from "react";
import { 
  ChevronDown, 
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

interface AccordionItem {
  title: string;
  desc: string;
  icon: string; // Icon name as string
}

interface ServiceAccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export function ServiceAccordion({ items, defaultOpen = 0 }: ServiceAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const Icon = iconMap[item.icon] || Search;

        return (
          <div
            key={idx}
            className={cn(
              "group relative overflow-hidden rounded-2xl border transition-all duration-300 ease-out",
              isOpen 
                ? "bg-white border-[#4a69e6]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
                : "bg-white/60 border-slate-200/60 hover:bg-white hover:border-slate-300/80 hover:shadow-sm"
            )}
          >
            {/* Active Left Indicator */}
            <div 
              className={cn(
                "absolute left-0 top-0 bottom-0 w-1 bg-[#4a69e6] transition-transform duration-300 ease-out origin-top",
                isOpen ? "scale-y-100" : "scale-y-0"
              )}
            />

            {/* Accordion Header */}
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center gap-5 px-6 py-5 sm:px-8 sm:py-6 text-left outline-none"
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  isOpen
                    ? "bg-[#4a69e6]/10 text-[#4a69e6]"
                    : "bg-slate-100/80 text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-100"
                )}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={isOpen ? 2 : 1.5} />
              </div>

              {/* Title */}
              <span
                className={cn(
                  "flex-1 text-[17px] sm:text-[19px] font-semibold font-manrope transition-colors duration-200",
                  isOpen ? "text-[#0c1a2e]" : "text-slate-700 group-hover:text-[#0c1a2e]"
                )}
              >
                {item.title}
              </span>

              {/* Chevron Wrapper */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
                isOpen ? "bg-[#4a69e6]/5" : "bg-transparent group-hover:bg-slate-50"
              )}>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 ease-out",
                    isOpen ? "rotate-180 text-[#4a69e6]" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
              </div>
            </button>

            {/* Accordion Content */}
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 pl-[5.25rem] sm:pl-[6.5rem]">
                  <p className="text-slate-600 font-inter text-[15px] sm:text-[16px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
