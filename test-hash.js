const bcrypt = require('bcryptjs');

const password = 'zecurx-admin-2025';
const hashFromDB = '$2b$10$xHarvNIEX3zSPUB9Q5BXb.fKaxtubYa4HL.sqrebUu2HJqD3rHPf';

bcrypt.compare(password, hashFromDB, (err, result) => {
    console.log('Password:', password);
    console.log('Hash:', hashFromDB);
    console.log('Match:', result);
    console.log('Error:', err);
});
