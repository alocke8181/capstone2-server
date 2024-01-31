


const db = require('../db');
const dndApi = require('../dndApi');
const {BadRequestError, NotFoundError, ExpressError } = require('../expressError');
const {characterToSQL, sqlToCharacter} = require('../helpers/characters');
const {sqlForUpdate} = require('../helpers/sql')

class Character {

    constructor(charSQL){
        this.id = charSQL.id;
        this.creatorID = charSQL.creatorid;
        this.charName = charSQL.charname;
        this.race = charSQL.race;
        this.subrace =charSQL.subrace;
        this.className = charSQL.classname;
        this.background = charSQL.background;
        this.alignment = charSQL.alignment;
        this.level = charSQL.level;
        this.exp = charSQL.exp;

        this.str = charSQL.strength;
        this.strMod = Math.floor((this.str -10)/2);
        this.dex = charSQL.dexterity;
        this.dexMod = Math.floor((this.dex -10)/2);
        this.con = charSQL.constitution;
        this.conMod = Math.floor((this.con -10)/2);
        this.int = charSQL.intelligence;
        this.intMod = Math.floor((this.int -10)/2);
        this.wis = charSQL.wisdom;
        this.wisMod = Math.floor((this.wis -10)/2);
        this.cha = charSQL.charisma;
        this.chaMod = Math.floor((this.cha -10)/2);

        this.profBonus = 0; //Calc'd from class level data
        this.savingProfs = charSQL.savingprofs.split('_') || null;
        this.skillProfs = charSQL.skillprofs.split('_') || null;
        this.jackOfAllTrades = false; //Calc'd from skills
        this.passPerc = this.wismMod + 10;

        this.speed = (this.dexMod * 5); //Calc'd from race data
        this.initiative = this.dexMod
        this.armorClass = charSQL.armorclass; 
        this.hpMax = charSQL.hpmax;
        this.hpCurr = charSQL.hpcurr;
        this.hpTemp = charSQL.hptemp;
        this.hitDice = 0; //Calc'd from class data
        this.hitDiceMax = this.level;
        this.hitDiceCurr = charSQL.hitdicecurr;
        this.deathSaveSuccess = charSQL.deathsavesuccess;
        this.deathSaveFail = charSQL.deathsavefail;
        this.altResources = charSQL.altresources; //Converted to objects

        this.personality = charSQL.personality;
        this.ideals = charSQL.ideals;
        this.bonds = charSQL.bonds;
        this.flaws = charSQL.flaws;

        this.traits = charSQL.traits; //Converted to objects and custom traits
        this.features = charSQL.features; //Converted to objects
        this.languages = charSQL.languages.split('_') || null;
        this.equipProfs = charSQL.equipprofs.split('_') || null;

        this.equipment = charSQL.equipment; //Converted to objects
        this.copper = charSQL.copper;
        this.silver = charSQL.silver;
        this.gold = charSQL.gold;

        this.attacks = charSQL.attacks; //Converted into atk objects, spells NOT included
        this.spellAbility = charSQL.spellability;
        this.spellSaveDC = charSQL.spellsavedc;
        this.spellAtkBonus = charSQL.spellatkbonus;

        this.cantripsKnown = 0;
        this.cantrips = charSQL.cantrips; //All lists of spells are converted to objects
        this.levelOne = charSQL.levelone;
        this.levelOneSlots = 0;
        this.levelOneLeft = charSQL.leveloneleft;
        this.levelTwo = charSQL.leveltwo;
        this.levelTwoSlots = 0;
        this.levelTwoLeft = charSQL.leveltwoleft;
        this.levelThree = charSQL.levelthree;
        this.levelThreeSlots = 0;
        this.levelThreeLeft = charSQL.levelthreeleft;
        this.levelFour = charSQL.levelFour;
        this.levelFourSlots = 0;
        this.levelFourLeft = charSQL.levelfourleft;
        this.levelFive = charSQL.levelfive;
        this.levelFiveSlots = 0;
        this.levelFiveLeft = charSQL.levelfiveleft;
        this.levelSix = charSQL.levelsix;
        this.levelSixSlots = 0;
        this.levelSixLeft = charSQL.levelsixleft;
        this.levelSeven = charSQL.levelseven;
        this.levelSevenSlots = 0;
        this.levelSevenLeft = charSQL.levelsevenleft;
        this.levelEight = charSQL.leveleight;
        this.levelEightSlots = 0;
        this.levelEightLeft = charSQL.leveleightleft;
        this.levelNine = charSQL.levelnine;
        this.levelNineSlots = 0;
        this.levelNineLeft = charSQL.levelnineleft;

        this.age = charSQL.age;
        this.height = charSQL.height;
        this.weight = charSQL.weight;
        this.backstory = charSQL.backstory;
        this.appearance = charSQL.appearance;
        this.allies = charSQL.allies;

    }



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
        SELECT id, creatorid, charname, race, classname, level, race
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
        SELECT id, charname, race, classname, level
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
    static async get(id){
        const results = await db.query(`
            SELECT * FROM characters
            WHERE id=$1`,
            [id]);
        if(!results.rows[0]){
            throw new NotFoundError(`No character id: ${id}`);
        }
        //Create a character object and return it
        //Route will then do some manipulation to get all the other info
        let character = new Character(results.rows[0]);
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