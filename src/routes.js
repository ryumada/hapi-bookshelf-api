/* ---------------------------- require handlers ---------------------------- */
// const { } = require('./handler');
const test = require('./handlers/test'); // test handler

/* --------------------------------- routes --------------------------------- */
const routes = [
  {
    method: 'GET',
    path: '/',
    handler: test.main,
  },
  {
    method: 'GET',
    path: '/testFile',
    handler: test.readFile,
  },
  {
    method: 'POST',
    path: '/testFile',
    handler: test.writeFile,
  },
  {
    method: 'DELETE',
    path: '/testFile/{key1}',
    handler: test.deleteFile,
  },
  {
    method: 'POST',
    path: '/testFileParams/{id}',
    handler: test.writeFile,
  },
];

/* ---------------------------- export all modules -------------------------- */
module.exports = routes;
