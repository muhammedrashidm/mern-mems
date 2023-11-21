import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import postRoutes from './routes/posts.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

const port = 8080


const app = express()

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()

})

app.use('/posts', postRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)


mongoose.connect('mongodb://localhost:27017/memories').then(result => {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

}).then(e => { console.log(e) })

