const path = require('path'); 
const factFile = path.resolve(__dirname, 'foodfacts.txt');

const foodFacts = [];

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(factFile)
});

lineReader.on('line', (line) => {
    if (line[0] !== "#") foodFacts.push(line)
});

module.exports = function () { 
    return foodFacts[Math.floor(Math.random()*foodFacts.length)];
}