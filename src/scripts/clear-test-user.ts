import { db } from '../lib/db';

async function clearUserData() {
  const email = 'windroexe@gmail.com';
  
  try {
    console.log(`Clearing all data for ${email}...`);
    
    // Delete certificates
    const certCount = await db.delete('certificates', { email });
    console.log(`✓ Deleted ${certCount} certificate(s)`);
    
    // Delete student feedback
    const studentCount = await db.delete('student_leads', { email });
    console.log(`✓ Deleted ${studentCount} student feedback entry(ies)`);
    
    // Delete enterprise feedback
    const enterpriseCount = await db.delete('enterprise_leads', { email });
    console.log(`✓ Deleted ${enterpriseCount} enterprise feedback entry(ies)`);
    
    console.log('\n✓ All clear! Windroexe is now a fresh user.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearUserData();
