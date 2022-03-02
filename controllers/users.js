const bcrypt = require('bcrypt')
const middleware = require('../utils/middleware')
const router = require('express').Router()
const { User, Blog, Comment } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        attributes: {exclude: ['password']},
        include: [{
            model: Blog,
            attributes: {exclude: ['userId']}
        }, {
            model: Comment,
            attributes: {exclude: ['userId']}
        }]
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = {
        username,
        name,
        password: passwordHash,
    }

    try {
        const newUser = await User.create(user)
        res.status(201).json(newUser)
    } catch(error) {
        throw Error('Bad request')
    }
})

router.post('/:username', middleware.userExtractor, async (req, res) => {
    if(req.user.username !== req.params.username) throw Error('Access Denied')
    const newUsername = req.body.newUsername
    req.user.username = newUsername
    await req.user.save()

    res.json(req.user)
})

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        attributes: {exclude: ['password']},
        include: [{
                model: Blog,
                attributes: { exclude: ['userId'] }
            },
            {
                model: Blog,
                as: 'readings',
                attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
                through: {
                    attributes: []
                },
                    include: {
                    model: User,
                    attributes: ['name']
                }
            }
        ]
    })
    if (user) {
        res.json(user)
    } else {
        throw Error('User not found')
    }
})

module.exports = router