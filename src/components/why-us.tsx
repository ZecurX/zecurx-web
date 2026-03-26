"use client";

import { Shield, Brain, CheckCircle, Zap, Clock, Code2, Lock } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

export function WhyUs() {
  return (
    <section id="why-us" className="-mt-px py-20 md:py-24 bg-[#BFDBFE] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1280px] relative z-10">
        
        {/* Header Layout */}
        <BlurFade inView delay={0}>
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end mb-14 md:mb-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-4">
                Why Zecurx
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium text-slate-900 mt-2 mb-0 tracking-tight leading-[1.1]"
              >
                Built for teams that <br className="hidden md:block" />
                can&apos;t <span className="text-[#4b6ffa]">afford</span> to get <span className="text-[#4b6ffa]">hacked</span>
              </h2>
            </div>
            <p className="text-slate-800 text-lg max-w-md lg:pb-2 leading-relaxed">
              Security that fits your workflow — not the other way around. 
              We bring enterprise-grade protection to fast-moving teams without slowing them down.
            </p>
          </div>
        </BlurFade>

        {/* Asymmetric Bento Grid - Hyper-Consistent Enterprise Light Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto">
          
          {/* Card 1: Large Hero Feature (DevSec) - 2x2 on Large screens */}
          <BlurFade inView delay={0.1} className="lg:col-span-2 lg:row-span-2">
            <div className="h-full glass-card rounded-[2rem] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 flex flex-col">
              <div className="relative z-10 p-8 md:p-12 pb-0 md:pb-0 flex-none">
                <div className="flex items-center gap-2.5 mb-3 text-slate-900">
                  <Shield className="w-[18px] h-[18px] text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                  <h3 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
                    DevSec-first approach
                  </h3>
                </div>
                <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                  We embed security directly into your sprint cycles — not as an afterthought. Ship faster without sacrificing your security posture.
                </p>
              </div>

              {/* DevSecFirst Lottie Animation */}
              <div className="relative z-10 w-full flex-1 flex items-end justify-center mt-6 pb-6 min-h-[220px]">
                <LottieAnimation 
                  src={getCdnUrl("lottie/devsec2.json")} 
                  className="w-full max-w-[420px] h-[220px] object-contain object-center block" 
                  speed={1} 
                />
              </div>
            </div>
          </BlurFade>

          {/* Card 2: AI-native - 2x1 */}
          <BlurFade inView delay={0.2} className="lg:col-span-2 lg:row-span-1">
            <div className="h-full glass-card rounded-[2rem] p-7 md:p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500">
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2 text-slate-900">
                    <Brain className="w-[18px] h-[18px] text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                    <h3 className="text-2xl font-medium tracking-tight leading-tight">
                      AI-native threat intelligence
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Our threat engine learns from every engagement to identify novel attack vectors before your adversaries can weaponize them.
                  </p>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Card 3: 72-hour turnaround - 1x1 */}
          <BlurFade inView delay={0.3} className="lg:col-span-1 lg:row-span-1">
            <div className="h-full glass-card rounded-[2rem] p-7 md:p-8 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 flex flex-col">
              <div className="flex items-center gap-2.5 mb-2 text-slate-900">
                <Clock className="w-[18px] h-[18px] text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                <h3 className="text-xl font-medium tracking-tight leading-tight">
                  72-hour turnaround
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Critical findings reported in real-time. Full assessments delivered within 72 hours, keeping sprints unblocked.
              </p>
            </div>
          </BlurFade>

          {/* Card 4: Startup pricing - 1x1 */}
          <BlurFade inView delay={0.4} className="lg:col-span-1 lg:row-span-1">
            <div className="h-full glass-card rounded-[2rem] p-7 md:p-8 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 flex flex-col">
              <div className="flex items-center gap-2.5 mb-2 text-slate-900">
                <Zap className="w-[18px] h-[18px] text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                <h3 className="text-xl font-medium tracking-tight leading-tight">
                  Startup-first pricing
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Transparent, fixed-scope pricing designed for seed-to-Series B companies. No enterprise bloat or hidden fees.
              </p>
            </div>
          </BlurFade>

          {/* Card 5: Zero-friction compliance - 2x1 */}
          <BlurFade inView delay={0.5} className="lg:col-span-2 lg:row-span-1">
            <div className="h-full glass-card rounded-[2rem] p-7 md:p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500">
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2 text-slate-900">
                    <CheckCircle className="w-[18px] h-[18px] text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                    <h3 className="text-2xl font-medium tracking-tight leading-tight">
                      Zero-friction compliance
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    We turn months-long compliance projects into structured 90-day programs with full auditor-ready evidence support.
                  </p>
                </div>
                <div className="flex flex-wrap md:flex-col gap-3 flex-shrink-0 mt-2 md:mt-0">
                  <div className="px-4 py-2.5 bg-[#FAFAFA] rounded-xl border border-slate-100 font-medium text-sm text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-500" /> SOC 2 Type II
                  </div>
                  <div className="px-4 py-2.5 bg-[#FAFAFA] rounded-xl border border-slate-100 font-medium text-sm text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-500" /> ISO 27001
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Card 6: Remediation support - 2x1 */}
          <BlurFade inView delay={0.6} className="lg:col-span-2 lg:row-span-1">
            <div className="h-full glass-card rounded-[2rem] p-7 md:p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500">
              <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="flex items-center gap-2.5 mb-2 text-slate-900">
                  <Code2 className="w-[18px] h-[18px] text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                  <h3 className="text-2xl font-medium tracking-tight leading-tight">
                    Code-level remediation
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed max-w-xl">
                  We don&apos;t just throw a PDF report at you. We actively help your engineering team fix vulnerabilities with exact code-level guidance and architecture reviews.
                </p>
              </div>
            </div>
          </BlurFade>

        </div>
      </div>
    </section>
  );
}
