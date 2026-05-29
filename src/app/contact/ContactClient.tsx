"use client";

import React, { useState } from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import {
  Mail,
  MapPin,
  Phone,
  Loader2,
  CheckCircle2,
  Send,
} from "lucide-react";
import DateTimePicker from "@/components/ui/DateTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subject, setSubject] = useState("");
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // ✅ manual validation (important)
    if (!subject) {
      setError("Please select a subject");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ FIXED
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject,
          message: formData.get("message"),
          preferredDate: preferredDate?.toISOString() || null,
        }),
      });

      // ✅ check response
      if (!res.ok) {
        throw new Error("Failed");
      }

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
      setSubject("");
      setPreferredDate(null);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-foreground">
      <CreativeNavBar />

      <section className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT SIDE */}
          <div className="space-y-10">
            <h1 className="text-5xl font-bold leading-tight">
              Let’s build{" "}
              <span className="text-[#4c69e4]">secure systems</span>{" "}
              together.
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Tell us about your requirements and we’ll help you secure,
              scale, and ship confidently.
            </p>

            <div className="space-y-6 pt-6">
              <div className="flex gap-4">
                <Mail className="text-[#4c69e4]" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    official@zecurx.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-[#4c69e4]" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    +91 7488813601
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="text-[#4c69e4]" />
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-sm text-muted-foreground">
                    Bengaluru, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-[#f3f6fb] border border-[#e2e8f5] rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl">

            {isSuccess ? (
              <div className="flex flex-col items-center text-center py-10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Message Sent</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We’ll get back to you shortly.
                </p>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-[#4c69e4] text-sm font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* NAME + EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text" // ✅ FIXED
                    required
                    placeholder="Full Name"
                    className="w-full h-12 sm:h-14 bg-white border border-[#dbe3f1] rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/30"
                  />

                  <input
                    name="email"
                    type="email" // ✅ FIXED
                    required
                    placeholder="Work Email"
                    className="w-full h-12 sm:h-14 bg-white border border-[#dbe3f1] rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/30"
                  />
                </div>

                {/* PHONE */}
                <input
                  name="phone"
                  type="tel" // ✅ FIXED
                  required
                  placeholder="Phone Number"
                  className="w-full h-12 sm:h-14 bg-white border border-[#dbe3f1] rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/30"
                />

                {/* SUBJECT */}
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="h-12 sm:h-14 bg-white border border-[#dbe3f1] rounded-xl text-sm focus:ring-2 focus:ring-[#4c69e4]/30">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales Inquiry">Sales Inquiry</SelectItem>
                    <SelectItem value="Technical Support">Technical Support</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {/* DATE (optional improvement: show only if needed) */}
                <DateTimePicker
                  onChange={setPreferredDate}
                  minDate={new Date()}
                  className="bg-white border border-[#dbe3f1] rounded-xl"
                />

                {/* MESSAGE */}
                <textarea
                  name="message"
                  required
                  placeholder="How can we help you?"
                  className="w-full h-28 bg-white border border-[#dbe3f1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/30 resize-none"
                />

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-14 bg-[#4c69e4] text-white rounded-xl font-semibold transition hover:bg-[#3f5bd9]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message <Send className="w-4 h-4" />
                    </span>
                  )}
                </button>

              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}