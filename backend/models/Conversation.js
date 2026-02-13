const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ['multi', 'single'],
        required: true
    },
    responses: [{
        model: String,
        answer: String,
        status: String
    }],
    selectedModel: String,
    consensus: {
        model: String,
        answer: String,
        status: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const conversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messageSchema]
}, {
    timestamps: true // Adds createdAt and updatedAt to conversation
});

module.exports = mongoose.model('Conversation', conversationSchema);