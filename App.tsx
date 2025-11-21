import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { getGameArchives, getGamesFromArchive, getPlayerStats, getPlayerProfile } from './services/chesscomService';
import { stockfishService } from './services/stockfishService';
import { generateCoachingReport } from './services/ollamaService';
import { ChessComGame, CoachingReport, Puzzle, PlayerStats, PlayerProfile, CriticalMoment, EngineCriticalMoment } from './types';
import Chessboard from './components/Chessboard';
import PuzzleBoard from './components/PuzzleBoard';
import GameList from './components/GameList';
import Controls from './components/Controls';
import AnalysisPanel from './components/AnalysisPanel';
import ProfileCard from './components/ProfileCard';
import CapturedPieces from './components/CapturedPieces';
import EvaluationBar from './components/EvaluationBar';
import { SearchIcon, BrainCircuitIcon, CheckIcon, FlipIcon } from './components/icons';
import { Chess } from 'chess.js';

type ViewMode = 'game' | 'puzzle';
type TimeClass = 'all' | 'rapid' | 'blitz';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('Hikaru');
  const [searchedUsername, setSearchedUsername] = useState<string>('');
  const [games, setGames] = useState<ChessComGame[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [selectedGame, setSelectedGame] = useState<ChessComGame | null>(null);
  const [coachingReport, setCoachingReport] = useState<CoachingReport | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('game');
  const [timeClassFilter, setTimeClassFilter] = useState<TimeClass>('all');
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [selectedGameUrls, setSelectedGameUrls] = useState<string[]>([]);

  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isLoadingGames, setIsLoadingGames] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorsError, setIsCorsError] = useState<boolean>(false);

  // Centralized game logic instance and pre-calculated FENs
  const [gameInstance, setGameInstance] = useState<Chess | null>(null);
  const [fenHistory, setFenHistory] = useState<string[]>(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);
  const [evaluationHistory, setEvaluationHistory] = useState<number[] | null>(null);

  // Effect to update game instance and pre-calculate all FENs when a new game is selected
  useEffect(() => {
    if (selectedGame?.pgn) {
      try {
        const newGame = new Chess();
        newGame.loadPgn(selectedGame.pgn);
        setGameInstance(newGame);

        // Pre-calculate FEN history for reliable navigation
        const history = newGame.history({ verbose: true });
        const startingFen = newGame.header().FEN;
        const gameCopy = startingFen ? new Chess(startingFen) : new Chess();
        const fens: string[] = [gameCopy.fen()];
        for (const move of history) {
            gameCopy.move(move.san);
            fens.push(gameCopy.fen());
        }
        setFenHistory(fens);

      } catch {
        setError("Failed to load PGN for the selected game.");
        setGameInstance(null);
        setFenHistory(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);
      }
    } else {
      setGameInstance(null);
      setFenHistory(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);
    }
  }, [selectedGame]);
  
    // Effect to run full game evaluation when fenHistory is populated
    useEffect(() => {
    if (fenHistory.length > 1 && searchedUsername && selectedGame) { // A game is loaded
      const evaluate = async () => {
        setIsEvaluating(true);
        setEvaluationHistory(null);
        try {
          const evals = await stockfishService.evaluateFenHistory(fenHistory, (progress) => {
            console.log('Evaluation progress:', progress);
          });
          setEvaluationHistory(evals);
        } catch (err) {
          console.error("Failed to get full game evaluation:", err);
        } finally {
          setIsEvaluating(false);
        }
      };
      evaluate();
    } else {
        setEvaluationHistory(null);
    }
  }, [fenHistory, searchedUsername, selectedGame]);


  const currentFen = fenHistory[currentPly] || fenHistory[0];
  const totalPly = (fenHistory.length > 1) ? fenHistory.length - 1 : 0;
  
  const handleSearchPlayer = useCallback(async () => {
    if (!username) {
      setError("Please enter a chess.com username.");
      return;
    }
    setIsLoadingProfile(true);
    setError(null);
    setIsCorsError(false);
    setGames([]);
    setSelectedGame(null);
    setCoachingReport(null);
    setPuzzle(null);
    setPlayerStats(null);
    setPlayerProfile(null);
    setEvaluationHistory(null);
    setSelectedGameUrls([]);
    setViewMode('game');
    setCurrentPly(0);
    setSearchedUsername(username);

    try {
      const [profile, stats] = await Promise.all([
        getPlayerProfile(username),
        getPlayerStats(username),
      ]);

      if (!profile) {
        setError("Could not find a player with that username. Please check the spelling and try again.");
      } else {
        setPlayerProfile(profile);
        setPlayerStats(stats as PlayerStats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during profile search.');
    } finally {
      setIsLoadingProfile(false);
    }
  }, [username]);
  
  const handleLoadGames = useCallback(async () => {
    if (!playerProfile) return;

    setIsLoadingGames(true);
    setError(null);
    
    try {
      const archives = await getGameArchives(playerProfile.username);
      if (archives.length > 0) {
        const recentArchives = archives.slice(-2).reverse();
        const gamesFromArchives = await Promise.all(
          recentArchives.map(url => getGamesFromArchive(url))
        );
        const allRecentGames = gamesFromArchives.flat();
        allRecentGames.sort((a, b) => b.end_time - a.end_time);

        setGames(allRecentGames);
        if (allRecentGames.length === 0) {
          setError("No recent games with PGN found in the last couple of months.");
        }
      } else {
        setError("No game archives found for this user.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching games.');
    } finally {
      setIsLoadingGames(false);
    }
  }, [playerProfile]);

  const handleToggleGameSelection = (url: string) => {
    setSelectedGameUrls(prev => 
        prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleViewGame = (game: ChessComGame) => {
    setSelectedGame(game);
    setCurrentPly(0);
    const playerIsWhite = game.white.username.toLowerCase() === searchedUsername.toLowerCase();
    setBoardOrientation(playerIsWhite ? 'white' : 'black');
  };

  const handleAnalyzeSelectedGames = useCallback(async () => {
    if (selectedGameUrls.length === 0) {
        setError("Please select at least one game to analyze.");
        return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setIsCorsError(false);
    setCoachingReport(null);
    
    try {
        const allMoments: EngineCriticalMoment[] = [];
        
        const gamesToAnalyze = games.filter(g => selectedGameUrls.includes(g.url));

        for (let i = 0; i < gamesToAnalyze.length; i++) {
            const gameToAnalyze = gamesToAnalyze[i];
            
            setAnalysisStatus(`Analyzing game ${i + 1} of ${gamesToAnalyze.length}...`);
            
            const engineMoments = await stockfishService.findCriticalMoments(
                gameToAnalyze.pgn,
                searchedUsername,
                gameToAnalyze.url,
                (progress: string) => setAnalysisStatus(`Game ${i+1}/${gamesToAnalyze.length}: ${progress}`)
            );
            allMoments.push(...engineMoments);
        }
        
        if (allMoments.length === 0) {
            setCoachingReport({ overallSummary: "A very solid set of games! The Stockfish engine found no major mistakes to highlight.", weaknesses: [] });
            return;
        }

        setAnalysisStatus('Synthesizing weaknesses with AI coach...');
        const report = await generateCoachingReport(allMoments, searchedUsername);
        setCoachingReport(report);

    } catch (err) {
      if (err instanceof Error && err.message === 'CORS_ERROR') {
        setIsCorsError(true);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to analyze game.');
      }
      setCoachingReport(null);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatus('');
    }
  }, [searchedUsername, selectedGameUrls, games]);
  
  const handleMomentSelect = (moment: CriticalMoment) => {
    const gameForMoment = games.find(g => g.url === moment.gameUrl);
    if (gameForMoment) {
        if (selectedGame?.url !== gameForMoment.url) {
            handleViewGame(gameForMoment);
        }
        const ply = (moment.moveNumber - 1) * 2 + (moment.playerColor === 'White' ? 1 : 0);
        setCurrentPly(ply);
    }
  };

  const handleFlipBoard = useCallback(() => {
    setBoardOrientation(prev => (prev === 'white' ? 'black' : 'white'));
  }, []);

  const filteredGames = useMemo(() => {
    if (timeClassFilter === 'all') return games;
    return games.filter(game => game.time_class === timeClassFilter);
  }, [games, timeClassFilter]);
  
  const TimeFilterButton: React.FC<{timeClass: TimeClass, label: string}> = ({ timeClass, label }) => (
    <button 
        onClick={() => setTimeClassFilter(timeClass)}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${timeClassFilter === timeClass ? 'bg-sky-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center space-x-2">
            <BrainCircuitIcon />
            <h1 className="text-3xl font-bold text-sky-400">Chess AI Coach</h1>
          </div>
          <p className="text-slate-400 mt-1">Stockfish analysis explained by your local Ollama instance.</p>
        </header>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchPlayer()}
              placeholder="Enter a chess.com username"
              className="flex-grow bg-slate-800 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={handleSearchPlayer}
              disabled={isLoadingProfile}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <SearchIcon />
              {isLoadingProfile ? 'Searching...' : 'Search Player'}
            </button>
          </div>
          {isCorsError && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md relative mt-4" role="alert">
              <strong className="font-bold">Connection Blocked!</strong>
              <span className="block sm:inline ml-2">This app can't connect to your local Ollama server.</span>
              <div className="mt-3 text-sm bg-slate-900 p-3 rounded-md">
                <p className="font-semibold">Ensure your local AI proxy is running:</p>
                <code className="block bg-slate-800 p-2 rounded mt-1 font-mono text-xs break-all">
                  node proxy.js
                </code>
                <p className="mt-2 text-xs text-slate-400">Make sure Ollama is running in the background as well.</p>
              </div>
            </div>
          )}
          {error && !isCorsError && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 bg-slate-800/50 p-4 rounded-lg">
            {isLoadingProfile && (
              <div className="text-center p-8">
                <p className="animate-pulse text-slate-400">Searching for player...</p>
              </div>
            )}

            {!isLoadingProfile && playerProfile && (
              <div className="space-y-4">
                <ProfileCard profile={playerProfile} stats={playerStats} searchedUsername={searchedUsername} />
                
                {games.length === 0 && !isLoadingGames && (
                  <button
                      onClick={handleLoadGames}
                      disabled={isLoadingGames}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                      <CheckIcon />
                      {isLoadingGames ? 'Loading Games...' : 'Confirm & Load Games'}
                  </button>
                )}
              </div>
            )}
            
            {games.length > 0 && (
                 <div className="mt-4">
                     <button
                        onClick={handleAnalyzeSelectedGames}
                        disabled={isAnalyzing || selectedGameUrls.length === 0}
                        className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        <BrainCircuitIcon />
                        {isAnalyzing ? 'Analyzing...' : `Analyze ${selectedGameUrls.length} Selected Games`}
                    </button>
                 </div>
            )}

            {(isLoadingGames || games.length > 0) && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Recent Games</h2>
                    <div className="flex items-center gap-2">
                        <TimeFilterButton timeClass="all" label="All" />
                        <TimeFilterButton timeClass="rapid" label="Rapid" />
                        <TimeFilterButton timeClass="blitz" label="Blitz" />
                    </div>
                </div>
                <div className="max-h-[50vh] overflow-y-auto pr-2">
                  <GameList 
                    games={filteredGames} 
                    onViewGame={handleViewGame}
                    onToggleGameSelection={handleToggleGameSelection}
                    selectedGameUrls={selectedGameUrls}
                    currentlyViewingUrl={selectedGame?.url || null}
                    isLoading={isLoadingGames}
                  />
                </div>
              </div>
            )}
          </aside>

          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-800/50 p-4 rounded-lg">
              {!selectedGame && (!playerProfile || games.length === 0) ? (
                 <div className="aspect-square flex items-center justify-center bg-slate-800 rounded-md">
                   <p className="text-slate-500">Search for a player to begin</p>
                 </div>
              ) : !selectedGame && playerProfile && games.length > 0 ? (
                 <div className="aspect-square flex items-center justify-center bg-slate-800 rounded-md">
                   <p className="text-slate-500">Select a game to view it</p>
                 </div>
              ) : viewMode === 'puzzle' && puzzle ? (
                <PuzzleBoard puzzle={puzzle} onExit={() => setViewMode('game')} />
              ) : (
                selectedGame && gameInstance && (
                  <div className="flex gap-3 items-stretch">
                    {(isEvaluating || evaluationHistory) && (
                      <EvaluationBar 
                        score={evaluationHistory ? evaluationHistory[currentPly] : 0} 
                        isLoading={isEvaluating}
                      />
                    )}
                    <div className="flex-grow flex flex-col">
                      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center flex-grow">
                        <CapturedPieces color="white" game={gameInstance} currentPly={currentPly} />
                        <div className="relative">
                          <Chessboard
                            key={selectedGame.url}
                            fen={currentFen}
                            game={gameInstance}
                            currentPly={currentPly}
                            coachingReport={coachingReport}
                            username={searchedUsername}
                            boardOrientation={boardOrientation}
                          />
                          <button
                              onClick={handleFlipBoard}
                              className="absolute top-1 right-1 p-1.5 bg-slate-900/50 rounded-md hover:bg-slate-700/70 transition-colors"
                              aria-label="Flip board"
                              title="Flip board"
                            >
                              <FlipIcon />
                          </button>
                        </div>
                        <CapturedPieces color="black" game={gameInstance} currentPly={currentPly} />
                      </div>
                      <Controls 
                        currentPly={currentPly}
                        totalPly={totalPly}
                        onNavigate={setCurrentPly}
                      />
                    </div>
                  </div>
                )
              )}
            </section>
            
            <section className="bg-slate-800/50 p-4 rounded-lg min-h-[300px]">
                <AnalysisPanel 
                    coachingReport={coachingReport}
                    isAnalyzing={isAnalyzing}
                    analysisStatus={analysisStatus}
                    username={searchedUsername}
                    currentPly={currentPly}
                    game={gameInstance}
                    selectedGameUrl={selectedGame?.url || null}
                    onMomentSelect={handleMomentSelect}
                />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;