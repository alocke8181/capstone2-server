const express = require('express');
const router = new express.Router();
const { isAdmin, isAdminOrUser, isAdminOrUserForData} = require('../middleware/auth')
const Character = require('../models/Character');

const {completeCharacterDataOut, completeCharacterDataIn} = require('../middleware/characters');



/**
 * GET / => {characters : [{id, creatorID, charName, race, className, level}, ...]}
 * 
 * Requires admin
 */
router.get('/', isAdmin, async (req,res,next)=>{
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
 * No auth required
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
 * Requires Admin or logged in
 */

router.get('/user/:id', isAdminOrUser,async (req,res,next)=>{
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
 * Requires admin or user
 */
router.post('/', isAdminOrUserForData,async (req,res,next)=>{
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
 * Requires Admin or correct user
 */
router.patch('/:id', isAdminOrUserForData,async (req,res,next)=>{
    try{
        const charSQL = completeCharacterDataIn(req.body);
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