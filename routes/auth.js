const User = require('../models/User');
const express = require('express');
const router = new express.Router();
const {createToken} = require('../helpers/tokens');
const {BadRequestError} = require('../expressError');

/** POST /auth/token: {username, password} => {token}
 * Add validation later
 */
router.post('/token', async (req,res,next)=>{
    const {username, password} = req.body;
    const user = await User.authenticate(user, password);
    const token = createToken(user);
    return res.json({token})
});

/**
 * POST /auth/register: {user} =>{token}
 * user must include username, password, and email
 */

router.post('/register', async (req,res,next)=>{
    const newUser = await User.post({...req.body, isAdmin: false});
    const token = createToken(newUser);
    return res.json({token});
});

module.exports = router;