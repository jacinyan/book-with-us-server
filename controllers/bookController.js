const books = require('../data/books')

exports.getBooks = async (req, res) => {
    res.json(books)
}

exports.getBookById = async (req, res) => {
    const book = books.find(book => req.params.id === book._id)
    res.json(book)
}

