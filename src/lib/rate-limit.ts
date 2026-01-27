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
let seminarRateLimiter: Ratelimit | null = null;

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

    seminarRateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'), // Strict limit for OTP/Booking
        analytics: true,
        prefix: 'ratelimit:seminar',
    });
} else {
    console.warn('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured - rate limiting disabled');
}

// ... existing functions ...

export async function checkSeminarRateLimit(ip: string): Promise<RateLimitResult> {
    if (!seminarRateLimiter) {
        return { success: true, limit: 5, remaining: 5, reset: 0 };
    }
    const { success, limit, remaining, reset } = await seminarRateLimiter.limit(`seminar:${ip}`);
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
