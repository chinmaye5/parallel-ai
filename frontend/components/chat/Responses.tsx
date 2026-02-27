'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Scale, RefreshCcw, Info } from 'lucide-react';

interface Response {
    model: string;
    answer: string;
    status?: string;
    responseTime?: number;
}

interface ResponsesProps {
    responses: Response[];
    modelBrands: Record<string, string>;
    consensus?: Response;
    isConsensusLoading?: boolean;
}

const modelGlows: Record<string, string> = {
    'Meta': 'border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]',
    'Alibaba': 'border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]',
    'OpenAI': 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]',
    'Moonshot AI': 'border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.05)]',
    'Groq': 'border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]',
};

export default function Responses({ responses, modelBrands, consensus, isConsensusLoading }: ResponsesProps) {
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [showConsensusExplanation, setShowConsensusExplanation] = useState(false);

    const parseAIResponse = (text: string) => {
        try {
            const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
            const data = JSON.parse(cleaned);
            return {
                short: data.short_ans || data.short_online_ans || '',
                long: data.explanation || ''
            };
        } catch {
            return { short: text.substring(0, 100) + '...', long: text };
        }
    };

    const consensusData = useMemo(() => {
        if (!consensus?.answer) return { short: '', long: '' };
        return parseAIResponse(consensus.answer);
    }, [consensus]);

    const copyToClipboard = (text: string, id: string) => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(text);
            setCopiedIndex(id);
            setTimeout(() => setCopiedIndex(null), 2000);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getShortModelName = (model: string): string => {
        const parts = model.split('/');
        return parts[parts.length - 1];
    };

    if (responses.length === 0 && !isConsensusLoading) return null;

    return (
        <div className="space-y-6 lg:space-y-8 animate-fadeIn w-full">
            {/* Consensus Section */}
            {(consensus || isConsensusLoading) && (
                <div className="relative">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                        <div className="flex items-center space-x-2 lg:space-x-3">
                            <Scale className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                            <h3 className="text-[9px] lg:text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] lg:tracking-[0.3em]">Parallel AI Aggregate Victory</h3>
                        </div>
                        {consensus?.responseTime && (
                            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-blue-500/5 border border-blue-500/10">
                                <RefreshCcw className="w-3 h-3 text-blue-400" />
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{consensus.responseTime}s</span>
                            </div>
                        )}
                    </div>

                    <div className={`relative p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] bg-gray-900 border border-blue-500/20 transition-all duration-700 ${isConsensusLoading ? 'animate-pulse' : ''}`}>
                        {isConsensusLoading ? (
                            <div className="flex items-center space-x-3 lg:space-x-4 py-3 lg:py-4">
                                <RefreshCcw className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 animate-spin" />
                                <p className="text-[10px] lg:text-sm font-black text-blue-400/80 uppercase tracking-widest">Synthesizing consensus verdict...</p>
                            </div>
                        ) : (
                            <div className="space-y-4 lg:space-y-6">
                                <div className="flex flex-col space-y-2 lg:space-y-3">
                                    <span className="text-[8px] lg:text-[9px] font-black text-blue-500/60 uppercase tracking-widest">Collective Short Answer</span>
                                    <h4 className="text-white text-base lg:text-2xl font-bold tracking-tight leading-tight lg:leading-snug">
                                        {consensusData.short}
                                    </h4>
                                </div>

                                {consensusData.long && (
                                    <div className="pt-1 lg:pt-2">
                                        <button
                                            onClick={() => setShowConsensusExplanation(!showConsensusExplanation)}
                                            className="group flex items-center space-x-2 text-[8px] lg:text-[10px] font-black text-gray-500 hover:text-blue-400 transition-all uppercase tracking-widest"
                                        >
                                            <Info className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform ${showConsensusExplanation ? 'rotate-180 text-blue-400' : ''}`} />
                                            <span>{showConsensusExplanation ? 'Hide Process Detail' : 'Show Deep Consensus Analysis'}</span>
                                        </button>

                                        {showConsensusExplanation && (
                                            <div className="mt-4 lg:mt-6 p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-black border border-white/5 animate-fadeIn">
                                                <p className="text-gray-400 text-[11px] lg:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                                    {consensusData.long}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="absolute top-4 lg:top-8 right-4 lg:right-8">
                                    <button
                                        onClick={() => copyToClipboard(consensusData.short + '\n\n' + consensusData.long, 'consensus')}
                                        className="p-1.5 lg:p-2.5 rounded-lg lg:rounded-xl bg-gray-800 text-gray-500 hover:text-white border border-transparent hover:border-blue-500/30 transition-all"
                                    >
                                        {copiedIndex === 'consensus' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Individual Models Row */}
            <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                    <h3 className="text-[9px] lg:text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Source Perspectives</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {responses.map((resp, index) => {
                        const parsed = parseAIResponse(resp.answer);
                        const brand = modelBrands[resp.model] || 'AI';
                        const id = `resp-${resp.model}-${index}`;
                        const isExpanded = expandedCards[id] === true;

                        return (
                            <div
                                key={id}
                                className={`flex flex-col bg-gray-950 border rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-gray-900 ${modelGlows[brand] || 'border-white/5'}`}
                            >
                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05] bg-white/[0.01]">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] lg:text-[11px] font-black text-white truncate uppercase tracking-wider">{getShortModelName(resp.model)}</span>
                                        <span className="text-[8px] font-black text-blue-500/80 uppercase tracking-[0.1em]">{brand}</span>
                                    </div>
                                    {resp.responseTime && (
                                        <span className="text-[9px] font-bold text-gray-500 tabular-nums">{resp.responseTime}s</span>
                                    )}
                                </div>

                                <div className="p-3 lg:p-4 flex-1">
                                    <p className="text-gray-300 text-[11px] lg:text-[13px] leading-snug font-medium mb-2 lg:mb-3">
                                        {parsed.short}
                                    </p>

                                    {parsed.long && (
                                        <button
                                            onClick={() => toggleExpand(id)}
                                            className="w-full py-1 lg:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[8px] lg:text-[9px] font-black text-gray-500 hover:text-gray-300 transition-all uppercase tracking-widest border border-transparent hover:border-white/5"
                                        >
                                            {isExpanded ? 'Hide Detail' : 'Read Detail'}
                                        </button>
                                    )}

                                    {isExpanded && parsed.long && (
                                        <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-white/[0.03] animate-fadeIn">
                                            <p className="text-gray-500 text-[9px] lg:text-[11px] leading-relaxed italic">
                                                {parsed.long}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}