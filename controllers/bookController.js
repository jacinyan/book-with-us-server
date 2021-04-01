const Book = require('../models/bookModel')


// @desc     Fetch all books
// @route    GET /api/books
// @access   Public
exports.getBooks = async (req, res, next) => {
    try {
        const books = await Book.find({})

        res.json(books)
    } catch (error) {
        next(error)
    }
}

// @desc     Fetch single book
// @route    GET /api/book/:id
// @access   Public
exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
        if (book) {
            res.status(200).json(book)
        } else {
            res.status(404)
            throw new Error('Book not found')
        }

    } catch (error) {
        next(error)
    }
}

