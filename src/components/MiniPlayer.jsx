// File: src/components/MiniPlayer.jsx
import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart, ChevronUp, Radio, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

export default function MiniPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrev,
  onOpenNowPlaying,
  isLiked,
  onToggleLike
}) {
  if (!track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLocal = track.isLocal || false;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={onOpenNowPlaying}
      className="group relative bg-white/95 hover:bg-white border-t sm:border border-orange-200/90 backdrop-blur-xl transition-all duration-200 cursor-pointer shadow-xl shadow-orange-500/10 z-40 sm:rounded-2xl sm:mx-4 sm:mb-20 md:mb-4 max-w-5xl md:mx-auto select-none"
    >
      {/* Sleek Top Progress Bar in Vibrant Orange */}
      <div className="absolute -top-[1px] left-0 right-0 h-1 bg-orange-100 overflow-hidden sm:rounded-t-2xl">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 transition-all duration-300 ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5">
        {/* Left: Thumbnail & Title */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 shadow-sm border border-stone-200/80"
          >
            <img
              src={track.coverUrl}
              alt={track.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            )}
          </motion.div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                {track.title}
              </h4>
              {isLocal ? (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                  <HardDrive className="w-2.5 h-2.5 mr-0.5" />
                  Local
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 shrink-0">
                  <Radio className="w-2.5 h-2.5 mr-1 text-orange-500 animate-pulse" />
                  Background Active
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              {track.artist}
            </p>
          </div>
        </div>

        {/* Center / Right: Controls */}
        <div
          className="flex items-center space-x-1 sm:space-x-3 shrink-0"
          onClick={(e) => e.stopPropagation()} // Keep button clicks from opening modal
        >
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.75 }}
            whileHover={{ scale: 1.15 }}
            type="button"
            onClick={() => onToggleLike(track.id)}
            className={`p-2 rounded-full hover:bg-orange-50 transition ${
              isLiked ? "text-rose-500" : "text-stone-400 hover:text-stone-700"
            }`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>

          {/* Previous Track */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            type="button"
            onClick={onPrev}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-orange-50 transition hidden sm:inline-flex"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>

          {/* Play / Pause */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            type="button"
            onClick={onPlayPause}
            className="p-2.5 sm:p-3 bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-lg shadow-orange-500/35 transition-all"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </motion.button>

          {/* Next Track */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            type="button"
            onClick={onNext}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-orange-50 transition"
            title="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>

          {/* Open Full Player Button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            type="button"
            onClick={onOpenNowPlaying}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-orange-50 transition"
            title="Expand player"
          >
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
