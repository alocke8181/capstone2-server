const Trait = require('../models/Trait');
const Attack = require('../models/Attack');
const dndApi = require('../dndApi');

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
            name : name.replaceAll('-',' '),
            amount : parseInt(amount)
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

module.exports = {
    convertAltResources,
    convertTraits,
    convertFeatures,
    convertEquipment,
    convertSpells,
    convertAttacks
}