const User = require('../models/userModel')

exports.authUser = (req, res) => {
    res.send('ok')
} 

exports.registerUser = async (req, res) => {
    const {username, email, password} = req.body
    
}