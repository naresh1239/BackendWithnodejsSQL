
const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
    try {
        const saltRounds = 10; // Number of salt rounds
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}

async function comparePassword(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (err) {
        console.error('Error comparing passwords:', err);
        throw err;
    }
}

module.exports = {hashPassword,comparePassword}