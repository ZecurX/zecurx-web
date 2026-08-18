import { Metadata } from "next";
import BookPageClient from "./BookPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params: _params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    return {
        title: `Book Your Slot - ZecurX Academy`,
        description: "Reserve your seat in a ZecurX Academy course.",
        openGraph: {
            title: "ZecurX Academy - Book Your Slot",
            description: "Reserve your seat in a ZecurX Academy course.",
            type: "website",
        },
    };
}

export default async function BookPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <BookPageClient courseId={id} />;
}
