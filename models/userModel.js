const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        stripe_account_id: '',
        stripe_seller: {},
        stripeSession: {}
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', async function (next) {
    try {
        // this ==> user instance
        // only hash the password if it has been modified (or is new)
        if (!this.isModified('password')) {
           return next()
        }

        // generate a salt
        const salt = await bcrypt.genSalt(10)
        // hash the password along with our new salt
        const hash = await bcrypt.hash(this.password, salt);
        // override the cleartext password with the hashed one
        this.password = hash;

        next()
    } catch (error) {
        return next(error)
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User