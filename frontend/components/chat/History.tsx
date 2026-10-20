import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { Search, MessageSquare, Layers, Cpu, X, Trash2, Loader2 } from 'lucide-react';

interface HistoryItem {
    id: string;
    question: string;
    mode: string;
    selectedModel?: string;
    responses: Array<{ model: string; answer: string }>;
    createdAt: string;
}

interface HistoryProps {
    history: HistoryItem[];
    onLoadHistory?: (item: HistoryItem) => void;
    onDeleteHistory?: (id: string) => Promise<void>;
    compact?: boolean;
}

export default function History({ history, onLoadHistory, onDeleteHistory, compact = false }: HistoryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredHistory = useMemo(() => {
        if (!searchQuery) return history;
        const query = searchQuery.toLowerCase();
        return history.filter(item =>
            item.question.toLowerCase().includes(query) ||
            item.responses.some(resp =>
                resp.answer.toLowerCase().includes(query) ||
                resp.model.toLowerCase().includes(query)
            )
        );
    }, [history, searchQuery]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (deletingId) return;

        setDeletingId(id);
        try {
            if (onDeleteHistory) {
                await onDeleteHistory(id);
            }
        } finally {
            setDeletingId(null);
        }
    };

    // Group by date
    const groupedHistory = useMemo(() => {
        const groups: Record<string, HistoryItem[]> = {};
        const now = new Date();
        const today = now.toDateString();
        const yesterday = new Date(now.getTime() - 86400000).toDateString();

        filteredHistory.forEach(item => {
            const date = new Date(item.createdAt);
            const dateStr = date.toDateString();
            let label: string;

            if (dateStr === today) {
                label = 'Today';
            } else if (dateStr === yesterday) {
                label = 'Yesterday';
            } else {
                const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
                if (diffDays < 7) {
                    label = 'This Week';
                } else if (diffDays < 30) {
                    label = 'This Month';
                } else {
                    label = format(date, 'MMMM yyyy');
                }
            }

            if (!groups[label]) groups[label] = [];
            groups[label].push(item);
        });

        return groups;
    }, [filteredHistory]);

    if (compact) {
        // Sidebar compact view
        return (
            <div className="space-y-2 font-mono">
                {/* Search */}
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="FILTER_SESSIONS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-[#171720] border-2 border-black text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 brutal-shadow-sm font-mono uppercase"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-[#2e2e38] p-3">
                        <MessageSquare className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-mono">NO LOGS RECORDED</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-4 border border-dashed border-[#2e2e38] p-2">
                        <p className="text-[11px] text-gray-500 uppercase font-mono">NO MATCHES</p>
                    </div>
                ) : (
                    Object.entries(groupedHistory).map(([label, items]) => (
                        <div key={label} className="space-y-1">
                            <div className="px-1 pt-1 pb-0.5">
                                <span className="text-[9px] font-black text-violet-400 uppercase tracking-wider block font-mono">[{label}]</span>
                            </div>
                            {items.map((item, index) => (
                                <div key={item.id || `${label}-${index}`} className="relative group">
                                    <button
                                        onClick={() => onLoadHistory?.(item)}
                                        className="w-full text-left p-2 bg-[#171720] hover:bg-[#20202c] border border-black hover:border-violet-400 transition-all pr-8 cursor-pointer"
                                    >
                                        <div className="flex items-start space-x-2">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {item.mode === 'multi' ? (
                                                    <span className="px-1 py-0.2 text-[8px] bg-violet-400 text-black font-black uppercase">5X</span>
                                                ) : (
                                                    <span className="px-1 py-0.2 text-[8px] bg-cyan-400 text-black font-black uppercase">1X</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-200 group-hover:text-white font-sans font-medium truncate leading-tight">
                                                    {item.question}
                                                </p>
                                                <p className="text-[9px] text-gray-500 mt-0.5 font-mono">
                                                    {format(new Date(item.createdAt), 'HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, item.id)}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black hover:bg-rose-400 border border-transparent hover:border-black opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                        title="Delete chat"
                                    >
                                        {deletingId === item.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-3 h-3" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        );
    }

    // Full-page history view
    return (
        <div className="space-y-4">
            {filteredHistory.map((item) => (
                <div
                    key={item.id}
                    className="group bg-gray-800/40 border border-gray-700/30 rounded-xl p-4 hover:border-gray-600/40 transition-all cursor-pointer relative"
                    onClick={() => onLoadHistory?.(item)}
                >
                    <div className="pr-10">
                        <p className="text-white text-sm mb-2 line-clamp-2">{item.question}</p>
                        <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.mode === 'multi'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                {item.mode === 'multi' ? 'Multi' : 'Single'}
                            </span>
                            <span className="text-xs text-gray-500">
                                {format(new Date(item.createdAt), 'MMM d, h:mm a')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-400/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                        {deletingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}
