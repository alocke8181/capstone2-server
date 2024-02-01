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
 * 
 */

router.post('/', async (req,res,next)=>{
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
 * Will require admin later
 */

router.get('/', async (req,res,next)=>{
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
 * Will require admin or logged in later
 */

router.get('/:id', async (req,res,next)=>{
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
 * Will later require login or admin
 */

router.patch('/:id', async (req,res,next)=>{
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
 * Will later require admin or logged in
 * 
 */

router.delete('/:id', async (req,res,next)=>{
    try{
        await User.delete(req.params.id);
        return res.json({deleted : req.params.id});
    }catch(e){
        return next(e);
    };
});

module.exports = router;