const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config');

function createToken(user){
    console.assert(user.isadmin !== undefined,
        'createToken passed user without isAdmin prop!');
    let payload = {
        username : user.username,
        id : user.id,
        isAdmin : user.isadmin || false
    };
    return jwt.sign(payload, SECRET_KEY);
}

module.exports = {createToken};