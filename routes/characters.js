const express = require('express');
const router = new express.Router();

const Character = require('../models/Character');

const {completeCharacterDataOut, completeCharacterDataIn} = require('../middleware/characters');



/**
 * GET / => {characters : [{id, creatorID, charName, race, className, level}, ...]}
 * 
 * Will require admin later
 */
router.get('/', async (req,res,next)=>{
    try{
        let characters = await Character.getAll();
        return res.json({characters});
    }catch(e){
        return next(e);
    }
})

/**GET /[id] => {character}
 * 
 * Get based on an ID
 * Return the whole character object after converting from SQL
 * 
 * Will require Auth later
 * 
 */

router.get('/:id', async (req,res,next)=>{
    try{
        let character = await Character.get(req.params.id);
        character = await completeCharacterDataOut(character); 
        return res.json({character})
    }catch(e){
        return next(e);
    }
})

/**
 * GET /user/:id [id] = {characters : [{},{}]}
 * Get a list of characters based on a user ID
 * Does not return all info, only key stuff
 */

router.get('/user/:id', async (req,res,next)=>{
    try{
        const characters = await Character.getList(req.params.id);
        return res.json({characters});
    }catch(e){
        return next(e);
    };
});

/**
 * POST / {creatorID, charName, race, className, background, level, xp} => {character data}
 * Create a new character based on a small amount of starting data
 * This will be entered via a form client-side
 * Return the id for the client to redirect to the character page
 */
router.post('/', async (req,res,next)=>{
    try{
        const id = await Character.post(req.body);
        return res.json({id});
    }catch(e){
        return next(e);
    };
});

/**
 * PATCH /:id {..data} => {updated character}
 * Update an existing character
 */
router.patch('/:id', async (req,res,next)=>{
    try{
        const charSQL = completeCharacterDataIn(req.body);
        console.log(charSQL);
        const charReturn = await Character.patch(req.params.id, charSQL);
        const character = await completeCharacterDataOut(charReturn);
        return res.json({character});
    }catch(e){
        return next(e);
    };
});

/**
 * DELETE /:id id => {success : id}
 * Delete a character
 */
router.delete('/:id', async (req,res,next)=>{
    try{
        const id = await Character.delete(req.params.id);
        return res.json({success : id});
    }catch(e){
        return next(e);
    };
});


module.exports = router;