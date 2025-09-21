const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Todos', todoSchema)