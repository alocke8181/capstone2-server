const express = require('express');
const router = new express.Router();
const {isAdminOrUserForData} = require('../middleware/auth');
const Trait = require('../models/Trait');

/**
 * GET /:id => {id, charID, name, source, description}
 * 
 * No auth req'd
 */
router.get('/:id', async (req,res,next)=>{
    try{
        const trait = await Trait.get(req.params.id);
        return res.json({trait});
    }catch(e){
        return next(e);
    };
});

/**
 * POST / {charId, name, source, desc} => {id, charID, name, source, desc}
 * 
 */
router.post('/', isAdminOrUserForData, async (req,res,next)=>{
    try{
        const trait = await Trait.post(req.body);
        return res.json({trait});
    }catch(e){
        return next(e);
    };
});

/**
 * PATCH /:id {data} = > {updated trait}
 */
router.patch('/:id', isAdminOrUserForData, async (req,res,next)=>{
    try{
        const trait = await Trait.patch(req.body);
        return res.json({trait});
    }catch(e){
        return next(e);
    };
});

/**
 * DELETE /:id => id
 */
router.delete('/:id', isAdminOrUserForData, async (req,res,next)=>{
    try{
        const id = await Trait.delete(req.params.id);
        return res.json({success : id});
    }catch(e){
        return next(e);
    };
});

module.exports = router;