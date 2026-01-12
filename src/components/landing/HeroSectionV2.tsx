import Link from 'next/link';
import { ArrowRight, ChevronRight, Shield, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export default function HeroSectionV2() {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">

                {/* Badge */}
                <ScrollAnimation direction="down" delay={0.1}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 hover:border-primary/30 hover:bg-muted/80 transition-all duration-300 backdrop-blur-sm mb-8 group cursor-pointer">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            v2.0 is now live
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                </ScrollAnimation>

                {/* Headline */}
                <ScrollAnimation direction="up" delay={0.2}>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-manrope tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 mb-6 drop-shadow-sm">
                        Security for the <br className="hidden md:block" />
                        Modern Web.
                    </h1>
                </ScrollAnimation>

                {/* Subtext */}
                <ScrollAnimation direction="up" delay={0.3}>
                    <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
                        Automated threat detection and response for high-growth enterprises.
                        Secure your infrastructure with just a few lines of code.
                    </p>
                </ScrollAnimation>

                {/* Buttons */}
                <ScrollAnimation direction="up" delay={0.4}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link
                            href="/auth/signup"
                            className="h-12 px-8 rounded-full bg-foreground text-background font-semibold flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                        >
                            Start Protecting
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/contact"
                            className="h-12 px-8 rounded-full bg-background border border-border/50 text-foreground font-medium flex items-center gap-2 hover:bg-muted/50 transition-all hover:border-foreground/20"
                        >
                            Talk to Sales
                        </Link>
                    </div>
                </ScrollAnimation>

                {/* Dashboard Mockup */}
                <ScrollAnimation direction="up" delay={0.6}>
                    <div className="relative mx-auto max-w-5xl rounded-xl border border-border/40 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden group">
                        {/* Fake Browser Toolbar */}
                        <div className="h-10 bg-muted/40 border-b border-border/40 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="mx-auto w-[40%] h-5 bg-muted/50 rounded-md border border-border/20 flex items-center justify-center text-[10px] text-muted-foreground/50 font-mono">
                                zecurx.com/dashboard
                            </div>
                        </div>

                        {/* Content Placeholder (The visible content of the dashboard) */}
                        <div className="aspect-[16/10] bg-gradient-to-br from-background via-muted/5 to-muted/20 p-8 flex flex-col gap-6 relative">
                            {/* Overlay Gradient for "Reflection" */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="h-8 w-48 bg-foreground/10 rounded-lg animate-pulse" />
                                    <div className="h-4 w-32 bg-foreground/5 rounded-lg" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-full bg-foreground/10" />
                                    <div className="h-8 w-8 rounded-full bg-foreground/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mt-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 rounded-xl bg-foreground/5 border border-foreground/5 flex flex-col p-4 justify-between">
                                        <div className="h-8 w-8 rounded-lg bg-foreground/10" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-12 bg-foreground/10 rounded" />
                                            <div className="h-6 w-24 bg-foreground/10 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 rounded-xl bg-foreground/5 border border-foreground/5 mt-2 relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-primary/10 to-transparent opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium backdrop-blur-md">
                                        Live Thread Analysis
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Reflection/Shadow under dashboard */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-primary/20 blur-[60px] rounded-full opacity-50 -z-10" />
                </ScrollAnimation>

            </div>
        </section>
    );
}
