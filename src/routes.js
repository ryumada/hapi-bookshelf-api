/* ---------------------------- require handlers ---------------------------- */
const test = require('./handlers/test'); // test handler
// main handler
const {
  addBook,
  deleteBook,
  editBook,
  getBook,
  getBookById,
} = require('./handler');

/* --------------------------------- routes --------------------------------- */
const routes = [
  // main route
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBook,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook,
  },

  // test route
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
