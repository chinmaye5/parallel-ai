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
        'openai/gpt-oss-120b',
        'llama-3.3-70b-versatile',
        'qwen/qwen3.8-27b',
        'groq/compound-mini',
        'moonshotai/kimi-k2-instruct'
    ];

    const modelBrands: Record<string, string> = {
        'openai/gpt-oss-120b': 'OpenAI',
        'llama-3.3-70b-versatile': 'Meta',
        'qwen/qwen3.8-27b': 'Alibaba',
        'groq/compound-mini': 'Groq',
        'moonshotai/kimi-k2-instruct': 'Moonshot AI'
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
            <div className="min-h-screen bg-[#0e0e11] text-[#f4f4f0] flex items-center justify-center p-4 relative font-mono">
                <div className="relative w-full max-w-md z-10 animate-fadeIn">
                    <AuthForm onAuthSuccess={handleAuthSuccess} />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-[#0e0e11] text-[#f4f4f0] overflow-hidden font-sans relative">
            {isMobileSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 z-40 transition-opacity"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Neo-Brutalist Sidebar */}
            <aside className={`
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                ${isSidebarOpen ? 'lg:w-[290px]' : 'lg:w-0 lg:overflow-hidden'}
                fixed lg:relative z-50 lg:z-auto w-[290px] h-full
                bg-[#121217] border-r-2 border-black transition-all duration-200
                flex flex-col font-mono
            `}>
                {/* Brand Banner */}
                <div className="p-4 border-b-2 border-black bg-violet-400 text-black flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
                        <div className="w-7 h-7 bg-black text-violet-400 border border-black flex items-center justify-center font-black text-sm">
                            P
                        </div>
                        <h1 className="text-sm font-black uppercase tracking-tight">PARALLEL<span className="bg-black text-violet-400 px-1 ml-0.5">AI</span></h1>
                    </Link>
                    <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden p-1 text-black hover:opacity-75">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Action button */}
                <div className="p-3 border-b-2 border-black bg-[#16161d]">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-white text-black border-2 border-black font-extrabold text-xs uppercase tracking-wider brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span>[+] NEW SESSION</span>
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar space-y-3">
                    <div className="flex items-center justify-between px-1 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-[#23232c] pb-1">
                        <span>SESSION LOGS</span>
                        <span className="font-mono">REC</span>
                    </div>
                    <History
                        history={history}
                        onLoadHistory={handleLoadHistory}
                        onDeleteHistory={handleDeleteHistory}
                        compact={true}
                    />
                </div>

                {/* User Status Bar */}
                <div className="p-3 border-t-2 border-black bg-[#16161d] relative">
                    {isProfileOpen && (
                        <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#121217] border-2 border-black brutal-shadow p-2 z-[60] animate-fadeIn">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-2 p-2 bg-rose-500 hover:bg-rose-600 text-black border border-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>ABORT / LOG OUT</span>
                            </button>
                        </div>
                    )}
                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center justify-between bg-black/60 p-2 border-2 border-black hover:border-violet-400 transition-all cursor-pointer"
                    >
                        <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-7 h-7 bg-violet-400 text-black border border-black flex items-center justify-center text-[10px] font-black uppercase flex-shrink-0">
                                {user.name?.substring(0, 2) || 'OP'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-white truncate font-mono uppercase">{user.name}</p>
                                <p className="text-[9px] text-gray-400 truncate font-mono">{user.email}</p>
                            </div>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180 text-violet-400' : ''}`} />
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-[#0e0e11]">
                {/* Neo-Brutalist Top HUD */}
                <header className="h-14 border-b-2 border-black bg-[#121217] flex items-center justify-between px-4 lg:px-6 z-40 sticky top-0 font-mono">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsMobileSidebarOpen(true);
                                else setIsSidebarOpen(!isSidebarOpen);
                            }}
                            className="p-1.5 bg-[#202028] hover:bg-[#2b2b36] border-2 border-black text-white brutal-shadow-sm cursor-pointer"
                            title="Toggle Sidebar"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider">
                            <span className="w-2 h-2 bg-emerald-400 inline-block border border-black animate-pulse"></span>
                            <span className="text-gray-300">STATUS: READY // 5 ACTIVE ENGINES</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className={`px-2.5 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest ${
                            isLoading 
                                ? 'bg-violet-400 text-black brutal-shadow-sm animate-pulse' 
                                : 'bg-[#1b1b22] text-emerald-400'
                        }`}>
                            {isLoading ? 'PROCESSING...' : 'CONNECTED'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative no-scrollbar">
                    {!hasStarted ? (
                        <div className="min-h-full flex flex-col items-center justify-center px-4 py-16 text-center relative font-mono">
                            <div className="max-w-2xl mx-auto z-10 space-y-6">
                                <div className="inline-block p-3 bg-violet-400 text-black border-2 border-black brutal-shadow-lg">
                                    <Brain className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl lg:text-5xl font-black text-white font-sans uppercase tracking-tight">
                                        PARALLEL<span className="bg-violet-400 text-black px-2 ml-1">CONSENSUS</span>
                                    </h2>
                                    <p className="text-xs lg:text-sm text-gray-400 max-w-lg mx-auto font-mono uppercase tracking-widest">
                                        Query 5 AI architectures simultaneously. Synthesize truth through algorithmic majority.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 max-w-xl mx-auto text-[10px] font-extrabold uppercase">
                                    <div className="p-2 bg-[#171720] border-2 border-black text-emerald-400 brutal-shadow-sm">OpenAI 120B</div>
                                    <div className="p-2 bg-[#171720] border-2 border-black text-blue-400 brutal-shadow-sm">Meta Llama</div>
                                    <div className="p-2 bg-[#171720] border-2 border-black text-amber-400 brutal-shadow-sm">Qwen 3.8</div>
                                    <div className="p-2 bg-[#171720] border-2 border-black text-purple-400 brutal-shadow-sm">Groq Mini</div>
                                    <div className="p-2 bg-[#171720] border-2 border-black text-rose-400 brutal-shadow-sm col-span-2 sm:col-span-1">Moonshot Kimi</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-[1500px] mx-auto px-4 lg:px-6 pt-6 pb-40 space-y-8">
                            {conversation.map((entry, index) => (
                                <div key={index} className="space-y-4 animate-fadeIn">
                                    {/* User Question in Neo-Brutalist Frame */}
                                    <div className="flex justify-end pr-1">
                                        <div className="max-w-[85%] lg:max-w-2xl bg-white text-black border-2 border-black brutal-shadow p-3 lg:p-4">
                                            <div className="flex items-center space-x-1.5 mb-1 pb-1 border-b border-black/20 text-[9px] font-mono font-black uppercase tracking-wider text-gray-700">
                                                <span>PROMPT // CLIENT DISPATCH</span>
                                            </div>
                                            <p className="text-black text-sm lg:text-base font-bold font-sans leading-snug">
                                                {entry.question}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Response Grid */}
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

                {/* Floating Bottom Input Bar */}
                <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center pointer-events-none">
                    <div className="w-full pointer-events-auto max-w-4xl px-3 lg:px-0">
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
