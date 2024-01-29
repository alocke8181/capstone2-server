const db = require('../db');
const {NotFoundError} = require('../expressError')

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
    static async get(trait){
        let id = trait.split('-')[1];
        const results = await db.query(`
        SELECT * FROM custom_traits
        WHERE id = $1`,
        [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No trait id: ${id}`);
        };
        return new Trait(results.rows[0]);
    }
}

module.exports = Trait;