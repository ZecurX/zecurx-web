import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout - ZecurX",
    description: "Complete your purchase securely. Enroll in ZecurX Academy cybersecurity courses, internships, or shop products with secure Razorpay payment processing.",
    keywords: [
        "zecurx checkout",
        "cybersecurity course enrollment",
        "secure payment",
        "razorpay checkout",
        "cybersecurity training purchase",
    ],
    openGraph: {
        title: "Checkout - ZecurX",
        description: "Complete your purchase securely with ZecurX. Enroll in cybersecurity courses, internships, or shop products.",
        type: "website",
        url: "https://zecurx.com/checkout",
    },
    twitter: {
        card: "summary",
        title: "Checkout - ZecurX",
        description: "Secure checkout for ZecurX Academy courses, internships, and products.",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
