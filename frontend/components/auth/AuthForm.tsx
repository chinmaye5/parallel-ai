import { useState } from 'react';
import axios from 'axios';

interface AuthFormProps {
    onAuthSuccess: (token: string, user: any) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

    // Update the handleLogin function in AuthForm.tsx
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!loginData.email || !loginData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            console.log('Attempting login with:', loginData); // Debug log
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Login response:', res.data); // Debug log

            if (res.data.token && res.data.user) {
                onAuthSuccess(res.data.token, res.data.user);
                setLoginData({ email: '', password: '' });
                setError(null);
            } else {
                setError('Invalid response from server');
            }
        } catch (err: any) {
            console.error('Login error:', err); // Debug log

            if (err.response) {
                // Server responded with error status
                setError(err.response.data?.message ||
                    `Login failed (${err.response.status})`);
            } else if (err.request) {
                // Request was made but no response received
                setError('No response from server. Check your connection.');
            } else {
                // Other errors
                setError('Login request failed. Please try again.');
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, registerData);
            onAuthSuccess(res.data.token, res.data.user);
            setRegisterData({ name: '', email: '', password: '' });
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError(null);
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Toggle tabs */}
            <div className="flex mb-6 border-b border-gray-600">
                <button
                    className={`flex-1 py-2 font-medium ${isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={`flex-1 py-2 font-medium ${!isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-2 bg-red-900 text-red-200 rounded-md">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                {isLogin ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Name"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                placeholder="Email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                id="reg-password"
                                type="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
                        >
                            Register
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        onClick={toggleAuthMode}
                        className="text-blue-400 hover:text-blue-300 focus:outline-none"
                    >
                        {isLogin ? 'Register here' : 'Login here'}
                    </button>
                </div>
            </div>
        </div>
    );
}