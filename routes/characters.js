const express = require('express');

const {BadRequestError, NotFoundError, ExpressError } = require('../expressError')
const dndApi = require('../dndApi');
const Character = require('../models/Character');

const router = new express.Router();

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
        character = await completeCharacterData(character); //Move this to a middleware file
        return res.json({character})
    }catch(e){
        return next(e);
    }
})

//Helper function to set a bunch of attributes by making API calls
async function completeCharacterData(character){
    const raceData = await dndApi.getRaceInfo(character.race);
    const classData = await dndApi.getClassInfo(character.className)
    const classLevelData = await dndApi.getClassLevelInfo(character.className, character.level)
    character.profBonus = classLevelData.prof_bonus;
    if(character.traits.includes('jack-of-all-trades')){
        character.jackOfAllTrades = true;
    }
    character.speed = character.speed + raceData.speed;
    character.hitDice = classData.hit_die;

    const spellData = classLevelData.spellcasting;
    character.cantripsKnown = spellData.cantrips_known;
    character.levelOneSlots = spellData.spell_slots_level_1;
    character.levelTwoSlots = spellData.spell_slots_level_2;
    character.levelThreeSlots = spellData.spell_slots_level_3;
    character.levelFourSlots = spellData.spell_slots_level_4;
    character.levelFiveSlots = spellData.spell_slots_level_5;
    character.levelSixSlots = spellData.spell_slots_level_6;
    character.levelSevenSlots = spellData.spell_slots_level_7;
    character.levelEightSlots = spellData.spell_slots_level_8;
    character.levelNineSlots = spellData.spell_slots_level_9;

    character.altResources = convertAltResources(character.altResources);
    character.traits = await convertTraits(character.traits);
    character.features = await convertFeatures(character.features);
}

/**
 * Convert each string in the alt resources into an object
 * 1*1*bardic-inspiration => {max : 1, curr : 1, name : bardic inspiration}
 * 
 */
function convertAltResources(input){
    let output = [];
    input.forEach((input)=>{
        let data = input.split('*');
        let name = data[2].replace('-',' ');
        output.push({
            max : data[0],
            curr : data[1],
            name : name
        })
    })
    return output
}

async function convertTraits(traits){
    let output = [];
    let promises = [];
    traits.forEach((trait) =>{
        promises.push(dndApi.getTraitInfo(trait));
    })
    Promise.allSettled(promises).then((results)=>{
        results.forEach((result)=>{
            output.push({
                index : result.data.index,
                name : result.data.name,
                description : result.data.desc.join()
            });
        });
    });
    return output;
}

async function convertFeatures(features){
    let output = [];
    let promises = [];
    features.forEach((feature) =>{
        promises.push(dndApi.getFeatureInfo(feature));
    })
    Promise.allSettled(promises).then((results)=>{
        results.forEach((result)=>{
            output.push({
                index : result.data.index,
                name : result.data.name,
                description : result.data.desc.join()
            });
        });
    });
    return output;
}

module.exports = router;