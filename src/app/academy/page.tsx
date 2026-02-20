import { query } from '@/lib/db';
import { CourseData } from '@/lib/courses';
import { getCdnUrl } from '@/lib/cdn';
import AcademyClient from './AcademyClient';

export const dynamic = 'force-dynamic';

interface DBPlan {
    id: string;
    name: string;
    price: string;
    description: string | null;
    duration: string | null;
    level: string | null;
    features: string[] | null;
    logo: string | null;
    original_price: string | null;
    popular: boolean;
    students_count: number | null;
    brochure_link: string | null;
    in_stock: boolean;
    pricing_type: string;
}

export default async function AcademyPage() {
    let courses: CourseData[] = [];

    try {
        const result = await query<DBPlan>(
            `SELECT id, name, price, description, duration, level, features,
                    logo, original_price, popular, students_count, brochure_link,
                    COALESCE(in_stock, true) as in_stock,
                    COALESCE(pricing_type, 'fixed') as pricing_type
             FROM plans
             WHERE active = true AND type = 'academy'
             ORDER BY
               CASE COALESCE(pricing_type, 'fixed')
                 WHEN 'fixed' THEN 1
                 WHEN 'contact' THEN 2
                 WHEN 'institutional' THEN 3
                 ELSE 4
               END,
               name`
        );

        courses = result.rows.map(row => {
            const pricingType = row.pricing_type as CourseData['pricingType'];
            const price = parseFloat(row.price);
            const originalPrice = row.original_price ? parseFloat(row.original_price) : undefined;

            let displayPrice: number | string;
            if (pricingType === 'institutional') {
                displayPrice = 'Institution Only';
            } else if (pricingType === 'contact') {
                displayPrice = 'Contact for Pricing';
            } else {
                displayPrice = !isNaN(price) && price > 0 ? price : 'Contact for Pricing';
            }

            return {
                id: row.id,
                title: row.name,
                description: row.description || '',
                price: displayPrice,
                originalPrice: originalPrice && !isNaN(originalPrice) ? originalPrice : undefined,
                duration: row.duration || 'Custom',
                level: (row.level as CourseData['level']) || 'Beginner',
                features: row.features || [],
                popular: row.popular ?? false,
                logo: row.logo || undefined,
                students: row.students_count || undefined,
                brochureLink: row.brochure_link ? getCdnUrl(row.brochure_link) : undefined,
                inStock: row.in_stock ?? true,
                pricingType,
            };
        });
    } catch (error) {
        console.error('Failed to fetch courses from DB:', error);
    }

    return <AcademyClient courses={courses} />;
}
