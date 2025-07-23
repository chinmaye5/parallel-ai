require('dotenv').config();
const Groq = require('groq-sdk');
const ApiError = require('./apiError');
const logger = require('./logger');

// Model-specific configurations with different API keys
const modelConfigs = [
    {
        name: 'llama3-8b-8192',
        apiKey: process.env.GROQ_API_KEY1,
        preprompt: 'Answer concisely under 50 words. Be factual. For MCQs, provide option and brief explanation.'
    },
    {
        name: 'qwen/qwen3-32b',
        apiKey: process.env.GROQ_API_KEY2,
        preprompt: 'just give 1 line answer without any explaination and dont give what u think For MCQs, clearly state the correct option with reasoning.'
    },
    {
        name: 'deepseek-r1-distill-llama-70b',
        apiKey: process.env.GROQ_API_KEY3,
        preprompt: 'Give precise answers under 50 words. If unsure, say so. For MCQs, select the best option with justification.'
    },
    {
        name: 'gemma2-9b-it',
        apiKey: process.env.GROQ_API_KEY4,
        preprompt: 'Respond accurately in under 50 words. For multiple choice, identify the correct answer with a short explanation.'
    },
    {
        name: 'llama-3.1-8b-instant',
        apiKey: process.env.GROQ_API_KEY5,
        preprompt: 'Keep responses brief (under 50 words). Be direct. For MCQs, choose the right option and explain briefly.'
    }
];

// Verify all API keys are loaded
modelConfigs.forEach(config => {
    console.log(`API key for ${config.name}:`, config.apiKey ? 'Loaded' : 'Missing');
});

const availableModels = modelConfigs.map(config => config.name);

const createGroqClient = (apiKey) => {
    if (!apiKey) {
        throw new ApiError(500, 'API key not configured for this model');
    }
    return new Groq({ apiKey });
};

const getQuickResponseFromAllModels = async (userQuestion) => {
    try {
        const responses = [];

        for (const modelConfig of modelConfigs) {
            try {
                const groq = createGroqClient(modelConfig.apiKey);
                const completion = await groq.chat.completions.create({
                    messages: [{
                        role: 'system',
                        content: modelConfig.preprompt
                    }, {
                        role: 'user',
                        content: userQuestion
                    }],
                    model: modelConfig.name,
                    max_tokens: 1500,
                    temperature: 0.7
                });

                responses.push({
                    model: modelConfig.name,
                    answer: completion.choices[0]?.message?.content || 'No response',
                    status: 'success'
                });
            } catch (error) {
                logger.warn(`Model ${modelConfig.name} failed: ${error.message}`);
                responses.push({
                    model: modelConfig.name,
                    answer: 'Model unavailable',
                    status: 'error'
                });
            }
        }

        if (responses.every(r => r.status === 'error')) {
            throw new ApiError(503, 'All models failed to respond');
        }

        return responses;
    } catch (error) {
        logger.error('Groq API error:', error);
        throw error instanceof ApiError ? error : new ApiError(500, 'Error communicating with Groq API');
    }
};

const getResponseFromModel = async (model, userQuestion, maxTokens = 4000) => {
    try {
        const config = modelConfigs.find(m => m.name === model);
        if (!config) {
            throw new ApiError(400, 'Invalid model specified');
        }

        const groq = createGroqClient(config.apiKey);
        const response = await groq.chat.completions.create({
            messages: [{
                role: 'system',
                content: `Consider yourself an industry expert in the field the question is based on. Provide a detailed, comprehensive answer, including:
                - Clear explanations of key concepts
                - Relevant examples or use cases
                - Practical applications where applicable
                - Code snippets for technical questions
                Aim for a response length of 300-800 words, depending on question complexity.`
            }, {
                role: 'user',
                content: userQuestion
            }],
            model,
            max_tokens: maxTokens,
            temperature: 0.7
        });

        return {
            model,
            answer: response.choices[0]?.message?.content || 'No response',
            status: 'success'
        };
    } catch (error) {
        logger.error('Groq API error:', error);
        throw error instanceof ApiError ? error : new ApiError(500, 'Error communicating with Groq API');
    }
};

module.exports = {
    getQuickResponseFromAllModels,
    getResponseFromModel,
    availableModels
};