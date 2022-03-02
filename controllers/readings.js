const router = require('express').Router()
const { Op } = require('sequelize')
const middleware = require('../utils/middleware')
const { Blog, User, UserBlogs } = require('../models')

router.post('/', middleware.userExtractor, async (req, res) => {
    if(req.user.id !== req.body.userId) throw Error('Access denied')
    
    const blog = await Blog.findByPk(req.body.blogId)

    if(!blog) throw Error('Blog not found')

    const reading = await UserBlogs.create({blogId: req.body.blogId, userId: req.body.userId})
    return res.json(reading)
})

router.delete('/', middleware.userExtractor, async(req, res) => {
    if(req.user.id !== req.body.userId) throw Error('Access denied')
    
    const blog = await Blog.findByPk(req.body.blogId)

    if(!blog) throw Error('Blog not found')

    const reading = await UserBlogs.findOne({
        where: {
            [Op.and]: [{
                    userId: req.user.id
                }, {
                    blogId: req.body.blogId
                }
            ]
        }
    })

    if(!reading) throw Error('Reading not found')

    await reading.destroy()

    return res.status(204).end()
})

module.exports = router
