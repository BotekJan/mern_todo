const express = require('express')
const router = express.Router()
const User = require('../models/user')
const authenticateToken = require('../middleware/auth')


router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const todos = user.todos
        res.json(todos)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, getTodo, (req, res) => {
    res.json(res.todo)
})

router.post('/', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    const todo = {
        content: req.body.content,
        isDone: false
    }

    try {
        user.todos.push(todo)
        await user.save()
        res.status(201).json(todo)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', authenticateToken, getTodo, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.todos = user.todos.filter(todo => todo._id != req.params.id)
        await user.save()
        res.json({ message: 'Deleted todo' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.patch('/:id', authenticateToken, getTodo, async (req, res) => {

    try {
        const user = await User.findById(req.user.id);

        const todo = user.todos.find(todo => todo._id == req.params.id)

        if (req.body.content != null) {
            todo.content = req.body.content
        }
        if (req.body.isDone != null) {
            todo.isDone = req.body.isDone
        }
        await user.save()
        res.json({ message: 'Updated todo todo' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

async function getTodo(req, res, next) {
    let todo
    try {
        const user = await User.findById(req.user.id);
        todo = user.todos.find(todo => todo._id == req.params.id)
        if (todo == null) {
            return res.status(404).json({ message: 'cannot find Todo' })
        }
    } catch (err) {
        return res.status(500).json({ message: err })
    }

    res.todo = todo
    next()
}



module.exports = router