const express = require('express')
const router = express.Router()
const { getBooks, getBookById } = require('../controllers/bookController')


router.get('/books', getBooks)
router.get('/books/:id', getBookById)


module.exports = router