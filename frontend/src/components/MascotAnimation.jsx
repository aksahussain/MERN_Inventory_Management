import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const MascotAnimation = ({ onComplete }) => {
    const controls = useAnimation();
    const bagControls = useAnimation();
    const [isWalking, setIsWalking] = useState(true);

    useEffect(() => {
        const runAnimation = async () => {
            // 1. Walk in from left
            await controls.start({
                x: 0,
                opacity: 1,
                transition: { duration: 2, ease: "easeOut" }
            });

            setIsWalking(false);

            // 2. Pause briefly
            await new Promise(resolve => setTimeout(resolve, 500));

            // 3. Put bag down
            await bagControls.start({
                y: 120,
                x: -40,
                rotate: 0,
                transition: { duration: 0.8, type: "spring", stiffness: 100 }
            });

            // 4. Trigger completion
            if (onComplete) onComplete();
        };

        runAnimation();
    }, [controls, bagControls, onComplete]);

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none">
            <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={controls}
                className="relative"
            >
                <svg width="250" height="400" viewBox="0 0 250 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shadow */}
                    <ellipse cx="125" cy="380" rx="60" ry="10" fill="rgba(0,0,0,0.1)" />

                    {/* Legs */}
                    <motion.g
                        animate={isWalking ? {
                            rotate: [0, -10, 0, 10, 0]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                    >
                        <rect x="105" y="300" width="15" height="70" rx="7.5" fill="#1a1a1a" />
                        <rect x="130" y="300" width="15" height="70" rx="7.5" fill="#1a1a1a" />
                    </motion.g>

                    {/* Body/Suit */}
                    <rect x="85" y="160" width="80" height="150" rx="20" fill="#cbd5e1" />
                    <path d="M85 180C85 168.954 93.9543 160 105 160H145C156.046 160 165 168.954 165 180V240L125 260L85 240V180Z" fill="#94a3b8" />

                    {/* Shirt/Tie */}
                    <path d="M115 160L125 190L135 160H115Z" fill="white" />
                    <path d="M122 170V200L125 205L128 200V170H122Z" fill="#ef4444" />

                    {/* Head */}
                    <circle cx="125" cy="110" r="45" fill="#fde68a" />

                    {/* Hair & Beard */}
                    <path d="M85 90C85 70 100 55 125 55C150 55 165 70 165 90H85Z" fill="#d97706" />
                    <path d="M90 125C90 145 110 155 125 155C140 155 160 145 160 125C160 135 150 145 125 145C100 145 90 135 90 125Z" fill="#d97706" />

                    {/* Eyes */}
                    <circle cx="110" cy="105" r="3" fill="#1a1a1a" />
                    <circle cx="140" cy="105" r="3" fill="#1a1a1a" />

                    {/* Arms */}
                    {/* Left Arm (Holding Bag) */}
                    <motion.rect
                        x="55" y="180" width="15" height="80" rx="7.5" fill="#94a3b8"
                        animate={isWalking ? { rotate: [-10, 10, -10] } : { rotate: 20 }}
                        style={{ originX: "62px", originY: "185px" }}
                    />

                    {/* Right Arm */}
                    <motion.rect
                        x="180" y="180" width="15" height="80" rx="7.5" fill="#94a3b8"
                        animate={isWalking ? { rotate: [10, -10, 10] } : {}}
                        style={{ originX: "187px", originY: "185px" }}
                    />

                    {/* The Bag */}
                    <motion.g
                        initial={{ y: 0, x: 0, rotate: 10 }}
                        animate={bagControls}
                        className="origin-top"
                    >
                        <rect x="30" y="240" width="50" height="40" rx="8" fill="#4b5563" />
                        <path d="M45 240V230C45 225 48 222 55 222C62 222 65 225 65 230V240" stroke="#374151" strokeWidth="4" fill="none" />
                        <rect x="35" y="250" width="40" height="4" rx="2" fill="#374151" />
                    </motion.g>
                </svg>
            </motion.div>
        </div>
    );
};

export default MascotAnimation;
