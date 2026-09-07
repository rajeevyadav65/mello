import { searchSongs } from './melodiaApi.js';

/** Search only the licensed catalogue provided by the Melodia backend. */
export async function searchGlobalMusic(query, limit = 25) {
  const results = await searchSongs(query);
  return results.slice(0, limit);
}
