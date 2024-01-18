


// const db = require('../db);
// const {BadRequestError, NotFoundError, ExpressError } = require('../expressError');
const { NotFoundError } = require('../expressError');
const {characterToSQL, sqlToCharacter, sqlForUpdate} = require('../helpers');

class Character {
    /** Create a character from data, add to db, return just the ID if successful
     * Since the only thing changing is an ID being added, to save time the server
     * will only return the ID number on success instead of the whole data to be parsed
     * 
     */

    static async post(newCharacter){
        //Helper function to convert the object into a SQL string
        //NEED TO FIGURE OUT WHAT CHARTOSQL WILL DO AND 
        const [sqlNames, sqlNumbers, dataToAdd] = characterToSQL(newCharacter);
        const results = await db.query(`
            INSERT INTO characters
            ${sqlNames}
            VALUES ${sqlNumbers}
            RETURNING id`,
            dataToAdd);

        return results.rows[0];
    }

    /**
     * Get all characters
     * Returns only name, class, level, and race
     * ADMIN ONLY
     */
    static async getAll(){
        const results = await db.query(`
        SELECT id, name, class, level, race
        FROM characters`);
        return results.rows;
    }

    /**
     * Get a list of characters and return a small amount of details
     * Intended to be used to list characters on a users profile
     * 
     */
    static async getList(userID){
        const results = await db.query(`
        SELECT id, name, class, level, race
        FROM characters
        WHERE creator_ID = $1`,
        [userID]);

        return results.rows;
    }


    /**
     * Get a specific character from the database by id
     * Some data manipulation is done to convert from strings to lists
     * This does not make any external api calls
     */
    static async getDetails(id){
        const results = await db.query(`
            SELECT * FROM characters
            WHERE id=$1`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No character id: ${id}`);
        }
        let character = sqlToCharacter(results.rows[0]);
        return character;
    }

    /**
     * Update a character in the database
     * Current plan is to update everything regardless of changes
     *  In the future, find a way to only update data that's changed.
     * USE CHARTOSQL WITH SQLFORUPDATE
     */
    static async patch(id, data){
        const {setCols, values, lastIdx} = sqlForUpdate(data)
        const query = `UPDATE characters
                        SET ${setCols}
                        WHERE id = ${lastIdx}
                        RETURNING id`;
        const results = await db.query(query, [...values, id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No character id: ${id}`);
        };
        return results.rows[0];
        
    }

    /**
     * Delete a character 
     */
    static async delete(id){
        const results = await db.query(`
            DELETE FROM characters
            WHERE id=$1
            RETURNING id`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No character id: ${id}`)
        }
    }

}
module.exports = Character;