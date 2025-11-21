import { ChessComGame, PlayerStats, PlayerProfile } from '../types';

const API_BASE = 'https://api.chess.com/pub';

export const getPlayerProfile = async (username: string): Promise<PlayerProfile | null> => {
  const response = await fetch(`${API_BASE}/player/${username}`);
  if (!response.ok) {
    return null; // A user might not have a public profile; don't throw an error.
  }
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
};


export const getPlayerStats = async (username: string): Promise<PlayerStats> => {
  const response = await fetch(`${API_BASE}/player/${username}/stats`);
  if (!response.ok) {
    // A user might exist but have no stats, so we don't throw.
    // The primary check for user existence is getGameArchives.
    return {};
  }
  try {
    const data = await response.json();
    return data;
  } catch (e) {
    // Handle case where stats endpoint returns non-json or is empty
    return {};
  }
};

export const getGameArchives = async (username: string): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/player/${username}/games/archives`);
  if (!response.ok) {
    throw new Error('Could not fetch game archives. Please check the username.');
  }
  const data = await response.json();
  return data.archives;
};

export const getGamesFromArchive = async (archiveUrl: string): Promise<ChessComGame[]> => {
  const response = await fetch(archiveUrl);
  if (!response.ok) {
    throw new Error('Could not fetch games from the archive.');
  }
  const data = await response.json();
  return data.games.filter(game => game.pgn).reverse(); // Get latest games first and ensure PGN exists
};