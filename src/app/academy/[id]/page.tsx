import { Metadata } from "next";
import CourseDetailPageClient from "./CourseDetailPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params: _params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    return {
        title: `Course Details - ZecurX Academy`,
        description: "View detailed information about this cybersecurity course from ZecurX Academy.",
        openGraph: {
            title: "ZecurX Academy - Course Details",
            description: "View detailed information about this cybersecurity course from ZecurX Academy.",
            type: "website",
        },
    };
}

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <CourseDetailPageClient courseId={id} />;
}
