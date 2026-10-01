import { useRef, useState } from 'react';

/**
 * TiltCard — Wraps any card element and adds a 3D tilt effect
 * with an inner light-glare that follows the cursor.
 *
 * Props:
 *  - maxTilt: maximum tilt angle in degrees (default 8)
 *  - glare: show a light-glare overlay (default true)
 *  - className: additional classes
 *  - children: card content
 *  - style: additional inline styles
 */
const TiltCard = ({
    children,
    maxTilt = 8,
    glare = true,
    className = '',
    style = {},
    ...rest
}) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)');
    const [shinePos, setShinePos] = useState({ x: '50%', y: '50%' });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;   // -0.5 → 0.5
        const y = (e.clientY - top) / height - 0.5;

        setTransform(
            `perspective(800px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale3d(1.02, 1.02, 1.02)`
        );

        // Shine position as percentage
        const shineX = ((e.clientX - left) / width) * 100;
        const shineY = ((e.clientY - top) / height) * 100;
        setShinePos({ x: `${shineX}%`, y: `${shineY}%` });
    };

    const handleMouseLeave = () => {
        setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <div
            ref={cardRef}
            className={`tilt-card ${className}`}
            style={{
                ...style,
                transform,
                transition: 'transform 0.15s ease-out',
                willChange: 'transform',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            {...rest}
        >
            {children}
            {glare && (
                <div
                    className="tilt-shine"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        background: `radial-gradient(600px circle at ${shinePos.x} ${shinePos.y}, rgba(255, 255, 255, 0.1) 0%, transparent 60%)`,
                    }}
                />
            )}
        </div>
    );
};

export default TiltCard;
