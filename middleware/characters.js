const Trait = require('../models/Trait');
const Attack = require('../models/Attack');
const dndApi = require('../dndApi');

/**
 * Convert each string in the alt resources into an object
 * 1*1*bardic-inspiration => {max : 1, curr : 1, name : bardic inspiration}
 * 
 */
function convertAltResourcesOut(input){
    if(input.length==0 || input[0] === ''){
        return null;
    }
    let output = [];
    input.forEach((input)=>{
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
function convertAltResourcesIn(input){
    if(!input || input.length ==0){
        return null;
    }
    const output = [];
    input.forEach((input)=>{
        let text = input.max.toString() + '*' + input.curr.toString() + '*' + input.name.replaceAll(' ','-');
        output.push(text);
    });
    return output.join('_');
};

/**
 * Convert all traits from strings into objects
 * Queries the external API or DB for data
 * 
 */
async function convertTraitsOut(allTraits){
    if(allTraits.length == 0 || allTraits[0] === ''){
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

    //console.log(customTraits);
    customTraits.forEach((trait)=>{
        promisesCustom.push(Trait.get(trait));
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
                    description : result.value.data.desc.join()
                });
            }
        });
    });
    return output;
}

/**
 * Convert all the trait objects into a single string
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
 * Convert all traits from strings into objects
 * Queries the external API for data
 * 
 */
async function convertFeaturesOut(features){
    if(features.length == 0 || features[0] === ''){
        return null;
    }
    let output = [];
    let promises = [];
    features.forEach((feature) =>{
        promises.push(dndApi.getFeatureInfo(feature));
    })
    await Promise.allSettled(promises).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Feature Not Found',
                    description : `No Path ${result.reason.request.path}`
                });
            }else{
                output.push({
                    index : result.value.data.index,
                    name : result.value.data.name,
                    description : result.value.data.desc.join()
                });
            };
        });
    });
    return output;
}

/**
 * Convert the array of features into a single string
 */

function convertFeaturesIn(features){
    if(!features || features.length ==0){
        return null;
    }
    let output = [];
    features.forEach((feature)=>{
        output.push(feature.index);
    });
    return output.join('_');
};

/**
 * Converts strings of items into objects
 * ['1*item-name',...] => [{name : item name, amount : 1},...]
 */
function convertEquipmentOut(equipment){
    if(equipment.length == 0 || equipment[0] === ''){
        return null;
    }
    let output = [];
    equipment.forEach((item)=>{
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
    if(spells.length == 0 || spells[0] === ''){
        return null;
    }
    let output = [];
    let promises = [];
    spells.forEach((spell)=>{
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
                    description : result.value.data.desc.join(),
                    higherLevels : result.value.data.higher_level || null,
                    range : result.value.data.range,
                    duration : result.value.data.duration,
                    concentration : result.value.data.concentration,
                    castingTime : result.value.data.casting_time,
                    attackType : result.value.data.attack_type || null,
                    damage : result.value.data.damage || null,
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
 * Checks if it's a custom attack first,
 * Then checks the external API
 */
async function convertAttacksOut(attacks){
    let output = [];
    let customAtks = [];
    let extAtks = []
    let dbPromises = [];
    let extPromises = [];
    
    if(attacks.length == 0 || attacks[0] === ''){
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

    //Get custom
    customAtks.forEach((attack)=>{
        dbPromises.push(Attack.get(attack));
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

    //Get normal
    extAtks.forEach((attack)=>{
        extPromises.push(dndApi.getAttack(attack));
    });
    await Promise.allSettled(extPromises).then((results)=>{
        results.forEach((result)=>{
            if(result.status === 'rejected'){
                output.push({
                    name : 'Attack Not Found',
                    description : `No Path ${result.reason.request.path}`
                });
            }else{
                output.push({
                    index : result.value.data.index,
                    name : result.value.data.name,
                    damage : result.value.data.damage,
                    range : result.value.data.range,
                    props : result.value.data.properties,
                    twoHandDmg : result.value.data.two_handed_damage || null
                });
            }
        });
    });

    return output;
};

/**
 * Convert an array of attacks into a single string
 */

function convertAttacksIn(attacks){
    if(!attacks || attacks.length ==0){
        return null;
    }
    let output = [];
    attacks.forEach((attack)=>{
        if(attack.id){
            output.push('custom-' + attack.id.toString());
        }else{
            output.push(attack.index);
        };
    });
    return output.join('_');
}

module.exports = {
    convertAltResourcesOut,
    convertTraitsOut,
    convertFeaturesOut,
    convertEquipmentOut,
    convertSpellsOut,
    convertAttacksOut,
    convertAltResourcesIn,
    convertTraitsIn,
    convertFeaturesIn,
    convertEquipmentIn,
    convertSpellsIn,
    convertAttacksIn,
}