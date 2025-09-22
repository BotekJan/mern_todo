const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const authenticateToken = require('../middleware/auth')

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find()
        res.json(todos)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getTodo, (req, res) => {
    res.json(res.todo)
})

router.post('/', async (req, res) => {
    const todo = new Todo({
        content: req.body.content,
        isDone: false
    })

    try {
        const newTodo = await todo.save()
        res.status(201).json(newTodo)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getTodo, async (req, res) => {
    try {
        await res.todo.deleteOne()
        res.json({ message: 'Deleted todo' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.patch('/:id', getTodo, async (req, res) => {
    console.log(req.body)
    if (req.body.content != null) {
        res.todo.content = req.body.content
    }
    if (req.body.isDone != null) {
        res.todo.isDone = req.body.isDone
    }
    try {
        const updatedTodo = await (res.todo.save())
        res.json(updatedTodo)
    } catch (err) {
        res.status(400).message({ message: err.message })
    }
})

async function getTodo(req, res, next) {
    let todo
    try {
        todo = await Todo.findById(req.params.id)
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