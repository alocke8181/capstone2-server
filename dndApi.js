const axios = require('axios');
const BASE_URL = 'https://www.dnd5eapi.co/api';
const {BadRequestError, NotFoundError, ExpressError } = require('expressError');

class dndApi{

    static async getClassInfo(className){
        const resp = await axios.get(`${BASE_URL}/${className}`);
        return resp.data;
    }

    static async getClassLevelInfo(className,level){
        const resp = await axios.get(`${BASE_URL}/${className}/levels/${level}`);
        return resp.data;
    }

    static async getRaceInfo(raceName){
        const resp = await axios.get(`${BASE_URL}/races/${raceName}`);
        return resp.data;
    }

    static async getTraitInfo(trait){
        const resp = await axios.get(`${BASE_URL}/traits/${trait}`);
        return resp;
    }

    static async getFeatureInfo(feature){
        const resp = await axios.get(`${BASE_URL}/features/${feature}`);
        return resp;
    }

}

module.exports = dndApi;