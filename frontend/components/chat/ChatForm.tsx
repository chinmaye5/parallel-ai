import { useState, useRef, useEffect } from 'react';

interface ChatFormProps {
    onSubmit: (question: string, mode: 'multi' | 'single', selectedModel: string) => void;
    availableModels: string[];
    isLoading: boolean;
}

export default function ChatForm({ onSubmit, availableModels, isLoading }: ChatFormProps) {
    const [question, setQuestion] = useState('');
    const [mode, setMode] = useState<'multi' | 'single'>('multi');
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [question]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        onSubmit(question, mode, selectedModel);
        setQuestion('');
    };

    const modelOptions: Record<string, string> = {
        'llama3-8b-8192': 'Meta Llama 3',
        'qwen/qwen3-32b': 'Alibaba Qwen',
        'deepseek-r1-distill-llama-70b': 'DeepSeek',
        'gemma2-9b-it': 'Google Gemma',
    };

    const getModelLabel = (modelKey: string) => {
        return modelOptions[modelKey] || modelKey;
    };

    return (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">AI Chat Interface</h2>
                    <p className="text-sm text-gray-400">Ask anything to our AI models</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                    <span className="text-xs text-gray-400">{isLoading ? 'Processing' : 'Ready'}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Question Input */}
                <div className="relative">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Question
                    </label>
                    <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500/30' : ''}`}>
                        <textarea
                            ref={textareaRef}
                            id="question"
                            placeholder="Type your question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none resize-none transition-all duration-200"
                            rows={1}
                            required
                            style={{ minHeight: '120px' }}
                        />
                        {question && (
                            <button
                                type="button"
                                onClick={() => setQuestion('')}
                                className="absolute top-4 right-3 text-gray-400 hover:text-gray-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                            {question.length}/2000 characters
                        </span>
                        <span className="text-xs text-gray-500">
                            {question.split(' ').length} words
                        </span>
                    </div>
                </div>

                {/* Mode and Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mode Selector */}
                    <div>
                        <label htmlFor="mode" className="block text-sm font-medium text-gray-300 mb-2">
                            Response Mode
                        </label>
                        <div className="relative">
                            <select
                                id="mode"
                                value={mode}
                                onChange={(e) => setMode(e.target.value as 'multi' | 'single')}
                                className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                            >
                                <option value="multi">Multi-Model Response</option>
                                <option value="single">Single Model Response</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Model Selector - Conditional rendering */}
                    {mode === 'single' && (
                        <div className="transition-all duration-200 ease-in-out">
                            <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
                                Select Model
                            </label>
                            <div className="relative">
                                <select
                                    id="model"
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                                >
                                    {availableModels.map((model) => (
                                        <option key={model} value={model}>
                                            {getModelLabel(model)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className={`w-full py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${isLoading
                        ? 'bg-blue-700 cursor-not-allowed'
                        : !question.trim()
                            ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                            <span>Send Message</span>
                        </>
                    )}
                </button>

                {/* Quick Tips */}
                <div className="text-center text-xs text-gray-500 mt-4">
                    <p>Pro Tip: Press Shift+Enter for new line</p>
                </div>
            </form>
        </div>
    );
}