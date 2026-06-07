import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';

const PHRASES = ['fleeting feelings', 'dreamlike moments'];

export default function AboutPhrase() {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const indexRef = useRef(0);
    const [phrase, setPhrase] = useState(PHRASES[0]);

    // Scroll-driven blur clear
    useGSAP(
        () => {
            const el = textRef.current;
            if (!el) return;

            let ticking = false;
            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const rect = el.getBoundingClientRect();
                        const windowH = window.innerHeight;
                        const triggerPoint = windowH * 0.6;
                        const progress = Math.min(Math.max((triggerPoint - rect.top) / (windowH * 0.3), 0), 1);

                        gsap.set(el, {
                            filter: `blur(${(1 - progress) * 8}px)`,
                            opacity: 0.1 + progress * 0.1,
                        });
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();

            return () => window.removeEventListener('scroll', onScroll);
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const el = textRef.current;
            if (!el) return;

            const cycle = setInterval(() => {
                // Blur out
                gsap.to(el, {
                    filter: 'blur(12px)',
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        // Swap text while fully blurred — change is invisible
                        indexRef.current = (indexRef.current + 1) % PHRASES.length;
                        setPhrase(PHRASES[indexRef.current]);
                        // Let scroll handler resume control of blur/opacity
                        const rect = el.getBoundingClientRect();
                        const windowH = window.innerHeight;
                        const triggerPoint = windowH * 0.6;
                        const progress = Math.min(Math.max((triggerPoint - rect.top) / (windowH * 0.3), 0), 1);
                        gsap.to(el, {
                            filter: `blur(${(1 - progress) * 8}px)`,
                            duration: 0.5,
                            ease: 'power2.out',
                        });
                    },
                });
            }, 3500);

            return () => clearInterval(cycle);
        },
        { scope: containerRef },
    );

    return (
        <section ref={containerRef}>
            <h2
                ref={textRef}
                className="font-display text-muted-foreground hidden text-8xl leading-tight font-extrabold transition-none md:block"
                style={{ filter: 'blur(8px)', opacity: 0.1, willChange: 'filter, opacity' }}
            >
                {phrase}
            </h2>
        </section>
    );
}
