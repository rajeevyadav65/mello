// File: src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import TopBar from './components/TopBar.jsx';
import BottomNav from './components/BottomNav.jsx';
import MiniPlayer from './components/MiniPlayer.jsx';
import NowPlaying from './components/NowPlaying.jsx';
import AuthModal from './components/AuthModal.jsx';
import PlaylistModal from './components/PlaylistModal.jsx';
import AddToPlaylistModal from './components/AddToPlaylistModal.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Library from './pages/Library.jsx';
import Trends from './pages/Trends.jsx';
import Playlists from './pages/Playlists.jsx';
import PlaylistDetail from './pages/PlaylistDetail.jsx';
import { audioEngine } from './utils/audioEngine.js';
import { addSongToPlaylist, createPlaylist, deletePlaylist, likeSong, listLikedSongs, listPlaylists, listSongs, removeSongFromPlaylist, unlikeSong, updatePlaylist } from './utils/melodiaApi.js';
import { Volume2, VolumeX, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'search' | 'playlists' | 'playlist-detail' | 'library' | 'trends'
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback State
  const [songs, setSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [activeQueue, setActiveQueue] = useState([]);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mello_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User Playlists State
  const [playlists, setPlaylists] = useState(() => {
    try {
      const storageKey = currentUser ? `mello_playlists_${currentUser.id}` : 'mello_playlists_guest';
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [trackForAddToPlaylist, setTrackForAddToPlaylist] = useState(null);

  // User Library & Likes
  const [localTracks, setLocalTracks] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState([]);

  // Audio HTML5 Reference
  const audioElementRef = useRef(null);

  // Load the licensed catalogue from the Spring Boot API; mock data remains a visual fallback.
  useEffect(() => {
    listSongs().then((catalogue) => {
      if (catalogue.length) {
        setSongs(catalogue);
        setActiveQueue(catalogue);
        setCurrentTrack(catalogue[0]);
        setDuration(catalogue[0].duration || 0);
      }
    }).catch(() => {});
  }, []);

  // Personal features are loaded only after a real JWT login.
  useEffect(() => {
    if (!currentUser) { setPlaylists([]); setLikedSongIds([]); return; }
    listPlaylists().then(setPlaylists).catch(() => setPlaylists([]));
    listLikedSongs().then(songs => setLikedSongIds(songs.map(song => song.id))).catch(() => setLikedSongIds([]));
  }, [currentUser]);

  // Handle Audio Volume Changes
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioElementRef.current) {
      audioElementRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
    audioEngine.setVolume(newVolume);
  };

  // Set up MediaSession API for lock-screen & background control
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || "Mello Music",
        artwork: [
          { src: currentTrack.coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => handlePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => handlePlayPause());
      navigator.mediaSession.setActionHandler('previoustrack', handlePrevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', handleNextTrack);
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          handleSeek(details.seekTime);
        }
      });
    }
  }, [currentTrack]);

  // Play a specific track (Works for BOTH streaming MP3/M4A previews and local files)
  const handlePlayTrack = (track) => {
    if (!track) return;

    // Ensure the track is available in our active catalogue if from live search
    setSongs((prev) => {
      if (!prev.some((s) => s.id === track.id)) {
        return [track, ...prev];
      }
      return prev;
    });

    // Also ensure it is in the active playback queue
    setActiveQueue((prev) => {
      if (!prev.some((s) => s.id === track.id)) {
        return [track, ...prev];
      }
      return prev;
    });

    if (currentTrack?.id === track.id) {
      handlePlayPause();
      return;
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration || 210);

    const audioEl = audioElementRef.current;
    if (audioEl) {
      const srcToPlay = track.audioSrc;
      if (srcToPlay) {
        audioEl.src = srcToPlay;
        audioEl.currentTime = 0;
        audioEl.volume = volume;
        audioEl.play()
          .then(() => {
            setIsPlaying(true);
            setAudioBlocked(false);
          })
          .catch((err) => {
            console.warn("Audio play blocked by browser:", err);
            setAudioBlocked(true);
            setIsPlaying(false);
          });
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Play/Pause toggle
  const handlePlayPause = () => {
    const audioEl = audioElementRef.current;
    if (!isPlaying) {
      if (audioEl) {
        if (!audioEl.src && currentTrack?.audioSrc) {
          audioEl.src = currentTrack.audioSrc;
        }
        audioEl.volume = volume;
        audioEl.play()
          .then(() => {
            setIsPlaying(true);
            setAudioBlocked(false);
          })
          .catch((err) => {
            console.warn("Audio play error:", err);
            setAudioBlocked(true);
          });
      } else {
        setIsPlaying(true);
      }
    } else {
      if (audioEl) {
        audioEl.pause();
      }
      setIsPlaying(false);
    }
  };

  // Next Track
  const handleNextTrack = () => {
    const queue = activeQueue.length > 0 ? activeQueue : [...localTracks, ...songs];
    if (queue.length === 0) return;

    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      const currentIndex = queue.findIndex((s) => s.id === currentTrack?.id);
      nextIndex = (currentIndex + 1) % queue.length;
    }

    handlePlayTrack(queue[nextIndex]);
  };

  // Previous Track
  const handlePrevTrack = () => {
    const queue = activeQueue.length > 0 ? activeQueue : [...localTracks, ...songs];
    if (queue.length === 0) return;

    if (currentTime > 4) {
      handleSeek(0);
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    handlePlayTrack(queue[prevIndex]);
  };

  // Seek
  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = newTime;
    }
  };

  // Toggle Like
  const handleToggleLike = async (songId) => {
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    const wasLiked = likedSongIds.includes(songId);
    setLikedSongIds((prev) => wasLiked ? prev.filter((id) => id !== songId) : [...prev, songId]);
    try { await (wasLiked ? unlikeSong(songId) : likeSong(songId)); }
    catch { setLikedSongIds((prev) => wasLiked ? [...prev, songId] : prev.filter((id) => id !== songId)); }
  };

  // Toggle Shuffle
  const handleToggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  // Toggle Repeat
  const handleToggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  // Play entire playlist
  const handlePlayPlaylist = (songsList, startIndex = 0, shuffle = false) => {
    if (!songsList || songsList.length === 0) return;
    setActiveQueue(songsList);
    setIsShuffle(shuffle);
    const targetSong = songsList[startIndex] || songsList[0];
    handlePlayTrack(targetSong);
  };

  // Playlist Management Handlers
  const handleCreatePlaylist = async (playlistData) => {
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    try {
      const created = await createPlaylist(playlistData.title);
      setPlaylists((prev) => [{ ...playlistData, ...created, songIds: [] }, ...prev]);
    } catch { /* keep the UI unchanged if the request fails */ }
  };

  const handleEditPlaylist = async (updatedData) => {
    try {
      await updatePlaylist(updatedData.id, updatedData.title);
      setPlaylists((prev) => prev.map((pl) => (pl.id === updatedData.id ? { ...pl, ...updatedData } : pl)));
    } catch {}
  };

  const handleDeletePlaylist = async (playlistId) => {
    try { await deletePlaylist(playlistId); } catch { return; }
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setActiveTab('playlists');
      setSelectedPlaylistId(null);
    }
  };

  const handleAddToPlaylist = async (playlistId, songId) => {
    const playlist = playlists.find((item) => item.id === playlistId);
    const already = playlist?.songIds?.includes(songId);
    try { await (already ? removeSongFromPlaylist(playlistId, songId) : addSongToPlaylist(playlistId, songId)); } catch { return; }
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const already = pl.songIds?.includes(songId);
          const newSongIds = already
            ? pl.songIds.filter((id) => id !== songId)
            : [...(pl.songIds || []), songId];
          return { ...pl, songIds: newSongIds };
        }
        return pl;
      })
    );
  };

  const handleRemoveSongFromPlaylist = async (playlistId, songId) => {
    try { await removeSongFromPlaylist(playlistId, songId); } catch { return; }
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, songIds: (pl.songIds || []).filter((id) => id !== songId) };
        }
        return pl;
      })
    );
  };

  const handleReorderPlaylistSong = (playlistId, fromIndex, direction) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const list = [...(pl.songIds || [])];
          const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
          if (toIndex < 0 || toIndex >= list.length) return pl;
          const [moved] = list.splice(fromIndex, 1);
          list.splice(toIndex, 0, moved);
          return { ...pl, songIds: list };
        }
        return pl;
      })
    );
  };

  // Open Add To Playlist Modal for a song
  const handleOpenAddToPlaylistModal = (track) => {
    setTrackForAddToPlaylist(track);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('mello_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mello_user');
      localStorage.removeItem('melodia_access_token');
      localStorage.removeItem('melodia_refresh_token');
    } catch {
      // ignore
    }
  };

  // Import Local Music Files
  const handleImportFiles = (files, isDirectObject = false) => {
    if (isDirectObject) {
      setLocalTracks((prev) => [files[0], ...prev]);
      handlePlayTrack(files[0]);
      return;
    }

    const fileList = Array.from(files);
    fileList.forEach((file, idx) => {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      const audioUrl = URL.createObjectURL(file);
      const tempAudio = new Audio(audioUrl);

      const addTrackWithDuration = (durationSecs) => {
        const d = Math.max(1, Math.round(durationSecs || 180));
        const m = Math.floor(d / 60);
        const s = d % 60;
        const newTrack = {
          id: `local-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          title: fileNameWithoutExt,
          artist: "Device Audio File",
          album: "Local Storage",
          duration: d,
          durationFormatted: `${m}:${s < 10 ? '0' : ''}${s}`,
          coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
          genre: "Local Music",
          isLocal: true,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          audioSrc: audioUrl,
          file: file
        };

        setLocalTracks((prev) => [newTrack, ...prev]);
        if (idx === 0) {
          handlePlayTrack(newTrack);
        }
      };

      tempAudio.addEventListener('loadedmetadata', () => {
        addTrackWithDuration(tempAudio.duration);
      });
      tempAudio.addEventListener('error', () => {
        addTrackWithDuration(180);
      });
    });
  };

  const handleDeleteLocalTrack = (id) => {
    setLocalTracks((prev) => prev.filter((t) => t.id !== id));
    if (currentTrack?.id === id) {
      handleNextTrack();
    }
  };

  // Active playlist resolution
  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);
  const allAvailableSongs = [...localTracks, ...songs];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-violet-500/30 selection:text-violet-200">
      {/* Real HTML5 Audio Element for Sound Streaming */}
      <audio
        ref={audioElementRef}
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setAudioBlocked(false);
          if (audioEngine?.stopMelodicSynth) {
            audioEngine.stopMelodicSynth();
          }
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
          const d = e.currentTarget.duration;
          if (d && !isNaN(d) && isFinite(d) && d > 0 && Math.abs(duration - d) > 1) {
            setDuration(Math.round(d));
          }
        }}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && !isNaN(d) && isFinite(d) && d > 0) {
            const rounded = Math.round(d);
            setDuration(rounded);
            setCurrentTrack((prev) => {
              if (prev && prev.duration !== rounded) {
                const m = Math.floor(rounded / 60);
                const s = rounded % 60;
                return {
                  ...prev,
                  duration: rounded,
                  durationFormatted: `${m}:${s < 10 ? '0' : ''}${s}`
                };
              }
              return prev;
            });
          }
        }}
        onEnded={() => {
          if (repeatMode === 'one') {
            if (audioElementRef.current) {
              audioElementRef.current.currentTime = 0;
              audioElementRef.current.play().catch(() => {});
            }
          } else {
            handleNextTrack();
          }
        }}
        onError={(e) => {
          console.warn("Audio stream playback issue:", e);
          setIsPlaying(false);
        }}
        className="hidden"
      />

      {/* Browser Autoplay Blocked Banner */}
      {audioBlocked && (
        <div className="bg-gradient-to-r from-amber-600 to-violet-700 text-white px-4 py-2 text-xs flex items-center justify-between shadow-lg sticky top-0 z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Audio paused by browser permissions. Tap to unmute and enable playback!</span>
          </div>
          <button
            type="button"
            onClick={() => {
              handlePlayPause();
              audioEngine.playChime();
            }}
            className="px-3 py-1 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-100 transition active:scale-95 shadow"
          >
            Enable Sound Now
          </button>
        </div>
      )}

      {/* Top Application Bar */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onVoiceSearch={(query) => {
          setSearchQuery(query);
          setActiveTab('search');
        }}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onOpenNowPlaying={() => setIsNowPlayingOpen(true)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'playlist-detail') setSelectedPlaylistId(null);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCreatePlaylist={() => {
          setEditingPlaylist(null);
          setIsPlaylistModalOpen(true);
        }}
        playlistsCount={playlists.length}
        likedCount={likedSongIds.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <BottomNav
          activeTab={activeTab === 'playlist-detail' ? 'playlists' : activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'playlist-detail') setSelectedPlaylistId(null);
          }}
          localTracksCount={localTracks.length}
          playlistsCount={playlists.length}
        />

        {/* Page Views */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 transition-all duration-300">
          {activeTab === 'home' && (
            <Home
              songs={songs}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              likedSongIds={likedSongIds}
              onAddToPlaylist={handleOpenAddToPlaylistModal}
            />
          )}

          {activeTab === 'search' && (
            <Search
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onVoiceSearch={(query) => setSearchQuery(query)}
              songs={[...localTracks, ...songs]}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              likedSongIds={likedSongIds}
              onAddToPlaylist={handleOpenAddToPlaylistModal}
            />
          )}

          {activeTab === 'playlists' && (
            <Playlists
              playlists={playlists}
              allSongs={allAvailableSongs}
              onSelectPlaylist={(pl) => {
                setSelectedPlaylistId(pl.id);
                setActiveTab('playlist-detail');
              }}
              onOpenCreatePlaylist={() => {
                setEditingPlaylist(null);
                setIsPlaylistModalOpen(true);
              }}
              onPlayPlaylist={handlePlayPlaylist}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'playlist-detail' && selectedPlaylist && (
            <PlaylistDetail
              playlist={selectedPlaylist}
              onBack={() => {
                setActiveTab('playlists');
                setSelectedPlaylistId(null);
              }}
              allSongs={allAvailableSongs}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onPlayPlaylist={handlePlayPlaylist}
              onReorderSong={handleReorderPlaylistSong}
              onRemoveSong={handleRemoveSongFromPlaylist}
              onEditPlaylist={(pl) => {
                setEditingPlaylist(pl);
                setIsPlaylistModalOpen(true);
              }}
              onDeletePlaylist={handleDeletePlaylist}
              onOpenSearch={() => setActiveTab('search')}
              onToggleLike={handleToggleLike}
              likedSongIds={likedSongIds}
            />
          )}

          {activeTab === 'library' && (
            <Library
              localTracks={localTracks}
              onImportFiles={handleImportFiles}
              onDeleteLocalTrack={handleDeleteLocalTrack}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              likedSongIds={likedSongIds}
              allSongs={songs}
              onAddToPlaylist={handleOpenAddToPlaylistModal}
            />
          )}

          {activeTab === 'trends' && (
            <Trends
              songs={songs}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              likedSongIds={likedSongIds}
            />
          )}
        </main>
      </div>

      {/* Persistent Mini Player Bar */}
      {currentTrack && (
        <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-30 pointer-events-auto">
          <MiniPlayer
            track={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onPlayPause={handlePlayPause}
            onNext={handleNextTrack}
            onPrev={handlePrevTrack}
            onOpenNowPlaying={() => setIsNowPlayingOpen(true)}
            isLiked={likedSongIds.includes(currentTrack.id)}
            onToggleLike={handleToggleLike}
          />
        </div>
      )}

      {/* Full-Screen Now Playing View Modal */}
      {isNowPlayingOpen && currentTrack && (
        <NowPlaying
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onSeek={handleSeek}
          onClose={() => setIsNowPlayingOpen(false)}
          isLiked={likedSongIds.includes(currentTrack.id)}
          onToggleLike={handleToggleLike}
          isShuffle={isShuffle}
          onToggleShuffle={handleToggleShuffle}
          repeatMode={repeatMode}
          onToggleRepeat={handleToggleRepeat}
          onAddToPlaylist={handleOpenAddToPlaylistModal}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}

      {/* User Authentication Modal (Email/Password + Google + Apple) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

      {/* Create / Edit Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => {
          setIsPlaylistModalOpen(false);
          setEditingPlaylist(null);
        }}
        onSave={(data) => {
          if (editingPlaylist) {
            handleEditPlaylist(data);
          } else {
            handleCreatePlaylist(data);
          }
        }}
        initialData={editingPlaylist}
      />

      {/* Add Song To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={Boolean(trackForAddToPlaylist)}
        onClose={() => setTrackForAddToPlaylist(null)}
        track={trackForAddToPlaylist}
        playlists={playlists}
        onAddToPlaylist={handleAddToPlaylist}
        onCreateNewPlaylist={() => {
          setEditingPlaylist(null);
          setIsPlaylistModalOpen(true);
        }}
      />
    </div>
  );
}
