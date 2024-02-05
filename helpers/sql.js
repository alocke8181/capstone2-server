const {BadRequestError} = require('../expressError')

//Export to helpers
function sqlForUpdate(data){
    const keys = Object.keys(data);
    if (keys.length === 0) throw new BadRequestError("No data");

    // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
    const cols = keys.map((colName, idx) =>
        `"${colName.toLowerCase()}"=$${idx + 1}`,
    );

    return {
        setCols: cols.join(", "),
        values: Object.values(data),
    };
}

function sqlForPost(data){
    const keys = Object.keys(data);
    let keystring = [];
    let values = [];
    let indeces = [];
    let i = 1;
    keys.forEach((key)=>{
        let value = data[key];
        keystring.push(key.toLowerCase());
        values.push(value);
        indeces.push("$" + i.toString());
        i++;
    });
    return [
        "(" + keystring.join(', ') + ")",
        "(" + indeces.join(', ') + ")",
        values
    ]
}

module.exports = {sqlForUpdate, sqlForPost};