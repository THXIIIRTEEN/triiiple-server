const fs = require('fs');

const writeFile = (data) => {

    const dataObject = JSON.stringify(data)

    fs.appendFile('./data/users.json', dataObject, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log('zaebis')
}})
}

module.exports = writeFile;