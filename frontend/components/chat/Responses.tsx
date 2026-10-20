'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, AlertTriangle, RefreshCcw } from 'lucide-react';

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

const brandDot: Record<string, string> = {
    'Meta': 'bg-blue-400',
    'Alibaba': 'bg-amber-400',
    'OpenAI': 'bg-emerald-400',
    'Groq': 'bg-purple-400',
    'Moonshot AI': 'bg-rose-400',
};

export default function Responses({ responses, modelBrands, consensus, isConsensusLoading }: ResponsesProps) {
    const [copied, setCopied] = useState(false);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [showNodes, setShowNodes] = useState(true);
    const [showRationale, setShowRationale] = useState(false);

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

    const copyVerdict = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(consensusData.short + (consensusData.long ? '\n\n' + consensusData.long : ''));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
        <div className="space-y-4 w-full animate-fadeIn font-mono">

            {/* ── Consensus Block ── */}
            {(consensus || isConsensusLoading) && (
                <div className="bg-[#131318] border border-[#2a2a35] overflow-hidden">
                    {/* thin violet top accent */}
                    <div className="h-[2px] bg-violet-500 w-full" />

                    <div className="px-5 py-4 space-y-3">
                        {isConsensusLoading ? (
                            <div className="flex items-center space-x-2.5 py-3 text-violet-400">
                                <RefreshCcw className="w-4 h-4 animate-spin flex-shrink-0" />
                                <span className="text-[11px] uppercase tracking-widest font-bold">
                                    Cross-examining model streams…
                                </span>
                            </div>
                        ) : (
                            <>
                                {/* Answer — the hero */}
                                <p className="text-white text-xl font-bold font-sans leading-snug tracking-tight">
                                    {consensusData.short || consensus?.answer}
                                </p>

                                {/* Meta row */}
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                                        120B Judge
                                        {consensus?.responseTime && (
                                            <span className="ml-2 text-gray-600">{consensus.responseTime}s</span>
                                        )}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        {consensusData.long && (
                                            <button
                                                onClick={() => setShowRationale(v => !v)}
                                                className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-violet-400 transition-colors uppercase tracking-wider"
                                            >
                                                {showRationale ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                Rationale
                                            </button>
                                        )}
                                        <button
                                            onClick={copyVerdict}
                                            className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
                                        >
                                            {copied
                                                ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                                                : <><Copy className="w-3 h-3" /> Copy</>
                                            }
                                        </button>
                                    </div>
                                </div>

                                {showRationale && consensusData.long && (
                                    <div className="pt-3 border-t border-[#22222c] text-gray-400 text-xs font-sans leading-relaxed whitespace-pre-wrap">
                                        {consensusData.long}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Node Outputs Toggle ── */}
            {responses.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowNodes(v => !v)}
                        className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-widest font-bold w-full text-left pb-2 border-b border-[#1e1e26]"
                    >
                        <span className="flex items-center gap-1">
                            {showNodes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Node Outputs
                        </span>
                        <span className="text-gray-600 font-mono">[{responses.length}/5]</span>
                    </button>

                    {showNodes && (
                        <div className="mt-2 space-y-1">
                            {responses.map((resp, index) => {
                                const parsed = parseAIResponse(resp.answer);
                                const brand = modelBrands[resp.model] || 'AI';
                                const dot = brandDot[brand] || 'bg-zinc-500';
                                const id = `resp-${resp.model}-${index}`;
                                const isExpanded = expandedCards[id] === true;
                                const isError = resp.status === 'error';

                                return (
                                    <div key={id} className="border border-[#1e1e26] bg-[#111116]">
                                        <div className="flex items-center justify-between px-3 py-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                                                <span className="text-[11px] font-semibold text-gray-300 truncate font-sans">
                                                    {getShortModelName(resp.model)}
                                                </span>
                                                <span className="text-[9px] text-gray-600 hidden sm:block">{brand}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                {resp.responseTime && (
                                                    <span className="text-[9px] text-gray-600 font-mono">{resp.responseTime}s</span>
                                                )}
                                                {!isError && parsed.long && (
                                                    <button
                                                        onClick={() => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))}
                                                        className="text-[9px] text-gray-600 hover:text-gray-300 transition-colors uppercase tracking-wider flex items-center gap-0.5"
                                                    >
                                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                        Detail
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-3 pb-2.5">
                                            {isError ? (
                                                <span className="flex items-center gap-1.5 text-rose-400 text-xs">
                                                    <AlertTriangle className="w-3 h-3" /> Failed
                                                </span>
                                            ) : (
                                                <p className="text-gray-400 text-xs font-sans leading-relaxed">
                                                    {parsed.short}
                                                </p>
                                            )}
                                        </div>

                                        {isExpanded && parsed.long && (
                                            <div className="px-3 pb-3 pt-2 border-t border-[#1a1a22] text-gray-500 text-[11px] font-sans leading-relaxed whitespace-pre-wrap">
                                                {parsed.long}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}