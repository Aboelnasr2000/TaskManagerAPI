import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { User } from '../models/user.js';
import { auth } from '../middleware/auth.js';
import { Task } from '../models/task.js';
import { sendByeEmail, sendWelcomeEmail } from '../emails/account.js';



const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {

            return cb(new Error('Please Upload (PNG,JPEG,JPG)'))

        }

        cb(undefined, true)


    }

})


export const userRouter = new express.Router()

userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

userRouter.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send("Logged Out")
    } catch (e) {
        res.status(500).send()
    }
})

userRouter.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Logged Out All")
    } catch (e) {
        res.status(500).send()
    }
})


userRouter.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

userRouter.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("error : Invalid updates!")
    }
    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(201).send(req.user)

    } catch (e) {

        res.status(500).send(e)

    }
})

userRouter.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne({ _id: req.user.id })
        await Task.deleteMany({ owner: req.user.id })
        sendByeEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


userRouter.get('/users/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


userRouter.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

