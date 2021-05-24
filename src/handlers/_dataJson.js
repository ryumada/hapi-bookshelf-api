const fs = require('fs');

/* ----------------------------- ambil data JSON ---------------------------- */
const { fileLocation, newData } = require('../../initial'); // json file location
// json file not found?, create file
if (!fs.existsSync(fileLocation)) {
  const dataString = JSON.stringify(newData, null, 2);
  // create file using sychronous
  fs.writeFileSync(fileLocation, dataString, (e) => {
    // if error throw error
    if (e) throw e;
    // file successfully created
  });
}
// const rawdata = fs.readFileSync(path.resolve(__dirname, '../_data.json'));
const rawdata = fs.readFileSync(fileLocation);
const data = JSON.parse(rawdata);

// to replace with the new data and update the json file
const replace = (replacedData) => {
  // masukkan data ke file json
  const dataString = JSON.stringify(replacedData, null, 2);
  // biar bisa langsung kasih respon dibawahnya, pake asynchronous, responnya di handler
  fs.writeFileSync(fileLocation, dataString, (e) => {
    // if error throw error
    if (e) throw e;
    // file successfully replaced
  });
};

module.exports = {
  data,
  fileLocation,
  replace,
};
