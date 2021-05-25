/* ---------------------------- require packages ---------------------------- */
const { nanoid } = require('nanoid');
const toolsBook = require('./handlers/toolsBook'); // tools used to help manage books
// data JSON module
const dataJson = require('./handlers/_dataJson');

// tambahkan buku ke api
const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // jika tidak ada nama buku, maka response 400
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  // jika client melampirkan readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  try {
    const id = nanoid(16);
    const bookNew = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: (pageCount === readPage),
      reading,
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // masukkan ke data json
    dataJson.data.bookData.push(bookNew);
    // replace main data dengan data terbaru
    dataJson.replace(dataJson.data);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  } catch (e) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);

    return response;
  }
};

// menghapus buku
const deleteBook = (request, h) => {
  const { bookId } = request.params;
  // cari index buku menggunakan id
  const bookIndex = dataJson.data.bookData.findIndex((book) => book.id === bookId);
  // cek apa buku ada?, kalo ada hapus bukunya
  if (bookIndex !== -1) {
    // delete book
    dataJson.data.bookData.splice(bookIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  // kebalikan gagal respon message
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// mengedit buku
const editBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // jika tidak ada nama buku, maka response 400
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  // jika client melampirkan readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  const { bookId } = request.params;
  // cari buku menggunakan id
  const bookIndex = dataJson.data.bookData.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    // edit with updated data
    dataJson.data.bookData[bookIndex] = {
      ...dataJson.data.bookData[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };
    // replace main data dengan data terbaru
    dataJson.replace(dataJson.data);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);

    return response;
  }

  // send response
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

// tampilkan buku yang ada di api
const getBook = (request, h) => {
  const { finished, name, reading } = request.query; // ambil query parameter
  // ubah parameter jadi boolean
  let response = null;
  // cek apa ada query parameter reading
  if (reading !== undefined) {
    // ubah query parameter jadi boolean
    const isReading = Boolean(Number(reading));
    // filter buku yang dibaca aja
    let books = dataJson.data.bookData.filter((bookFilter) => bookFilter.reading === isReading);

    if (!books) {
      // send response
      response = h.response({
        status: 'fail',
        message: 'Buku yang sedang dibaca, tidak ditemukan',
      });
      response.code(404);

      return response;
    }
    // map the book
    books = toolsBook.mapBook(books);

    // send response
    response = h.response({
      status: 'success',
      reading: reading,
      data: {
        books,
      },
    });
  } else if (finished !== undefined) { // jika ada parameter finished dan bernilai true
    // ubah query parameter jadi boolean
    const isFinished = Boolean(Number(finished));
    // filter buku yang sudah selesai saja
    let books = dataJson.data.bookData.filter((bookFilter) => bookFilter.finished === isFinished);

    if (!books) {
      // send response
      response = h.response({
        status: 'fail',
        message: 'Buku yang sudah selesai, tidak ditemukan',
      });
      response.code(404);

      return response;
    }
    // map the book
    books = toolsBook.mapBook(books);

    // send response
    response = h.response({
      status: 'success',
      finished: finished,
      data: {
        books,
      },
    });
  } else if (name !== undefined) { // jika ada parameter name
    // filter buku yang sudah selesai saja
    let books = dataJson.data.bookData.find((bookFilter) => bookFilter.name === name);

    if (books === []) {
      // send response
      response = h.response({
        status: 'fail',
        message: `Buku dengan nama "${name}", tidak ditemukan`,
      });
      response.code(404);

      return response;
    }
    // map the book
    books = toolsBook.mapBook(books);

    // send response
    response = h.response({
      status: 'success',
      name: name,
      data: {
        books,
      },
    });
  } else {
    // map array to have id, name, and publisher only
    const books = toolsBook.mapBook(dataJson.data.bookData);

    // send response
    response = h.response({
      status: 'success',
      part: 'all',
      data: {
        books,
      },
    });
  }
  response.code(200);

  return response;
};
const getBookById = (request, h) => {
  const { bookId } = request.params;
  // cari buku menggunakan id
  const book = dataJson.data.bookData.filter((bookFilter) => (bookFilter.id === bookId))[0];

  // jika buku tidak ditemukan
  if (!book) {
    // send response
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
  }

  // send response
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);

  return response;
};

/* ---------------------------- export all modules -------------------------- */
module.exports = {
  addBook,
  deleteBook,
  editBook,
  getBook,
  getBookById,
};
