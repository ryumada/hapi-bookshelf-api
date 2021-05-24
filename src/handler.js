/* ---------------------------- require packages ---------------------------- */
const { nanoid } = require('nanoid');
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
  // map array to have id, name, and publisher only
  const books = dataJson.data.bookData.map((book) => {
    const { id, name, publisher } = book;
    return {
      id, name, publisher,
    };
  });

  // send response
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
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
