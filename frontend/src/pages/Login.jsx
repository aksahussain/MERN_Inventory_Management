import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import CuteLamp from '../components/CuteLamp';
import CustomCursor from '../components/CustomCursor';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLampOn, setIsLampOn] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className={`min-h-screen flex bg-white dark:bg-dark-bg transition-all duration-700 overflow-hidden ${!isLampOn ? 'grayscale-[0.5]' : ''}`} style={{ cursor: 'none' }}>
            <CustomCursor />

            {/* Floating Back Button */}
            <Link
                to="/"
                className={`absolute top-8 left-8 z-50 flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-500 backdrop-blur-md border ${isLampOn
                    ? 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white hover:text-primary-600'
                    : 'bg-black/30 border-slate-800 text-slate-400 hover:bg-black/50 hover:text-white'
                    }`}
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">Back</span>
            </Link>

            {/* Left Side: Cute Lamp Mascot */}
            <div className={`hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative transition-all duration-700 ${isLampOn ? 'bg-white dark:bg-dark-card' : 'bg-slate-950'}`}>
                <div className="absolute top-12 left-12 flex items-center space-x-2 z-20 opacity-0 pointer-events-none">
                    {/* Hide the old logo placement to avoid overlap with back button */}
                    <div className="bg-primary-600 p-2 rounded-lg shadow-lg">
                        <User className="text-white" size={24} />
                    </div>
                    <span className={`text-xl font-bold transition-colors duration-500 ${isLampOn ? 'text-gray-900 dark:text-white' : 'text-slate-700'}`}>InventoPro</span>
                </div>

                <div className="relative w-full h-[400px]">
                    <CuteLamp onToggle={setIsLampOn} initialOn={false} />
                </div>

                <div className={`mt-auto text-center max-w-sm transition-all duration-1000 ${isLampOn ? 'opacity-100 blur-0' : 'opacity-0 blur-sm pointer-events-none'}`}>
                    <h3 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${isLampOn ? 'text-gray-900 dark:text-white' : 'text-slate-600'}`}>Welcome back!</h3>
                    <p className={`transition-colors duration-500 ${isLampOn ? 'text-gray-500 dark:text-gray-400' : 'text-slate-700'}`}>Sign in to continue managing your professional inventory.</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className={`flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative transition-all duration-1000 ${isLampOn ? 'bg-gray-50 dark:bg-dark-bg' : 'bg-black'}`}>
                {/* Global Glow Effect */}
                <AnimatePresence>
                    {isLampOn && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-green-500/5 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-8 flex items-center space-x-2">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <User className="text-white" size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">InventoPro</span>
                </div>

                <AnimatePresence mode="wait">
                    {isLampOn && (
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                            className="max-w-md w-full z-10"
                        >
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                    Hello Again
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Enter your details to access your account</p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 text-center shadow-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Link to="/forgot-password" className="text-sm font-bold text-primary-600 hover:text-primary-700">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20"
                                >
                                    <span>Sign In</span>
                                    <ArrowRight size={20} />
                                </button>
                            </form>

                            <div className="mt-10 text-center text-sm space-y-6">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="font-bold ml-1 text-primary-600 hover:text-primary-700">
                                        Create Account
                                    </Link>
                                </p>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <Link to="/" className="flex items-center justify-center space-x-2 text-gray-400 hover:text-gray-600">
                                        <ArrowLeft size={16} />
                                        <span>Back to Home</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Mascot View */}
                <div className="lg:hidden mt-8 scale-75">
                    <CuteLamp onToggle={setIsLampOn} initialOn={false} />
                </div>
            </div>
        </div>
    );
};

export default Login;
