# LMS Manual Enrollment Guide

This document describes how to manually enable LMS access for users.

## Prerequisites

- SSH access to VPS: `172.235.15.209`
- Database credentials: `zecurx:zecurxdb2026`
- Database: `zecurx_platform`

## Steps to Enable LMS Access for a User

### 1. Connect to VPS

```bash
ssh root@172.235.15.209
```

### 2. Find the User

```bash
PGPASSWORD=zecurxdb2026 psql -h localhost -U zecurx -d zecurx_platform -c \
  "SELECT id, email, name, \"isLmsUser\" FROM public.users WHERE email = 'USER_EMAIL_HERE';"
```

### 3. Enable LMS Access

```bash
PGPASSWORD=zecurxdb2026 psql -h localhost -U zecurx -d zecurx_platform -c \
  "UPDATE public.users SET \"isLmsUser\" = true WHERE email = 'USER_EMAIL_HERE';"
```

### 4. Generate Password Reset Token (if needed)

Run inside the LMS backend container:

```bash
docker exec zecurx-lms-backend node -e "
const crypto = require('crypto');
const argon2 = require('argon2');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Get user ID
  const userResult = await pool.query(
    \"SELECT id FROM users WHERE email = \\\$1\",
    ['USER_EMAIL_HERE']
  );
  
  if (userResult.rows.length === 0) {
    console.log('User not found');
    await pool.end();
    return;
  }
  
  const userId = userResult.rows[0].id;
  
  // Generate token
  const token = crypto.randomBytes(64).toString('hex');
  const tokenHash = await argon2.hash(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const tokenId = crypto.randomUUID();

  await pool.query(
    \`INSERT INTO password_reset_tokens (id, \"userId\", \"tokenHash\", \"expiresAt\", \"isAdminTriggered\", \"createdAt\")
     VALUES (\\\$1, \\\$2, \\\$3, \\\$4, true, NOW())\`,
    [tokenId, userId, tokenHash, expiresAt]
  );

  console.log('Reset URL: https://lms.zecurx.com/reset-password?token=' + token);
  await pool.end();
}
main().catch(console.error);
"
```

## Creating a New LMS User Manually

If the user doesn't exist in LMS yet:

```bash
docker exec zecurx-lms-backend node -e "
const crypto = require('crypto');
const argon2 = require('argon2');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const email = 'USER_EMAIL_HERE';
  const name = 'USER_NAME_HERE';
  const userId = crypto.randomUUID();
  const tempPassword = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await argon2.hash(tempPassword);
  
  // Get Intern role ID
  const roleResult = await pool.query(
    \"SELECT id FROM \\\"Role\\\" WHERE type = 'INTERN' LIMIT 1\"
  );
  const roleId = roleResult.rows[0].id;
  
  // Create user with isLmsUser = true
  await pool.query(
    \`INSERT INTO users (id, email, name, password, \"roleId\", \"isVerified\", \"isLmsUser\", \"createdAt\", \"updatedAt\")
     VALUES (\\\$1, \\\$2, \\\$3, \\\$4, \\\$5, true, true, NOW(), NOW())\`,
    [userId, email, name, hashedPassword, roleId]
  );
  
  // Generate password reset token
  const token = crypto.randomBytes(64).toString('hex');
  const tokenHash = await argon2.hash(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const tokenId = crypto.randomUUID();

  await pool.query(
    \`INSERT INTO password_reset_tokens (id, \"userId\", \"tokenHash\", \"expiresAt\", \"isAdminTriggered\", \"createdAt\")
     VALUES (\\\$1, \\\$2, \\\$3, \\\$4, true, NOW())\`,
    [tokenId, userId, tokenHash, expiresAt]
  );

  console.log('User created:', email);
  console.log('Reset URL: https://lms.zecurx.com/reset-password?token=' + token);
  await pool.end();
}
main().catch(console.error);
"
```

## Creating Internship Record

After creating the user, create their internship record:

```bash
PGPASSWORD=zecurxdb2026 psql -h localhost -U zecurx -d zecurx_platform -c "
INSERT INTO public.internships 
  (id, \"userId\", \"programName\", \"programType\", \"durationMonths\", \"startDate\", \"endDate\", 
   status, \"paymentId\", \"paymentAmount\", \"createdAt\", \"updatedAt\")
VALUES 
  ('$(uuidgen)', 'USER_ID_HERE', 'Penetration Tester Internship (3 Months)', 'BASIC', 3, 
   NOW(), NOW() + INTERVAL '3 months', 'ACTIVE', 'manual_enrollment', 0, NOW(), NOW());
"
```

## Important Notes

- The `isLmsUser` flag MUST be `true` for users to log into the LMS
- Password reset tokens are hashed with argon2 (not sha256 or bcrypt)
- Tokens expire in 24 hours by default
- The LMS uses a separate `password_reset_tokens` table, not columns on the users table
