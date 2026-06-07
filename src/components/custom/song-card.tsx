interface SongCardProps {
    title: string;
    coverArt: string | null;
    albumTitle?: string;
    releaseDate?: string | null;
    trackNumber?: number | null;
    links?: {
        spotify?: string;
        youtube?: string;
        apple_music?: string;
    } | null;
    storageUrl: string;
}

export default function SongCard({ title, coverArt, albumTitle, releaseDate, trackNumber, links, storageUrl }: SongCardProps) {
    return (
        <div className="group flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/5">
            <div className="flex items-center gap-3">
                {/* Cover Art */}
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md shadow-sm">
                    {coverArt ? (
                        <img
                            src={`${storageUrl}/${coverArt}`}
                            alt={title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="bg-brand/10 text-brand/40 flex h-full w-full items-center justify-center">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">{title}</p>
                    {albumTitle && <p className="text-muted-foreground truncate text-xs">{albumTitle}</p>}
                </div>

                {/* Track number / date */}
                <div className="flex-shrink-0 text-right">
                    {trackNumber != null && <span className="text-muted-foreground text-xs">#{trackNumber}</span>}
                    {releaseDate && <p className="text-muted-foreground text-xs">{new Date(releaseDate).getFullYear()}</p>}
                </div>
            </div>

            {/* Links at the bottom */}
            {links && Object.values(links).some((link) => !!link) && (
                <div className="ml-13 flex items-center gap-3 pb-1">
                    {links.spotify && (
                        <a
                            href={links.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Listen on Spotify"
                            className="text-muted-foreground/60 transition-colors hover:text-[#1DB954]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.302c-.215.353-.675.465-1.028.249-2.858-1.746-6.457-2.14-10.697-1.171-.403.092-.81-.157-.902-.56-.092-.403.157-.81.56-.902 4.637-1.06 8.624-.601 11.818 1.35.353.216.465.675.249 1.028zm1.466-3.266c-.27.441-.849.58-1.29.31-3.272-2.012-8.259-2.593-12.128-1.418-.496.15-1.022-.128-1.172-.625-.15-.496.128-1.022.625-1.172 4.42-1.341 9.91-.689 13.655 1.611.441.27.58.849.31 1.29zm.126-3.411c-3.924-2.33-10.392-2.545-14.154-1.403-.602.183-1.238-.163-1.421-.765-.183-.602.163-1.238.765-1.421 4.318-1.311 11.458-1.055 15.993 1.638.54.32.715 1.02.395 1.56-.32.54-1.02.715-1.56.395z" />
                            </svg>
                        </a>
                    )}
                    {links.youtube && (
                        <a
                            href={links.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Watch on YouTube"
                            className="text-muted-foreground/60 transition-colors hover:text-[#FF0000]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    )}
                    {links.apple_music && (
                        <a
                            href={links.apple_music}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Listen on Apple Music"
                            className="text-muted-foreground/60 transition-colors hover:text-[#FB2441]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.825 8.351a6.685 6.685 0 0 1-.806-.039 5.863 5.863 0 0 0-.256-4.509 2.502 2.502 0 0 1 1.761 1.761 2.501 2.501 0 0 1-.699 2.787zm-4.706-4.9c-.312.437-.589.907-.824 1.399a.401.401 0 0 0 .151.492c.321.161.64.324.953.498.406.225.823.148 1.1-.237a6.29 6.29 0 0 0 .841-3.152.091.091 0 0 0-.104-.093c-1.01.125-1.741.528-2.117 1.093zM21.571 16.35c-.173.473-.374.935-.6 1.385a11.97 11.97 0 0 1-1.353 2.175c-.482.607-.984.629-1.579.256-.479-.301-1-.444-1.564-.448-.567 0-1.088.163-1.564.448-.595.357-1.083.351-1.564-.007-.156-.116-.312-.228-.475-.327a14.49 14.49 0 0 0-1.25-.668c-.682-.317-1.39-.413-2.112-.259-.283.06-.566.12-.849.18-1.127.24-2.072-.257-2.731-1.25-.97-1.464-1.436-3.08-1.549-4.839-.063-.984.116-1.928.535-2.822.446-.957 1.12-1.7 2.053-2.222a4.57 4.57 0 0 1 2.376-.595 5.17 5.17 0 0 1 1.706.335c.249.098.503.184.755.269.835.281 1.631.309 2.456-.007a4.912 4.912 0 0 1 1.677-.384c1.121-.082 2.11.231 2.949.969.833.733 1.25 1.666 1.373 2.766-.021.037-.042.062-.058.093a5.405 5.405 0 0 0-.583 3.033 5.258 5.258 0 0 0 2.508 4.293z" />
                            </svg>
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
