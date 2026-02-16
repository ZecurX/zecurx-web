import { Metadata } from 'next';
import { query } from '@/lib/db';
import InternshipsClient from './InternshipsClient';

export const metadata: Metadata = {
    title: 'Internships | ZecurX',
    description: 'Explore cybersecurity internship opportunities at ZecurX. Gain hands-on experience in security research, penetration testing, and more.',
    keywords: ['internships', 'cybersecurity internship', 'security training', 'ZecurX'],
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
