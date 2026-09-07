const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1';

function duration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export function toTrack(song) {
  return {
    id: song.id,
    title: song.title,
    artist: song.artistName || 'Unknown artist',
    album: song.albumTitle || '',
    genre: song.genreName || 'Music',
    duration: song.durationSeconds || 0,
    durationFormatted: duration(song.durationSeconds),
    coverUrl: '/placeholder-cover.svg',
    audioSrc: `${API_BASE}/songs/${song.id}/stream`,
    isCatalogTrack: true
  };
}

async function request(path, options = {}) {
  const token = localStorage.getItem('melodia_access_token');
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || 'Request failed');
  return response.status === 204 ? null : response.json();
}

export async function listSongs() {
  const page = await request('/songs?size=100&sort=title,asc');
  return (page.content || []).map(toTrack);
}

export async function searchSongs(query) {
  const songs = await request(`/search?q=${encodeURIComponent(query)}&limit=50`);
  return songs.map(toTrack);
}

export async function authenticate(mode, email, password, displayName) {
  const path = mode === 'signup' ? '/auth/register' : '/auth/login';
  const payload = mode === 'signup' ? { email, password, displayName } : { email, password };
  const auth = await request(path, { method: 'POST', body: JSON.stringify(payload) });
  localStorage.setItem('melodia_access_token', auth.accessToken);
  localStorage.setItem('melodia_refresh_token', auth.refreshToken);
  return { id: auth.userId, name: auth.displayName, email };
}

export const listPlaylists = () => request('/playlists').then(items => items.map(playlist => ({ ...playlist, songIds: playlist.songs.map(song => song.id) })));
export const createPlaylist = (title) => request('/playlists', { method: 'POST', body: JSON.stringify({ title, isPublic: false }) });
export const updatePlaylist = (id, title) => request(`/playlists/${id}`, { method: 'PUT', body: JSON.stringify({ title, isPublic: false }) });
export const deletePlaylist = (id) => request(`/playlists/${id}`, { method: 'DELETE' });
export const addSongToPlaylist = (playlistId, songId) => request(`/playlists/${playlistId}/songs/${songId}`, { method: 'POST' });
export const removeSongFromPlaylist = (playlistId, songId) => request(`/playlists/${playlistId}/songs/${songId}`, { method: 'DELETE' });
export const listLikedSongs = () => request('/library/liked-songs').then(songs => songs.map(toTrack));
export const likeSong = (songId) => request(`/library/likes/${songId}`, { method: 'POST' });
export const unlikeSong = (songId) => request(`/library/likes/${songId}`, { method: 'DELETE' });
