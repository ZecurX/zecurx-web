import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ItemPriceResponse {
    id: string;
    name: string;
    price: number;
    type: 'internship' | 'course';
    description?: string;
    error?: string;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('itemId');
        const type = searchParams.get('type');

        if (!itemId) {
            return NextResponse.json<{ error: string }>(
                { error: 'itemId is required' },
                { status: 400 }
            );
        }

        // Check plans (internships) first
        if (type === 'internship' || !type) {
            const planResult = await query(
                'SELECT id, name, price, description FROM plans WHERE id::text = $1 AND active = true',
                [itemId]
            );
            
            if (planResult.rows.length > 0) {
                const plan = planResult.rows[0];
                return NextResponse.json<ItemPriceResponse>({
                    id: plan.id.toString(),
                    name: plan.name,
                    price: parseFloat(plan.price),
                    type: 'internship',
                    description: plan.description || undefined
                });
            }
        }

        // Check courses
        if (type === 'course' || !type) {
            const courseResult = await query(
                'SELECT id, title, price, description FROM courses WHERE id = $1 OR slug = $1',
                [itemId]
            );
            
            if (courseResult.rows.length > 0) {
                const course = courseResult.rows[0];
                return NextResponse.json<ItemPriceResponse>({
                    id: course.id.toString(),
                    name: course.title,
                    price: parseFloat(course.price),
                    type: 'course',
                    description: course.description || undefined
                });
            }
        }

        // If type was specified but not found, try the other type
        if (type === 'internship') {
            const courseResult = await query(
                'SELECT id, title, price, description FROM courses WHERE id = $1 OR slug = $1',
                [itemId]
            );
            
            if (courseResult.rows.length > 0) {
                const course = courseResult.rows[0];
                return NextResponse.json<ItemPriceResponse>({
                    id: course.id.toString(),
                    name: course.title,
                    price: parseFloat(course.price),
                    type: 'course',
                    description: course.description || undefined
                });
            }
        } else if (type === 'course') {
            const planResult = await query(
                'SELECT id, name, price, description FROM plans WHERE id::text = $1 AND active = true',
                [itemId]
            );
            
            if (planResult.rows.length > 0) {
                const plan = planResult.rows[0];
                return NextResponse.json<ItemPriceResponse>({
                    id: plan.id.toString(),
                    name: plan.name,
                    price: parseFloat(plan.price),
                    type: 'internship',
                    description: plan.description || undefined
                });
            }
        }

        return NextResponse.json<{ error: string }>(
            { error: 'Item not found' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Error fetching item price:', error);
        return NextResponse.json<{ error: string }>(
            { error: 'Failed to fetch item' },
            { status: 500 }
        );
    }
}
