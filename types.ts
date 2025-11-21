import type React from 'react';

export interface ChessComGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: {
    rating: number;
    result: string;
    '@id': string;
    username: string;
  };
  black: {
    rating: number;
    result: string;
    '@id': string;
    username: string;
  };
}

export interface CriticalMoment {
  moveNumber: number;
  playerColor: 'White' | 'Black';
  positionFen: string;
  moveNotation: string;
  reasoning: string;
  betterMove: string;
  betterMoveReasoning: string;
  evaluationChange: number; // In centipawns
  gameUrl: string;
}

// Intermediate type for data from Stockfish to Ollama
export interface EngineCriticalMoment {
  moveNumber: number;
  playerColor: 'White' | 'Black';
  positionFen: string;
  playerMove: string;
  engineBestMove: string;
  evaluationDrop: number; // Positive number representing centipawn loss
  gameUrl: string;
}

export interface Weakness {
  theme: string;
  explanation: string;
  criticalMoments: CriticalMoment[];
}

export interface CoachingReport {
  overallSummary: string;
  weaknesses: Weakness[];
}

export interface CustomSquareStyles {
  [square: string]: React.CSSProperties;
}

export interface Puzzle {
  fen: string;
  solution: string[];
  prompt: string;
  explanation: string;
}

export interface PlayerProfile {
  avatar?: string;
  player_id: number;
  '@id': string;
  url: string;
  name?: string;
  username: string;
  title?: string;
  followers: number;
  country: string;
  location?: string;
  last_online: number;
  joined: number;
  status: string;
  is_streamer: boolean;
  verified: boolean;
  league?: string;
}


export interface Rating {
  rating: number;
  date: number;
  rd: number;
}

export interface GameTypeStats {
  last: Rating;
  best: Rating & { game: string };
  record: {
    win: number;
    loss: number;
    draw: number;
  };
}

export interface PlayerStats {
  chess_blitz?: GameTypeStats;
  chess_rapid?: GameTypeStats;
  chess_daily?: GameTypeStats;
}