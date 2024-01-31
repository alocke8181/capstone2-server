const express = require('express');
const router = new express.Router();

const Character = require('../models/Character');

const {completeCharacterData} = require('../middleware/characters');



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
 * return the whole character object after converting from SQL
 * 
 * Will require Auth later
 * 
 */

router.get('/:id', async (req,res,next)=>{
    try{
        let character = await Character.get(req.params.id);
        character = await completeCharacterData(character); 
        return res.json({character})
    }catch(e){
        return next(e);
    }
})



module.exports = router;