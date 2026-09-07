// File: src/components/SongCard.jsx
import React from 'react';
import { Play, Pause, Heart, HardDrive, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function SongCard({
  track,
  isPlaying = false,
  isCurrent = false,
  onPlay,
  onToggleLike,
  onAddToPlaylist,
  isLiked = false,
  variant = "carousel", // "carousel" | "row" | "compact"
  index = 0
}) {
  if (!track) return null;

  const isLocal = track.isLocal || false;

  // Row layout variant
  if (variant === "row") {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={() => onPlay(track)}
        className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
          isCurrent
            ? "bg-orange-50/90 border border-orange-300 shadow-sm text-stone-900"
            : "bg-white/90 hover:bg-orange-50/60 text-stone-700 border border-stone-200/70 hover:border-orange-200 shadow-xs hover:shadow-md hover:shadow-orange-500/10"
        }`}
      >
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="w-6 text-center text-xs font-semibold text-stone-600 shrink-0">
            {isCurrent && isPlaying ? (
              <div className="flex items-end justify-center space-x-0.5 h-3.5">
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-2.5"></span>
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-3.5" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 bg-orange-500 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }}></span>
              </div>
            ) : (
              <span className="group-hover:hidden text-stone-600">{index + 1}</span>
            )}
            <button
              type="button"
              className="hidden group-hover:inline-flex items-center justify-center text-orange-600 hover:scale-110 transition-transform"
            >
              {isCurrent && isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
          </div>

          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 shadow-sm">
            <img
              src={track.coverUrl}
              alt={track.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isCurrent && isPlaying && (
              <div className="absolute inset-0 bg-orange-500/25 backdrop-blur-[1px] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className={`text-sm font-bold truncate ${isCurrent ? "text-orange-600" : "text-stone-900 group-hover:text-orange-600"}`}>
                {track.title}
              </h4>
              {isLocal ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                  <HardDrive className="w-2.5 h-2.5 mr-1" />
                  Local
                </span>
              ) : (
                track.region && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-600 shrink-0 border border-stone-200">
                    {track.region}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              {track.artist} {track.album && <span className="text-stone-400">• {track.album}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0 ml-2">
          {track.plays && (
            <span className="hidden md:inline text-xs text-stone-600 font-medium">{track.plays} plays</span>
          )}
          <span className="text-xs text-stone-600 tabular-nums font-medium">
            {track.durationFormatted || "3:20"}
          </span>

          {onAddToPlaylist && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist(track);
              }}
              className="p-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-100 transition"
              title="Add to Playlist"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.75 }}
            whileHover={{ scale: 1.15 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(track.id);
            }}
            className={`p-1.5 rounded-full hover:bg-orange-100 transition ${
              isLiked ? "text-rose-500" : "text-stone-600 hover:text-stone-900"
            }`}
            title={isLiked ? "Remove from Liked" : "Add to Liked"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Carousel card layout variant
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={() => onPlay(track)}
      className={`group flex flex-col p-3 rounded-2xl bg-white border transition-all duration-300 cursor-pointer w-44 sm:w-48 shrink-0 shadow-sm hover:shadow-xl hover:shadow-orange-500/15 ${
        isCurrent
          ? "border-orange-400 ring-2 ring-orange-400/20"
          : "border-stone-200/80 hover:border-orange-300"
      }`}
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm">
        <img
          src={track.coverUrl}
          alt={track.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Region / Local Badge */}
        <div className="absolute top-2 left-2">
          {isLocal ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-amber-700 border border-amber-300 shadow-xs">
              <HardDrive className="w-2.5 h-2.5 mr-1 text-amber-600" />
              Local
            </span>
          ) : (
            track.region && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-stone-700 border border-stone-200 shadow-xs">
                {track.region}
              </span>
            )
          )}
        </div>

        {/* Action icons in top right */}
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          {onAddToPlaylist && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist(track);
              }}
              className="p-1.5 rounded-full backdrop-blur-md bg-white/90 text-stone-700 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-orange-500 shadow-sm transition-all"
              title="Add to Playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.75 }}
            whileHover={{ scale: 1.15 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(track.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md shadow-sm transition-all ${
              isLiked
                ? "bg-white/95 text-rose-500"
                : "bg-white/90 text-stone-700 opacity-0 group-hover:opacity-100 hover:text-rose-500"
            }`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
        </div>

        {/* Large Hover/Active Play Button */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className={`absolute bottom-2.5 right-2.5 p-3 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/35 transition-all duration-300 ${
            isCurrent
              ? "opacity-100 scale-100"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </motion.div>

        {/* Live Audio Equalizer Wave in Bottom Left */}
        {isCurrent && isPlaying && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-end space-x-0.5 h-5 border border-orange-200">
            <span className="w-1 bg-orange-500 rounded-full animate-pulse h-2.5"></span>
            <span className="w-1 bg-orange-500 rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 bg-orange-500 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <h4 className={`text-sm font-bold truncate ${isCurrent ? "text-orange-600" : "text-stone-900 group-hover:text-orange-600"}`}>
          {track.title}
        </h4>
        <p className="text-xs text-stone-500 truncate mt-0.5">
          {track.artist}
        </p>
        <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium mt-2 pt-2 border-t border-stone-100">
          <span>{track.genre || "Music"}</span>
          <span>{track.durationFormatted || "3:30"}</span>
        </div>
      </div>
    </motion.div>
  );
}
