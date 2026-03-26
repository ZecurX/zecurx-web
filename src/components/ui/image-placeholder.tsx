"use client";

import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label: string;
  className?: string;
  aspectRatio?: string;
  dark?: boolean;
}

export function ImagePlaceholder({
  label,
  className,
  aspectRatio = "16/10",
  dark = true,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl",
        dark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100",
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundSize: "24px 24px",
          backgroundImage: `linear-gradient(to right, ${dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"} 1px, transparent 1px), linear-gradient(to bottom, ${dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"} 1px, transparent 1px)`,
        }}
      />

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            dark ? "bg-white/10" : "bg-black/5"
          )}
        >
          <svg
            className={cn(
              "w-6 h-6",
              dark ? "text-white/40" : "text-black/30"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
        </div>

        <span
          className={cn(
            "text-sm font-medium font-inter tracking-wide",
            dark ? "text-white/50" : "text-black/40"
          )}
        >
          {label}
        </span>
      </div>

      {/* Corner accents */}
      <div
        className={cn(
          "absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl-sm",
          dark ? "border-white/10" : "border-black/10"
        )}
      />
      <div
        className={cn(
          "absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr-sm",
          dark ? "border-white/10" : "border-black/10"
        )}
      />
      <div
        className={cn(
          "absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl-sm",
          dark ? "border-white/10" : "border-black/10"
        )}
      />
      <div
        className={cn(
          "absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br-sm",
          dark ? "border-white/10" : "border-black/10"
        )}
      />
    </div>
  );
}
