'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ChatForm from '@/components/chat/ChatForm';
import Responses from '@/components/chat/Responses';
import History from '@/components/chat/History';
import AuthForm from '@/components/auth/AuthForm';
import { PanelLeftClose, PanelLeftOpen, Sparkles, Brain, Menu, X, LogOut, Zap, Clock, ChevronDown } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Response {
    model: string;
    answer: string;
    status?: string;
    responseTime?: number;
}

interface ConversationEntry {
    id?: string;
    question: string;
    mode: 'multi' | 'single';
    selectedModel?: string;
    responses: Response[];
    consensus?: Response;
    timestamp: Date;
    isConsensusLoading?: boolean;
}


interface HistoryItem {
    id: string;
    question: string;
    mode: string;
    selectedModel?: string;
    responses: Response[];
    consensus?: Response;
    createdAt: string;
}

export default function Chat() {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [conversation, setConversation] = useState<ConversationEntry[]>([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation, isLoading]);

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

    const handleDeleteHistory = async (id: string) => {
        if (!token) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(prev => prev.filter(item => item.id !== id));
            // If the deleted chat is the current one, reset view
            if (conversation.length > 0 && conversation[0].id === id) {
                handleNewChat();
            }
        } catch (err) {
            setError('Failed to delete history');
        }
    };

    const handleAuthSuccess = (token: string, userData: User) => {
        const user = { ...userData, avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random` };
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        fetchHistory(token);
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        setConversation([]);
        setHistory([]);
        setHasStarted(false);
        localStorage.removeItem('token');
    };

    const handleNewChat = () => {
        setConversation([]);
        setHasStarted(false);
        setError(null);
        setIsMobileSidebarOpen(false);
    };

    const handleLoadHistory = (item: HistoryItem) => {
        setConversation([{
            id: item.id,
            question: item.question,
            mode: item.mode as 'multi' | 'single',
            selectedModel: item.selectedModel,
            responses: item.responses,
            consensus: item.consensus,
            timestamp: new Date(item.createdAt)
        }]);
        setHasStarted(true);
        setIsMobileSidebarOpen(false);
    };


    const handleChat = async (question: string, mode: 'multi' | 'single', selectedModel: string) => {
        if (!token) return;

        setHasStarted(true);
        setIsLoading(true);

        const newEntryIdx = conversation.length;
        const newEntry: ConversationEntry = {
            question,
            mode,
            selectedModel: mode === 'single' ? selectedModel : undefined,
            responses: [],
            timestamp: new Date(),
            isConsensusLoading: mode === 'multi'
        };

        setConversation(prev => [...prev, newEntry]);

        try {
            if (mode === 'single') {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/single`,
                    { question, model: selectedModel },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setConversation(prev => {
                    const updated = [...prev];
                    updated[newEntryIdx] = { ...updated[newEntryIdx], responses: [res.data.response], isConsensusLoading: false };
                    return updated;
                });
            } else {
                const modelPromises = availableModels.map(async (model) => {
                    try {
                        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/single`,
                            { question, model, save: false },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        setConversation(prev => {
                            const updated = [...prev];
                            const currentResponses = [...updated[newEntryIdx].responses, res.data.response];
                            updated[newEntryIdx] = { ...updated[newEntryIdx], responses: currentResponses };
                            return updated;
                        });
                        return res.data.response;
                    } catch (err) {
                        const errorResp = { model, answer: 'Failed to fetch response', status: 'error' };
                        setConversation(prev => {
                            const updated = [...prev];
                            if (updated[newEntryIdx]) {
                                updated[newEntryIdx].responses = [...updated[newEntryIdx].responses, errorResp];
                            }
                            return updated;
                        });
                        return errorResp;
                    }
                });

                const allResponses = await Promise.all(modelPromises);

                try {
                    const consensusRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/consensus`,
                        { question, responses: allResponses },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setConversation(prev => {
                        const updated = [...prev];
                        updated[newEntryIdx] = { ...updated[newEntryIdx], consensus: consensusRes.data.consensus, isConsensusLoading: false };
                        return updated;
                    });
                } catch (cErr) {
                    setConversation(prev => {
                        const updated = [...prev];
                        updated[newEntryIdx].isConsensusLoading = false;
                        return updated;
                    });
                }
            }

            fetchHistory(token);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Chat request failed');
            setConversation(prev => {
                const updated = [...prev];
                if (updated[newEntryIdx]) updated[newEntryIdx].isConsensusLoading = false;
                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative w-full max-w-md z-10 animate-fadeIn">
                    <AuthForm onAuthSuccess={handleAuthSuccess} />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-black text-gray-100 overflow-hidden font-sans relative">
            {isMobileSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-500"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Premium Sidebar */}
            <aside className={`
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                ${isSidebarOpen ? 'lg:w-[280px]' : 'lg:w-0 lg:overflow-hidden'}
                fixed lg:relative z-50 lg:z-auto w-[280px] h-full
                bg-gray-950 border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                flex flex-col shadow-2xl shadow-blue-500/5
            `}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group cursor-pointer transition-transform hover:scale-[1.02]">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-sm font-black text-white uppercase tracking-widest">Parallel<span className="text-blue-500">AI</span></h1>
                    </Link>
                    <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>


                <div className="p-4">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
                    >
                        <Zap className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">New Session</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-none">
                    <div className="flex items-center space-x-2 px-2 mb-4">
                        <Clock className="w-3.5 h-3.5 text-gray-600" />
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Recent Intelligence</span>
                    </div>
                    <History
                        history={history}
                        onLoadHistory={handleLoadHistory}
                        onDeleteHistory={handleDeleteHistory}
                        compact={true}
                    />

                </div>

                <div className="p-4 border-t border-white/5 bg-black/40 relative">
                    {isProfileOpen && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl animate-fadeIn overflow-hidden z-[60]">
                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">Log Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center justify-between bg-white/[0.03] p-3 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all cursor-pointer group"
                    >
                        <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-lg shadow-blue-500/20 flex-shrink-0">
                                {user.name?.substring(0, 2) || 'AI'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-white truncate">{user.name}</p>
                                <p className="text-[9px] text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-600 group-hover:text-gray-300 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-black">
                <header className="h-16 lg:h-20 border-b border-white/[0.03] bg-black/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsMobileSidebarOpen(true);
                                else setIsSidebarOpen(!isSidebarOpen);
                            }}
                            className="p-2 lg:p-2.5 rounded-xl bg-white/[0.03] text-gray-400 hover:text-white transition-all border border-white/5"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-[8px] lg:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Interface</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isLoading ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20' : 'bg-white/5 text-gray-500'}`}>
                            <span className="hidden sm:inline">{isLoading ? 'Synthesizing...' : 'Link Ready'}</span>
                            <span className="sm:hidden">{isLoading ? '...' : 'Ready'}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative no-scrollbar">
                    {!hasStarted ? (
                        <div className="min-h-full flex flex-col items-center justify-center px-6 py-20 text-center relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-blue-600/5 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none"></div>

                            <div className="max-w-3xl mx-auto z-10 space-y-8 lg:space-y-12">
                                <div className="space-y-4 lg:space-y-6">
                                    <div className="inline-block p-3 lg:p-4 rounded-2xl lg:rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-600/40">
                                        <Brain className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                                    </div>
                                    <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-tight lg:leading-none">
                                        COLLECTIVE <br />
                                        <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent uppercase">Intelligence</span>
                                    </h2>
                                    <p className="text-sm lg:text-xl text-gray-500 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-widest px-4">
                                        Parallel processing across 5 flagship models.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-[1640px] mx-auto px-4 lg:px-6 pt-6 lg:pt-10 pb-40 space-y-12 lg:space-y-16">
                            {conversation.map((entry, index) => (
                                <div key={index} className="space-y-8 lg:space-y-12 animate-fadeIn">
                                    <div className="flex justify-end pr-2 lg:pr-4">
                                        <div className="max-w-[85%] lg:max-w-xl bg-white/[0.03] border border-white/5 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl relative">
                                            <p className="text-gray-200 text-sm lg:text-lg leading-relaxed font-semibold">{entry.question}</p>
                                        </div>
                                    </div>
                                    <Responses
                                        responses={entry.responses}
                                        modelBrands={modelBrands}
                                        consensus={entry.consensus}
                                        isConsensusLoading={entry.isConsensusLoading}
                                    />
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </main>

                <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none">
                    <div className="w-full pointer-events-auto max-w-4xl px-4 lg:px-0">
                        <ChatForm
                            onSubmit={handleChat}
                            availableModels={availableModels}
                            isLoading={isLoading}
                            modelBrands={modelBrands}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
