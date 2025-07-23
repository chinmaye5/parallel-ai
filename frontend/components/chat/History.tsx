import { format } from 'date-fns';
import { useState, useMemo } from 'react';

interface HistoryItem {
    question: string;
    mode: string;
    selectedModel?: string;
    responses: Array<{ model: string; answer: string }>;
    createdAt: string;
}

interface HistoryProps {
    history: HistoryItem[];
}

export default function History({ history }: HistoryProps) {
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and sort history
    const filteredHistory = useMemo(() => {
        let result = [...history];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.question.toLowerCase().includes(query) ||
                item.responses.some(resp =>
                    resp.answer.toLowerCase().includes(query) ||
                    resp.model.toLowerCase().includes(query)
                )
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [history, searchQuery, sortOrder]);

    if (history.length === 0) {
        return (
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No History Yet</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    Your conversation history will appear here once you start chatting with the AI models.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Conversation History</h2>
                    <p className="text-gray-400 text-sm">
                        {filteredHistory.length} {filteredHistory.length === 1 ? 'entry' : 'entries'} •
                        Sorted by {sortOrder === 'newest' ? 'newest first' : 'oldest first'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <svg className="w-5 h-5 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                            className="flex items-center justify-between w-full sm:w-40 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <span className="mr-2">
                                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                            </span>
                            <svg className={`w-5 h-5 transition-transform ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {filteredHistory.length === 0 ? (
                <div className="bg-gray-700/30 p-8 rounded-xl text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">No matches found</h3>
                    <p className="text-gray-400">Try adjusting your search query</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {filteredHistory.map((msg, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-700/80 to-gray-800/90 p-5 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 shadow-lg"
                        >
                            <div className="flex items-start gap-4">
                                <div className="min-w-[40px] pt-1">
                                    <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold">
                                        {sortOrder === 'newest' ? index + 1 : filteredHistory.length - index}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    {/* Header with metadata */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${msg.mode === 'multi'
                                                    ? 'bg-purple-900/30 text-purple-400'
                                                    : 'bg-green-900/30 text-green-400'
                                                }`}>
                                                {msg.mode === 'multi' ? 'Multi-Model' : 'Single-Model'}
                                            </span>
                                            {msg.mode === 'single' && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                                                    {msg.selectedModel}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {format(new Date(msg.createdAt), 'MMM d, yyyy • h:mm a')}
                                        </span>
                                    </div>

                                    {/* Question */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-white mb-1">Question</h3>
                                        <p className="text-gray-200 bg-gray-700/30 p-3 rounded-lg">
                                            {msg.question}
                                        </p>
                                    </div>

                                    {/* Responses */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            Responses ({msg.responses.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {msg.responses.map((resp, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-gray-900/30 p-4 rounded-lg border-l-4 border-blue-500/50"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-mono font-bold text-blue-400">
                                                            {resp.model}
                                                        </h4>
                                                        <span className="text-xs text-gray-400">
                                                            {resp.answer.length} chars • {Math.ceil(resp.answer.split(' ').length / 200)} min read
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-200 whitespace-pre-wrap bg-gray-800/30 p-3 rounded">
                                                        {resp.answer}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-700/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                    Showing {filteredHistory.length} of {history.length} conversations
                </p>
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300 transition-all flex items-center"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        Back to Top
                    </button>
                </div>
            </div>
        </div>
    );
}