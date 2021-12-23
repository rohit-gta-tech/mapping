const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require("path")

if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config()
}

const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users')

app.use(express.json())

mongoose.connect(process.env.MONGO_URI, { usenewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Mongo DB connected'))
.catch(error => console.log(error))

app.use('/api/pins', pinRoute)
app.use('/api/users', userRoute)

app.use(express.static(path.join(__dirname, '../frontend/build')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
})

app.listen(process.env.PORT, () => {
    console.log(`Backend server is running on port: ${process.env.PORT}!`)
})