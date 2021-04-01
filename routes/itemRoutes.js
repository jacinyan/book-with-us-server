const express = require('express')
const router = express.Router()
const { getItems, getItemById } = require('../controllers/itemController')


router.get('/items', getItems)
router.get('/items/:id', getItemById)


module.exports = router