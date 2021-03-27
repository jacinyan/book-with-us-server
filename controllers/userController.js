const User = require('../models/userModel')

exports.authUser = (req, res) => {
    res.send('ok')
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        
        // password < 6
        if (password && password.length < 6) {
            throw new Error('Password is 6 characters minimum')
        }

        // if user exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            throw new Error('User already exists')
        }

        // if user doesn't exist, create
        const user = await User.create({
            username,
            email,
            password,
        })

        // final validation
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
            })
        }

    } catch (error) {
        if(error.errors){
            res.status(400).send('Invalid user data')
            return
        };
        res.status(400).send(error.message)
    }
}

