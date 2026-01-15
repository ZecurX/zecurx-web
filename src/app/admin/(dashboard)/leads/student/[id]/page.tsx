import StudentLeadDetailClient from "./StudentLeadDetailClient";

export const dynamic = 'force-dynamic';

export default async function StudentLeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <StudentLeadDetailClient leadId={id} />;
}
