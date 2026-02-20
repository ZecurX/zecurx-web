import { query } from '@/lib/db';
import { courses as staticCourses, CourseData } from '@/lib/courses';
import { CDN_ASSETS } from '@/lib/cdn';
import AcademyClient from './AcademyClient';

export const dynamic = 'force-dynamic';

const brochureMap: Record<string, string | undefined> = {
    '06a10be6-115a-4a83-b338-67168abcce1a': CDN_ASSETS.brochures.zxCPEH,
    '1033198a-bf65-4183-9e6e-aab727903039': CDN_ASSETS.brochures.zxCPPT,
    '7f0e2cb3-82c1-4634-9a95-67a2ae14a815': CDN_ASSETS.brochures.zxCCP,
    '3613d162-d801-47c6-9305-719f999738c8': CDN_ASSETS.brochures.zxCCF,
    'ef34cbc8-c918-4e64-bd88-799863b299e1': CDN_ASSETS.brochures.zxCCE,
};

export default async function AcademyPage() {
    let courses: CourseData[];

    try {
        const result = await query<{ id: string; price: string }>('SELECT id, name, price, description FROM plans');
        const dbPrices = new Map(result.rows.map(r => [r.id, parseFloat(r.price)]));

        courses = staticCourses.map(course => {
            const dbPrice = dbPrices.get(course.id);
            return {
                ...course,
                price: dbPrice !== undefined && !isNaN(dbPrice) ? dbPrice : course.price,
                brochureLink: brochureMap[course.id],
            };
        });
    } catch {
        // Fallback to static data if DB is unreachable
        courses = staticCourses.map(course => ({
            ...course,
            brochureLink: brochureMap[course.id],
        }));
    }

    return <AcademyClient courses={courses} />;
}
