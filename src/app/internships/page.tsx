import { supabase } from '@/lib/supabase';
import InternshipsClient from './InternshipsClient';

export const dynamic = 'force-dynamic';

type Plan = {
    id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    active: boolean;
    in_stock: boolean;
};

export default async function InternshipsPage() {
    const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .eq('type', 'internship')
        .eq('active', true)
        .order('created_at', { ascending: true });

    return <InternshipsClient plans={(plans as Plan[]) || []} />;
}
