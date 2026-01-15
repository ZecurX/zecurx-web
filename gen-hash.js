const bcrypt = require('bcryptjs');
const fs = require('fs');

// Generate a fresh hash
const password = 'zecurx-admin-2025';
const hash = bcrypt.hashSync(password, 10);

// Write to file to avoid terminal corruption
fs.writeFileSync('hash-output.txt', hash);
console.log('Hash written to hash-output.txt');

// Verify it works
const verified = bcrypt.compareSync(password, hash);
console.log('Verification:', verified ? 'SUCCESS' : 'FAILED');
