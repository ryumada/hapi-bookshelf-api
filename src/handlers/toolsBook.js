// map books array to have id, name, and publisher only
const mapBook = (books) => {
  const bookMapped = books.map((book) => {
    const { id, name, publisher } = book;
    return {
      id, name, publisher,
    };
  });

  return bookMapped;
};

const toolsBook = {
  mapBook,
};

module.exports = toolsBook;
