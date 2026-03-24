import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, User } from 'lucide-react';
import MascotAnimation from '../components/MascotAnimation';
import CustomCursor from '../components/CustomCursor';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const { data } = await API.post('/auth/forgotpassword', { email });

            // Web3Forms Integration (Frontend Submission)
            const web3Response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: '7412b122-a7fb-495a-94ff-f9d3ed8647c8',
                    subject: "Password Reset Request - IMS Pro",
                    from_name: "IMS Pro System",
                    message: `A password reset has been requested for: ${data.data.userEmail}\n\nReset Link: ${data.data.resetUrl}\n\nPlease provide this link to the user.`
                })
            });

            const web3Result = await web3Response.json();

            if (web3Result.success) {
                setMessage('Reset link has been sent to the administrator. Please contact them for the link.');
                setEmail('');
            } else {
                setError('Link generated, but failed to notify admin. Please contact support.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-dark-bg transition-all duration-700 overflow-hidden" style={{ cursor: 'none' }}>
            {/* Left Side: Mascot Animation */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative bg-white dark:bg-dark-card border-r border-gray-100 dark:border-gray-800">
                <div className="absolute top-12 left-12 flex items-center space-x-2">
                    <div className="bg-primary-600 p-2 rounded-lg shadow-lg">
                        <User className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">InventoPro</span>
                </div>

                <MascotAnimation onComplete={() => setIsAnimationComplete(true)} />

                <div className="mt-8 text-center max-w-sm">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Don't Worry!</h3>
                    <p className="text-gray-500 dark:text-gray-400">We'll help you get back into your account in no time.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative bg-gray-50 dark:bg-dark-bg">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-8 flex items-center space-x-2">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <User className="text-white" size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">InventoPro</span>
                </div>

                <AnimatePresence>
                    {isAnimationComplete && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="max-w-md w-full"
                        >
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                    Lost Access?
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Enter your email to reset your password</p>
                            </div>

                            {message && (
                                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm mb-6 text-center shadow-sm">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 text-center shadow-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-white shadow-sm"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20 disabled:opacity-50"
                                >
                                    {isLoading ? <span>Scheduling Reset...</span> : (
                                        <>
                                            <span>Send Reset Link</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 text-center text-sm">
                                <Link to="/login" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center justify-center space-x-2 transition-colors">
                                    <ArrowLeft size={16} />
                                    <span>Back to Login</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isAnimationComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="lg:hidden flex flex-col items-center"
                    >
                        <MascotAnimation onComplete={() => setIsAnimationComplete(true)} />
                        <p className="text-gray-500 mt-4 animate-pulse">Wait for it...</p>
                    </motion.div>
                )}
            </div>
            {isAnimationComplete && <CustomCursor />}
        </div>
    );
};

export default ForgotPassword;
