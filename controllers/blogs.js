
const router = require('express').Router()
const { Op } = require('sequelize')
const middleware = require('../utils/middleware')
const { Blog, User, Comment } = require('../models')

router.get('/', async (req, res) => {
    let where = {}

    if (req.query.search) {
        where = {
            [Op.or]: [
                {
                    title: {
                        [Op.iLike]: '%' + req.query.search + '%'
                    }
                }, {
                    author: {
                        [Op.iLike]: '%' + req.query.search + '%'
                    }
                }
            ]
        }
    }

    const blogs = await Blog.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [{
            model: User,
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
        }, {
            model: Comment,
            attributes: ['comment', 'id', 'createdAt'],
            include: {
                model: User,
                attributes: ['name', 'id']
            }
        }],
        where
    })
    res.json(blogs)
})

router.post('/', middleware.userExtractor, async (req, res) => {
    const blog = {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: 0,
        userId: req.user.id
    }
    try {
        const newBlog = await Blog.create(blog)
        const populatedBlog = await Blog.findByPk(newBlog.id, {
            include: [{
                model: User,
                attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
            }, {
                model: Comment,
                attributes: ['comment', 'id', 'createdAt'],
                include: {
                    model: User,
                    attributes: ['name', 'id']
                }
            }]
        })
        res.status(201).json(populatedBlog)
    } catch(error) {
        throw Error('Bad request')
    }
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id, {
        include: [{
            model: User,
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
        }, {
            model: Comment,
            attributes: ['comment', 'id', 'createdAt'],
            include: {
                model: User,
                attributes: ['name', 'id']
            }
        }]
    })
    res.json(blog)
})
  
router.delete('/:id', middleware.blogFinder, middleware.userExtractor, async (req, res) => {
    if(req.blog.userId !== req.user.id) throw Error('Access denied')
    await req.blog.destroy()
    res.status(204).end()
})
  
router.put('/:id', middleware.blogFinder, middleware.userExtractor, async (req, res) => {
    req.blog.likes = req.blog.likes + 1
    await req.blog.save()

    const blog = await Blog.findByPk(req.blog.id, {
        include: [{
            model: User,
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
        }, {
            model: Comment,
            attributes: ['comment', 'id', 'createdAt'],
            include: {
                model: User,
                attributes: ['name', 'id']
            }
        }]
    })

    res.json(blog)
})

module.exports = router