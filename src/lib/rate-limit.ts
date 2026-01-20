import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type RateLimitResult = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const isUpstashConfigured = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

let redis: Redis | null = null;
let paymentRateLimiter: Ratelimit | null = null;
let validateRateLimiter: Ratelimit | null = null;

if (isUpstashConfigured) {
    redis = new Redis({
        url: UPSTASH_URL!,
        token: UPSTASH_TOKEN!,
    });

    paymentRateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '60 s'),
        analytics: true,
        prefix: 'ratelimit:payment',
    });

    validateRateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '10 s'),
        analytics: true,
        prefix: 'ratelimit:validate',
    });
} else {
    console.warn('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured - rate limiting disabled');
}

export async function checkPaymentRateLimit(ip: string): Promise<RateLimitResult> {
    if (!paymentRateLimiter) {
        return { success: true, limit: 10, remaining: 10, reset: 0 };
    }
    const { success, limit, remaining, reset } = await paymentRateLimiter.limit(`payment:${ip}`);
    return { success, limit, remaining, reset: Math.ceil(reset / 1000) };
}

export async function checkValidateRateLimit(ip: string): Promise<RateLimitResult> {
    if (!validateRateLimiter) {
        return { success: true, limit: 20, remaining: 20, reset: 0 };
    }
    const { success, limit, remaining, reset } = await validateRateLimiter.limit(`validate:${ip}`);
    return { success, limit, remaining, reset: Math.ceil(reset / 1000) };
}

export function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }
    return 'unknown';
}

export function isRateLimitingEnabled(): boolean {
    return isUpstashConfigured;
}
