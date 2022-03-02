const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../utils/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
    const {username, password} = request.body

    const user = await User.findOne({
        where: {
            username
        }
    })

    const passwordCorrect = user === null? false : await bcrypt.compare(password, user.password)

    if (!(user && passwordCorrect)) throw Error('Invalid username or password')

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60*60 })

    response.send({ token, username: user.username, name: user.name, timestamp: new Date(), id: user.id })
})

module.exports = router