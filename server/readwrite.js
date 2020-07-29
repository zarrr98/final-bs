// const fs = require('fs')

// let jsonData = null;
// readData = () => {
//   if (!jsonData) {
//     jsonData = JSON.parse(fs.readFileSync('./data.json'));
//   }

//   return jsonData;
// }


// writeData = (data) => {
//   readData();
//   jsonData.features.push(data);
//   //console.log('%%% ', jsonData.features[jsonData.features.length-1].geometry.coordinates[0][0])
//   fs.writeFileSync('./data.json', JSON.stringify(jsonData))
// }


// module.exports.readData = readData
// module.exports.writeData = writeData  