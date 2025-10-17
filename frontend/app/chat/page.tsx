'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatForm from '@/components/chat/ChatForm';
import Responses from '@/components/chat/Responses';
import History from '@/components/chat/History';
import AuthForm from '@/components/auth/AuthForm';
import { Twitter, Github, Linkedin } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Response {
    model: string;
    answer: string;
}

interface HistoryItem {
    question: string;
    mode: string;
    selectedModel?: string;
    responses: Response[];
    createdAt: string;
}

type ViewMode = 'chat' | 'history';

export default function Chat() {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [responses, setResponses] = useState<Response[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('chat');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const availableModels = [
    'llama-3.1-8b-instant',
    'qwen/qwen3-32b', 
    'groq/compound-mini',
    'openai/gpt-oss-20b',
    'moonshotai/kimi-k2-instruct-0905'
];

const modelBrands: Record<string, string> = {
    'llama-3.1-8b-instant': 'Meta',
    'qwen/qwen3-32b': 'Alibaba',
    'groq/compound-mini': 'Groq',
    'openai/gpt-oss-20b': 'OpenAI',
    'moonshotai/kimi-k2-instruct-0905': 'Moonshot AI'
};

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchProfile(storedToken);
            fetchHistory(storedToken);
        }
    }, []);

    const fetchProfile = async (token: string) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser({
                ...res.data,
                avatar: res.data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(res.data.name)}&background=random`
            });
        } catch (err) {
            setError('Failed to fetch profile. Please login again.');
            handleLogout();
        }
    };

    const fetchHistory = async (token: string) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(res.data);
        } catch (err) {
            setError('Failed to fetch history');
        }
    };

    const handleAuthSuccess = (token: string, userData: User) => {
        const user = {
            ...userData,
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
        };
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        fetchHistory(token);
        setViewMode('chat');
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        setResponses([]);
        setHistory([]);
        localStorage.removeItem('token');
    };

    const handleChat = async (question: string, mode: 'multi' | 'single', selectedModel: string) => {
        if (!token) return;

        setIsLoading(true);
        try {
            const endpoint = mode === 'multi' ? '/api/chat/multi' : '/api/chat/single';
            const data = mode === 'multi' ? { question } : { question, model: selectedModel };

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setResponses(mode === 'multi' ? res.data.responses : [res.data.response]);
            fetchHistory(token);
            setError(null);
            setViewMode('chat');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Chat request failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            {/* Header */}
            <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
                    <div className="flex items-center justify-between h-12">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <svg className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                                    <a href='/'>ParallelAI</a>
                                </span>
                            </div>
                        </div>

                        {user && (
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <div className="ml-3 relative">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                            <div className="relative">
                                                <img
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-gray-800"></span>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="ml-2 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        {user && (
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        {isMobileMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && user && (
                    <div className="md:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50">
                        <div className="px-4 pt-4 pb-3 space-y-3 sm:px-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {error && (
                    <div className="mb-6 bg-red-900/50 border border-red-500/50 text-white p-4 rounded-lg backdrop-blur-sm flex items-start">
                        <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-200">Error</h3>
                            <p className="mt-1 text-sm text-red-100">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md text-red-300 hover:text-red-100 focus:outline-none"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {!user ? (
                    <div className="flex justify-center items-center min-h-[70vh]">
                        <div className="w-full max-w-md">
                            <AuthForm onAuthSuccess={handleAuthSuccess} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Mobile drawer toggle button */}
                        <div className="lg:hidden flex justify-between items-center">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/30">
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => setViewMode('chat')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'chat'
                                            ? 'bg-blue-600/90 text-white shadow-md'
                                            : 'text-gray-300 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>Chat</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('history')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'history'
                                            ? 'bg-blue-600/90 text-white shadow-md'
                                            : 'text-gray-300 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>History</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                                className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-300 hover:bg-gray-700/50 transition-all flex items-center"
                            >
                                {isMobileDrawerOpen ? (
                                    <>
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Close</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                        <span>Menu</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Mobile drawer */}
                        <div className={`lg:hidden fixed inset-x-0 bottom-0 z-10 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50 transition-all duration-300 ease-in-out transform ${isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3 flex items-center text-gray-200">
                                            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            AI Models
                                        </h3>
                                        <ul className="space-y-2">
                                            {availableModels.map((model) => (
                                                <li key={model}>
                                                    <div className="text-sm text-gray-300 bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all flex items-center justify-between">
                                                        <span className="truncate">{model}</span>
                                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-blue-300">
                                                            {modelBrands[model] || 'AI'}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3 flex items-center text-gray-200">
                                            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Statistics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-700/30 p-3 rounded-lg">
                                                <p className="text-gray-400 text-xs">Total Chats</p>
                                                <p className="text-lg font-semibold text-white">{history.length}</p>
                                            </div>
                                            <div className="bg-gray-700/30 p-3 rounded-lg">
                                                <p className="text-gray-400 text-xs">Last Active</p>
                                                <p className="text-white text-sm">
                                                    {history[0] ?
                                                        new Date(history[0].createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : 'Never'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Sidebar - Desktop */}
                            <div className="hidden lg:block lg:w-1/5">
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 h-full sticky top-24">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 flex items-center text-gray-200">
                                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                                AI Models
                                            </h3>
                                            <ul className="space-y-2">
                                                {availableModels.map((model) => (
                                                    <li key={model}>
                                                        <div className="text-sm text-gray-300 bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all flex items-center justify-between">
                                                            <span className="truncate">{model}</span>
                                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-blue-300">
                                                                {modelBrands[model] || 'AI'}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 flex items-center text-gray-200">
                                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                Statistics
                                            </h3>
                                            <div className="text-sm space-y-3">
                                                <div className="bg-gray-700/30 p-3 rounded-lg">
                                                    <p className="text-gray-400">Total Chats</p>
                                                    <p className="text-xl font-semibold text-white">{history.length}</p>
                                                </div>
                                                <div className="bg-gray-700/30 p-3 rounded-lg">
                                                    <p className="text-gray-400">Last Active</p>
                                                    <p className="text-white">
                                                        {history[0] ?
                                                            new Date(history[0].createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                            : 'Never'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="w-full lg:w-4/5 space-y-6">
                                {/* View mode toggle - Desktop */}
                                <div className="hidden lg:block bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 w-fit border border-gray-700/30">
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => setViewMode('chat')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'chat'
                                                ? 'bg-blue-600/90 text-white shadow-md'
                                                : 'text-gray-300 hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <span>Chat Interface</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setViewMode('history')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'history'
                                                ? 'bg-blue-600/90 text-white shadow-md'
                                                : 'text-gray-300 hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Conversation History</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {viewMode === 'chat' ? (
                                    <>
                                        <ChatForm
                                            onSubmit={handleChat}
                                            availableModels={availableModels}
                                            isLoading={isLoading}
                                        />
                                        <Responses responses={responses} />
                                    </>
                                ) : (
                                    <History history={history} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            {isMobileDrawerOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/30 z-[5] backdrop-blur-sm"
                    onClick={() => setIsMobileDrawerOpen(false)}
                />
            )}
            <footer className="relative z-10 px-6 py-20 border-t border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-gray-950">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-3 mb-8 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                                    ParallelAI
                                </span>
                            </div>
                            <p className="text-gray-400 max-w-md leading-relaxed text-lg mb-8">
                                Revolutionizing AI interaction through parallel intelligence. Get the most accurate answers by leveraging multiple AI models simultaneously.
                            </p>
                            <div className="flex space-x-5">
                                {[
                                    { name: 'twitter', icon: <Twitter className="w-5 h-5" />, color: 'hover:text-blue-400' },
                                    { name: 'github', icon: <Github className="w-5 h-5" />, color: 'hover:text-gray-200' },
                                    { name: 'linkedin', icon: <Linkedin className="w-5 h-5" />, color: 'hover:text-blue-500' },
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href="#"
                                        className={`w-12 h-12 bg-gray-800/50 hover:bg-gray-700/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-700/50 hover:border-blue-500/50 ${social.color}`}
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-6 text-white">Product</h3>
                            <ul className="space-y-4 text-gray-400 text-lg">
                                {['Features', 'Documentation'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-white transition-colors duration-300 flex items-center">
                                            <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-6 text-white">Company</h3>
                            <ul className="space-y-4 text-gray-400 text-lg">
                                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-white transition-colors duration-300 flex items-center">
                                            <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800/50 pt-12 text-center">
                        <p className="text-gray-500 text-lg">
                            © 2025 ParallelAI. All rights reserved. (Chinmaye HG)
                        </p>
                    </div>
                </div>
            </footer>
        </div>

    );
}
