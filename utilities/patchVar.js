const overwriteTable = (table, kwargs) => {
    for(let [key, value] of Object.entries(kwargs)) {
        if(value) table[key] = value;
    }
}

module.exports = overwriteTable;