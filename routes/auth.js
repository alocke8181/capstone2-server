const User = require('../models/User');
const express = require('express');
const router = new express.Router();
const {createToken} = require('../helpers/tokens');
const {BadRequestError} = require('../expressError');

/** POST /auth/token: {username, password} => {token, user}
 * Add validation later
 */
router.post('/token', async (req,res,next)=>{
    const {username, password} = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({
        token : token,
        user : user});
});

/**
 * POST /auth/register: {user} =>{token, user}
 * user must include username, password, and email
 */

router.post('/register', async (req,res,next)=>{
    const newUser = await User.post({...req.body, isAdmin: false});
    const token = createToken(newUser);
    return res.json({
        token : token,
        user : newUser});
});

module.exports = router;