const express = require('express')
const router = express.Router()
const { authUser, registerUser } = require('../controllers/userController')

router.get('/', authUser)
router.post('/register', registerUser)

module.exports = router