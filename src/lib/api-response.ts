import { NextResponse } from 'next/server';

/**
 * Standard API response format for consistency across all endpoints
 * 
 * Success: { success: true, data: T }
 * Error: { success: false, error: { code: string, message: string } }
 */

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
    };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a standardized success response
 * 
 * @example
 * return apiSuccess({ userId: 123, email: 'user@example.com' });
 * // Returns: { success: true, data: { userId: 123, email: 'user@example.com' } }
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json({ success: true, data }, { status });
}

/**
 * Create a standardized error response
 * 
 * @example
 * return apiError('UNAUTHORIZED', 'Invalid credentials', 401);
 * // Returns: { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }
 */
export function apiError(
    code: string,
    message: string,
    status = 500
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            error: { code, message },
        },
        { status }
    );
}

// Common error codes for consistency
export const ErrorCode = {
    // 400 Bad Request
    BAD_REQUEST: 'BAD_REQUEST',
    INVALID_INPUT: 'INVALID_INPUT',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MISSING_FIELD: 'MISSING_FIELD',
    
    // 401 Unauthorized
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    
    // 403 Forbidden
    FORBIDDEN: 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    
    // 404 Not Found
    NOT_FOUND: 'NOT_FOUND',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    
    // 409 Conflict
    CONFLICT: 'CONFLICT',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    
    // 500 Internal Server Error
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;
