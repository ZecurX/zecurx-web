import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, amountToPaise, CURRENCY } from '@/lib/razorpay';
import { query, getClient } from '@/lib/db';
import { validateDiscount } from '@/lib/discount-validation';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, itemId, itemName, metadata, discountAmount = 0 } = body;

        // Validate required fields
        if (!amount || !itemId || !itemName) {
            return NextResponse.json(
                { error: 'Missing required fields: amount, itemId, itemName' },
                { status: 400 }
            );
        }

        // Validate amount is positive
        if (amount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be greater than 0' },
                { status: 400 }
            );
        }

        let verifiedAmount = amount;

        // Server-side price verification for shop orders
        if (metadata?.type === 'shop_order' && metadata?.items) {
            const items: CartItem[] = metadata.items;

            if (!Array.isArray(items) || items.length === 0) {
                return NextResponse.json(
                    { error: 'Invalid cart items' },
                    { status: 400 }
                );
            }

            // Use transaction with row locks to prevent race conditions
            const client = await getClient();
            try {
                await client.query('BEGIN');

                // Fetch and lock product rows
                const productIds = items.map(item => item.id);
                const stockCheck = await client.query(
                    `SELECT id, price, stock FROM products 
                     WHERE id::text = ANY($1)
                     FOR UPDATE`,
                    [productIds]
                );

                if (stockCheck.rows.length !== items.length) {
                    await client.query('ROLLBACK');
                    return NextResponse.json(
                        { error: 'One or more products not found' },
                        { status: 404 }
                    );
                }

                let calculatedTotal = 0;
                const unavailableItems: string[] = [];

                // Verify prices and stock availability
                for (const item of items) {
                    const dbProduct = stockCheck.rows.find(
                        (p: any) => p.id.toString() === item.id.toString()
                    );

                    if (!dbProduct) {
                        await client.query('ROLLBACK');
                        return NextResponse.json(
                            { error: `Product ${item.name} not found` },
                            { status: 404 }
                        );
                    }

                    const actualPrice = Number(dbProduct.price);

                    // Verify client price matches database price
                    if (Math.abs(item.price - actualPrice) > 0.01) {
                        await client.query('ROLLBACK');
                        return NextResponse.json(
                            { 
                                error: 'Price mismatch detected. Please refresh your cart.',
                                details: `${item.name}: Expected ₹${actualPrice}, got ₹${item.price}`
                            },
                            { status: 400 }
                        );
                    }

                    // Verify stock availability
                    const availableStock = Number(dbProduct.stock);
                    if (availableStock < item.quantity) {
                        unavailableItems.push(
                            `${item.name} (only ${availableStock} available)`
                        );
                    }

                    calculatedTotal += actualPrice * item.quantity;
                }

                // Check if any items are out of stock
                if (unavailableItems.length > 0) {
                    await client.query('ROLLBACK');
                    return NextResponse.json(
                        { 
                            error: 'Insufficient stock',
                            unavailableItems 
                        },
                        { status: 409 }
                    );
                }

                const discountResult = await validateDiscount(
                    calculatedTotal,
                    discountAmount,
                    metadata?.referralCode,
                    metadata?.partnerReferralCode,
                    client
                );

                if (!discountResult.valid) {
                    await client.query('ROLLBACK');
                    return NextResponse.json(
                        { error: discountResult.error },
                        { status: 400 }
                    );
                }

                const expectedAmount = calculatedTotal - discountResult.verifiedDiscount;
                if (Math.abs(expectedAmount - amount) > 0.01) {
                    await client.query('ROLLBACK');
                    return NextResponse.json(
                        { 
                            error: 'Total amount mismatch. Please refresh your cart.',
                            details: `Expected ₹${expectedAmount}, got ₹${amount}`
                        },
                        { status: 400 }
                    );
                }

                // Use server-verified total (with discount applied)
                verifiedAmount = expectedAmount;

                // Create Razorpay order while rows are still locked
                const order = await getRazorpay().orders.create({
                    amount: amountToPaise(verifiedAmount),
                    currency: CURRENCY,
                    receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`,
                    notes: {
                        itemId,
                        itemName,
                        ...metadata
                    },
                });

                await client.query('COMMIT');
                client.release();

                return NextResponse.json({
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    itemName,
                    itemId,
                });

            } catch (error) {
                await client.query('ROLLBACK');
                client.release();
                throw error;
            }
        } else {
            let finalAmount = verifiedAmount;
            let isTestOrder = false;
            let isPromoPrice = false;
            let verifiedFromDb = false;

            if (itemId) {
                // First check if it's a plan (internship)
                const planResult = await query(
                    'SELECT id, name, price FROM plans WHERE id::text = $1 OR name = $2',
                    [itemId, itemName]
                );
                
                if (planResult.rows.length > 0) {
                    const plan = planResult.rows[0];
                    const planPrice = parseFloat(plan.price);
                    
                    // For plans, strictly enforce the database price
                    if (Math.abs(planPrice - amount) > 0.01) {
                        console.error(`Price tampering detected: Plan ${plan.name} costs ₹${planPrice}, but ₹${amount} was sent`);
                        return NextResponse.json(
                            { 
                                error: 'Invalid amount. Please refresh the page and try again.',
                                details: `Price mismatch for ${plan.name}`
                            },
                            { status: 400 }
                        );
                    }
                    
                    finalAmount = planPrice;
                    verifiedFromDb = true;
                } else {
                    // Check if it's a course
                    const courseResult = await query(
                        'SELECT price, title FROM courses WHERE id = $1 OR slug = $1',
                        [itemId]
                    );
                    if (courseResult.rows.length > 0) {
                        const course = courseResult.rows[0];
                        const coursePrice = parseFloat(course.price);
                        
                        if (metadata?.promoPrice && metadata.promoPrice !== coursePrice) {
                            const promoCheckResult = await query(`
                                SELECT pp.* FROM public.promo_prices pp
                                LEFT JOIN courses c ON pp.plan_id = c.id
                                WHERE pp.is_active = true
                                AND (pp.valid_until IS NULL OR pp.valid_until > NOW())
                                AND pp.valid_from <= NOW()
                                AND $1 >= pp.min_price 
                                AND $1 <= pp.max_price
                                AND (
                                    (pp.plan_id IS NOT NULL AND (c.id = $2 OR c.slug = $2))
                                    OR ($3 ILIKE pp.plan_name_pattern AND pp.plan_name_pattern IS NOT NULL)
                                )
                                LIMIT 1
                            `, [metadata.promoPrice, itemId, course.title]);

                            if (promoCheckResult.rows.length > 0) {
                                finalAmount = metadata.promoPrice;
                                isPromoPrice = true;
                                verifiedFromDb = true;
                            } else {
                                return NextResponse.json(
                                    { error: 'Invalid promo price for this course' },
                                    { status: 400 }
                                );
                            }
                        } else if (discountAmount > 0) {
                            const discountResult = await validateDiscount(
                                coursePrice,
                                discountAmount,
                                metadata?.referralCode,
                                metadata?.partnerReferralCode
                            );

                            if (!discountResult.valid) {
                                return NextResponse.json(
                                    { error: discountResult.error },
                                    { status: 400 }
                                );
                            }
                            
                            finalAmount = coursePrice - discountResult.verifiedDiscount;
                            verifiedFromDb = true;
                        } else {
                            // No discount - verify exact price match
                            if (Math.abs(coursePrice - amount) > 0.01) {
                                return NextResponse.json(
                                    { error: 'Price mismatch. Please refresh the page.' },
                                    { status: 400 }
                                );
                            }
                            finalAmount = coursePrice;
                            verifiedFromDb = true;
                        }
                    }
                }
            }

            // If we couldn't verify from database, reject the order
            if (!verifiedFromDb) {
                console.error(`Unverified order attempt: itemId=${itemId}, itemName=${itemName}, amount=${amount}`);
                return NextResponse.json(
                    { error: 'Unable to verify product. Please try again.' },
                    { status: 400 }
                );
            }

            const order = await getRazorpay().orders.create({
                amount: amountToPaise(finalAmount),
                currency: CURRENCY,
                receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`,
                notes: {
                    itemId,
                    itemName,
                    isTest: isTestOrder ? 'true' : 'false',
                    isPromoPrice: isPromoPrice ? 'true' : 'false',
                    originalAmount: verifiedAmount.toString(),
                    verifiedPrice: finalAmount.toString(),
                    ...metadata
                },
            });

            return NextResponse.json({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                itemName,
                itemId,
                isTestOrder,
                isPromoPrice,
                originalAmount: isTestOrder || isPromoPrice ? verifiedAmount : undefined,
            });
        }
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Failed to create order: ${errorMessage}` },
            { status: 500 }
        );
    }
}
