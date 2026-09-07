// File: src/pages/Home.jsx
import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  Flame,
  Radio,
  Play,
  Languages,
  Music,
  Disc3
} from 'lucide-react';
import { motion } from 'motion/react';
import SongCard from '../components/SongCard.jsx';
import { REGIONS } from '../data/mockData.js';

export default function Home({
  songs,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  likedSongIds,
  onAddToPlaylist
}) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const trendingScrollRef = useRef(null);
  const newReleasesScrollRef = useRef(null);

  // Filter songs for Global Hits by language/region category
  const globalHits = selectedRegion === "all"
    ? songs
    : songs.filter((s) => {
        const text = `${s.genre || ''} ${s.language || ''} ${s.region || ''}`.toLowerCase();
        if (selectedRegion === "bollywood") return text.includes("bollywood") || text.includes("hindi");
        if (selectedRegion === "punjabi") return text.includes("punjabi");
        if (selectedRegion === "pop") return text.includes("pop") || text.includes("english");
        if (selectedRegion === "kpop") return text.includes("k-pop") || text.includes("korean");
        if (selectedRegion === "latin") return text.includes("latin") || text.includes("spanish");
        if (selectedRegion === "afrobeats") return text.includes("afrobeat") || text.includes("african");
        if (selectedRegion === "jpop") return text.includes("j-pop") || text.includes("japanese");
        if (selectedRegion === "south-indian") return text.includes("telugu") || text.includes("tamil") || text.includes("south indian");
        return s.region?.toLowerCase() === selectedRegion.toLowerCase();
      });

  // Carousel scroll helpers
  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const offset = direction === 'left' ? -340 : 340;
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Trending top 10 songs
  const trendingTracks = songs.slice(0, 10);
  // New Releases
  const newReleases = songs.slice(8, 20);

  return (
    <div className="space-y-8 pb-32 select-none">
      {/* Hero Welcome Banner in Warm Orange / White theme */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15"
      >
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mello Worldwide Music Feed • Real Audio Streams</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            Music in every language, <br />
            <span className="text-orange-100 underline decoration-white/40 underline-offset-4">
              from Bollywood to Global Pop.
            </span>
          </h1>

          <p className="text-sm text-orange-50 max-w-lg font-medium leading-relaxed">
            Listen to authentic hit songs worldwide uninterrupted in the background. Search any track or import your own device music.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onPlayTrack(trendingTracks[0])}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-orange-600 hover:bg-orange-50 text-sm font-bold shadow-lg shadow-black/10 transition-all"
            >
              <Play className="w-4 h-4 fill-current text-orange-500" />
              <span>Play Top Global Hit</span>
            </motion.button>

            <div className="inline-flex items-center space-x-2 px-4 py-3 rounded-full bg-black/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>Background audio enabled</span>
            </div>
          </div>
        </div>

        {/* Decorative Musical Elements */}
        <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none sm:opacity-25">
          <Disc3 className="w-64 h-64 text-white animate-spin-slow" />
        </div>
      </motion.section>

      {/* Section: Trending Now (Horizontal Carousel) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Trending Worldwide
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Real chart-topping hits from India, US, UK, South Korea, Latin America, and Africa
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => scrollContainer(trendingScrollRef, 'left')}
              className="p-2 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-600 border border-orange-200/80 shadow-xs transition"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => scrollContainer(trendingScrollRef, 'right')}
              className="p-2 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-600 border border-orange-200/80 shadow-xs transition"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={trendingScrollRef}
          className="flex space-x-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingTracks.map((song, idx) => (
            <SongCard
              key={song.id}
              track={song}
              variant="carousel"
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

      {/* Section: Global Languages & Hits (Filterable) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Languages className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Global Languages & Genres
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Explore authentic music in your favorite languages
            </p>
          </div>

          {/* Region / Language Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {REGIONS.map((r) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={r.id}
                type="button"
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedRegion === r.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
                    : "bg-white text-stone-600 hover:text-stone-900 border border-orange-200/80 hover:border-orange-300"
                }`}
              >
                {r.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Global Hits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {globalHits.slice(0, 9).map((song, idx) => (
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

      {/* Section: New Releases Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Fresh Global Discoveries
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Exciting tracks from Pop, Latin, Afrobeats and Asian scenes
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => scrollContainer(newReleasesScrollRef, 'left')}
              className="p-2 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-600 border border-orange-200/80 shadow-xs transition"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => scrollContainer(newReleasesScrollRef, 'right')}
              className="p-2 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-600 border border-orange-200/80 shadow-xs transition"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div
          ref={newReleasesScrollRef}
          className="flex space-x-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newReleases.map((song, idx) => (
            <SongCard
              key={song.id}
              track={song}
              variant="carousel"
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
    </div>
  );
}
