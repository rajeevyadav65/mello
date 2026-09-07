// File: src/pages/Trends.jsx
import React, { useState } from 'react';
import {
  Flame,
  Clock,
  ArrowUpRight,
  Play,
  Pause,
  Sparkles,
  Trophy
} from 'lucide-react';
import { motion } from 'motion/react';
import { REGIONS } from '../data/mockData.js';

export default function Trends({
  songs,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  likedSongIds
}) {
  const [selectedRegion, setSelectedRegion] = useState("all");

  const filteredSongs = selectedRegion === "all"
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

  // Top 3 featured podium tracks
  const podium = filteredSongs.slice(0, 3);

  return (
    <div className="space-y-8 pb-32 select-none">
      {/* Header Banner */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
            <span>Mello Worldwide Velocity Chart • Updated Live</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Global Viral Top 50
          </h1>

          <p className="text-sm text-orange-50 font-medium max-w-lg">
            Real-time streaming charts across Bollywood, Punjabi bangers, Global Pop, Latin grooves, and K-Pop anthems.
          </p>

          <div className="flex items-center space-x-2 text-xs text-orange-100 pt-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-white" />
            <span>Recalculated every hour • Real Streaming Previews</span>
          </div>
        </div>

        <div className="absolute -right-6 -bottom-6 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </motion.section>

      {/* Region & Language Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
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

      {/* Top 3 Podium Cards */}
      {podium.length >= 3 && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {podium.map((song, idx) => {
            const ranks = [
              { label: "#1", badgeBg: "bg-gradient-to-r from-amber-400 to-orange-500 text-white", border: "border-orange-300" },
              { label: "#2", badgeBg: "bg-stone-200 text-stone-800", border: "border-stone-200" },
              { label: "#3", badgeBg: "bg-amber-100 text-amber-900", border: "border-amber-200" }
            ];
            const rankStyle = ranks[idx];
            const isCurrent = currentTrack?.id === song.id;

            return (
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                key={song.id}
                onClick={() => onPlayTrack(song)}
                className={`group relative p-4 rounded-3xl bg-white hover:bg-orange-50/40 border ${rankStyle.border} transition-all duration-300 cursor-pointer shadow-md shadow-orange-500/5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs ${rankStyle.badgeBg}`}>
                    {rankStyle.label} VIRAL
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-emerald-600 font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Trending</span>
                  </div>
                </div>

                <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-3 shadow-sm border border-stone-200/60">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white shadow-lg">
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-base font-bold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-xs text-stone-500 truncate font-medium">{song.artist}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 mt-3 pt-2.5 border-t border-orange-100">
                  <span className="font-semibold text-orange-600">{song.plays} streams</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                    {song.language || song.genre}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* Ranked Chart Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-orange-500" />
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Global Leaderboard ({filteredSongs.length} Tracks)
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-medium">Updated live</span>
        </div>

        <div className="space-y-2">
          {filteredSongs.map((song, idx) => {
            const isCurrent = currentTrack?.id === song.id;
            const rank = idx + 1;

            return (
              <motion.div
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.99 }}
                key={song.id}
                onClick={() => onPlayTrack(song)}
                className={`group flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-orange-50/90 border border-orange-300 text-stone-900 shadow-sm"
                    : "bg-white hover:bg-orange-50/40 border border-orange-200/80 shadow-xs"
                }`}
              >
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Rank Number */}
                  <div className="w-7 text-center font-bold text-sm text-stone-400 group-hover:text-orange-600 shrink-0">
                    #{rank}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-stone-200/80">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 text-white fill-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-bold truncate ${isCurrent ? "text-orange-600" : "text-stone-800 group-hover:text-orange-600"}`}>
                        {song.title}
                      </h4>
                      {song.language && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100/70 text-orange-800 shrink-0">
                          {song.language}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5 font-medium">
                      {song.artist}
                    </p>
                  </div>
                </div>

                {/* Right side stats */}
                <div className="flex items-center space-x-4 shrink-0 text-xs text-stone-500">
                  <span className="hidden sm:inline font-semibold text-stone-700">{song.plays} plays</span>
                  <span className="tabular-nums font-medium">{song.durationFormatted || "3:30"}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
