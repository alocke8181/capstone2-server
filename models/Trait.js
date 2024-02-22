const db = require('../db');
const {NotFoundError} = require('../expressError')
const {sqlForUpdate} = require('../helpers/sql');

class Trait{
    constructor(data){
        this.id = data.id;
        this.charID = data.charid;
        this.name = data.name;
        this.source = data.source;
        this.description = data.description;
    }

    /**
     * Takes a string of a custom trait name and returns a custom trait object
     * 'custom-1' => {trait}
     * Traits have id, charID, name, source, and description
     */
    static async get(id){
        console.log('\u001b[32m INTERNAL','\u001b[33m GET TRAIT \u001b[0m',id);
        const results = await db.query(`
        SELECT * FROM custom_traits
        WHERE id = $1`,
        [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No trait id: ${id}`);
        };
        return new Trait(results.rows[0]);
    }

    /**
     * Post a custom trait from data and then return it
     */
    static async post(data){
        const results = await db.query(`
            INSERT INTO custom_traits
            (charid, name, source, description)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [data.charID, data.name, data.source, data.description]);
        return new Trait(results.rows[0]);
    };


    /**
     * Patch a custom trait and then return it
     */
    static async patch(data){
        const id = data.id;
        delete data.id;
        const {setCols, values} = sqlForUpdate(data)
        const lastIdx = '$' + (values.length+1);
        const results = await db.query(`
            UPDATE custom_traits
            SET ${setCols}
            WHERE id = ${lastIdx}
            RETURNING *`,
            [...values, id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No trait id: ${id}`);
        };
        return new Trait(results.rows[0]);
    };

    /**
     * Delete a custom trait and return the delete ID on success
     */
    static async delete(id){
        const results = await db.query(`
            DELETE FROM custom_traits
            WHERE id = $1
            RETURNING id`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No trait id: ${id}`);
        };
        return results.rows[0].id;
    }
}

module.exports = Trait;