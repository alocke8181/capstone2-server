const db = require('../db');

const {NotFoundError, UnauthorizedError, BadRequestError} = require('../expressError');
const {sqlForUpdate} = require('../helpers/sql');
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../config');

class User{

    /**
     * Authenticate a user with username and password
     */

    static async authenticate(username, password){
        const result = await db.query(
            `SELECT * from users
            WHERE username = $1`,
            [username]);
        const user = result.rows[0];
        if(user){
            const valid = await bcrypt.compare(password, user.password);
            if(valid){
                delete user.password;
                return user;
            };
        };
        throw new UnauthorizedError('Invalid username/password');
    };

    /**
     * Make a new user
     * Returns full user object
     */
    static async post({username, password, email, isAdmin}){
        const dupeCheck = await db.query(`
            SELECT username FROM users WHERE username = $1`,
            [username]);
        if(dupeCheck.rows[0]){
            throw new BadRequestError(`Duplicate user: ${username}`);
        }

        const hashPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(`
            INSERT INTO users
            (username, password, email, isAdmin)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, isAdmin`,
            [username, password, email, isAdmin]);

        const user = result.rows[0];
        return user;
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
        const password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        const email = data.email;
        const results = await db.query(`
            UPDATE users
            SET password = $1, email = $2
            WHERE id = $3
            RETURNING id, username, email, isAdmin`,
            [password, email, id]);
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