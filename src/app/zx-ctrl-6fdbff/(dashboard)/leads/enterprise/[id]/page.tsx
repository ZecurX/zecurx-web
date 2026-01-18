import EnterpriseLeadDetailClient from "./EnterpriseLeadDetailClient";

export const dynamic = 'force-dynamic';

export default async function EnterpriseLeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <EnterpriseLeadDetailClient leadId={id} />;
}
