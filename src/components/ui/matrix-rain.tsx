"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CHARS = "0123456789";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
  fontSize?: number;
  color?: string;
  density?: number;
}

export function MatrixRain({
  className,
  opacity = 0.08,
  fontSize = 13,
  color = "currentColor",
  density = 120,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;
      ctx.globalAlpha = opacity;

      for (let i = 0; i < density; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillText(char, x, y);
      }
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [opacity, fontSize, color, density]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}
