const express = require('express');
const {isLoggedIn, isAdmin, isAdminOrUser} = require('../middleware/auth');
const {BadRequestError} = require('../expressError');
const User = require('../models/User');
const {createToken} = require('../helpers/tokens');
const jsonschema = require('jsonschema');
const userPatchSchema = require('../schemas/userPatch.json');

const router = express.Router();

/** POST / {user} => {user, token}
 * 
 * No auth required
 */

router.post('/', isAdmin, async (req,res,next)=>{
    try{
        const user = await User.post(req.body);
        const token = createToken(user);
        return res.json({user, token});
    }catch(e){
        return next(e);
    }
});

/** GET / => {users : [{username, email},...]}
 *  Returns list of all users
 * 
 * Requires Admin
 */

router.get('/', isAdmin, async (req,res,next)=>{
    try{
        const users = await User.getAll();
        return res.json({users});
    }catch(e){
        return next(e);
    };
});

/** GET /[id] => {user}
 * 
 * Returns {username, email, isAdmin}
 * 
 * Requires Admin or correct user
 */

router.get('/:id', isAdminOrUser, async (req,res,next)=>{
    try{
        const user = await User.get(req.params.id);
        return res.json({user});
    }catch(e){
        return next(e);
    };
});

/** PATCH /[id] {user} => {user}
 * 
 * Data can be password or email
 * 
 * Returns {username, email, isAdmin}
 * 
 * Requires Admin or correct user
 */

router.patch('/:id', isAdminOrUser, async (req,res,next)=>{
    try{
        const validator = jsonschema.validate(req.body,userPatchSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const user = await User.patch(req.params.id, req.body);
        return res.json({user});
    }catch(e){
        return next(e);
    };
});

/** DELETE /[id] => {deleted : id}
 * 
 * Requires admin or logged in 
 * 
 */

router.delete('/:id', isAdminOrUser, async (req,res,next)=>{
    try{
        await User.delete(req.params.id);
        return res.json({deleted : req.params.id});
    }catch(e){
        return next(e);
    };
});

module.exports = router;