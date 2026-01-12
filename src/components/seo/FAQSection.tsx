'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getFAQSchema, type FAQItem } from '@/lib/schemas/faq';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FAQSection({ 
  faqs, 
  title = "Frequently Asked Questions",
  subtitle,
  className = '' 
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const schema = getFAQSchema(faqs);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      
      {/* FAQ Section */}
      <section className={`py-24 ${className}`}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm font-medium text-foreground mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>FAQs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-background hover:border-foreground/20 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Compact FAQ variant for sidebars or smaller sections
interface CompactFAQProps {
  faqs: FAQItem[];
  className?: string;
}

export function CompactFAQ({ faqs, className = '' }: CompactFAQProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const schema = getFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      
      <div className={`space-y-2 ${className}`}>
        {faqs.slice(0, 5).map((faq, index) => (
          <details
            key={index}
            className="group border border-border rounded-lg bg-muted/10"
            open={openIndex === index}
            onClick={(e) => {
              e.preventDefault();
              setOpenIndex(openIndex === index ? null : index);
            }}
          >
            <summary className="px-4 py-3 cursor-pointer font-medium text-sm text-foreground list-none flex items-center justify-between">
              {faq.question}
              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            {openIndex === index && (
              <div className="px-4 pb-3 text-sm text-muted-foreground">
                {faq.answer}
              </div>
            )}
          </details>
        ))}
      </div>
    </>
  );
}
