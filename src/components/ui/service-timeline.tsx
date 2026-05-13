"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
  icon: string;
}

interface ServiceTimelineProps {
  items: TimelineItem[];
}

const Connector = ({ 
  direction, 
  isActive 
}: { 
  direction: "right" | "down" | "left", 
  isActive: boolean 
}) => {
  const isHorizontal = direction === "right" || direction === "left";
  // Path flows start to end, mapping to directional logic
  const pathD = direction === "right" ? "M 0 5 L 100 5" : 
                direction === "left" ? "M 100 5 L 0 5" : 
                "M 5 0 L 5 100";
  
  return (
    <div className={cn(
      "hidden md:block absolute z-0 overflow-visible pointer-events-none",
      direction === "right" ? "-right-16 top-1/2 -translate-y-1/2 w-16 h-2" :
      direction === "left" ? "-left-16 top-1/2 -translate-y-1/2 w-16 h-2" :
      "-bottom-16 left-1/2 -translate-x-1/2 w-2 h-16"
    )}>
      <svg viewBox={isHorizontal ? "0 0 100 10" : "0 0 10 100"} preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {/* Architectural Base Track */}
        <path 
          d={pathD} 
          stroke={isActive ? "#cbd5e1" : "#f1f5f9"} 
          strokeWidth="1" 
          fill="none" 
          vectorEffect="non-scaling-stroke" 
          className="transition-colors duration-700 ease-out"
        />
        {/* Subtle Signal Flow Pulse */}
        <g className={cn("transition-opacity duration-700 ease-out", isActive ? "opacity-100" : "opacity-40")}>
          <motion.path 
            d={pathD} 
            stroke="#4c69e4" 
            strokeWidth="1.5" 
            fill="none" 
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: 0.3 }}
            animate={{ pathOffset: [0, 1], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </g>
      </svg>
    </div>
  );
};

export function ServiceTimeline({ items }: ServiceTimelineProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto relative pt-4 md:pt-12 md:pb-12">
      {/* Left Line for Mobile (< md) */}
      <div className="absolute left-[39px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent md:hidden z-0" />

      <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-16 relative z-10">
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon] || Search;

          // U-shape workflow order for md+ (1 -> 2 -> 3 -> 4)
          const orderClass = 
            idx === 0 ? "md:order-1" :
            idx === 1 ? "md:order-2" :
            idx === 2 ? "md:order-4" :
            idx === 3 ? "md:order-3" : "";

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              key={idx}
              className={cn(
                "relative flex items-center md:items-stretch group",
                "flex-row md:flex-col",
                orderClass
              )}
            >
              {/* Intelligent Workflow Connectors */}
              {idx === 0 && <Connector direction="right" isActive={hoveredIdx === 0 || hoveredIdx === 1} />}
              {idx === 1 && <Connector direction="down" isActive={hoveredIdx === 1 || hoveredIdx === 2} />}
              {idx === 2 && <Connector direction="left" isActive={hoveredIdx === 2 || hoveredIdx === 3} />}

              {/* Mobile Icon Node (< md) */}
              <div 
                className={cn(
                  "absolute left-[39px] -translate-x-1/2 flex-shrink-0 z-10 md:hidden",
                  "w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center",
                  "transition-all duration-300 group-hover:border-[#4c69e4]/30 group-hover:shadow-[0_0_20px_rgba(74,111,250,0.15)]"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#4c69e4]/10">
                  <Icon className="w-5 h-5 text-slate-500 transition-colors duration-300 group-hover:text-[#4c69e4]" />
                </div>
              </div>

              {/* Content Card Container */}
              <div className={cn("w-full flex h-full", "pl-20 md:pl-0")}>
                <div className={cn(
                  "w-full h-full relative flex flex-col p-6 md:p-10 rounded-2xl overflow-hidden transition-all duration-700 ease-out",
                  "bg-white/70 backdrop-blur-xl border border-slate-200/50",
                  "shadow-[0_2px_10px_rgb(0,0,0,0.02)]",
                  "group-hover:bg-white/90 group-hover:border-slate-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                  "hover:-translate-y-[2px]"
                )}>
                  
                  {/* Oversized Ghost Numeral */}
                  <div className="absolute -bottom-4 -right-4 text-[120px] md:text-[160px] font-black font-manrope leading-none text-slate-100/60 pointer-events-none select-none z-0 transition-all duration-700 group-hover:text-slate-200/60">
                    0{idx + 1}
                  </div>

                  {/* Desktop Card Header (Hidden on Mobile) */}
                  <div className="hidden md:flex items-center justify-between mb-8 relative z-20">
                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 flex items-center justify-center transition-all duration-700 ease-out shadow-[0_2px_10px_rgb(0,0,0,0.02)] group-hover:border-[#4c69e4]/20 group-hover:shadow-[0_4px_15px_rgb(76,105,228,0.08)]">
                        <Icon className="w-5 h-5 text-slate-500 group-hover:text-[#4c69e4] transition-colors duration-500" />
                     </div>
                     <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-[11px] font-bold tracking-widest text-slate-500 transition-all duration-500 group-hover:text-[#4c69e4] group-hover:bg-[#4c69e4]/5 group-hover:border-[#4c69e4]/20">
                        STEP 0{idx + 1}
                     </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold font-manrope text-[#0c1a2e] mb-3 group-hover:text-[#4c69e4] transition-colors duration-500 relative z-20">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-inter text-[15px] md:text-[16px] leading-relaxed flex-grow relative z-20">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}