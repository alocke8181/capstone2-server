const db = require('../db');
const {NotFoundError} = require('../expressError')
const {sqlForUpdate, sqlForPost} = require('../helpers/sql');

class Attack{

    constructor(data){
        this.id = data.id;
        this.charID = data.charid;
        this.name = data.name;
        this.attackSkill = data.attackskill;
        this.attackMod = data.attackmod;
        this.isProf = data.isprof;
        this.dmgDice = data.dmgdice;
        this.numDice = data.numdice;
        this.dmgSkill = data.dmgskill;
        this.dmgMod = data.dmgmod;
        this.dmgType = data.dmgtype;
        this.altDmgDice = data.altdmgdice;
        this.altNumDice = data.altnumdice;
        this.altDmgSkill = data.altdmgskill;
        this.altDmgMod = data.altdmgmod;
        this.altDmgType = data.altdmgtype;
        this.description = data.description;
        this.savingSkill = data.savingskill;
        this.savingEffect = data.savingeffect;
        this.range = data.range;
    };

    static async get(id){
        console.log('\u001b[32m INTERNAL','\u001b[31m GET ATTACK \u001b[0m',id);
        const results = await db.query(`
            SELECT * FROM custom_attacks
            WHERE id=$1`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No attack id: ${id}`);
        };
        return new Attack(results.rows[0]);
    };

    static async post(data){
        const [keyString, indeces, values] = sqlForPost(data)
        const results = await db.query(`
            INSERT INTO custom_attacks
            ${keyString}
            VALUES ${indeces}
            RETURNING *`,
            [...values]);
        return new Attack(results.rows[0]);
    };

    static async patch(data){
        const id = data.id;
        delete data.id;
        const {setCols, values} = sqlForUpdate(data);
        const lastIdx = '$' + (values.length+1);
        const results = await db.query(`
            UPDATE custom_attacks
            SET ${setCols}
            WHERE id = ${lastIdx}
            RETURNING *`,
            [...values, id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No attack id: ${id}`);
        };
        return new Attack(results.rows[0]);
    };

    static async delete(id){
        const results = await db.query(`
            DELETE FROM custom_attacks
            WHERE id = $1
            RETURNING id`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No trait id: ${id}`);
        };
        return results.rows[0].id;
    }

    
};

module.exports = Attack;