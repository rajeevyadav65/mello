// File: src/pages/Search.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search as SearchIcon,
  Flame,
  Globe,
  Loader2,
  Sparkles,
  Music2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SearchBar from '../components/SearchBar.jsx';
import SongCard from '../components/SongCard.jsx';
import {
  TRENDING_SEARCH_SUGGESTIONS,
  MOCK_ARTISTS,
  MOCK_ALBUMS
} from '../data/mockData.js';
import { searchGlobalMusic } from '../utils/musicApi.js';

export default function Search({
  searchQuery,
  onSearchChange,
  onVoiceSearch,
  songs,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  likedSongIds,
  onAddToPlaylist
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'bollywood' | 'pop' | 'punjabi' | 'kpop' | 'latin' | 'afrobeats'
  const [liveResults, setLiveResults] = useState([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const debounceTimerRef = useRef(null);

  // Global Language & Genre quick explore categories
  const languageExplorers = [
    { name: "Bollywood & Hindi", query: "Arijit Singh Bollywood", flag: "🇮🇳", gradient: "from-orange-500 to-amber-600" },
    { name: "Global Pop Hits", query: "Taylor Swift Pop Hits", flag: "🌎", gradient: "from-amber-500 to-orange-600" },
    { name: "Punjabi Banger", query: "Diljit Dosanjh Punjabi", flag: "🌾", gradient: "from-orange-600 to-red-600" },
    { name: "K-Pop Wave", query: "BTS K-Pop", flag: "🇰🇷", gradient: "from-rose-500 to-amber-600" },
    { name: "Latin & Reggaeton", query: "Bad Bunny Reggaeton", flag: "💃", gradient: "from-amber-600 to-orange-700" },
    { name: "Afrobeats Fever", query: "Burna Boy Afrobeats", flag: "🌍", gradient: "from-emerald-500 to-teal-700" },
    { name: "Japanese & J-Pop", query: "YOASOBI J-Pop", flag: "🇯🇵", gradient: "from-teal-600 to-orange-600" },
    { name: "South Indian Hits", query: "Anirudh South Indian", flag: "🌺", gradient: "from-stone-600 to-orange-800" }
  ];

  // Fetch from global music search whenever searchQuery changes
  useEffect(() => {
    const q = (searchQuery || '').trim();
    if (!q) {
      setLiveResults([]);
      setIsSearchingLive(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsSearchingLive(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchGlobalMusic(q, 30);
        setLiveResults(results);
      } catch (err) {
        console.warn("Live search err:", err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Merge pre-loaded catalog matches + live search results (deduplicated)
  const combinedSongs = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return [];

    // Local matches
    const localMatches = songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album?.toLowerCase().includes(q) ||
        s.genre?.toLowerCase().includes(q) ||
        s.language?.toLowerCase().includes(q) ||
        s.region?.toLowerCase().includes(q)
    );

    // Merge with live search results, avoiding duplicates
    const seenTitles = new Set(localMatches.map((s) => `${s.title.toLowerCase()}_${s.artist.toLowerCase()}`));
    const uniqueLive = [];

    for (const item of liveResults) {
      const key = `${item.title.toLowerCase()}_${item.artist.toLowerCase()}`;
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        uniqueLive.push(item);
      }
    }

    const merged = [...localMatches, ...uniqueLive];

    // Filter by category/language tab if selected
    if (filterType === 'all') return merged;

    return merged.filter((s) => {
      const text = `${s.genre || ''} ${s.language || ''} ${s.title || ''} ${s.artist || ''}`.toLowerCase();
      if (filterType === 'bollywood') return text.includes('bollywood') || text.includes('hindi') || text.includes('arijit');
      if (filterType === 'punjabi') return text.includes('punjabi') || text.includes('diljit') || text.includes('bhangra');
      if (filterType === 'pop') return text.includes('pop') || text.includes('english');
      if (filterType === 'kpop') return text.includes('k-pop') || text.includes('korean');
      if (filterType === 'latin') return text.includes('latin') || text.includes('spanish') || text.includes('reggaeton');
      if (filterType === 'afrobeats') return text.includes('afrobeat') || text.includes('african');
      return true;
    });
  }, [songs, liveResults, searchQuery, filterType]);

  // Filter artists
  const matchingArtists = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_ARTISTS.filter(
      (a) => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q) || a.language?.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter albums
  const matchingAlbums = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_ALBUMS.filter(
      (alb) => alb.title.toLowerCase().includes(q) || alb.artist.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const topResult = combinedSongs[0] || null;

  return (
    <div className="space-y-6 pb-32 select-none">
      {/* Search Input on Search Page */}
      <div className="max-w-2xl mx-auto space-y-2">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onVoiceSearch={onVoiceSearch}
          placeholder="Search any song, artist, movie or lyric globally..."
          autoFocus={false}
        />

        {/* Live Search Status Badge */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between px-2 text-xs text-stone-500">
            <div className="flex items-center space-x-1.5">
              {isSearchingLive ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                  <span>Searching worldwide music catalog...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Found {combinedSongs.length} songs globally</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-stone-400">All languages • Instant stream</span>
          </div>
        )}
      </div>

      {/* When no query is entered: show Trending Suggestions & Browse All Languages */}
      {!searchQuery.trim() ? (
        <div className="space-y-8">
          {/* Trending Global Searches */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-stone-700">
              <Flame className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold tracking-wider uppercase text-stone-500">
                Trending Global Searches & Artists
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCH_SUGGESTIONS.map((suggestion, i) => (
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  type="button"
                  onClick={() => onSearchChange(suggestion)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-600 border border-orange-200/80 text-xs font-semibold shadow-xs transition"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Browse by Global Language / Culture */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-bold tracking-wider uppercase text-stone-500">
                  Explore by Language & Global Style
                </h3>
              </div>
              <span className="text-xs text-stone-400">Bollywood, Pop, Punjabi & more</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {languageExplorers.map((cat, idx) => (
                <motion.div
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  key={idx}
                  onClick={() => onSearchChange(cat.query)}
                  className={`group relative h-28 rounded-2xl p-4 bg-gradient-to-br ${cat.gradient} cursor-pointer overflow-hidden shadow-md shadow-orange-500/10 transition-shadow`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-lg">{cat.flag}</span>
                  </div>
                  <span className="text-base font-bold text-white tracking-tight drop-shadow-sm block leading-tight">
                    {cat.name}
                  </span>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-white/20 group-hover:scale-125 transition-transform flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-white/70" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* When search query is entered: Show results */
        <div className="space-y-6">
          {/* Result Filter Tabs */}
          <div className="flex items-center space-x-2 border-b border-orange-100 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `All Results (${combinedSongs.length})` },
              { id: 'bollywood', label: 'Bollywood / Hindi' },
              { id: 'pop', label: 'Global Pop' },
              { id: 'punjabi', label: 'Punjabi' },
              { id: 'kpop', label: 'K-Pop' },
              { id: 'latin', label: 'Latin / Spanish' },
              { id: 'afrobeats', label: 'Afrobeats' }
            ].map((tab) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                  filterType === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25"
                    : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {combinedSongs.length === 0 && !isSearchingLive ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 mx-auto flex items-center justify-center text-orange-500">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-800">
                Searching for "{searchQuery}"...
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Looking up songs in every language globally. You can also try searching by artist (e.g. Arijit Singh, Taylor Swift, Diljit Dosanjh, Bad Bunny).
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Result Card */}
              {topResult && (
                <section className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Best Match
                    </h3>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onPlayTrack(topResult)}
                    className="p-4 sm:p-5 rounded-3xl bg-white border border-orange-200 hover:border-orange-400 cursor-pointer shadow-md shadow-orange-500/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-stone-200">
                        <img
                          src={topResult.coverUrl}
                          alt={topResult.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                            {topResult.genre || "Global"}
                          </span>
                          {topResult.language && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              {topResult.language}
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors truncate">
                          {topResult.title}
                        </h4>
                        <p className="text-sm text-stone-500 font-medium truncate">
                          {topResult.artist} {topResult.album && `• ${topResult.album}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {onAddToPlaylist && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToPlaylist(topResult);
                          }}
                          className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-xs font-bold border border-stone-200 transition"
                        >
                          + Add to Playlist
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition"
                      >
                        {currentTrack?.id === topResult.id && isPlaying ? "Pause Track" : "Play Now"}
                      </motion.button>
                    </div>
                  </motion.div>
                </section>
              )}

              {/* All Matching Songs List */}
              {combinedSongs.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Matching Songs ({combinedSongs.length})
                    </h3>
                    <span className="text-xs text-stone-400">Click any track to stream instantly</span>
                  </div>

                  <div className="space-y-1.5">
                    {combinedSongs.map((song, idx) => (
                      <SongCard
                        key={song.id}
                        track={song}
                        variant="row"
                        isPlaying={isPlaying}
                        isCurrent={currentTrack?.id === song.id}
                        onPlay={onPlayTrack}
                        onToggleLike={onToggleLike}
                        onAddToPlaylist={onAddToPlaylist}
                        isLiked={likedSongIds.includes(song.id)}
                        index={idx}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Matching Artists */}
              {matchingArtists.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Artists
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {matchingArtists.map((artist) => (
                      <motion.div
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        key={artist.id}
                        onClick={() => onSearchChange(artist.name)}
                        className="p-3.5 rounded-2xl bg-white border border-orange-200/80 text-center space-y-2 hover:border-orange-300 shadow-xs transition cursor-pointer"
                      >
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-xs border border-orange-100">
                          <img
                            src={artist.coverUrl}
                            alt={artist.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 truncate">{artist.name}</p>
                          <p className="text-xs text-stone-500 truncate">{artist.genre}</p>
                          <p className="text-[11px] text-stone-400 mt-1">{artist.monthlyListeners} monthly</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Matching Albums */}
              {matchingAlbums.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Albums
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {matchingAlbums.map((album) => (
                      <motion.div
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        key={album.id}
                        onClick={() => onSearchChange(album.title)}
                        className="p-3 rounded-2xl bg-white border border-orange-200/80 space-y-2 hover:border-orange-300 shadow-xs transition cursor-pointer"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden shadow-xs border border-stone-200">
                          <img
                            src={album.coverUrl}
                            alt={album.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 truncate">{album.title}</p>
                          <p className="text-xs text-stone-500 truncate">{album.artist}</p>
                          <p className="text-[11px] text-stone-400">{album.year} • {album.trackCount} tracks</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
