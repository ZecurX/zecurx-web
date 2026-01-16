import { query } from '@/lib/db';
import InternshipsClient from './InternshipsClient';

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
    const result = await query(`
        SELECT * FROM plans 
        WHERE type = 'internship' AND active = true 
        ORDER BY created_at ASC
    `);

    return <InternshipsClient plans={(result.rows as Plan[]) || []} />;
}
