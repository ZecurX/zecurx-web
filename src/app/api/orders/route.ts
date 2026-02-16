import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkOrdersRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
    try {
        const ip = getClientIp(request);
        const rateLimitResult = await checkOrdersRateLimit(ip);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const orderId = searchParams.get('orderId');

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter required' },
                { status: 400 }
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID parameter required for verification' },
                { status: 400 }
            );
        }

        const ordersResult = await query(`
            SELECT 
                so.id,
                so.order_id,
                so.payment_id,
                so.customer_name,
                so.customer_phone,
                so.shipping_address,
                so.shipping_city,
                so.shipping_pincode,
                so.total_amount,
                so.order_status,
                so.payment_status,
                so.created_at,
                json_agg(
                    json_build_object(
                        'product_id', soi.product_id,
                        'product_name', soi.product_name,
                        'product_price', soi.product_price,
                        'quantity', soi.quantity,
                        'subtotal', soi.subtotal
                    )
                ) as items
            FROM shop_orders so
            LEFT JOIN shop_order_items soi ON so.id = soi.order_id
            WHERE so.customer_email = $1 AND so.order_id = $2
            GROUP BY so.id
            ORDER BY so.created_at DESC
        `, [email, orderId]);

        return NextResponse.json({ orders: ordersResult.rows });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
