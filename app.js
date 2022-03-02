require('express-async-errors')
const middleware = require('./utils/middleware')
const cors = require('cors')
const express = require('express')
const app = express()

const { connectToDatabase } = require('./utils/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const readingRouter = require('./controllers/readings')
const commentsRouter = require('./controllers/comments')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readings', readingRouter)
app.use('/api/comments', commentsRouter)

app.use(middleware.errorHandler)

const start = async () => {
    await connectToDatabase()
    console.log(`Connected to database`)
}

start()

module.exports = app