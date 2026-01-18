import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

type RateLimitResult = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
};

const tokenCache = new LRUCache<string, number[]>({
    max: 500,
    ttl: 60000,
});

export function rateLimit(options?: RateLimitOptions) {
    const interval = options?.interval || 60000;

    return {
        check: async (limit: number, token: string): Promise<RateLimitResult> => {
            const now = Date.now();
            const windowStart = now - interval;

            let tokenData = tokenCache.get(token);
            if (!tokenData) {
                tokenData = [];
                tokenCache.set(token, tokenData);
            }

            const recentRequests = tokenData.filter(timestamp => timestamp > windowStart);

            recentRequests.push(now);
            tokenCache.set(token, recentRequests);

            const remaining = Math.max(0, limit - recentRequests.length);
            const success = recentRequests.length <= limit;
            const reset = Math.ceil((windowStart + interval) / 1000);

            return { success, limit, remaining, reset };
        },
    };
}

const paymentRateLimiter = rateLimit({ interval: 60000 });
const validateRateLimiter = rateLimit({ interval: 10000 });

export async function checkPaymentRateLimit(ip: string): Promise<RateLimitResult> {
    return paymentRateLimiter.check(10, `payment:${ip}`);
}

export async function checkValidateRateLimit(ip: string): Promise<RateLimitResult> {
    return validateRateLimiter.check(20, `validate:${ip}`);
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
