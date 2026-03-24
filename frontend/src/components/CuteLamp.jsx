import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const CuteLamp = ({ onToggle, initialOn = false }) => {
    const [isOn, setIsOn] = useState(initialOn);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const controls = useAnimation();

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const x = (clientX - window.innerWidth / 2) / 40;
            const y = (clientY - window.innerHeight / 2) / 40;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const toggleLamp = () => {
        const newState = !isOn;
        setIsOn(newState);
        if (onToggle) onToggle(newState);

        controls.start({
            y: [0, 20, 0],
            transition: { duration: 0.2, ease: "easeOut" }
        });
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-visible bg-transparent">
            {/* Background Glow */}
            <motion.div
                animate={{
                    opacity: isOn ? 1 : 0.05,
                    scale: isOn ? 1.4 : 0.8,
                }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-gradient-radial from-green-500/30 to-transparent pointer-events-none blur-[100px]"
            />

            <div className="relative z-10 scale-[1.8]">
                {/* Light Beam */}
                <motion.div
                    animate={{
                        opacity: isOn ? 0.6 : 0,
                        height: isOn ? 400 : 0
                    }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 50 }}
                    className="absolute top-24 left-1/2 -translate-x-1/2 w-64 bg-gradient-to-b from-white/80 via-green-200/30 to-transparent blur-3xl origin-top pointer-events-none"
                    style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
                />

                <svg width="140" height="240" viewBox="0 0 140 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <defs>
                        {/* Clip Path to keep face inside the shade */}
                        <clipPath id="shadeClip">
                            <path d="M35 120L10 30H130L105 120H35Z" />
                        </clipPath>
                    </defs>

                    {/* Lamp Base */}
                    <rect x="65" y="120" width="10" height="90" rx="5" fill="#f1f5f9" />
                    <ellipse cx="70" cy="210" rx="40" ry="12" fill="#cbd5e1" />
                    <ellipse cx="70" cy="206" rx="35" ry="8" fill="#e2e8f0" />

                    {/* Lamp Shade */}
                    <motion.path
                        animate={{
                            fill: isOn ? '#4ade80' : '#166534',
                            stroke: isOn ? '#166534' : '#064e3b'
                        }}
                        transition={{ duration: 0.4 }}
                        d="M35 120L10 30H130L105 120H35Z"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />

                    {/* Face (Clipped to stay inside lamp) */}
                    <motion.g
                        clipPath="url(#shadeClip)"
                        animate={{
                            x: mousePos.x * 0.4,
                            y: mousePos.y * 0.2 + (isOn ? Math.sin(Date.now() / 100) * 2 : 0)
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 12 }}
                    >
                        {/* Eyes */}
                        {isOn ? (
                            <g>
                                <motion.circle
                                    animate={{ scaleY: [1, 0.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.4 }}
                                    cx="50" cy="65" r="5" fill="#064e3b"
                                />
                                <motion.circle
                                    animate={{ scaleY: [1, 0.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.4 }}
                                    cx="90" cy="65" r="5" fill="#064e3b"
                                />
                                <circle cx="51.5" cy="63.5" r="2" fill="white" />
                                <circle cx="91.5" cy="63.5" r="2" fill="white" />
                            </g>
                        ) : (
                            <g stroke="#064e3b" strokeWidth="2.5" fill="none" strokeLinecap="round">
                                <path d="M45 68 Q50 62 55 68" />
                                <path d="M85 68 Q90 62 95 68" />
                            </g>
                        )}

                        {/* Mouth - Laughing Animation */}
                        <AnimatePresence mode="wait">
                            {isOn ? (
                                <motion.g
                                    key="laughing"
                                    initial={{ scale: 0, opacity: 0, x: 62, y: 78 }}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: 1,
                                        x: 62,
                                        y: 78
                                    }}
                                    transition={{
                                        scale: { repeat: Infinity, duration: 0.3 }
                                    }}
                                >
                                    {/* Only the smile line, no tongue ball */}
                                    <path d="M0 0C0 8 16 8 16 0" stroke="#064e3b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                </motion.g>
                            ) : (
                                <motion.path
                                    key="silent"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    d="M62 82 Q70 85 78 82"
                                    stroke="#064e3b" strokeWidth="2.5" fill="none" strokeLinecap="round"
                                />
                            )}
                        </AnimatePresence>
                    </motion.g>

                    {/* Pull Cord */}
                    <motion.g
                        animate={controls}
                        onClick={toggleLamp}
                        className="group"
                    >
                        <line x1="95" y1="120" x2="95" y2="170" stroke="#94a3b8" strokeWidth="2.5" />
                        <circle
                            cx="95" cy="175" r="7"
                            fill={isOn ? "#f87171" : "#64748b"}
                            className="transition-colors duration-300 group-hover:fill-red-500"
                        />
                        <circle cx="95" cy="160" r="30" fill="transparent" />
                    </motion.g>
                </svg>
            </div>
        </div>
    );
};

export default CuteLamp;
