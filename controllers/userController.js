const User = require('../models/userModel')

exports.authUser = (req, res) => {
    res.send('ok')
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        // password < 6
        if (!password || password.length < 6) {
            res.status(400)
            throw new Error('Password must be at least 6 chars long  ')
        }

        // if exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            res.status(400)
            throw new Error('User already exists')
        }

        // if doesn't exist, create
        const user = await User.create({
            username,
            email,
            password,
        })
        console.log(user)

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        } else {
            res.status(400)
            throw new Error('Invalid user data')
        }

    } catch (error) {
        res.json({errorMsg: error.message})
    }
}

