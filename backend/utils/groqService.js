require('dotenv').config();
const Groq = require('groq-sdk');
const ApiError = require('./apiError');
const logger = require('./logger');

// Model-specific configurations with different API keys
const modelConfigs = [
    {
        name: 'llama-3.1-8b-instant',
        apiKey: process.env.GROQ_API_KEY1,
        preprompt: 'Return ONLY JSON: {"short_ans": "concise factual answer under 50 words", "explanation": "brief reasoning"}.'
    },
    {
        name: 'qwen/qwen3-32b',
        apiKey: process.env.GROQ_API_KEY2,
        preprompt: 'Return ONLY JSON: {"short_ans": "1-line answer", "explanation": "reasoning if needed"}.'
    },
    {
        name: 'groq/compound-mini',
        apiKey: process.env.GROQ_API_KEY3,
        preprompt: 'Return ONLY JSON: {"short_ans": "precise answer under 50 words", "explanation": "justification"}.'
    },
    {
        name: 'openai/gpt-oss-20b',
        apiKey: process.env.GROQ_API_KEY4,
        preprompt: 'Return ONLY JSON: {"short_ans": "accurate identification", "explanation": "short explanation"}.'
    },
    {
        name: 'moonshotai/kimi-k2-instruct-0905',
        apiKey: process.env.GROQ_API_KEY5,
        preprompt: 'Return ONLY JSON: {"short_ans": "direct brief choice", "explanation": "context"}.'
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
                    temperature: 0.2,
                    response_format: { type: "json_object" }
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
                content: config.preprompt
            }, {
                role: 'user',
                content: userQuestion
            }],
            model,
            max_tokens: maxTokens,
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        return {
            model,
            answer: response.choices[0]?.message?.content || '{"short_ans": "No response", "explanation": ""}',
            status: 'success'
        };
    } catch (error) {
        logger.error('Groq API error:', error);
        throw error instanceof ApiError ? error : new ApiError(500, 'Error communicating with Groq API');
    }
};

const getConsensusAnswer = async (userQuestion, responses) => {
    try {
        // Use the highest capacity model for consensus
        const config = modelConfigs[0];
        const groq = createGroqClient(config.apiKey);

        // Truncate individual answers to stay within TPM limits if needed
        const modelsContext = responses
            .filter(r => r.status === 'success')
            .map(r => `Model (${r.model}): ${r.answer.substring(0, 1000)}`)
            .join('\n\n---\n\n');

        const consensusPrompt = `
            Analyze these AI responses and the user question.
            Return ONLY a JSON object:
            {
              "short_ans": "One-line clear answer",
              "explanation": "Brief synthesis of logic"
            }
            
            Question: ${userQuestion}
            
            Responses:
            ${modelsContext}
        `;

        const response = await groq.chat.completions.create({
            messages: [{
                role: 'system',
                content: 'You are an expert consensus engine. Output ONLY JSON.'
            }, {
                role: 'user',
                content: consensusPrompt
            }],
            model: config.name,
            max_tokens: 1000,
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        return {
            model: 'ParallelAI Consensus',
            answer: response.choices[0]?.message?.content || 'Unable to generate consensus',
            status: 'success'
        };
    } catch (error) {
        logger.error('Consensus generation error:', error);
        return {
            model: 'ParallelAI Consensus',
            answer: 'Failed to generate consensus due to a technical error.',
            status: 'error'
        };
    }
};

module.exports = {
    getQuickResponseFromAllModels,
    getResponseFromModel,
    getConsensusAnswer,
    availableModels,
    modelConfigs
};

