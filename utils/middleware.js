const { Blog, User } = require('../models')
const { SECRET } = require('./config')
const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    } else {
        return null
    }
}

const userExtractor = async (req, res, next) => {
    const token = tokenExtractor(req)
    if(token) {
        const decodedToken = jwt.verify(token, SECRET)
        if (!decodedToken.id) throw Error('Invalid token')
        req.user = await User.findByPk(decodedToken.id, {
            attributes: {exclude: ['password']},
            include: {
                model: Blog
            }
        })
    } else throw Error('Missing token')
    next()
}

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id, {
        include: {
            model: User,
            attributes: {exclude: ['password']}
        }
    })
    console.log("BLOG", req.blog)
    if(!req.blog) throw Error('Blog not found')
    next()
}

const errorHandler = (err, req, res, next) => {
    if (err.message === 'Access denied') {
        res.status(403).json({ error: err.message })
    } else if (err.message === 'Blog not found' || err.message === 'User not found' || err.message === 'Reading not found') {
        res.status(404).json({ error: err.message })
    } else if (err.message === 'Bad request') {
        res.status(400).json({ error: err.message })
    } else if(err.message === 'Invalid username or password' || err.message === 'Missing token' || err.message === 'Token invalid') {
        res.status(401).json({ error: err.message })
    }

    next(err)
}

module.exports = {
    blogFinder,
    errorHandler,
    userExtractor,
}