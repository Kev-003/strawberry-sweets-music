import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import AppLogoIcon from './app-logo-icon';

const TEXT = 'Strawberry Sweets';

export default function AppLogo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const charsRef = useRef<HTMLSpanElement[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const [hovered, setHovered] = useState(false);

    useGSAP(
        () => {
            const chars = charsRef.current;

            if (tlRef.current) tlRef.current.kill();
            gsap.killTweensOf([iconRef.current, textRef.current, ...chars]);

            if (hovered) {
                tlRef.current = gsap.timeline();

                // Icon quietly dissolves
                tlRef.current.to(
                    iconRef.current,
                    {
                        opacity: 0,
                        scale: 0.85,
                        duration: 0.3,
                        ease: 'power2.in',
                    },
                    0,
                );

                // Text drifts left softly
                tlRef.current.to(
                    textRef.current,
                    {
                        x: -48,
                        duration: 0.35,
                        ease: 'power2.out',
                    },
                    0,
                );

                // Characters surface from blur
                tlRef.current.from(
                    chars,
                    {
                        opacity: 0.1,
                        scale: 0.8,
                        filter: 'blur(4px)',
                        y: 4,
                        stagger: { each: 0.06, from: 'center' },
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    0.1,
                );
            } else {
                tlRef.current = gsap.timeline();

                // Icon quietly reappears
                tlRef.current.to(
                    iconRef.current,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.35,
                        ease: 'power2.out',
                    },
                    0,
                );

                // Text drifts back
                tlRef.current.to(
                    textRef.current,
                    {
                        x: 0,
                        duration: 0.35,
                        ease: 'power2.out',
                    },
                    0,
                );

                // Characters quietly settle
                tlRef.current.to(
                    chars,
                    {
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        stagger: { each: 0.02, from: 'end' },
                    },
                    0,
                );
            }
        },
        { scope: containerRef, dependencies: [hovered] },
    );

    return (
        <div
            ref={containerRef}
            className="flex cursor-pointer items-center gap-1"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div ref={iconRef} className="flex-shrink-0">
                <AppLogoIcon className="text-brand dark:text-brand size-12 fill-current" />
            </div>

            <span ref={textRef} className="brand-heading text-brand mt-1 hidden text-4xl leading-none md:inline-block">
                {TEXT.split('').map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => {
                            if (el) charsRef.current[i] = el;
                        }}
                        style={{ display: 'inline-block', whiteSpace: 'pre' }}
                    >
                        {char}
                    </span>
                ))}
            </span>
        </div>
    );
}
