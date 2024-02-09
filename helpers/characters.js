
/**
 * Static function to split a string or return null
 *  
 */
function splitOrEmpty(property){
    if(!property || property === '' || property.length === 0){
        return [];
    }else{
        return property.split('_');
    };
};

module.exports = {
    splitOrEmpty
}