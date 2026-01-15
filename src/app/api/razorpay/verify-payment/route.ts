import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';
import validator from 'validator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dev_mode, metadata } = body;

        const isDevMode = dev_mode === true && process.env.NEXT_PUBLIC_DEV_MODE === 'true';

        if (!isDevMode && (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment verification fields' },
                { status: 400 }
            );
        }

        if (!isDevMode) {
            const secret = process.env.RAZORPAY_KEY_SECRET;
            if (!secret) {
                return NextResponse.json(
                    { success: false, error: 'Payment verification configuration error' },
                    { status: 500 }
                );
            }

            const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return NextResponse.json(
                    { success: false, error: 'Payment verification failed - invalid signature' },
                    { status: 400 }
                );
            }
        }

        try {
            let notes: Record<string, string> | undefined;
            let amountInRupees: number;

            if (isDevMode && metadata) {
                notes = metadata;
                amountInRupees = 1;
            } else {
                const { getRazorpay } = await import("@/lib/razorpay");
                const order = await getRazorpay().orders.fetch(razorpay_order_id);

                if (!order) {
                    throw new Error('Order not found');
                }

                notes = order.notes as Record<string, string> | undefined;
                amountInRupees = Number(order.amount) / 100;
            }

            if (notes && notes.email) {
                const email = validator.isEmail(String(notes.email)) 
                    ? validator.normalizeEmail(String(notes.email)) || String(notes.email)
                    : '';
                
                if (!email) {
                    console.error('Invalid email in payment notes:', notes.email);
                    return NextResponse.json(
                        { success: false, error: 'Invalid email address' },
                        { status: 400 }
                    );
                }

                const name = validator.escape(String(notes.name || '').trim()).substring(0, 255);
                const mobile = String(notes.mobile || notes.phone || '')
                    .replace(/[^0-9+\-\s()]/g, '')
                    .substring(0, 20);
                
                const isShopOrder = notes.type === 'shop_order';
                
                if (isShopOrder && notes.items) {
                    try {
                        const items = typeof notes.items === 'string' ? JSON.parse(notes.items) : notes.items;
                        
                        const address = validator.escape(String(notes.address || '').trim()).substring(0, 500);
                        const city = validator.escape(String(notes.city || '').trim()).substring(0, 100);
                        const pincode = String(notes.pincode || '').replace(/[^0-9]/g, '').substring(0, 10);
                        
                        const orderResult = await query(`
                            INSERT INTO shop_orders (
                                order_id, payment_id, customer_email, customer_name, customer_phone,
                                shipping_address, shipping_city, shipping_pincode,
                                total_amount, order_status, payment_status
                            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                            RETURNING id
                        `, [
                            razorpay_order_id,
                            razorpay_payment_id,
                            email,
                            name,
                            mobile,
                            address,
                            city,
                            pincode,
                            amountInRupees,
                            'processing',
                            'captured'
                        ]);

                        const shopOrderId = orderResult.rows[0]?.id;
                        
                        if (shopOrderId && Array.isArray(items)) {
                            for (const item of items) {
                                await query(`
                                    INSERT INTO shop_order_items (
                                        order_id, product_id, product_name, product_price, quantity, subtotal
                                    ) VALUES ($1, $2, $3, $4, $5, $6)
                                `, [
                                    shopOrderId,
                                    item.id,
                                    item.name,
                                    item.price,
                                    item.quantity || 1,
                                    item.price * (item.quantity || 1)
                                ]);
                                
                                const stockUpdate = await query(`
                                    UPDATE products 
                                    SET stock = stock - $1 
                                    WHERE id::text = $2 AND stock >= $1
                                    RETURNING stock
                                `, [item.quantity || 1, item.id]);
                                
                                if (stockUpdate.rowCount === 0) {
                                    console.error(`CRITICAL: Stock deduction failed for product ${item.id} - insufficient stock or product not found`);
                                }
                            }
                        }
                    } catch (shopError) {
                        console.error('Shop Order DB Error:', shopError);
                        return NextResponse.json(
                            { success: false, error: 'Failed to save order details' },
                            { status: 500 }
                        );
                    }
                } else {
                    const college = validator.escape(String(notes.college || '').trim()).substring(0, 255);
                    const whatsapp = String(notes.whatsapp || '')
                        .replace(/[^0-9+\-\s()]/g, '')
                        .substring(0, 20);

                    const customerResult = await query(`
                        INSERT INTO customers (email, name, phone, whatsapp, college)
                        VALUES ($1, $2, $3, $4, $5)
                        ON CONFLICT (email) 
                        DO UPDATE SET 
                            name = COALESCE(EXCLUDED.name, customers.name),
                            phone = COALESCE(EXCLUDED.phone, customers.phone),
                            whatsapp = COALESCE(EXCLUDED.whatsapp, customers.whatsapp),
                            college = COALESCE(EXCLUDED.college, customers.college),
                            updated_at = NOW()
                        RETURNING *
                    `, [
                        email,
                        name,
                        mobile,
                        whatsapp,
                        college
                    ]);

                    const customer = customerResult.rows[0];
                    if (!customer) throw new Error('Failed to save customer');

                    let planId = notes.planId || null;
                    if (!planId && notes.itemName) {
                        const planResult = await query(
                            'SELECT id FROM plans WHERE name = $1 LIMIT 1',
                            [notes.itemName]
                        );
                        if (planResult.rows.length > 0) {
                            planId = planResult.rows[0].id;
                        }
                    }

                    try {
                        await query(`
                            INSERT INTO transactions (payment_id, order_id, amount, status, customer_id, plan_id)
                            VALUES ($1, $2, $3, $4, $5, $6)
                        `, [razorpay_payment_id, razorpay_order_id, amountInRupees, 'captured', customer.id, planId]);
                    } catch (txError) {
                        console.error('Transaction DB Error:', txError);
                    }
                }
            }
        } catch (dbError) {
            console.error('Database Sync Failed:', dbError);
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { success: false, error: 'Payment verification failed. Please contact support.' },
            { status: 500 }
        );
    }
}
