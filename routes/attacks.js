const express = require('express');
const router = new express.Router();

const Attack = require('../models/Attack');

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
 * No auth req'd
 */
router.post('/', async (req,res,next)=>{
    try{
        const attack = await Attack.post(req.body);
        return res.json({attack});
    }catch(e){
        return next(e);
    };
});

/**
 * PATCH /:id {data} = > {updated attack}
 */
router.patch('/:id', async (req,res,next)=>{
    try{
        const attack = await Attack.patch(req.body);
        return res.json({attack});
    }catch(e){
        return next(e);
    };
});

/**
 * DELETE /:id => id
 */
router.delete('/:id', async (req,res,next)=>{
    try{
        const id = await Attack.delete(req.params.id);
        return res.json({success : id});
    }catch(e){
        return next(e);
    };
});

module.exports = router;