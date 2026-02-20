import { query } from './db';
import crypto from 'crypto';
import * as argon2 from 'argon2';

type RoleType = 'SUPERADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' | 'INTERN';

interface LmsUser {
    id: string;
    email: string;
    name: string;
    roleId: string;
}

interface CourseMapping {
    id: string;
    webPlanName: string;
    lmsCourseId: string;
    isInternship: boolean;
    internshipDurationMonths: number | null;
}

async function getRoleId(roleType: RoleType): Promise<string | null> {
    const result = await query<{ id: string }>(
        'SELECT id FROM public."Role" WHERE type = $1 LIMIT 1',
        [roleType]
    );
    return result.rows[0]?.id || null;
}

export async function createLmsUser(
    email: string,
    name: string,
    roleType: RoleType = 'STUDENT',
    _phone?: string
): Promise<LmsUser | null> {
    const existingUser = await query<LmsUser>(
        'SELECT id, email, name, "roleId" FROM public.users WHERE email = $1',
        [email]
    );
    
    if (existingUser.rows.length > 0) {
        return existingUser.rows[0];
    }
    
    const roleId = await getRoleId(roleType);
    if (!roleId) {
        return null;
    }
    
    const userId = crypto.randomUUID();
    const tempPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await argon2.hash(tempPassword);
    
    const result = await query<LmsUser>(
        `INSERT INTO public.users (id, email, name, password, "roleId", "isVerified", "isLmsUser", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, true, true, NOW(), NOW())
         RETURNING id, email, name, "roleId"`,
        [userId, email, name, hashedPassword, roleId]
    );
    
    return result.rows[0] || null;
}

export async function createPasswordResetToken(
    userId: string,
    expiryMinutes: number = 1440
): Promise<string | null> {
    const token = crypto.randomBytes(64).toString('hex');
    const hashedToken = await argon2.hash(token);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const tokenId = crypto.randomUUID();
    
    await query(
        `INSERT INTO public.password_reset_tokens (id, "userId", "tokenHash", "expiresAt", "isAdminTriggered", "createdAt")
         VALUES ($1, $2, $3, $4, true, NOW())`,
        [tokenId, userId, hashedToken, expiresAt]
    );
    
    return token;
}

export async function getCourseMapping(planName: string): Promise<CourseMapping | null> {
    const result = await query<CourseMapping>(
        `SELECT id, web_plan_name as "webPlanName", lms_course_id as "lmsCourseId", 
                is_internship as "isInternship", internship_duration_months as "internshipDurationMonths"
         FROM zecurx_admin.course_mapping 
         WHERE LOWER(web_plan_name) = LOWER($1) AND is_active = true
         LIMIT 1`,
        [planName]
    );
    return result.rows[0] || null;
}

export async function createInternship(
    userId: string,
    programName: string,
    programType: 'BASIC' | 'STANDARD' | 'PREMIUM',
    durationMonths: number,
    paymentId: string,
    paymentAmount: number
): Promise<string | null> {
    const internshipId = crypto.randomUUID();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);
    
    const result = await query<{ id: string }>(
        `INSERT INTO public.internships 
         (id, "userId", "programName", "programType", "durationMonths", "startDate", "endDate", 
          status, "paymentId", "paymentAmount", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE', $8, $9, NOW(), NOW())
         RETURNING id`,
        [internshipId, userId, programName, programType, durationMonths, startDate, endDate, paymentId, paymentAmount]
    );
    
    return result.rows[0]?.id || null;
}

export async function createEnrollment(
    userId: string,
    courseId: string,
    _paymentId?: string
): Promise<string | null> {
    const existingEnrollment = await query<{ id: string }>(
        'SELECT id FROM public.enrollments WHERE "userId" = $1 AND "courseId" = $2',
        [userId, courseId]
    );
    
    if (existingEnrollment.rows.length > 0) {
        return existingEnrollment.rows[0].id;
    }
    
    const enrollmentId = crypto.randomUUID();
    const result = await query<{ id: string }>(
        `INSERT INTO public.enrollments (id, "userId", "courseId", status, "enrolledAt", "updatedAt")
         VALUES ($1, $2, $3, 'ACTIVE', NOW(), NOW())
         RETURNING id`,
        [enrollmentId, userId, courseId]
    );
    
    return result.rows[0]?.id || null;
}

function determineProgramType(planName: string): 'BASIC' | 'STANDARD' | 'PREMIUM' {
    const lowerName = planName.toLowerCase();
    if (lowerName.includes('premium') || lowerName.includes('pro')) return 'PREMIUM';
    if (lowerName.includes('standard') || lowerName.includes('professional')) return 'STANDARD';
    return 'BASIC';
}

export async function processLmsEnrollment(data: {
    email: string;
    name: string;
    phone?: string;
    planName: string;
    paymentId: string;
    amount: number;
}): Promise<{
    success: boolean;
    userId?: string;
    resetToken?: string;
    resetUrl?: string;
    isNewUser?: boolean;
    error?: string;
}> {
    try {
        const mapping = await getCourseMapping(data.planName);
        
        if (!mapping) {
            return { success: true };
        }
        
        const roleType: RoleType = mapping.isInternship ? 'INTERN' : 'STUDENT';
        
        const existingCheck = await query<{ id: string }>(
            'SELECT id FROM public.users WHERE email = $1',
            [data.email]
        );
        const isNewUser = existingCheck.rows.length === 0;
        
        const user = await createLmsUser(data.email, data.name, roleType, data.phone);
        
        if (!user) {
            return { success: false, error: 'Failed to create LMS user' };
        }
        
        if (mapping.isInternship) {
            const programType = determineProgramType(data.planName);
            const duration = mapping.internshipDurationMonths || 3;
            
            await createInternship(
                user.id,
                data.planName,
                programType,
                duration,
                data.paymentId,
                data.amount
            );
        } else if (mapping.lmsCourseId) {
            await createEnrollment(user.id, mapping.lmsCourseId, data.paymentId);
        }
        
        let resetToken: string | undefined;
        let resetUrl: string | undefined;
        
        if (isNewUser) {
            const token = await createPasswordResetToken(user.id, 1440);
            if (token) {
                resetToken = token;
                resetUrl = `https://lms.zecurx.com/reset-password?token=${token}`;
            }
        }
        
        return {
            success: true,
            userId: user.id,
            resetToken,
            resetUrl,
            isNewUser,
        };
        
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}
