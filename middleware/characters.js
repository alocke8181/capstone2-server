const Trait = require('../models/Trait');
const Feature = require('../models/Feature');
const Attack = require('../models/Attack');
const dndApi = require('../dndApi');

/**
 * Massive converter function
 * Converts a character from SQL data to a javascript object
 * Sets lots of attributes based on external API calls
 * Converts arrays of strings to arrays of objects 
 */
async function completeCharacterDataOut(character){
    const raceData = await dndApi.getRaceInfo(character.race.toLowerCase().replace(' ','-'));
    const classData = await dndApi.getClassInfo(character.className.toLowerCase())
    const classLevelData = await dndApi.getClassLevelInfo(character.className.toLowerCase(), character.level)
    character.profBonus = classLevelData.prof_bonus;
    if(character.features !== null && character.features.includes('jack-of-all-trades')){
        character.jackOfAllTrades = true;
    }
    character.speed = character.speed + raceData.speed;
    character.hitDice = classData.hit_die;

    const spellData = classLevelData.spellcasting;
    if(!spellData){
        character.cantripsKnown = 0;
        character.levelOneSlots = 0;
        character.levelTwoSlots = 0;
        character.levelThreeSlots = 0;
        character.levelFourSlots = 0;
        character.levelFiveSlots = 0;
        character.levelSixSlots = 0;
        character.levelSevenSlots = 0;
        character.levelEightSlots = 0;
        character.levelNineSlots = 0;
    }else{
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
    }

    character.altResources = convertAltResourcesOut(character.altResources);
    character.traits = await convertTraitsOut(character.traits);
    character.features = await convertFeaturesOut(character.features);

    character.equipment = convertEquipmentOut(character.equipment);
    
    character.cantrips = await convertSpellsOut(character.cantrips);
    character.levelOne = await convertSpellsOut(character.levelOne);
    character.levelTwo = await convertSpellsOut(character.levelTwo);
    character.levelThree = await convertSpellsOut(character.levelThree);
    character.levelFour = await convertSpellsOut(character.levelFour);
    character.levelFive = await convertSpellsOut(character.levelFive);
    character.levelSix = await convertSpellsOut(character.levelSix);
    character.levelSeven = await convertSpellsOut(character.levelSeven);
    character.levelEight = await convertSpellsOut(character.levelEight);
    character.levelNine = await convertSpellsOut(character.levelNine);

    character.attacks = await convertAttacksOut(character.attacks);

    return character;
}

/**
 * Convert from a JS object into a SQL object
 * Delete many of the calculated properties
 * Convert arrays into single strings
 */

function completeCharacterDataIn(character){
    delete character.id;
    delete character.strMod;
    delete character.dexMod;
    delete character.conMod;
    delete character.intMod;
    delete character.wisMod;
    delete character.chaMod;

    character.strength = character.str;
    character.dexterity = character.dex;
    character.constitution = character.con;
    character.intelligence = character.int;
    character.wisdom = character.wis;
    character.charisma = character.cha;

    delete character.str;
    delete character.dex;
    delete character.con;
    delete character.int;
    delete character.wis;
    delete character.cha;

    delete character.profBonus;
    character.savingProfs = character.savingProfs.join('_') || null;
    character.skillProfs = character.skillProfs.join('_') || null;
    delete character.jackOfAllTrades;
    delete character.passPerc;

    delete character.speed;
    delete character.initiative;
    delete character.hitDice;
    delete character.hitDiceMax;
    character.altResources = convertAltResourcesIn(character.altResources);

    character.traits = convertTraitsIn(character.traits);
    character.features = convertFeaturesIn(character.features);
    character.languages = character.languages.join('_') || null;
    character.equipProfs = character.equipProfs.join('_') || null;

    character.equipment = convertEquipmentIn(character.equipment);

    character.attacks = convertAttacksIn(character.attacks);

    delete character.cantripsKnown;
    delete character.levelOneSlots;
    delete character.levelTwoSlots;
    delete character.levelThreeSlots;
    delete character.levelFourSlots;
    delete character.levelFiveSlots;
    delete character.levelSixSlots;
    delete character.levelSevenSlots;
    delete character.levelEightSlots;
    delete character.levelNineSlots;

    character.cantrips = convertSpellsIn(character.cantrips);
    character.levelOne = convertSpellsIn(character.levelOne);
    character.levelTwo = convertSpellsIn(character.levelTwo);
    character.levelThree = convertSpellsIn(character.levelThree);
    character.levelFour = convertSpellsIn(character.levelFour);
    character.levelFive = convertSpellsIn(character.levelFive);
    character.levelSix = convertSpellsIn(character.levelSix);
    character.levelSeven = convertSpellsIn(character.levelSeven);
    character.levelEight = convertSpellsIn(character.levelEight);
    character.levelNine = convertSpellsIn(character.levelNine);

    return character;
}

/**
 * Convert each string in the alt resources into an object
 * 1*1*bardic-inspiration => {max : 1, curr : 1, name : bardic inspiration}
 * 
 */
function convertAltResourcesOut(resources){
    if(!resources || resources == ''){
        return [];
    }
    const resourceList = resources.split('_');
    let output = [];
    resourceList.forEach((input)=>{
        let data = input.split('*');
        let name = data[2].replaceAll('-',' ');
        output.push({
            max : parseInt(data[0]),
            curr : parseInt(data[1]),
            name : name
        })
    })
    return output
}

/**
 * Convert each object into a string and then combine them
 * [{max : 1, curr : 1, name : bardic inspiration},...] => '1*1*bardic-inspiration_...
 */
function convertAltResourcesIn(resources){
    if(!resources || resources.length ==0){
        return null;
    }
    const output = [];
    resources.forEach((input)=>{
        let text = input.max.toString() + '*' + input.curr.toString() + '*' + input.name.replaceAll(' ','-');
        output.push(text);
    });
    return output.join('_');
};

/**
 * Convert all feats from strings into objects
 * Queries the external API or DB for data
 * 
 */
async function convertTraitsOut(allTraits){
    if(!allTraits || allTraits == ''){
        return [];
    }
    const traitList = allTraits.split('_');
    let output = [];
    let promises = [];
    let promisesCustom = [];
    let traits = [];
    let customTraits = [];

    traitList.forEach((trait)=>{
        if(trait.includes('custom')){
            customTraits.push(trait);
        }else{
            traits.push(trait);
        };
    });

    customTraits.forEach((trait)=>{
        let id = trait.split('-')[1]
        promisesCustom.push(Trait.get(id));
    });
    await Promise.allSettled(promisesCustom).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Custom Trait Not Found',
                    description : String(result.reason).slice(0,32)
                });
            }else{
                output.push(result.value);
            }
        });
    });

    traits.forEach((trait) =>{
        promises.push(dndApi.getTraitInfo(trait));
    })
    await Promise.allSettled(promises).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Trait Not Found',
                    description : `No Path ${result.reason.request.path}`
                })
            }else{
                output.push({
                    index : result.value.data.index,
                    name : result.value.data.name,
                    description : result.value.data.desc.join(' ')
                });
            }
        });
    });
    return output;
}

/**
 * Convert all the feature objects into a single string
 * Traits will be created/edited/deleted by the client on the app
 */

function convertTraitsIn(traits){
    if(!traits || traits.length ==0){
        return null;
    }
    let output = [];
    traits.forEach((trait)=>{
        if(trait.id){
            output.push('custom-' + trait.id.toString());
        }else{
            output.push(trait.index);
        };
    });
    return output.join('_');
};

/**
 * Convert all feats from strings into objects
 * Queries the external API for data
 * 
 */
async function convertFeaturesOut(allFeatures){
    if(!allFeatures || allFeatures == ''){
        return [];
    }
    const featList = allFeatures.split('_');
    let output = [];
    let promises = [];
    let promisesCustom = [];
    let feats = [];
    let customFeats = [];

    featList.forEach((feature)=>{
        if(feature.includes('custom')){
            customFeats.push(feature);
        }else{
            feats.push(feature);
        };
    });

    customFeats.forEach((feature)=>{
        let id = feature.split('-')[1];
        promisesCustom.push(Feature.get(id));
    });
    await Promise.allSettled(promisesCustom).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Custom Feature Not Found',
                    description : String(result.reason).slice(0,32)
                });
            }else{
                output.push(result.value);
            }
        });
    });

    feats.forEach((feature) =>{
        promises.push(dndApi.getFeatureInfo(feature));
    })
    await Promise.allSettled(promises).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Feature Not Found',
                    description : `No Path ${result.reason.request.path}`
                })
            }else{
                output.push({
                    index : result.value.data.index,
                    name : result.value.data.name,
                    description : result.value.data.desc.join(' ')
                });
            }
        });
    });
    return output;
}

/**
 * Convert the array of features into a single string
 * Custom feats are created/edited/saved by the client on the app
 */

function convertFeaturesIn(feats){
    if(!feats || feats.length ==0){
        return null;
    }
    let output = [];
    feats.forEach((feat)=>{
        if(feat.id){
            output.push('custom-' + feat.id.toString());
        }else if(feat.index){
            output.push(feat.index);
        };
    });
    return output.join('_');
};

/**
 * Converts strings of items into objects
 * ['1*item-name',...] => [{name : item name, amount : 1},...]
 */
function convertEquipmentOut(equipment){
    if(!equipment || equipment == ''){
        return [];
    }
    const equipList = equipment.split('_');
    let output = [];
    equipList.forEach((item)=>{
        let [amount, name] = item.split('*');
        output.push({
            name : name.replaceAll('-',' '),
            amount : parseInt(amount) || '1'
        })
    })
    return output;
}

/**
 * Convert the array of equipment into a single string
 */

function convertEquipmentIn(equipment){
    if(!equipment || equipment.length ==0){
        return null;
    }
    let output = [];
    equipment.forEach((item)=>{
        output.push(item.amount.toString() + '*' + item.name.replaceAll(' ','-'));
    });
    return output.join('_');
};


/**
 * Converts a list of spell strings into a list of spell objects
 * Queries the external API for this
 * Since there is such a wide range of spells, some will have null attributes
 * 
 */
async function convertSpellsOut(spells){
    if(!spells || spells == ''){
        return [];
    }
    const spellList = spells.split('_');
    let output = [];
    let promises = [];
    spellList.forEach((spell)=>{
        promises.push(dndApi.getSpell(spell));
    });
    await Promise.allSettled(promises).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Spell Not Found',
                    description : `No Path ${result.reason.request.path}`
                });
            }else{
                output.push({
                    index : result.value.data.index,
                    name : result.value.data.name,
                    description : result.value.data.desc.join(' '),
                    higherLevels : result.value.data.higher_level || null,
                    range : result.value.data.range,
                    duration : result.value.data.duration,
                    concentration : result.value.data.concentration,
                    ritual : result.value.data.ritual,
                    school : result.value.data.school,
                    castingTime : result.value.data.casting_time,
                    attackType : result.value.data.attack_type || null,
                    damage : result.value.data.damage || null,
                    areaOfAffect : result.value.data.area_of_affect || null,
                    healLevels : result.value.data.heal_at_slot_level || null,
                    dc : result.value.data.dc || null
                });
            }
        });
    });
    return output;
}
/**
 * Convert an array of spells into a single string
 */
function convertSpellsIn(spells){
    if(!spells || spells.length ==0){
        return null;
    }
    let output = [];
    spells.forEach((spell)=>{
        output.push(spell.index);
    });
    return output.join('_');
}

/**
 * Convert from attack strings to objects
 */
async function convertAttacksOut(attacks){
    if(!attacks || attacks == ''){
        return [];
    };

    const atkList = attacks.split('_');

    let output = [];
    let dbPromises = [];
    

    //Get custom
    atkList.forEach((attack)=>{
        let id = attack.split('-')[1]
        dbPromises.push(Attack.get(id));
    });
    await Promise.allSettled(dbPromises).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Custom Attack Not Found',
                    description : String(result.reason).slice(0,33)
                });
            }else{
                output.push(result.value);
            }
        });
    });

    return output;
};


/**
 * Convert an array of attacks into a single string
 * Custom attacks are CRUD'ed by the client on the app
 */

function convertAttacksIn(attacks){
    if(!attacks || attacks.length ==0){
        return null;
    }
    let output = [];
    attacks.forEach((attack)=>{
        output.push('custom-' + attack.id.toString());
    });
    return output.join('_');
}

module.exports = {
    completeCharacterDataOut,
    convertAltResourcesOut,
    convertTraitsOut,
    convertFeaturesOut,
    convertEquipmentOut,
    convertSpellsOut,
    convertAttacksOut,
    completeCharacterDataIn,
    convertAltResourcesIn,
    convertTraitsIn,
    convertFeaturesIn,
    convertEquipmentIn,
    convertSpellsIn,
    convertAttacksIn,
}