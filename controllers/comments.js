const router = require('express').Router()
const middleware = require('../utils/middleware')
const { Blog, User, Comment } = require('../models/index')

router.get('/', async (req, res) => {
    const comments = await Comment.findAll({
        include: [{
            model: User,
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
        },{
            model: Blog,
            attributes: {exclude:['userId', 'likes', 'url', 'author']}
        }]
    })
    res.json(comments)
})
  
router.post('/', middleware.userExtractor, async (req, res) => {
    const body = req.body
    const user = req.user
    const comment = await Comment.create({
        comment: body.comment,
        userId: user.id,
        blogId: body.blogID
    })
    const populatedComment = await Comment.findByPk(comment.id, {
        include: [{
            model: User,
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
        },{
            model: Blog,
            attributes: {exclude:['userId', 'likes', 'url', 'author']}
        }]
    })
    res.status(201).json(populatedComment)
})

router.delete('/:id', middleware.userExtractor, async (req, res) => {
    const comment = await Comment.findByPk(req.params.id)
    if(comment.userId !== req.user.id) throw Error('Access denied')

    await comment.destroy()

    return res.status(204).end()
})

module.exports = router