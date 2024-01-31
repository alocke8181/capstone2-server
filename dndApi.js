const axios = require('axios');
const BASE_URL = 'https://www.dnd5eapi.co/api';
const {BadRequestError, NotFoundError, ExpressError } = require('./expressError');

class dndApi{

    static async getClassInfo(className){
        console.log('\u001b[33m EXTERNAL','\u001b[34m CLASS INFO \u001b[0m',className)
        const resp = await axios.get(`${BASE_URL}/classes/${className}`);
        return resp.data;
    }

    static async getClassLevelInfo(className,level){
        console.log('\u001b[33m EXTERNAL','\u001b[36m CLASS LEVEL INFO \u001b[0m', className, level)
        const resp = await axios.get(`${BASE_URL}/classes/${className}/levels/${level}`);
        return resp.data;
    }

    static async getRaceInfo(raceName){
        console.log('\u001b[33m EXTERNAL','\u001b[32m RACE INFO \u001b[0m', raceName)
        const resp = await axios.get(`${BASE_URL}/races/${raceName}`);
        return resp.data;
    }

    static async getTraitInfo(trait){
        console.log('\u001b[33m EXTERNAL','\u001b[33m TRAIT INFO \u001b[0m', trait)
        const resp = await axios.get(`${BASE_URL}/traits/${trait}`);
        return resp;
    }

    static async getFeatureInfo(feature){
        console.log('\u001b[33m EXTERNAL','\u001b[35m FEAT INFO \u001b[0m', feature)
        const resp = await axios.get(`${BASE_URL}/features/${feature}`);
        return resp;
    }

    static async getSpell(spell){
        console.log('\u001b[33m EXTERNAL','\u001b[31m SPELL INFO \u001b[0m', spell)
        const resp = await axios.get(`${BASE_URL}/spells/${spell}`);
        return resp;
    }

    static async getAttack(weapon){
        console.log('\u001b[33m EXTERNAL','\u001b[31m ATK INFO \u001b[0m', weapon)
        const resp = await axios.get(`${BASE_URL}/equipment/${weapon}`);
        return resp;
    }

}

module.exports = dndApi;