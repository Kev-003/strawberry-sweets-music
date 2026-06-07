import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { FaApple, FaSpotify, FaYoutube } from 'react-icons/fa';

const ICONS = [FaSpotify, FaYoutube, FaApple];
const LABELS = ['Spotify', 'YouTube', 'Apple Music'];

export default function StreamingIconCycler() {
    const containerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const indexRef = useRef(0);

    useGSAP(
        () => {
            const cycle = () => {
                gsap.timeline()
                    .to(iconRef.current, {
                        rotateX: 90,
                        duration: 0.25,
                        ease: 'power2.in',
                        onComplete: () => {
                            indexRef.current = (indexRef.current + 1) % ICONS.length;
                            setIndex(indexRef.current);
                        },
                    })
                    .set(iconRef.current, { rotateX: -90 })
                    .to(iconRef.current, {
                        rotateX: 0,
                        duration: 0.25,
                        ease: 'power2.out',
                    });
            };

            const interval = setInterval(cycle, 1500);
            return () => clearInterval(interval);
        },
        { scope: containerRef },
    );

    const Icon = ICONS[index];

    return (
        <div ref={containerRef} style={{ perspective: '400px' }}>
            <div ref={iconRef} style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}>
                <Icon aria-label={LABELS[index]} />
            </div>
        </div>
    );
}
