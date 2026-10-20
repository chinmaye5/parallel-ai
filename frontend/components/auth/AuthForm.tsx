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
        <div className="w-full max-w-[420px] mx-auto p-6 bg-[#131317] border-2 border-black brutal-shadow-lg font-mono relative">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-2 border-b-2 border-black pb-4">
                    <div className="w-10 h-10 bg-violet-400 text-black border-2 border-black flex items-center justify-center font-black">
                        <Brain className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-base font-black text-white uppercase tracking-wider">
                            PARALLEL<span className="bg-violet-400 text-black px-1.5 ml-1">AUTH</span>
                        </h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                            ACCESS GATEWAY // LEVEL-0
                        </p>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2 bg-[#0c0c0f] p-1 border-2 border-black">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            isLogin ? 'bg-violet-400 text-black border border-black brutal-shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        SIGN IN
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            !isLogin ? 'bg-violet-400 text-black border border-black brutal-shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        REGISTER
                    </button>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="p-2.5 bg-rose-500/20 border-2 border-rose-500 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider">
                        [!] {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">IDENTITY_NAME</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Operator Name"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 bg-[#1b1b24] border-2 border-black text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-violet-400"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">NETWORK_EMAIL</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="email"
                                placeholder="operator@domain.com"
                                value={isLogin ? loginData.email : registerData.email}
                                onChange={(e) => isLogin
                                    ? setLoginData({ ...loginData, email: e.target.value })
                                    : setRegisterData({ ...registerData, email: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-[#1b1b24] border-2 border-black text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-violet-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ACCESS_KEY</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                value={isLogin ? loginData.password : registerData.password}
                                onChange={(e) => isLogin
                                    ? setLoginData({ ...loginData, password: e.target.value })
                                    : setRegisterData({ ...registerData, password: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-[#1b1b24] border-2 border-black text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-violet-400"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-violet-400 hover:bg-violet-300 text-black border-2 border-black font-black text-xs uppercase tracking-widest brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-black" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'AUTHENTICATE SESSION' : 'INITIALIZE CREDENTIALS'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </span>
                    </button>

                    {isLoading && (
                        <div className="p-2 border border-dashed border-violet-400 text-center">
                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest animate-pulse">
                                COLD-START IN PROGRESS...
                            </p>
                        </div>
                    )}
                </form>

                <p className="text-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    SECURE INFERENCE TUNNEL // PARALLELAI
                </p>
            </div>
        </div>
    );
}
