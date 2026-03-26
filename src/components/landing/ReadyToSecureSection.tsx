import { ShieldCheck } from "lucide-react";
import { AnimatedFeatureSpotlight } from "@/components/ui/feature-spotlight";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://zecurx-web.fsn1.your-objectstorage.com";

export default function ReadyToSecureSection() {
    return (
        <div className="flex items-center justify-center w-full bg-background border-t border-border/40 py-12 md:py-24 px-4 overflow-hidden relative">
            <AnimatedFeatureSpotlight
                preheaderIcon={<ShieldCheck className="h-4 w-4" />}
                preheaderText="Secure Your Digital Assets"
                heading={
                    <>
                        <span className="text-primary">Ready</span> to Secure Your{' '}
                        <span className="text-primary">Business?</span>
                    </>
                }
                description="Schedule a consultation with our advanced security architects and see how ZecurX can transform your defense posture without slowing you down."
                buttonText="Talk to a Security Expert"
                buttonHref="/contact"
                imageUrl={`${CDN_URL}/image.png`}
                imageAlt="Security Operations Center"
            />
        </div>
    );
}
