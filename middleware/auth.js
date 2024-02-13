const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config');
const {UnauthorizedError} = require('../expressError');

/**
 * Authenticate a user's token and store it in the payload
 * Throw and error if it's unauthorized
 */

function authJWT(req,res,next){
    try{
        const authHeader = req.headers && req.headers.authorization;
        if(authHeader){
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    }catch(e){
        return next();
    };
};

/**
 * Ensure a user is logged in
 */

function isLoggedIn(req,res,next){
    try{
        if(!res.locals.user) throw new UnauthorizedError();
        return next();
    }catch(e){
        return next(e);
    };
};

/**
 * Ensure a user is admin
 */

function isAdmin(req,res,next){
    try{
        if(!res.locals.user || !res.locals.user.isAdmin){
            throw new UnauthorizedError();
        };
        return next();
    }catch(e){
        return next(e);
    };
};


/**
 * Ensure a user is the correct user OR an admin
 */
function isAdminOrUser(req,res,next){
    try{
        if(!(res.locals.user && (res.locals.user.isAdmin || res.locals.user.id === req.params.id))){
            throw new UnauthorizedError();
        };
        return next();
    }catch(e){
        return next(e);
    };
};

/**
 * Ensure a user is the correct user OR an admin for a data piece
 */
function isAdminOrUserForData(req,res,next){
    try{
        if(!(res.locals.user && (res.locals.user.isAdmin || res.locals.user.id === req.body.userID))){
            throw new UnauthorizedError();
        };
        delete req.body.userID;
        return next();
    }catch(e){
        return next(e);
    };
}

module.exports = {
    authJWT,
    isLoggedIn,
    isAdmin,
    isAdminOrUser,
    isAdminOrUserForData
}