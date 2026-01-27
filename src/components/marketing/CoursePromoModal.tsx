"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, ArrowRight, Shield, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CoursePromoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CoursePromoModal({ isOpen, onClose }: CoursePromoModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-primary/20 rounded-3xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header Image/Gradient */}
                        <div className="relative h-32 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                            <div className="w-16 h-16 bg-background/50 backdrop-blur rounded-2xl flex items-center justify-center border border-white/10 shadow-lg relative z-10">
                                <GraduationCap className="w-8 h-8 text-primary" />
                            </div>
                            
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-bold mb-3 tracking-tight">
                                Continue Your <span className="text-primary">Learning Journey</span>
                            </h2>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                You've earned your certificate! Now take the next step. 
                                Master advanced cybersecurity skills with our industry-recognized courses.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                                <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                                    <Shield className="w-5 h-5 text-primary mb-2" />
                                    <h4 className="font-semibold text-sm mb-1">Hands-on Labs</h4>
                                    <p className="text-xs text-muted-foreground">Real-world attack simulations</p>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                                    <Award className="w-5 h-5 text-primary mb-2" />
                                    <h4 className="font-semibold text-sm mb-1">Pro Certification</h4>
                                    <p className="text-xs text-muted-foreground">Industry valid credentials</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link href="/academy" className="w-full">
                                    <Button className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                        Explore Courses <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <button 
                                    onClick={onClose}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
