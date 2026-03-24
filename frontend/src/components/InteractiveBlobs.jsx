import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useSpring, useTransform } from 'framer-motion';

const Blob = ({ color, d, eyes, mouth, mouseX, mouseY, delay = 0, scale = 1, x = 0, y = 0, tiltAmount = 20, initial = { y: 50, opacity: 0 } }) => {
    const tiltX = useTransform(mouseX, [-50, 50], [tiltAmount, -tiltAmount]);
    const tiltY = useTransform(mouseY, [-50, 50], [-tiltAmount, tiltAmount]);

    // Parallax for face - now looks TOWARDS the cursor
    const faceX = useTransform(mouseX, [-50, 50], [-8, 8]);
    const faceY = useTransform(mouseY, [-50, 50], [-4, 4]);

    return (
        <motion.g
            initial={initial}
            animate={{ opacity: 1, scale: scale, y: y, x: x }}
            transition={{
                delay,
                duration: 1.2, // Slightly longer for elegance
                type: "spring",
                stiffness: 100,
                damping: 25 // Less bouncy, smoother stop
            }}
        >
            <motion.path
                d={d}
                fill={color}
                style={{
                    rotateX: tiltY,
                    rotateY: tiltX,
                    transformPerspective: 1000
                }}
            />

            {/* Face */}
            <motion.g style={{ x: faceX, y: faceY }}>
                {eyes && eyes.map((eye, i) => (
                    <circle key={i} cx={eye.x} cy={eye.y} r={eye.r || 2} fill="#1a1a1a" />
                ))}
                {mouth && (
                    <path d={mouth.d} stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                )}
            </motion.g>
        </motion.g>
    );
};

const InteractiveBlobs = () => {
    const mouseX = useSpring(0, { stiffness: 60, damping: 20 }); // Smoother, fluid tracking
    const mouseY = useSpring(0, { stiffness: 60, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 7;
            const y = (e.clientY - window.innerHeight / 2) / 7;
            mouseX.set(Math.max(-80, Math.min(80, x)));
            mouseY.set(Math.max(-80, Math.min(80, y)));
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative w-full h-[450px] flex items-center justify-center pointer-events-none">
            {/* Background Glow - Subtle & Constant */}
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent opacity-60 pointer-events-none" />

            <svg width="450" height="400" viewBox="0 0 450 400" className="overflow-visible z-10">
                <motion.g
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} // Very smooth, slow float
                >
                    {/* 1. Orange Blob (Jumps from BOTTOM) */}
                    <Blob
                        color="#ff8c42"
                        d="M50 350 Q40 280 120 280 Q220 280 200 350 L50 350 Z"
                        eyes={[{ x: 110, y: 315, r: 2.5 }, { x: 135, y: 315, r: 2.5 }]}
                        mouth={{ d: "M118 325 Q122 328 126 325" }}
                        mouseX={mouseX} mouseY={mouseY}
                        delay={0.4} x={-20} y={15}
                        tiltAmount={35}
                        initial={{ y: 200, opacity: 0 }}
                    />

                    {/* 2. Pink Blob (Jumps from TOP) */}
                    <Blob
                        color="#f472b6"
                        d="M180 350 Q170 180 230 180 Q290 180 280 350 L180 350 Z"
                        eyes={[{ x: 215, y: 205 }, { x: 235, y: 205 }]}
                        mouseX={mouseX} mouseY={mouseY}
                        delay={0.2} scale={0.9} x={25} y={-5}
                        tiltAmount={20}
                        initial={{ y: -200, opacity: 0 }}
                    />

                    {/* 3. Purple Blob (Jumps from LEFT) */}
                    <Blob
                        color="#a78bfa"
                        d="M100 350 Q90 80 170 80 Q250 80 240 350 L100 350 Z"
                        eyes={[{ x: 155, y: 110, r: 3 }, { x: 185, y: 110, r: 3 }]}
                        mouth={{ d: "M168 125 L172 170" }}
                        mouseX={mouseX} mouseY={mouseY}
                        delay={0.1} x={40}
                        tiltAmount={45}
                        initial={{ x: -250, opacity: 0 }}
                    />

                    {/* 4. Yellow Blob (Jumps from RIGHT) */}
                    <Blob
                        color="#fbbf24"
                        d="M250 350 Q240 220 320 220 Q400 220 380 350 L250 350 Z"
                        eyes={[{ x: 305, y: 250 }, { x: 310, y: 245 }]}
                        mouth={{ d: "M320 260 L365 245" }}
                        mouseX={mouseX} mouseY={mouseY}
                        delay={0.3} x={-5} y={20}
                        tiltAmount={30}
                        initial={{ x: 250, opacity: 0 }}
                    />
                </motion.g>
            </svg>
        </div>
    );
};

export default InteractiveBlobs;
