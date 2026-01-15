import bcrypt from 'bcryptjs';
import { db } from '../src/lib/db';

async function createMediaUser() {
  console.log('🔐 Creating Media User...\n');

  try {
    const existingUser = await db.query(
      'SELECT id, email FROM admins WHERE email = $1',
      ['media@zecurx.com']
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  Media user already exists:');
      console.log(`   Email: ${existingUser.rows[0].email}`);
      console.log(`   ID: ${existingUser.rows[0].id}`);
      console.log('\nTo reset password, delete this user first or use the password reset endpoint.');
      return;
    }

    const password = 'media123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO admins (
        email,
        password_hash,
        role,
        name,
        is_active,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, email, role, name`,
      ['media@zecurx.com', hashedPassword, 'media', 'Media Team', true]
    );

    const newUser = result.rows[0];

    console.log('✅ Media user created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    media@zecurx.com');
    console.log('🔑 Password: media123');
    console.log('👤 Name:     Media Team');
    console.log('🎭 Role:     media');
    console.log(`🆔 User ID:  ${newUser.id}`);
    console.log('═══════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT: Change the password immediately after first login!');
    console.log('   Visit: http://localhost:3000/admin/profile\n');

    console.log('✅ Permissions granted:');
    console.log('   - blog:create  ✅');
    console.log('   - blog:read    ✅');
    console.log('   - blog:update  ✅');
    console.log('   - blog:delete  ✅');
    console.log('   - blog:publish ❌ (only super_admin)');
    console.log();
  } catch (error) {
    console.error('❌ Error creating media user:', error);
    throw error;
  } finally {
    await db.pool.end();
  }
}

createMediaUser();
