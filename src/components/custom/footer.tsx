import { FaApple, FaFacebook, FaInstagram, FaSpotify, FaTiktok, FaYoutube } from 'react-icons/fa';

const SOCIAL_LINKS = [
    { icon: FaInstagram, href: 'https://www.instagram.com/strawberry.sweetsmusic', label: 'Instagram' },
    { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61579241754690', label: 'Facebook' },
    { icon: FaSpotify, href: 'https://open.spotify.com/artist/7Mo22u97DuWuFpKEnD0o4Y?si=iRL9e663TR6-YroI0IeSbQ', label: 'Spotify' },
    { icon: FaApple, href: 'https://music.apple.com/us/artist/strawberry-sweets/1839745096', label: 'Apple Music' },
    { icon: FaYoutube, href: 'https://www.youtube.com/channel/UCxi5A41TEGDnj2kmZQt8efQ', label: 'YouTube' },
    { icon: FaTiktok, href: 'https://www.tiktok.com/@strawberrysweetsmusic', label: 'TikTok' },
];

export default function Footer() {
    return (
        <footer className="border-border/40 mt-20 w-full border-t">
            <div className="w-full px-4 py-8 lg:px-8">
                {/* Row 1 — Social icons */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                        <a
                            key={label}
                            href={href}
                            aria-label={label}
                            target="_blank"
                            className="text-muted-foreground hover:text-foreground border-foreground/10 flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200"
                        >
                            <Icon size={14} />
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-border/40 mb-6 border-t" />

                {/* Row 2 — Cause partners + legal */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Legal */}
                    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                        <span>© {new Date().getFullYear()} Strawberry Sweets</span>
                        <span className="hidden lg:inline">·</span>
                        <span>
                            Site by{' '}
                            <a
                                href="https://github.com/Kev-003"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand hover:text-brand/80 transition-colors"
                            >
                                Kevern
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
