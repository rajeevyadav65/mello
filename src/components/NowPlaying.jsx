// File: src/components/NowPlaying.jsx
import React, { useState } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  ListPlus,
  Volume2,
  VolumeX,
  Radio,
  HardDrive,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export default function NowPlaying({
  track,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onClose,
  isLiked,
  onToggleLike,
  isShuffle,
  onToggleShuffle,
  repeatMode, // 'off' | 'all' | 'one'
  onToggleRepeat,
  onAddToPlaylist,
  volume = 0.85,
  onVolumeChange
}) {
  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'lyrics'
  const [localVolume, setLocalVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);

  if (!track) return null;

  const isLocal = track.isLocal || false;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleVolumeInput = (val) => {
    setLocalVolume(val);
    if (isMuted) setIsMuted(false);
    if (onVolumeChange) onVolumeChange(val);
  };

  const mockLyrics = [
    { time: 5, text: "Drifting through the sunrise glow" },
    { time: 14, text: "Golden acoustic echoes slow" },
    { time: 24, text: "Signals dancing through the wire" },
    { time: 35, text: "Frequencies of pure desire" },
    { time: 48, text: "Feel the warm rhythm in your chest" },
    { time: 62, text: "Leave the heavy world at rest" },
    { time: 80, text: "Mello waves will carry you far" },
    { time: 98, text: "Shining under the morning star" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-orange-50/95 via-white to-amber-50/70 text-stone-800 overflow-y-auto backdrop-blur-2xl"
    >
      {/* Ambient Orange & Peach Warm Glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 25%, #F97316 0%, #FBBF24 35%, transparent 75%)`
        }}
      />

      <div className="relative z-10 flex flex-col min-h-full max-w-lg mx-auto w-full p-4 sm:p-6 justify-between select-none">
        {/* Top Header */}
        <div className="flex items-center justify-between py-2">
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            type="button"
            onClick={onClose}
            className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-orange-100 transition"
            title="Collapse player"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>

          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-600">
              {isLocal ? "Playing from Device" : `Trending in ${track.region || "Global"}`}
            </span>
            <div className="flex items-center justify-center space-x-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-700 font-semibold">Background playback active</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <motion.button
              whileTap={{ scale: 0.75 }}
              whileHover={{ scale: 1.15 }}
              type="button"
              onClick={() => onToggleLike(track.id)}
              className={`p-2 rounded-full hover:bg-orange-100 transition ${
                isLiked ? "text-rose-500" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </motion.button>
          </div>
        </div>

        {/* View Tabs: Player / Lyrics */}
        <div className="flex justify-center my-3">
          <div className="inline-flex p-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-semibold">
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => setActiveTab('player')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'player'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Player
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => setActiveTab('lyrics')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'lyrics'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lyrics
            </motion.button>
          </div>
        </div>

        {/* Center Content based on active tab */}
        {activeTab === 'player' ? (
          <div className="flex flex-col items-center my-auto py-2 sm:py-6">
            {/* Album Artwork Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 border-2 border-white group"
            >
              <img
                src={track.coverUrl}
                alt={track.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-100' : 'scale-95'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none" />

              {/* Media badge */}
              <div className="absolute top-3 left-3">
                {isLocal ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-amber-800 border border-amber-300 shadow-sm">
                    <HardDrive className="w-3 h-3 mr-1.5 text-amber-600" />
                    Device Audio
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-orange-700 border border-orange-200 shadow-sm">
                    <Radio className="w-3 h-3 mr-1.5 text-orange-500" />
                    {track.genre || "Global Stream"}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Song Meta */}
            <div className="w-full mt-6 sm:mt-8 px-2 flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 truncate tracking-tight">
                  {track.title}
                </h2>
                <p className="text-sm sm:text-base text-stone-500 truncate mt-1 font-medium">
                  {track.artist} {track.album && <span className="text-stone-400 font-normal">• {track.album}</span>}
                </p>
              </div>

              {onAddToPlaylist && (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.15 }}
                  type="button"
                  onClick={() => onAddToPlaylist(track)}
                  className="p-2.5 text-stone-500 hover:text-orange-600 rounded-full hover:bg-orange-100 transition"
                  title="Add to playlist"
                >
                  <ListPlus className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        ) : (
          /* Lyrics View */
          <div className="flex-1 flex flex-col items-center justify-center my-6 px-4 text-center max-h-80 overflow-y-auto space-y-4">
            <div className="flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Lyrics Preview</span>
            </div>
            {mockLyrics.map((line, idx) => {
              const isPast = currentTime >= line.time;
              const isCurrentLyric = isPast && (idx === mockLyrics.length - 1 || currentTime < mockLyrics[idx + 1].time);

              return (
                <p
                  key={idx}
                  className={`text-base sm:text-lg font-medium transition-all duration-300 ${
                    isCurrentLyric
                      ? "text-orange-600 text-xl sm:text-2xl font-black scale-105 drop-shadow-[0_2px_12px_rgba(249,115,22,0.3)]"
                      : isPast
                      ? "text-stone-700"
                      : "text-stone-400"
                  }`}
                >
                  {line.text}
                </p>
              );
            })}
            <p className="text-xs text-stone-400 pt-4">
              Full lyrics synced from global database • Mello Lyric Engine 2026
            </p>
          </div>
        )}

        {/* Bottom Playback Section */}
        <div className="w-full space-y-4 pb-4">
          {/* Progress Slider */}
          <div className="space-y-1.5">
            <div
              onClick={handleProgressClick}
              className="relative w-full h-2 bg-orange-100 hover:h-2.5 rounded-full cursor-pointer transition-all overflow-hidden group border border-orange-200/60"
            >
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full relative"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-orange-400 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between text-xs font-semibold text-stone-500 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center justify-between px-2 sm:px-6">
            {/* Shuffle */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={onToggleShuffle}
              className={`p-2.5 rounded-full transition ${
                isShuffle
                  ? "text-orange-600 bg-orange-100 border border-orange-200 shadow-xs"
                  : "text-stone-400 hover:text-stone-800"
              }`}
              title={isShuffle ? "Shuffle On" : "Shuffle Off"}
            >
              <Shuffle className="w-5 h-5" />
            </motion.button>

            {/* Previous */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={onPrev}
              className="p-3 text-stone-700 hover:text-stone-950 rounded-full hover:bg-orange-100 transition"
              title="Previous"
            >
              <SkipBack className="w-7 h-7" />
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              type="button"
              onClick={onPlayPause}
              className="p-5 bg-gradient-to-tr from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-xl shadow-orange-500/40 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </motion.button>

            {/* Next */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={onNext}
              className="p-3 text-stone-700 hover:text-stone-950 rounded-full hover:bg-orange-100 transition"
              title="Next"
            >
              <SkipForward className="w-7 h-7" />
            </motion.button>

            {/* Repeat */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={onToggleRepeat}
              className={`p-2.5 rounded-full transition relative ${
                repeatMode !== 'off'
                  ? "text-orange-600 bg-orange-100 border border-orange-200 shadow-xs"
                  : "text-stone-400 hover:text-stone-800"
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === 'one' && (
                <span className="absolute text-[9px] font-extrabold top-1.5 right-1.5 leading-none text-orange-600">
                  1
                </span>
              )}
            </motion.button>
          </div>

          {/* Volume and Hardware / Audio Route Info */}
          <div className="flex items-center justify-between pt-2 px-2 border-t border-orange-100 text-stone-500">
            <div className="flex items-center space-x-2 w-32">
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  if (onVolumeChange) onVolumeChange(newMuted ? 0 : localVolume);
                }}
                className="hover:text-stone-900"
              >
                {isMuted || localVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-orange-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-orange-500" />
                )}
              </motion.button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : localVolume}
                onChange={(e) => handleVolumeInput(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-stone-500 font-medium">
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              <span>MediaSession active</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
