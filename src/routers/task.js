import express from 'express';
import { Task } from '../models/task.js';
import { auth } from '../middleware/auth.js';


export const taskRouter = new express.Router()

taskRouter.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user.id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

taskRouter.get('/tasks', auth, async (req, res) => {

    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }


    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // console.log(req.user.id)
        // const tasks = await Task.find({owner: req.user.id})
        await req.user.populate({
            path: 'tasks', match, options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.status(201).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user.id })
        if (!task) {
            return res.status(404).send("Task not Found")
        }
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

taskRouter.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("error : Invalid updates!")
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id })

        if (!task) {
            return res.status(404).send("Task not Found")
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            return res.status(404).send("Task not Found")
        }
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})