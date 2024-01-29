const db = require('../db');
const {NotFoundError} = require('../expressError')

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
        this.altDmgSkill = data.altdmgskill;
        this.altDmgMod = data.altdmgmod;
        this.altDmgType = data.altdmgtype;
        this.description = data.description;
        this.savingSkill = data.savingskill;
        this.savingEffect = data.savingeffect;
    };

    static async get(attack){
        let id = attack.split('-')[1];
        const results = await db.query(`
            SELECT * FROM custom_attacks
            WHERE id=$1`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No attack id: ${id}`);
        };
        return new Attack(results.rows[0]);
    };
};

module.exports = Attack;