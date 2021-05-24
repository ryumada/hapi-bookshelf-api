/**
 * This file contains test function
 */

/* ---------------------------- require packages ---------------------------- */
// data file
const dataJson = require('./_dataJson');

/* -------------------------------- handlers -------------------------------- */
const main = (request, h) => {
  const response = h.response({
    status: 'success',
    message: 'berhasil',
    data: {
      test: 'test',
    },
  });
  response.code(200);

  return response;
};
// delete function discontinued
const deleteFile = (request, h) => {
  // ambil parameter
  const { params } = request;

  const response = h.response({
    status: 'success',
    message: 'berhasil',
    // data: data.testData,
    params,
  });
  response.code(200);

  return response;
};
const readFile = (request, h) => {
  const response = h.response({
    status: 'success',
    message: 'berhasil',
    data: dataJson.data.testData,
  });
  response.code(200);

  return response;
};
const writeFile = (request, h) => {
  const { key1, key2 } = request.payload; // ambil data request
  const paramsTaken = request.params; // ambil parameter jika ada
  // buat data
  const dataTaken = {
    key1,
    key2,
    updatedAt: Date(),
  };

  // masukkan testData ke data
  dataJson.data.testData.push(dataTaken);
  // replace main data dengan data terbaru
  dataJson.replace(dataJson.data);

  // biar nunggunya ga lama, sebenernya malah bikin kesalahan cuma buat sementara gini dulu
  // BAHAYA, takutnya file JSON nya gagal, tapi hapi udh ngasih respon sukses aja
  const response = h.response({
    status: 'success',
    message: 'berhasil',
    data: dataJson.data.testData,
    params: paramsTaken,
  });

  response.code(200);
  return response;
};

/* ------------------------ collect all test function ----------------------- */
const test = {
  main,
  deleteFile,
  readFile,
  writeFile,
};

module.exports = test;
