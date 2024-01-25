
class Character{
    constructor(charSQL){
        this.id = charSQL.id;
        this.creatorID = charSQL.creatorID;
        this.name = charSQL.name;
        this.race = charSQL.race;
        this.subrace =charSQL.subrace;
        this.class = charSQL.class;
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

        this.profBonus; //To be calc'd later from class progression
        this.savingProfs = charSQL.savingProfs.split('_');
        this.skillProfs = charSQL.skillProfs.split('_');
        this.jackOfAllTrades; //To be calc'd based on skill profs
        this.passPerc = this.wisMod + 10;

        this.speed; //basespeed from race + (dexmod * 5)
        this.initiative = this.dexMod
        this.armorClass = 10 + this.dexMod //add armor bonuses later
        this.hpMax = charSQL.hpMax;
        this.hpCurr = charSQL.hpCurr;
        this.hpTemp = charSQL.hpTemp;
        this.hitDice; //come from class
        this.hitDiceMax = this.level;
        this.hitDiceCurr = charSQL.hitDiceCurr;
        this.deathSaveSuccess = charSQL.deathSaveSuccess;
        this.deathSaveFail = charSQL.deathSaveFail;
        this.altResources = charSQL.altResources //Convert from string to list of objects

        this.personality = charSQL.personality;
        this.ideals = charSQL.ideals;
        this.bonds = charSQL.bonds;
        this.flaws = charSQL.flaws;

        this.traits = charSQL.traits.split('_'); //redo later to turn each into a trait object
        this.languages = charSQL.languages.split('_');
        this.equipProfs = charSQL.equipProfs.split('_');

        this.equipment = charSQL.equipment.split('_'); //Redo to convert into equipment objects with name and number
        this.copper = charSQL.copper;
        this.silver = charSQL.silver;
        this.gold = charSQL.gold;

        this.attacks = charSQL.attacks.split('_') //Redo to convert into atk objects, pull from db and spell list
        this.spellAbility = charSQL.spellAbility;
        this.spellSaveDC = charSQL.spellSaveDC;
        this.spellAtkBonus = charSQL.spellAtkBonus;

        this.cantrips = charSQL.cantrips.split('_'); //All lists of spells should be converted to objects
        this.levelOne = charSQL.levelOne.split('_');
        this.levelOneLeft = charSQL.levelOneLeft;
        this.levelTwo = charSQL.levelTwo.split('_');
        this.levelTwoLeft = charSQL.levelTwoLeft;
        this.levelThree = charSQL.levelThree.split('_');
        this.levelThreeLeft = charSQL.levelThreeLeft;
        this.levelFour = charSQL.levelFour.split('_');
        this.levelFourLeft = charSQL.levelFourLeft;
        this.levelFive = charSQL.levelFive.split('_');
        this.levelFiveLeft = charSQL.levelFiveLeft;
        this.levelSix = charSQL.levelSix.split('_');
        this.levelSixLeft = charSQL.levelSixLeft;
        this.levelSeven = charSQL.levelSeven.split('_');
        this.levelSevenLeft = charSQL.levelSevenLeft;
        this.levelEight = charSQL.levelEight.split('_');
        this.levelEightLeft = charSQL.levelEightLeft;
        this.levelNine = charSQL.levelNine.split('_');
        this.levelNineLeft = charSQL.levelNineLeft;

        this.age = charSQL.age;
        this.height = charSQL.height;
        this.weight = charSQL.weight;
        this.backstory = charSQL.backstory;
        this.appearance = charSQL.appearance;
        this.allies = charSQL.allies;

    }
}