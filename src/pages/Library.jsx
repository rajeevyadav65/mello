// File: src/pages/Library.jsx
import React, { useRef, useState } from 'react';
import { Upload, HardDrive, Music, Play, Trash2, Heart, Sparkles, FolderOpen, Info, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Library({
  localTracks,
  onImportFiles,
  onDeleteLocalTrack,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  likedSongIds,
  allSongs,
  onAddToPlaylist
}) {
  const fileInputRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('local'); // 'local' | 'liked' | 'all'
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImportFiles(files);
      e.target.value = ""; // reset
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)
    );
    if (files.length > 0) {
      onImportFiles(files);
    }
  };

  // Quick helper to create sample offline song for instant testing
  const handleAddSampleLocalTrack = () => {
    const sampleNames = [
      { name: "Sunset Acoustic Live.mp3", artist: "Device Local Audio", duration: 195, durationFormatted: "3:15" },
      { name: "Morning Amber Chill.wav", artist: "Local Recording", duration: 210, durationFormatted: "3:30" },
      { name: "Mello Studio Jam 2026.mp3", artist: "My Audio Project", duration: 180, durationFormatted: "3:00" }
    ];
    const picked = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    
    // Create simulated local audio track
    const mockFileTrack = {
      id: `local-${Date.now()}`,
      title: picked.name.replace(/\.[^/.]+$/, ""),
      artist: picked.artist,
      album: "Local Storage",
      duration: picked.duration,
      durationFormatted: picked.durationFormatted,
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      audioSrc: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
      genre: "Local File",
      isLocal: true,
      fileSize: "6.4 MB",
      addedAt: "Just now"
    };

    onImportFiles([mockFileTrack], true);
  };

  // Liked songs list
  const likedSongs = allSongs.filter((s) => likedSongIds.includes(s.id));

  // Determine which list to display
  let displayedTracks = [];
  if (activeFilter === 'local') {
    displayedTracks = localTracks;
  } else if (activeFilter === 'liked') {
    displayedTracks = likedSongs;
  } else {
    displayedTracks = [...localTracks, ...allSongs];
  }

  return (
    <div className="space-y-6 pb-32 select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header & Local Device Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HardDrive className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Music Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your personal device music files, recordings, and favorite tracks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Import Music</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAddSampleLocalTrack}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-full bg-white hover:bg-orange-50 text-stone-700 border border-orange-200/80 text-xs font-semibold shadow-xs transition"
            title="Import a demo track without needing your own mp3"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Add Demo File</span>
          </motion.button>
        </div>
      </div>

      {/* Drag & Drop Import Dropzone */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-orange-500 bg-orange-100/50 scale-[1.01]"
            : "border-orange-200 hover:border-orange-400 bg-orange-50/40 hover:bg-orange-50/70"
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center shadow-xs">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Drag & drop audio files here, or click to browse
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Supports MP3, WAV, FLAC, OGG, AAC. Plays natively in browser and continues in background.
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-[11px] text-stone-500 font-medium">
            <Info className="w-3.5 h-3.5 text-orange-500" />
            <span>Files remain stored directly in your local browser memory</span>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-orange-100 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'local', label: `Local Files (${localTracks.length})` },
          { id: 'liked', label: `Liked Songs (${likedSongs.length})` },
          { id: 'all', label: `All Music (${localTracks.length + allSongs.length})` }
        ].map((tab) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
              activeFilter === tab.id
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25"
                : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tracks Listing */}
      {displayedTracks.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-orange-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 mx-auto flex items-center justify-center text-orange-500">
            <Music className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-800">
            {activeFilter === 'local'
              ? "No local audio files imported yet"
              : activeFilter === 'liked'
              ? "No liked tracks yet"
              : "No tracks available"}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {activeFilter === 'local'
              ? "Click 'Import Music' or drag your audio files into the dropzone above to start playback."
              : "Tap the heart icon on any song to save it to your favorites."}
          </p>
          {activeFilter === 'local' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAddSampleLocalTrack}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-bold text-white shadow-sm shadow-orange-500/25 transition mt-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Add Sample Audio File</span>
            </motion.button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {displayedTracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;

            return (
              <motion.div
                whileHover={{ scale: 1.008, x: 2 }}
                key={track.id}
                className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 bg-white hover:bg-orange-50/40 border border-stone-200/80 hover:border-orange-300 shadow-xs"
              >
                <div
                  onClick={() => onPlayTrack(track)}
                  className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 cursor-pointer"
                >
                  {/* Track # or Playing indicator */}
                  <div className="w-6 text-center text-xs font-bold text-stone-400 shrink-0">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end justify-center space-x-0.5 h-3.5">
                        <span className="w-1 bg-orange-500 rounded-full animate-pulse h-2.5"></span>
                        <span className="w-1 bg-orange-400 rounded-full animate-pulse h-3.5" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 bg-amber-500 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Thumbnail / Local indicator icon */}
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 shadow-xs border border-stone-200">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-orange-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-bold truncate ${isCurrent ? "text-orange-600" : "text-stone-900 group-hover:text-orange-600"}`}>
                        {track.title}
                      </h4>
                      {track.isLocal ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                          <HardDrive className="w-2.5 h-2.5 mr-1 text-amber-600" />
                          Local
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200 shrink-0">
                          Stream
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5 font-medium">
                      {track.artist} {track.fileSize && <span className="text-stone-400">• {track.fileSize}</span>}
                    </p>
                  </div>
                </div>

                {/* Actions: Duration, Add to Playlist, Like, Delete (if local) */}
                <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0 ml-2">
                  <span className="text-xs text-stone-400 tabular-nums font-medium">
                    {track.durationFormatted || "3:20"}
                  </span>

                  {onAddToPlaylist && (
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.15 }}
                      type="button"
                      onClick={() => onAddToPlaylist(track)}
                      className="p-1.5 rounded-full text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition"
                      title="Add to Playlist"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.15 }}
                    type="button"
                    onClick={() => onToggleLike(track.id)}
                    className={`p-1.5 rounded-full hover:bg-orange-50 transition ${
                      likedSongIds.includes(track.id) ? "text-rose-500" : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedSongIds.includes(track.id) ? "fill-current" : ""}`} />
                  </motion.button>

                  {track.isLocal && (
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.15 }}
                      type="button"
                      onClick={() => onDeleteLocalTrack(track.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition"
                      title="Remove from library"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
