import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Layers, Cpu, X, RefreshCcw } from 'lucide-react';

interface ChatFormProps {
    onSubmit: (question: string, mode: 'multi' | 'single', selectedModel: string) => void;
    availableModels: string[];
    isLoading: boolean;
    modelBrands: Record<string, string>;
}

export default function ChatForm({ onSubmit, availableModels, isLoading, modelBrands }: ChatFormProps) {
    const [question, setQuestion] = useState('');
    const [mode, setMode] = useState<'multi' | 'single'>('multi');
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
    const [showModelPicker, setShowModelPicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const modelPickerRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
        }
    }, [question]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelPickerRef.current && !modelPickerRef.current.contains(e.target as Node)) {
                setShowModelPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        if (!question.trim() || isLoading) return;
        onSubmit(question.trim(), mode, selectedModel);
        setQuestion('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [question, mode, selectedModel, isLoading, onSubmit]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const getShortModelName = (model: string): string => {
        const parts = model.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto px-2 lg:px-4 font-mono">
            {/* Neo-Brutalist Mode & Model Drawer */}
            {showModelPicker && (
                <div
                    ref={modelPickerRef}
                    className="absolute bottom-full left-2 right-2 lg:left-4 lg:right-4 mb-3 bg-[#131317] border-2 border-black brutal-shadow-lg p-4 space-y-4 z-50 animate-fadeIn"
                >
                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                        <span className="text-xs font-black text-violet-400 uppercase tracking-widest">[ORCHESTRATION CONFIG]</span>
                        <button onClick={() => setShowModelPicker(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setMode('multi')}
                            className={`flex items-center justify-center space-x-2 py-2.5 px-3 border-2 border-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                                mode === 'multi' 
                                    ? 'bg-violet-400 text-black brutal-shadow-sm' 
                                    : 'bg-[#1e1e24] text-gray-400 hover:text-white'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span>ALL 5 (CONSENSUS)</span>
                        </button>
                        <button
                            onClick={() => setMode('single')}
                            className={`flex items-center justify-center space-x-2 py-2.5 px-3 border-2 border-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                                mode === 'single' 
                                    ? 'bg-cyan-400 text-black brutal-shadow-sm' 
                                    : 'bg-[#1e1e24] text-gray-400 hover:text-white'
                            }`}
                        >
                            <Cpu className="w-4 h-4" />
                            <span>SINGLE MODEL</span>
                        </button>
                    </div>

                    {mode === 'single' && (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {availableModels.map((model) => (
                                <button
                                    key={model}
                                    onClick={() => setSelectedModel(model)}
                                    className={`w-full flex items-center justify-between p-2 border-2 border-black text-xs font-bold transition-all cursor-pointer ${
                                        selectedModel === model 
                                            ? 'bg-white text-black brutal-shadow-sm' 
                                            : 'bg-[#181820] text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <span className="truncate pr-2 font-mono">{getShortModelName(model)}</span>
                                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-black text-violet-400 border border-black flex-shrink-0">
                                        {modelBrands[model]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Neo-Brutalist Input Bar */}
            <form onSubmit={handleSubmit} className="relative z-10 w-full">
                <div className="flex items-end bg-[#131318] border-2 border-black brutal-shadow-lg p-2 pl-4">
                    <textarea
                        ref={textareaRef}
                        placeholder={mode === 'multi' ? "Dispatch prompt to 5 parallel AI models..." : `Dispatch prompt to ${getShortModelName(selectedModel)}...`}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none py-2 text-sm lg:text-base font-sans font-medium leading-[1.4] max-h-36 scrollbar-none"
                        rows={1}
                        disabled={isLoading}
                    />

                    <div className="flex items-center space-x-2 ml-2 pb-0.5">
                        <button
                            type="button"
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className={`flex items-center space-x-1 px-2.5 py-2 border-2 border-black font-extrabold text-[11px] uppercase transition-all cursor-pointer ${
                                showModelPicker ? 'bg-violet-400 text-black' : 'bg-[#22222b] text-gray-300 hover:bg-[#2c2c38]'
                            }`}
                            title="Configuration"
                        >
                            {mode === 'multi' ? (
                                <>
                                    <Layers className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">5-WAY</span>
                                </>
                            ) : (
                                <>
                                    <Cpu className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">1-WAY</span>
                                </>
                            )}
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || !question.trim()}
                            className={`flex items-center space-x-1.5 px-4 py-2 border-2 border-black font-extrabold text-xs uppercase transition-all ${
                                isLoading || !question.trim()
                                    ? 'bg-[#202028] text-gray-600 border-gray-700 cursor-not-allowed'
                                    : 'bg-violet-400 hover:bg-violet-300 text-black brutal-shadow-sm cursor-pointer'
                            }`}
                        >
                            {isLoading ? (
                                <RefreshCcw className="w-4 h-4 animate-spin text-black" />
                            ) : (
                                <>
                                    <span>RUN</span>
                                    <Send className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}