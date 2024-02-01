const User = require('../models/User');
const express = require('express');
const router = new express.Router();
const {createToken} = require('../helpers/tokens');
const {BadRequestError} = require('../expressError');
const jsonschema = require('jsonschema');
const userRegisterSchema = require('../schemas/userRegister.json');

/** POST /auth/token: {username, password} => {token, user}
 * Add validation later
 */
router.post('/token', async (req,res,next)=>{
    try{
        const {username, password} = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({
            token : token,
            user : user});
    }catch(e){
        return next(e)
    }
});

/**
 * POST /auth/register: {user} =>{token, user}
 * user must include username, password, and email
 */

router.post('/register', async (req,res,next)=>{
    try{
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        };
        const newUser = await User.post({...req.body, isAdmin: false});
        const token = createToken(newUser);
        return res.json({
            token : token,
            user : newUser});
    }catch(e){
        return next(e);
    }
});

module.exports = router;