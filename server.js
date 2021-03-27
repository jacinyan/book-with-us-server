const { readdirSync } = require('fs')
const express = require('express')
const morgan = require('morgan')
const connectDB = require('./db')
const cors = require('cors')

const app = express()

require('dotenv').config({ path: '.env' })

connectDB()

// middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// dynamic routing
readdirSync('./routes').map(r => app.use('/api', require(`./routes/${r}`)))


const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
})