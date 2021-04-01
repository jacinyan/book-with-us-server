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
        isAdmin : {
            type: Boolean,
            required: true,
            default: false
        }
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
        next(error)
    }
})

//compare hashed password in db and entered password
userSchema.methods.matchPassword = async function (enteredPassword, next) {
    try {
        const match =  await bcrypt.compare(enteredPassword, this.password)
        return match
    } catch (error) {
       next(error)
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User