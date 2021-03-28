const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/books-r-us', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
        console.log(`MongoDB ${connect.connection.host} is connected`);
    } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1)
    }
}

module.exports = connectDB