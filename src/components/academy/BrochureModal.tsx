"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrochureModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    brochureLink: string;
}

export default function BrochureModal({ isOpen, onClose, courseTitle, brochureLink }: BrochureModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            courseTitle: courseTitle,
            formType: 'brochure'
        };

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSuccess(true);
                window.open(brochureLink, '_blank');
            } else {
                const result = await response.json();
                setError(result.error || 'Failed to submit notifcation');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-background border border-border w-full max-w-md rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 pb-2">
                                <div>
                                    <h2 className="text-xl font-bold font-manrope">Download Brochure</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Enter your details to view the brochure for <br />
                                        <span className="font-semibold text-foreground">{courseTitle}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-4">
                                {isSuccess ? (
                                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                            <Download className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium">Download Started!</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Your brochure should open in a new tab shortly.
                                            </p>
                                        </div>
                                        <Button onClick={onClose} variant="outline" className="mt-2 w-full">
                                            Close
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                                            <input
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="John Doe"
                                                className="flex h-10 w-full rounded-md border border-border bg-muted/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                className="flex h-10 w-full rounded-md border border-border bg-muted/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-sm text-red-500 font-medium">{error}</p>
                                        )}

                                        <div className="flex justify-end gap-3 mt-6 pt-2">
                                            <Button type="button" variant="ghost" onClick={onClose}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-black/90">
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Downloading...
                                                    </>
                                                ) : (
                                                    'Download Brochure'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
