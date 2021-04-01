const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewSchema = new Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
},
    {
        timestamps: true
    }
)

const bookSchema = new Schema(
    {
        user: {
            // info: mongoose.Schema.Types.Mixed 
            // determine which admin creates the book product by the userID
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        image: {
            type: String,
        },
        author: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        // array of review objects
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true,
    }
)

const Book = mongoose.model('Book', bookSchema)

module.exports = Book