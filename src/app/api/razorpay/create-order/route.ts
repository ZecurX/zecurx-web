import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, amountToPaise, CURRENCY } from '@/lib/razorpay';
import { query, getClient } from '@/lib/db';
import { validateDiscount } from '@/lib/discount-validation';
import { checkPaymentRateLimit, getClientIp } from '@/lib/rate-limit';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        const rateLimitResult = await checkPaymentRateLimit(clientIp);
        
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { 
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                    }
                }
            );
        }

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
            let shouldRelease = true;
            
            try {
                await client.query('BEGIN');

                const productIds = items.map(item => item.id);
                const stockCheck = await client.query(
                    `SELECT id, price, stock FROM products 
                     WHERE id::text = ANY($1)
                     FOR UPDATE`,
                    [productIds]
                );

                if (stockCheck.rows.length !== items.length) {
                    await client.query('ROLLBACK');
                    client.release();
                    shouldRelease = false;
                    return NextResponse.json(
                        { error: 'One or more products not found' },
                        { status: 404 }
                    );
                }

                let calculatedTotal = 0;
                const unavailableItems: string[] = [];

                for (const item of items) {
                    const dbProduct = stockCheck.rows.find(
                        (p: Record<string, unknown>) => String(p.id) === String(item.id)
                    );

                    if (!dbProduct) {
                        await client.query('ROLLBACK');
                        client.release();
                        shouldRelease = false;
                        return NextResponse.json(
                            { error: `Product ${item.name} not found` },
                            { status: 404 }
                        );
                    }

                    const actualPrice = Number(dbProduct.price);

                    if (Math.abs(item.price - actualPrice) > 0.01) {
                        await client.query('ROLLBACK');
                        client.release();
                        shouldRelease = false;
                        return NextResponse.json(
                            { 
                                error: 'Price mismatch detected. Please refresh your cart.',
                                details: `${item.name}: Expected ₹${actualPrice}, got ₹${item.price}`
                            },
                            { status: 400 }
                        );
                    }

                    const availableStock = Number(dbProduct.stock);
                    if (availableStock < item.quantity) {
                        unavailableItems.push(
                            `${item.name} (only ${availableStock} available)`
                        );
                    }

                    calculatedTotal += actualPrice * item.quantity;
                }

                if (unavailableItems.length > 0) {
                    await client.query('ROLLBACK');
                    client.release();
                    shouldRelease = false;
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
                    client.release();
                    shouldRelease = false;
                    return NextResponse.json(
                        { error: discountResult.error },
                        { status: 400 }
                    );
                }

                const expectedAmount = calculatedTotal - discountResult.verifiedDiscount;
                if (Math.abs(expectedAmount - amount) > 0.01) {
                    await client.query('ROLLBACK');
                    client.release();
                    shouldRelease = false;
                    return NextResponse.json(
                        { 
                            error: 'Total amount mismatch. Please refresh your cart.',
                            details: `Expected ₹${expectedAmount}, got ₹${amount}`
                        },
                        { status: 400 }
                    );
                }

                verifiedAmount = expectedAmount;

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
                shouldRelease = false;

                return NextResponse.json({
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    itemName,
                    itemId,
                });

            } catch (error) {
                if (shouldRelease) {
                    try {
                        await client.query('ROLLBACK');
                    } catch { /* ignore rollback errors */ }
                    client.release();
                }
                throw error;
            }
        } else {
            let finalAmount = verifiedAmount;
            const isTestOrder = false;
            let isPromoPrice = false;
            let verifiedFromDb = false;

            if (itemId) {
                const planResult = await query(
                    'SELECT id, name, price FROM zecurx_admin.plans WHERE id::text = $1',
                    [itemId]
                );
                
                if (planResult.rows.length > 0) {
                    const plan = planResult.rows[0];
                    const planPrice = parseFloat(plan.price);
                    
                    if ((metadata?.promoPrice || metadata?.promoCode) && (!metadata?.promoPrice || Math.abs(metadata.promoPrice - planPrice) > 0.01)) {
                        let promoCheckResult;
                        
                        if (metadata?.promoCode) {
                            promoCheckResult = await query(`
                                SELECT pp.* FROM zecurx_admin.promo_prices pp
                                WHERE pp.promo_code = $1
                                AND pp.is_active = true
                                AND (pp.valid_until IS NULL OR pp.valid_until > NOW())
                                AND pp.valid_from <= NOW()
                                AND (pp.max_uses IS NULL OR pp.current_uses < pp.max_uses)
                                AND (
                                    pp.plan_id = $2 
                                    OR ($3 ILIKE pp.plan_name_pattern AND pp.plan_name_pattern IS NOT NULL)
                                )
                                LIMIT 1
                            `, [metadata.promoCode.toUpperCase(), itemId, plan.name]);
                        } else {
                            promoCheckResult = await query(`
                                SELECT pp.* FROM zecurx_admin.promo_prices pp
                                WHERE pp.is_active = true
                                AND (pp.valid_until IS NULL OR pp.valid_until > NOW())
                                AND pp.valid_from <= NOW()
                                AND $1 >= pp.min_price 
                                AND $1 <= pp.max_price
                                AND (pp.max_uses IS NULL OR pp.current_uses < pp.max_uses)
                                AND (
                                    pp.plan_id = $2 
                                    OR ($3 ILIKE pp.plan_name_pattern AND pp.plan_name_pattern IS NOT NULL)
                                )
                                LIMIT 1
                            `, [metadata.promoPrice, itemId, plan.name]);
                        }

                        if (promoCheckResult.rows.length > 0) {
                            const promo = promoCheckResult.rows[0];
                            finalAmount = parseFloat(promo.min_price);
                            isPromoPrice = true;
                            verifiedFromDb = true;
                        } else {
                            return NextResponse.json(
                                { error: 'Invalid or expired promo' },
                                { status: 400 }
                            );
                        }
                    } else if (discountAmount > 0) {
                        const discountResult = await validateDiscount(
                            planPrice,
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
                        
                        const expectedAmount = planPrice - discountResult.verifiedDiscount;
                        if (Math.abs(expectedAmount - amount) > 0.01) {
                            console.error(`Price tampering: Plan ${plan.name} expected ₹${expectedAmount}, got ₹${amount}`);
                            return NextResponse.json(
                                { error: 'Invalid amount. Please refresh the page.' },
                                { status: 400 }
                            );
                        }
                        
                        finalAmount = expectedAmount;
                        verifiedFromDb = true;
                    } else {
                        if (Math.abs(planPrice - amount) > 0.01) {
                            console.error(`Price tampering: Plan ${plan.name} costs ₹${planPrice}, but ₹${amount} was sent`);
                            return NextResponse.json(
                                { error: 'Invalid amount. Please refresh the page.' },
                                { status: 400 }
                            );
                        }
                        finalAmount = planPrice;
                        verifiedFromDb = true;
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
