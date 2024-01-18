const db = require('../db');

const {NotFoundError} = require('../expressError');
const {sqlForUpdate} = require('../helpers');

class User{

    /**
     * Make a new user
     * Returns full user object
     */
    static async post(newUser){
        const [sqlNames, sqlNumbers, dataToAdd] = userToSQL(newUser)
        const results = await db.query(`
            INSERT INTO users
            ${sqlNames}
            VALUES ${sqlNumbers}
            RETURNING *`,
            dataToAdd);
        return results.rows[0]
    };

    /**
     * Get all users
     * ADMIN ONLY
     */
    static async getAll(){
        const results = await db.query('SELECT * FROM users');
        return results.rows;
    };

    /**
     * Get a user info by their id
     * Returns all user info
     * This does not include their character list
     */
    static async get(id){
        const results = await db.query(`
            SELECT * FROM users
            WHERE id = $1`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No user id: ${id}`);
        };
        return results.rows[0];
    };

    static async patch(id, data){
        const {setCols, values, lastIdx} = sqlForUpdate(data);
        const results = await db.query(`
            UPDATE users
            SET ${setCols}
            WHERE id = ${lastIdx}
            RETURNING *`,
            [...values, id]);
        if(!results.rows[0]){
            throw new NotFoundError(`Could not update no id: ${id}`);
        }
        return results.rows[0];
    };

    static async delete(id){
        const results = await db.query(`
            DELETE FROM users
            WHERE id=$1
            RETURNING id`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No user id: ${id}`);
        };
    };

};

module.exports = User;