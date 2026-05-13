"use client";

import { motion } from "framer-motion";
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
    <div className="w-full max-w-5xl mx-auto relative pt-4 md:pt-12 md:pb-12">
      {/* Left Line for Mobile (< md) */}
      <div className="absolute left-[39px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent md:hidden z-0" />

      <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-16 relative z-10">
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon] || Search;
          
          // U-shape workflow order for md+ (1 -> 2 -> 3 -> 4)
          // Grid flows left->right, top->bottom.
          // DOM 0 (Top Left) -> order 1
          // DOM 1 (Top Right) -> order 2
          // DOM 2 (Bottom Right) -> order 4
          // DOM 3 (Bottom Left) -> order 3
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
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              key={idx}
              className={cn(
                "relative flex items-center md:items-stretch group",
                "flex-row md:flex-col",
                orderClass
              )}
            >
              {/* Desktop Workflow Connectors & Nodes (md+) */}
              <div className="hidden md:block absolute inset-0 pointer-events-none z-20">
                 {/* Card 0 (Top Left) -> Connects Right */}
                 {idx === 0 && (
                   <>
                     {/* Node on Right Edge */}
                     <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-200 border-[2px] border-white group-hover:bg-[#4c69e4] group-hover:border-[#4c69e4]/30 group-hover:scale-150 transition-all duration-500 z-10 shadow-sm" />
                     {/* Line to Right */}
                     <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-16 h-[2px] bg-slate-100 overflow-hidden">
                        <motion.div 
                          className="w-full h-full bg-gradient-to-r from-transparent via-[#4c69e4] to-transparent opacity-40"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                     </div>
                   </>
                 )}

                 {/* Card 1 (Top Right) -> Receives from Left, Connects Down */}
                 {idx === 1 && (
                   <>
                     {/* Node on Left Edge (Receiving) */}
                     <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-200 border-[2px] border-white group-hover:bg-[#4c69e4] group-hover:border-[#4c69e4]/30 group-hover:scale-150 transition-all duration-500 z-10 shadow-sm" />
                     {/* Node on Bottom Edge (Sending) */}
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-200 border-[2px] border-white group-hover:bg-[#4c69e4] group-hover:border-[#4c69e4]/30 group-hover:scale-150 transition-all duration-500 z-10 shadow-sm" />
                     {/* Line Down */}
                     <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[2px] h-16 bg-slate-100 overflow-hidden">
                        <motion.div 
                          className="w-full h-full bg-gradient-to-b from-transparent via-[#4c69e4] to-transparent opacity-40"
                          animate={{ y: ["-100%", "100%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                     </div>
                   </>
                 )}

                 {/* Card 2 (Bottom Right) -> Receives from Top, Connects Left */}
                 {idx === 2 && (
                   <>
                     {/* Node on Top Edge (Receiving) */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-200 border-[2px] border-white group-hover:bg-[#4c69e4] group-hover:border-[#4c69e4]/30 group-hover:scale-150 transition-all duration-500 z-10 shadow-sm" />
                     {/* Node on Left Edge (Sending) */}
                     <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-200 border-[2px] border-white group-hover:bg-[#4c69e4] group-hover:border-[#4c69e4]/30 group-hover:scale-150 transition-all duration-500 z-10 shadow-sm" />
                     {/* Line Left */}
                     <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-16 h-[2px] bg-slate-100 overflow-hidden">
                        <motion.div 
                          className="w-full h-full bg-gradient-to-l from-transparent via-[#4c69e4] to-transparent opacity-40"
                          animate={{ x: ["100%", "-100%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
                        />
                     </div>
                   </>
                 )}

                 {/* Card 3 (Bottom Left) -> Receives from Right */}
                 {idx === 3 && (
                   <>
                     {/* Node on Right Edge (Receiving) */}
                     <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-200 border-[2px] border-white group-hover:bg-[#4c69e4] group-hover:border-[#4c69e4]/30 group-hover:scale-150 transition-all duration-500 z-10 shadow-sm" />
                   </>
                 )}
              </div>

              {/* Mobile Icon Node (< md) */}
              <div 
                className={cn(
                  "absolute left-[39px] -translate-x-1/2 flex-shrink-0 z-10 md:hidden",
                  "w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center",
                  "transition-all duration-300 group-hover:border-[#4c69e4]/30 group-hover:shadow-[0_0_20px_rgba(74,111,250,0.15)] group-hover:scale-110"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#4c69e4]/10">
                  <Icon className="w-5 h-5 text-slate-500 transition-colors duration-300 group-hover:text-[#4c69e4]" />
                </div>
              </div>

              {/* Content Card Container */}
              <div 
                className={cn(
                  "w-full flex h-full",
                  "pl-20 md:pl-0" // Mobile padding, Desktop 0
                )}
              >
                <div className="w-full relative flex flex-col bg-white/60 hover:bg-white backdrop-blur-sm border border-slate-200/60 hover:border-slate-300/80 p-6 md:p-10 rounded-2xl transition-all duration-500 md:hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:hover:-translate-y-1">
                  
                  {/* Desktop Card Header (Hidden on Mobile) */}
                  <div className="hidden md:flex items-center justify-between mb-8 relative z-20">
                     <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center transition-all duration-500 group-hover:bg-[#4c69e4]/5 group-hover:border-[#4c69e4]/30 group-hover:scale-110 group-hover:shadow-sm">
                        <Icon className="w-6 h-6 text-slate-500 group-hover:text-[#4c69e4] transition-colors duration-500" />
                     </div>
                     <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-[11px] font-bold tracking-widest text-slate-500 group-hover:text-[#4c69e4] group-hover:bg-[#4c69e4]/5 group-hover:border-[#4c69e4]/20 transition-all duration-500 shadow-sm">
                        STEP 0{idx + 1}
                     </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold font-manrope text-[#0c1a2e] mb-3 group-hover:text-[#4c69e4] transition-colors duration-300 md:duration-500">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-inter text-[15px] md:text-[16px] leading-relaxed flex-grow">
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