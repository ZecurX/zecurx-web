import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, amountToPaise, CURRENCY } from '@/lib/razorpay';
import { query, getClient } from '@/lib/db';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, itemId, itemName, metadata } = body;

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

                // Verify total matches
                if (Math.abs(calculatedTotal - amount) > 0.01) {
                    await client.query('ROLLBACK');
                    return NextResponse.json(
                        { 
                            error: 'Total amount mismatch. Please refresh your cart.',
                            details: `Expected ₹${calculatedTotal}, got ₹${amount}`
                        },
                        { status: 400 }
                    );
                }

                // Use server-verified total
                verifiedAmount = calculatedTotal;

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
            // Original flow for course/internship orders (no verification needed)
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

            return NextResponse.json({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                itemName,
                itemId,
            });
        }
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}
