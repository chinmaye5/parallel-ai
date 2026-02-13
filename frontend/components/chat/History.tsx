import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { Search, MessageSquare, Layers, Cpu, X } from 'lucide-react';

interface HistoryItem {
    question: string;
    mode: string;
    selectedModel?: string;
    responses: Array<{ model: string; answer: string }>;
    createdAt: string;
}

interface HistoryProps {
    history: HistoryItem[];
    onLoadHistory?: (item: HistoryItem) => void;
    compact?: boolean;
}

export default function History({ history, onLoadHistory, compact = false }: HistoryProps) {
    const [searchQuery, setSearchQuery] = useState('');

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
            <div className="space-y-1">
                {/* Search */}
                <div className="relative mb-3 px-1">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-gray-800/40 border border-gray-700/30 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-2 flex items-center"
                        >
                            <X className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300" />
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                        <p className="text-xs text-gray-500">No conversations yet</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-6 px-4">
                        <p className="text-xs text-gray-500">No matches found</p>
                    </div>
                ) : (
                    Object.entries(groupedHistory).map(([label, items]) => (
                        <div key={label}>
                            <div className="px-3 py-2">
                                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</span>
                            </div>
                            {items.map((item, index) => (
                                <button
                                    key={`${label}-${index}`}
                                    onClick={() => onLoadHistory?.(item)}
                                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-800/50 transition-all duration-150 group"
                                >
                                    <div className="flex items-center space-x-2.5">
                                        <div className="flex-shrink-0">
                                            {item.mode === 'multi' ? (
                                                <Layers className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                            ) : (
                                                <Cpu className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-300 group-hover:text-white truncate transition-colors leading-snug">
                                                {item.question}
                                            </p>
                                            <p className="text-[11px] text-gray-600 mt-0.5">
                                                {format(new Date(item.createdAt), 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))
                )}
            </div>
        );
    }

    // Full-page history view (fallback, shouldn't be needed in new design)
    return (
        <div className="space-y-4">
            {filteredHistory.map((item, index) => (
                <div
                    key={index}
                    className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-4 hover:border-gray-600/40 transition-all cursor-pointer"
                    onClick={() => onLoadHistory?.(item)}
                >
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
            ))}
        </div>
    );
}