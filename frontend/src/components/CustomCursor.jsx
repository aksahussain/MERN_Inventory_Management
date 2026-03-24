import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const mouseX = useSpring(0, { stiffness: 250, damping: 40 }); // Smoother, less snappy
    const mouseY = useSpring(0, { stiffness: 250, damping: 40 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [mouseX, mouseY, isVisible]);

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                x: mouseX,
                y: mouseY,
                pointerEvents: 'none',
                zIndex: 9999,
                display: isVisible ? 'block' : 'none'
            }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'translate(-5px, -5px)' }}
            >
                <path
                    d="M3 3L21 12L12 14L10 21L3 3Z"
                    fill="black"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        </motion.div>
    );
};

export default CustomCursor;
