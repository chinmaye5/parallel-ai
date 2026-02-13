import { useState } from 'react';
import axios from 'axios';
import { Brain, Lock, Mail, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

interface AuthFormProps {
    onAuthSuccess: (token: string, user: any) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!loginData.email || !loginData.password) {
            setError('All fields are required');
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, loginData);
            if (res.data.token && res.data.user) {
                onAuthSuccess(res.data.token, res.data.user);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, registerData);
            onAuthSuccess(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[400px] mx-auto p-8 rounded-[2.5rem] bg-gray-950 border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">
                            {isLogin ? 'Protocol Login' : 'Register Node'}
                        </h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                            Parallel Intelligence Interface
                        </p>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Access
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Enroll
                    </button>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 animate-shake">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest text-center">
                            {error}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Identity Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-medium text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Network Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                value={isLogin ? loginData.email : registerData.email}
                                onChange={(e) => isLogin
                                    ? setLoginData({ ...loginData, email: e.target.value })
                                    : setRegisterData({ ...registerData, email: e.target.value })}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-medium text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Access Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={isLogin ? loginData.password : registerData.password}
                                onChange={(e) => isLogin
                                    ? setLoginData({ ...loginData, password: e.target.value })
                                    : setRegisterData({ ...registerData, password: e.target.value })}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-medium text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full group/btn relative overflow-hidden py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Initialize Interface</span>
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </form>

                <p className="text-center text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                    Authorized Access Only
                </p>
            </div>
        </div>
    );
}
