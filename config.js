const SECRET_KEY = process.env.SECRET_KEY || 'secret-dev';
const PORT = +process.env.PORT || 3001;

function getDatabaseUri(){
    return(process.env.NODE_ENV === "test") 
    ? 'capstone2_test'
    : process.env.DATABASE_URL || 'capstone2'
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

console.log('Config:')
console.log('SECRET_KEY', SECRET_KEY);
console.log('PORT', PORT);
console.log('BCRYPT_WORK_FACTOR', BCRYPT_WORK_FACTOR);
console.log('Database', getDatabaseUri());
console.log('=====');

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
};