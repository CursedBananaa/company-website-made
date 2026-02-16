import React, { useEffect, useRef } from 'react';

interface AntigravityProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    colors?: string[];
    autoAnimate?: boolean;
    particleVariance?: number;
    rotationSpeed?: number;
    depthFactor?: number;
    pulseSpeed?: number;
    particleShape?: 'capsule' | 'circle' | 'square';
    fieldStrength?: number;
}

const Antigravity: React.FC<AntigravityProps> = ({
    count = 300,
    magnetRadius = 6,
    ringRadius = 7,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 1.5,
    lerpSpeed = 0.05,
    colors = ['#5227FF'],
    autoAnimate = true,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = 'capsule',
    fieldStrength = 10,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * canvas.width * 0.5;
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: particleSize + (Math.random() - 0.5) * particleVariance,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    angle: angle,
                    distance: dist,
                    phase: Math.random() * Math.PI * 2,
                    pulse: Math.random() * Math.PI * 2,
                    baseX: Math.random() * canvas.width,
                    baseY: Math.random() * canvas.height,
                });
            }
        };

        const animate = () => {
            time += 0.01 * waveSpeed;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((p) => {
                // Wave movement (base organic motion)
                const waveX = Math.sin(time + p.phase) * waveAmplitude * 5;
                const waveY = Math.cos(time + p.phase) * waveAmplitude * 5;

                // Base rotation if autoAnimate
                if (autoAnimate) {
                    p.angle += 0.001 * rotationSpeed;
                }

                // Mouse interaction - Physical Push/Repulsion
                const dx = p.x - mouseRef.current.x;
                const dy = p.y - mouseRef.current.y;
                const distToMouse = Math.sqrt(dx * dx + dy * dy);

                let targetX = p.baseX;
                let targetY = p.baseY;

                const interactRadius = magnetRadius * 60;
                if (distToMouse < interactRadius) {
                    const force = (1 - distToMouse / interactRadius) * (fieldStrength * 4);
                    targetX += (dx / distToMouse) * force;
                    targetY += (dy / distToMouse) * force;
                }

                // Combine base pattern with wave
                targetX += waveX;
                targetY += waveY;

                // Lerp movement for that "antigravity" floaty feel
                p.x += (targetX - p.x) * lerpSpeed;
                p.y += (targetY - p.y) * lerpSpeed;

                // Pulse
                let pulseScale = 1.0;
                let pulseAlpha = 0.7;

                if (pulseSpeed > 0) {
                    p.pulse += 0.01 * pulseSpeed;
                    pulseScale = (1 + Math.sin(p.pulse) * 0.2);
                    pulseAlpha = 0.6 + Math.sin(p.pulse) * 0.2;
                }

                const currentSize = p.size * pulseScale;

                // Draw
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);

                ctx.fillStyle = p.color;
                ctx.globalAlpha = pulseAlpha;

                if (particleShape === 'capsule') {
                    const length = currentSize * 4;
                    const radius = currentSize / 2;
                    ctx.beginPath();
                    ctx.roundRect(-length / 2, -radius, length, radius * 2, radius);
                    ctx.fill();
                } else if (particleShape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-currentSize, -currentSize, currentSize * 2, currentSize * 2);
                }

                ctx.restore();

                // Wrap around
                if (p.x < -50) p.x = canvas.width + 50;
                if (p.x > canvas.width + 50) p.x = -50;
                if (p.y < -50) p.y = canvas.height + 50;
                if (p.y > canvas.height + 50) p.y = -50;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [
        count,
        magnetRadius,
        ringRadius,
        waveSpeed,
        waveAmplitude,
        particleSize,
        lerpSpeed,
        colors,
        autoAnimate,
        particleVariance,
        rotationSpeed,
        depthFactor,
        pulseSpeed,
        particleShape,
        fieldStrength,
    ]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        />
    );
};

export default Antigravity;
