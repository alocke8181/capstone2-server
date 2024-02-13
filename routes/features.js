const express = require('express');
const router = new express.Router();
const {isAdminOrUserForData} = require('../middleware/auth');
const Feature = require('../models/Feature');

/**
 * GET /:id => {id, charID, name, source, description}
 * 
 * No auth req'd
 */
router.get('/:id', async (req,res,next)=>{
    try{
        const feature = await Feature.get(req.params.id);
        return res.json({feature});
    }catch(e){
        return next(e);
    };
});

/**
 * POST / {charId, name, source, desc} => {id, charID, name, source, desc}
 * 
 * No auth req'd
 */
router.post('/', isAdminOrUserForData,async (req,res,next)=>{
    try{
        const feature = await Feature.post(req.body);
        return res.json({feature});
    }catch(e){
        return next(e);
    };
});

/**
 * PATCH /:id {data} = > {updated feat}
 */
router.patch('/:id', isAdminOrUserForData,async (req,res,next)=>{
    try{
        const feature = await Feature.patch(req.body);
        return res.json({feature});
    }catch(e){
        return next(e);
    };
});

/**
 * DELETE /:id => id
 */
router.delete('/:id', isAdminOrUserForData,async (req,res,next)=>{
    try{
        const id = await Feature.delete(req.params.id);
        return res.json({success : id});
    }catch(e){
        return next(e);
    };
});

module.exports = router;