import { LucideIcon } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie-animation";

interface LargeServiceCardProps {
  heading: string;
  description: string;
  icon: LucideIcon;
  lottie?: string;
  reversed?: boolean;
}

export function LargeServiceCard({
  heading,
  description,
  icon: Icon,
  lottie,
  reversed = false,
}: LargeServiceCardProps) {
  return (
    <div className="group glass-card relative bg-white/50 border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] transition-all duration-500 rounded-3xl overflow-hidden p-6 md:p-10 lg:p-12 w-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c69e4]/5 blur-[60px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
      
      <div className={`grid gap-12 lg:grid-cols-2 xl:gap-20 items-center relative z-10 w-full`}>
        
        <div className={`flex flex-col gap-10 ${reversed ? 'lg:order-2' : ''}`}>
          <figure className="flex flex-col gap-6 text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#f8fbff] border border-blue-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#4c69e4]/5 transition-all duration-500 shadow-sm">
              <Icon className="w-7 h-7 text-[#4c69e4]" />
            </div>
            <blockquote className="text-left">
              <h3 className="text-3xl lg:text-4xl font-bold font-manrope text-[#0c1a2e] leading-tight mb-6 group-hover:text-[#4c69e4] transition-colors duration-300">
                {heading}
              </h3>
              <p className="text-slate-600 font-inter text-lg sm:text-xl leading-relaxed mb-8">
                {description}
              </p>
            </blockquote>
          </figure>
        </div>

        <div className={`flex items-center justify-center w-full ${reversed ? 'lg:order-1' : ''}`}>
          <div className="relative w-full max-w-[400px] lg:max-w-[500px]">
            <div className="absolute inset-0 bg-[#4c69e4]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#4c69e4]/10 transition-colors duration-700" />
            
            {lottie ? (
              <div className="relative z-10 flex items-center justify-center w-full aspect-square group-hover:scale-[1.02] group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                <LottieAnimation src={lottie} className="w-full h-full object-contain drop-shadow-xl" />
              </div>
            ) : (
              <div className="relative z-10 flex items-center justify-center w-full aspect-square group-hover:scale-[1.02] group-hover:-translate-y-2 transition-transform duration-700 ease-out bg-[#f8fbff] rounded-[2.5rem] border border-slate-200/50 shadow-inner">
                <Icon className="w-1/3 h-1/3 text-[#4c69e4]/20" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}