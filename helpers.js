//Coverts attr's of the object from sql data format to proper js format
//Export to helpers
function sqlToCharacter(results){
    results.savingProfs = results.savingProfs.split('_');
    results.skillProfs = results.skillProfs.split('_');
    results.traits = results.traits.split('_');
    results.languages = results.languages.split("_");
    results.equipProfs = results.equipProfs.split("_");
    results.equipment = results.equipment.split("_").map(item => 
        ({name : item.split('-')[0], amount : item.split('-')[1]}));
    results.attacks = results.attacks.split("_");
    results.cantrips = results.cantrips.split("_");
    results.levelOne = results.levelOne.split("_");
    results.levelTwo = results.levelTwo.split("_");
    results.levelThree = results.levelThree.split("_");
    results.levelFour = results.levelFour.split("_");
    results.levelFive = results.levelFive.split("_");
    results.levelSix = results.levelSix.split("_");
    results.levelSeven = results.levelSeven.split("_");
    results.levelEight = results.levelEight.split("_");
    results.levelNine = results.levelNine.split("_");
    
    return results;
}

//Converts attr's of the object from js arrays/objects to sql format
//Export to helpers
function characterToSQL(character){
    //TODO
}

//Export to helpers
function sqlForUpdate(data){
    const keys = Object.keys(data);
    if (keys.length === 0) throw new BadRequestError("No data");
  
    // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
    const cols = keys.map((colName, idx) =>
        `"${colName}"=$${idx + 1}`,
    );
      
    return {
        setCols: cols.join(", "),
        values: Object.values(data),
        lastIdx: "$"+(values.length +1);
    };
}

module.exports = {
    sqlToCharacter,
    characterToSQL,
    sqlForUpdate
}