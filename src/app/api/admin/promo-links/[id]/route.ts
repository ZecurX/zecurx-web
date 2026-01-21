import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await query(
            'DELETE FROM zecurx_admin.promo_prices WHERE id = $1',
            [id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting promo link:', error);
        return NextResponse.json(
            { error: 'Failed to delete promo link' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (body.is_active !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            values.push(body.is_active);
        }

        if (body.max_uses !== undefined) {
            updates.push(`max_uses = $${paramIndex++}`);
            values.push(body.max_uses);
        }

        if (body.valid_until !== undefined) {
            updates.push(`valid_until = $${paramIndex++}`);
            values.push(body.valid_until);
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            );
        }

        updates.push(`updated_at = NOW()`);
        values.push(id);

        const result = await query(
            `UPDATE zecurx_admin.promo_prices 
             SET ${updates.join(', ')} 
             WHERE id = $${paramIndex}
             RETURNING *`,
            values
        );

        return NextResponse.json({ success: true, promoLink: result.rows[0] });
    } catch (error) {
        console.error('Error updating promo link:', error);
        return NextResponse.json(
            { error: 'Failed to update promo link' },
            { status: 500 }
        );
    }
}
