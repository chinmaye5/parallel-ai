const { getQuickResponseFromAllModels, getResponseFromModel, availableModels } = require('../utils/groqService');
const Conversation = require('../models/Conversation');
const asyncHandler = require('../utils/asyncHandler');

exports.multiModeChat = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
        return res.status(400).json({ message: 'Question is required' });
    }

    const responses = await getQuickResponseFromAllModels(question);

    let conversation = await Conversation.findOne({ user: userId });
    if (!conversation) {
        conversation = new Conversation({ user: userId, messages: [] });
    }

    conversation.messages.push({
        question,
        mode: 'multi',
        responses,
        createdAt: new Date()
    });

    await conversation.save();

    res.json({ responses });
});

exports.singleModeChat = asyncHandler(async (req, res) => {
    const { question, model } = req.body;
    const userId = req.user.id;

    if (!question || !model) {
        return res.status(400).json({ message: 'Question and model are required' });
    }

    if (!availableModels.includes(model)) {
        return res.status(400).json({ message: 'Invalid model selected' });
    }

    const response = await getResponseFromModel(model, question, 5000);

    let conversation = await Conversation.findOne({ user: userId });
    if (!conversation) {
        conversation = new Conversation({ user: userId, messages: [] });
    }

    conversation.messages.push({
        question,
        mode: 'single',
        responses: [response],
        selectedModel: model,
        createdAt: new Date()
    });

    await conversation.save();

    res.json({ response });
});

exports.getHistory = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOne({ user: req.user.id }).select('messages');
    const history = conversation ? conversation.messages
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(message => ({
            question: message.question,
            mode: message.mode,
            responses: message.responses,
            selectedModel: message.selectedModel,
            createdAt: message.createdAt
        })) : [];
    res.json(history);
});