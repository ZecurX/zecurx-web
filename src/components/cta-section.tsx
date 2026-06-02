"use client"

import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { CallingLottie } from "@/components/ui/calling-lottie"

export function CtaSection() {
    return (
        <section className="py-10 md:py-16 px-4 md:px-6 bg-background">
            <div className="w-full max-w-6xl mx-auto p-5 md:p-12 rounded-2xl bg-background border border-[#4c69e4]/30 overflow-hidden shadow-lg shadow-[#4c69e4]/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="flex flex-col space-y-4 md:space-y-6 text-center md:text-left items-center md:items-start">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Secure Your Digital Assets</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                            <span className="text-primary">Ready</span> to Secure Your{" "}
                            <span className="text-primary">Product?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Deploy fearlessly with a trusted security partner guarding your
                            flank. Schedule a consultation with our advanced security
                            architects today.
                        </p>
                        <div>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-8 text-sm md:text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium transition-all active:scale-95"
                            >
                                Contact us today
                            </Link>
                        </div>
                    </div>

                    <div className="relative w-full min-h-[200px] md:min-h-[320px] flex items-center justify-center">
                        <CallingLottie />
                    </div>
                </div>
            </div>
        </section>
    )
}
