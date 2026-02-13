import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ChevronDown, Layers, Cpu, Sparkles, Command, X, RefreshCcw } from 'lucide-react';

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
        <div className="relative w-full max-w-4xl mx-auto px-2 lg:px-4">
            {/* Small Compact Model Picker */}
            {showModelPicker && (
                <div
                    ref={modelPickerRef}
                    className="absolute bottom-full left-2 right-2 lg:left-4 lg:right-4 mb-3 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn"
                >
                    <div className="p-4 lg:p-5 space-y-4 lg:space-y-5">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-widest">Configuration</span>
                            <button onClick={() => setShowModelPicker(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="flex flex-row gap-2 lg:gap-3">
                            <button
                                onClick={() => setMode('multi')}
                                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 lg:py-3 rounded-xl transition-all border ${mode === 'multi' ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'bg-white/5 border-transparent text-gray-500'}`}
                            >
                                <Layers className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-tight">Consensus</span>
                            </button>
                            <button
                                onClick={() => setMode('single')}
                                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 lg:py-3 rounded-xl transition-all border ${mode === 'single' ? 'bg-purple-600/10 border-purple-500/40 text-purple-400' : 'bg-white/5 border-transparent text-gray-500'}`}
                            >
                                <Cpu className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-tight">Isolated</span>
                            </button>
                        </div>

                        {mode === 'single' && (
                            <div className="space-y-1 max-h-48 overflow-y-auto pr-2 scrollbar-none">
                                {availableModels.map((model) => (
                                    <button
                                        key={model}
                                        onClick={() => setSelectedModel(model)}
                                        className={`w-full flex items-center justify-between p-2 lg:p-2.5 rounded-lg text-[10px] lg:text-xs transition-all border ${selectedModel === model ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <span className="font-bold truncate pr-4">{getShortModelName(model)}</span>
                                        <span className="text-[8px] lg:text-[9px] text-gray-600 font-black uppercase flex-shrink-0">{modelBrands[model]}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Compact Bottom Input */}
            <form onSubmit={handleSubmit} className="relative z-10 w-full group">
                <div className="flex items-end bg-[#0f0f0f]/90 backdrop-blur-xl border border-white/10 p-1.5 lg:p-2 pl-4 rounded-2xl lg:rounded-[1.5rem] shadow-2xl focus-within:border-white/20 transition-all">
                    <textarea
                        ref={textareaRef}
                        placeholder="Inquire..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none py-2 lg:py-3 text-base lg:text-lg font-medium leading-[1.4] tracking-tight max-h-40 scrollbar-hide"
                        rows={1}
                        disabled={isLoading}
                    />

                    <div className="flex items-center space-x-1.5 lg:space-x-2 mb-1 mr-1">
                        <button
                            type="button"
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className={`p-2 lg:p-2.5 rounded-xl transition-all ${showModelPicker ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                            title="Switch Mode"
                        >
                            {mode === 'multi' ? <Layers className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || !question.trim()}
                            className={`p-2 lg:p-2.5 rounded-xl transition-all ${isLoading || !question.trim()
                                ? 'bg-white/5 text-gray-800 cursor-not-allowed'
                                : 'bg-white text-black hover:scale-105 active:scale-95'
                                }`}
                        >
                            {isLoading ? (
                                <RefreshCcw className="w-5 h-5 animate-spin text-blue-600" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}