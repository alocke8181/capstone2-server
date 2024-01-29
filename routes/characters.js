const express = require('express');

const {BadRequestError, NotFoundError, ExpressError } = require('../expressError')
const dndApi = require('../dndApi');
const Character = require('../models/Character');
const Trait = require('../models/Trait');
const Attack = require('../models/Attack');

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

    character.equipment = convertEquipment(character.equipment);
    
    character.cantrips = await convertSpells(character.cantrips);
    character.levelOne = await convertSpells(character.levelOne);
    character.levelTwo = await convertSpells(character.levelTwo);
    character.levelThree = await convertSpells(character.levelThree);
    character.levelFour = await convertSpells(character.levelFour);
    character.levelFive = await convertSpells(character.levelFive);
    character.levelSix = await convertSpells(character.levelSix);
    character.levelSeven = await convertSpells(character.levelSeven);
    character.levelEight = await convertSpells(character.levelEight);
    character.levelNine = await convertSpells(character.levelNine);

    character.attacks = await convertAttacks(character.attacks);
}

/**
 * Convert each string in the alt resources into an object
 * 1*1*bardic-inspiration => {max : 1, curr : 1, name : bardic inspiration}
 * 
 */
function convertAltResources(input){
    if(input.length==0){
        return null;
    }
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

/**
 * Convert all traits from strings into objects
 * Queries the external API or DB for data
 * 
 */
async function convertTraits(allTraits){
    if(allTraits.length == 0){
        return null;
    }
    let output = [];
    let promises = [];
    let promisesCustom = [];
    let traits = [];
    let customTraits = [];

    allTraits.forEach((trait)=>{
        if(trait.includes('custom')){
            customTraits.push(trait);
        }else{
            traits.push(trait);
        };
    });

    customTraits.forEach((trait)=>{
        promisesCustom.push(Trait.get(trait));
    });
    promises.allSettled(promisesCustom).then((results)=>{
        results.forEach((result)=>{
            output.push(result);
        });
    });

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

/**
 * Convert all traits from strings into objects
 * Queries the external API for data
 * 
 */
async function convertFeatures(features){
    if(features.length == 0){
        return null;
    }
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

/**
 * Converts strings of items into objects
 * ['1*item-name',...] => [{name : item name, amount : 1},...]
 */
function convertEquipment(equipment){
    if(equipment.length == 0){
        return null;
    }
    let output = [];
    equipment.forEach((item)=>{
        let [amount, name] = item.split('*');
        output.push({
            name : name.replace('-',' '),
            amount : amount
        })
    })
    return output;
}


/**
 * Converts a list of spell strings into a list of spell objects
 * Queries the external API for this
 * Since there is such a wide range of spells, some will have null attributes
 * 
 */
async function convertSpells(spells){
    if(spells.length == 0){
        return null;
    }
    let output = [];
    let promises = [];
    spells.forEach((spell)=>{
        promises.push(dndApi.getSpell(spell));
    });
    Promise.allSettled(promises).then((results)=>{
        results.forEach((result)=>{
            output.push({
                index : result.data.index,
                name : result.data.name,
                description : result.data.desc.join(),
                higherLevels : result.data.higher_level || null,
                range : result.data.range,
                duration : result.data.duration,
                concentration : result.data.concentration,
                castingTime : result.data.casting_time,
                attackType : result.data.attack_type || null,
                damage : result.data.damage || null,
                healLevels : result.data.heal_at_slot_level || null,
                dc : result.data.dc || null
            })
        })
    })
}

/**
 * Convert from attack strings to objects
 * Checks if it's a custom attack first,
 * Then checks the external API
 */
async function convertAttacks(attacks){
    let output = [];
    let customAtks = [];
    let extAtks = []
    let dbPromises = [];
    let extPromises = [];
    
    if(attacks.length == 0){
        return null;
    };

    //Filter b/w normal and custom
    attacks.forEach((attack)=>{
        if(attack.includes('custom')){
            customAtks.push(attack);
        }else{
            extAtks.push(attack);
        };
    });

    //Get normal
    extAtks.forEach((attack)=>{
        extPromises.push(dndApi.getAttack(attack));
    });
    Promise.allSettled(extPromises).then((results)=>{
        results.forEach((result)=>{
            output.push({
                index : result.data.index,
                name : result.data.name,
                damage : result.data.damage,
                range : result.data.range,
                props : result.data.properties,
                twoHandDmg : result.data.two_handed_damage || null
            });
        });
    });

    //Get custom
    customAtks.forEach((attack)=>{
        dbPromises.push(Attack.get(attack));
    });
    Promise.allSettled(dbPromises).then((results)=>{
        results.forEach((result)=>{
            output.push(result);
        });
    });

    return output;
};

module.exports = router;