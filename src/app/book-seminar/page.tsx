import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import SeminarBookingForm from "@/components/resources/pages/SeminarBookingForm";

export const metadata: Metadata = {
    title: "Book a Seminar | ZecurX",
    description: "Schedule a cybersecurity seminar, workshop, or training session for your institution or company.",
};

export default function BookSeminarPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30">
            <CreativeNavBar />
            
            <div className="pt-20">
                <SeminarBookingForm />
            </div>

            <Footer />
        </main>
    );
}
