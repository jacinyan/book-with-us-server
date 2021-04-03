const mongoose = require('mongoose')

exports.connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/books-r-us', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
        console.log(`MongoDB ${connect.connection.host} is connected`.cyan.underline);
    } catch (error) {
        console.log(`Error: ${error}`.red.underline.bold);
        process.exit(1)
    }
}

