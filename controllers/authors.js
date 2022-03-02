
const router = require('express').Router()
const { sequelize } = require('../utils/db')
const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: [
            'author', 
            [sequelize.literal(`COUNT(case blog.author when author then 1 else null end)`), 'articles'],
            [sequelize.literal(`SUM(case blog.author when author then blog.likes else null end)`), 'likes']
        ],
        group: ['author']
    })

    res.json(blogs)
})

module.exports = router