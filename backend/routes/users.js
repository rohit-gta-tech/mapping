const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// register

router.post("/register", async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        const user = await newUser.save()
        res.status(200).json(user._id)

    } catch(error) {
        res.status(500).json(error)
    }
})

// login

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if(!user) return res.status(400).json('Wrong username or password')

        const validatePassword = await bcrypt.compare(req.body.password, user.password)
        if(!validatePassword) return res.status(400).json('Wrong username or password')

        res.status(200).json({_id: user._id, username: user.username})


    } catch(error) {
        res.status(500).json(error)
    }
})

module.exports = router