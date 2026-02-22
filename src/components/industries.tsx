"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
    {
        title: "FinTech\n& Payments",
        displayTitle: "FinTech & Payments",
        tag: "PCI-DSS · RBI Ready",
        link: "/industries",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/industries/fintech.png",
    },
    {
        title: "AI & ML\nStartups",
        displayTitle: "AI & ML Startups",
        tag: "LLM · MLOps Security",
        link: "/industries",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/industries/ai-ml.png",
    },
    {
        title: "HealthTech\n& MedTech",
        displayTitle: "HealthTech & MedTech",
        tag: "DPDP Act · HIPAA Ready",
        link: "/industries",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/industries/healthtech.png",
    },
    {
        title: "SaaS &\nDeveloper Tools",
        displayTitle: "SaaS & Developer Tools",
        tag: "CI/CD · OWASP Covered",
        link: "/industries",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/industries/saas.png",
    },
]

// ─── Main Component ────────────────────────────────────────────────────────────

export function Industries() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section ref={ref} className="py-24 md:py-32 bg-background text-foreground" id="industries">
            {/* Header */}
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col items-center text-center mb-16 md:mb-24"
                >
                    <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
                        Industries
                    </span>
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground"
                    >
                        Who we&apos;re <span className="font-newsreader italic text-muted-foreground">built for</span>
                    </h2>
                </motion.div>
            </div>

            {/* Grid layout instead of horizontal scroll */}
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {INDUSTRIES.map((ind, i) => (
                        <IndustryCard key={ind.displayTitle} ind={ind} index={i} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ─── Industry Card ─────────────────────────────────────────────────────────────

function IndustryCard({ ind, index }: { ind: (typeof INDUSTRIES)[0]; index: number }) {
    const [hovered, setHovered] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // Max rotation of 10 degrees at edges
        const rY = ((mouseX / width) - 0.5) * 20
        const rX = ((mouseY / height) - 0.5) * -20

        setRotateX(rX)
        setRotateY(rY)
    }

    const handleMouseLeave = () => {
        setHovered(false)
        setRotateX(0)
        setRotateY(0)
    }

    return (
        <Link
            href={ind.link}
            className="block focus:outline-none relative"
            style={{ perspective: 1200 }}
            onMouseEnter={() => setHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={cardRef}
                className="relative rounded-[20px] overflow-hidden"
                style={{
                    height: "480px",
                    width: "100%",
                    transformStyle: "preserve-3d",
                    /* Fix for image/border leaking bleeding issues */
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    transform: "translateZ(0)",
                    boxShadow: hovered
                        ? "0 0 0 1px rgba(255,255,255,0.12), 0 32px 64px rgba(0,0,0,0.5)"
                        : "0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.35)",
                }}
                animate={{
                    scale: hovered ? 1.02 : 1,
                    rotateX: hovered ? rotateX : 0,
                    rotateY: hovered ? rotateY : 0,
                }}
                transition={{
                    duration: hovered ? 0.1 : 0.6,
                    ease: hovered ? "linear" : [0.16, 1, 0.3, 1],
                }}
            >
                {/* Background photo */}
                <Image
                    src={ind.image}
                    alt={ind.displayTitle}
                    fill
                    quality={100}
                    unoptimized
                    className="object-cover object-center"
                    style={{
                        transition: "transform 0.6s ease",
                        transform: hovered ? "scale(1.1) translateZ(0)" : "scale(1.0) translateZ(0)",
                        filter: "brightness(0.75)",
                    }}
                />

                {/* Top gradient for text legibility */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.55) 100%)",
                        transform: "translateZ(1px)",
                    }}
                />

                {/* ── Industry name — top-left ── */}
                <div
                    className="absolute top-6 left-6"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <motion.h3
                        className="text-[22px] font-bold text-white leading-tight"
                        style={{ whiteSpace: "pre-line" }}
                        animate={{ x: hovered ? 4 : 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {ind.title}
                    </motion.h3>
                </div>

                {/* ── Bottom Link ── */}
                <div
                    className="absolute bottom-6 left-6 right-6 flex items-center justify-between"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                        {ind.tag}
                    </span>
                    <motion.span
                        className="text-[13px] font-semibold text-white/90 flex items-center gap-1"
                        animate={{ x: hovered ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        Explore <span className="text-white/50">→</span>
                    </motion.span>
                </div>
            </motion.div>
        </Link>
    )
}
