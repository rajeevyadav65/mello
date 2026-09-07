// File: src/pages/PlaylistDetail.jsx
import React from 'react';
import {
  Play,
  Shuffle,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit3,
  ArrowLeft,
  Music,
  Plus,
  Heart,
  Clock
} from 'lucide-react';

export default function PlaylistDetail({
  playlist,
  onBack,
  allSongs,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayPlaylist,
  onReorderSong,
  onRemoveSong,
  onEditPlaylist,
  onDeletePlaylist,
  onOpenSearch,
  onToggleLike,
  likedSongIds
}) {
  if (!playlist) return null;

  // Resolve song objects from songIds
  const playlistSongs = (playlist.songIds || [])
    .map((id) => allSongs.find((s) => s.id === id))
    .filter(Boolean);

  const totalDurationSecs = playlistSongs.reduce((acc, s) => acc + (s.duration || 210), 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      onPlayPlaylist(playlistSongs, 0);
    }
  };

  const handleShufflePlay = () => {
    if (playlistSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlistSongs.length);
      onPlayPlaylist(playlistSongs, randomIndex, true);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Playlists</span>
      </button>

      {/* Playlist Hero Banner */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 border overflow-hidden shadow-2xl transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${playlist.accentColor || '#6366f1'}33 0%, #18181b 85%)`,
          borderColor: `${playlist.accentColor || '#6366f1'}44`
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Cover Art */}
          <div
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10 relative group"
            style={{ backgroundColor: playlist.accentColor || '#6366f1' }}
          >
            <img
              src={playlist.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"}
              alt={playlist.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-2 min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
              User Playlist
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight break-words">
              {playlist.title}
            </h1>
            {playlist.description && (
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                {playlist.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
              <span>{playlistSongs.length} {playlistSongs.length === 1 ? 'track' : 'tracks'}</span>
              <span>•</span>
              <span>approx. {totalMins} min</span>
              <span>•</span>
              <span>Created {playlist.createdAt || "Recently"}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3">
              <button
                type="button"
                onClick={handlePlayAll}
                disabled={playlistSongs.length === 0}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-violet-600/30 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play All</span>
              </button>

              <button
                type="button"
                onClick={handleShufflePlay}
                disabled={playlistSongs.length === 0}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-200 border border-zinc-700/80 text-xs font-semibold transition"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>

              <button
                type="button"
                onClick={() => onEditPlaylist(playlist)}
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                title="Edit details"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${playlist.title}"?`)) {
                    onDeletePlaylist(playlist.id);
                  }
                }}
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition"
                title="Delete playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Tracks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <div className="flex items-center space-x-4">
            <span className="w-8 text-center">#</span>
            <span>Title</span>
          </div>
          <div className="flex items-center space-x-6 pr-2">
            <span>Reorder</span>
            <span className="hidden sm:inline flex items-center space-x-1">
              <Clock className="w-3 h-3" />
            </span>
            <span>Actions</span>
          </div>
        </div>

        {playlistSongs.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-zinc-900/30 rounded-3xl border border-zinc-800/60">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-zinc-500">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-zinc-300">
              This playlist is currently empty
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Add songs from Search, Home feed, or your local Library to build your track sequence.
            </p>
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Browse Music to Add</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {playlistSongs.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const isFirst = index === 0;
              const isLast = index === playlistSongs.length - 1;

              return (
                <div
                  key={`${track.id}-${index}`}
                  className={`group flex items-center justify-between p-2 sm:p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? "bg-violet-950/40 border border-violet-500/40 text-white"
                      : "bg-zinc-900/40 hover:bg-zinc-850/80 border border-zinc-800/40 text-zinc-300"
                  }`}
                >
                  {/* Left Track Info */}
                  <div
                    onClick={() => onPlayTrack(track)}
                    className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="w-8 text-center text-xs font-semibold text-zinc-500 shrink-0">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end justify-center space-x-0.5 h-3">
                          <span className="w-0.5 bg-violet-400 rounded-full animate-pulse h-2"></span>
                          <span className="w-0.5 bg-violet-400 rounded-full animate-pulse h-3" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-0.5 bg-violet-400 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 shadow-md">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className={`text-sm font-semibold truncate ${isCurrent ? "text-violet-300" : "text-zinc-100 group-hover:text-white"}`}>
                        {track.title}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate">
                        {track.artist} {track.album && <span className="text-zinc-600">• {track.album}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Right Controls: Reorder & Remove */}
                  <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 ml-2">
                    {/* Reorder Buttons: Move Up / Move Down */}
                    <div className="flex items-center space-x-0.5 bg-zinc-800/70 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => onReorderSong(playlist.id, index, 'up')}
                        disabled={isFirst}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onReorderSong(playlist.id, index, 'down')}
                        disabled={isLast}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs text-zinc-400 tabular-nums hidden sm:inline">
                      {track.durationFormatted || "3:30"}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleLike(track.id)}
                      className={`p-1.5 rounded-full hover:bg-zinc-800 transition ${
                        likedSongIds.includes(track.id) ? "text-rose-500" : "text-zinc-500 hover:text-zinc-200"
                      }`}
                      title={likedSongIds.includes(track.id) ? "Unlike" : "Like"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedSongIds.includes(track.id) ? "fill-current" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveSong(playlist.id, track.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-full hover:bg-zinc-800 transition"
                      title="Remove from playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
