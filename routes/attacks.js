const express = require('express');
const router = new express.Router();

const Attack = require('../models/Attack');
const {isAdminOrUserForData} = require('../middleware/auth');

/**
 * GET /:id => {...data}
 * 
 * No auth req'd
 */
router.get('/:id', async (req,res,next)=>{
    try{
        const attack = await Attack.get(req.params.id);
        return res.json({attack});
    }catch(e){
        return next(e);
    };
});

/**
 * POST / {...data} => {id, ...data}
 * 
 * Must be Admin or correct user
 */
router.post('/', isAdminOrUserForData, async (req,res,next)=>{
    try{
        const attack = await Attack.post(req.body);
        return res.json({attack});
    }catch(e){
        return next(e);
    };
});

/**
 * PATCH /:id {data} = > {updated attack}
 * 
 * Must be admin or correct user
 */
router.patch('/:id', isAdminOrUserForData, async (req,res,next)=>{
    try{
        const attack = await Attack.patch(req.body);
        return res.json({attack});
    }catch(e){
        return next(e);
    };
});

/**
 * DELETE /:id => id
 * 
 * Admin or correct user
 */
router.delete('/:id', isAdminOrUserForData, async (req,res,next)=>{
    try{
        const id = await Attack.delete(req.params.id);
        return res.json({success : id});
    }catch(e){
        return next(e);
    };
});

module.exports = router;