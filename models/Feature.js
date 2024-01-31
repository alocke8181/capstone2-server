const db = require('../db');
const {NotFoundError} = require('../expressError')
const {sqlForUpdate} = require('../helpers/sql');

class Feature{
    constructor(data){
        this.id = data.id;
        this.charID = data.charid;
        this.name = data.name;
        this.source = data.source;
        this.description = data.description;
    }

    /**
     * Takes a string of a custom feature name and returns a custom feature object
     * 'custom-1' => {feature}
     * Traits have id, charID, name, source, and description
     */
    static async get(feature){
        console.log('\u001b[32m INTERNAL','\u001b[33m GET FEATURE \u001b[0m',feature);
        let id = feature.split('-')[1];
        const results = await db.query(`
        SELECT * FROM custom_features
        WHERE id = $1`,
        [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No feature id: ${id}`);
        };
        return new Trait(results.rows[0]);
    }

    /**
     * Post a custom feature from data and then return it
     */
    static async post(data){
        const results = await db.query(`
            INSERT INTO custom_features
            (charid, name, source, description)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [data.charID, data.name, data.source, data.description]);
        return new Feature(results.rows[0]);
    };


    /**
     * Patch a custom feature and then return it
     */
    static async patch(data){
        const id = data.id;
        delete data.id;
        const {setCols, values} = sqlForUpdate(data)
        const lastIdx = '$' + (values.length+1);
        const results = await db.query(`
            UPDATE custom_features
            SET ${setCols}
            WHERE id = ${lastIdx}
            RETURNING *`,
            [...values, id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No feature id: ${id}`);
        };
        return new Feature(results.rows[0]);
    };

    static async delete(id){
        const results = await db.query(`
            DELETE FROM custom_features
            WHERE id = $1
            RETURNING id`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No feature id: ${id}`);
        };
        return results.rows[0].id;
    }
}

module.exports = Feature;