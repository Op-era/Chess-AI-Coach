import React from 'react';
import { PlayerProfile, PlayerStats } from '../types';

interface ProfileCardProps {
    profile: PlayerProfile | null;
    stats: PlayerStats | null;
    searchedUsername: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, stats, searchedUsername }) => {
    if (!profile) {
        return null; // Don't render if there's no profile data
    }

    const showSearchedUsername = 
        searchedUsername &&
        profile.username.toLowerCase() === searchedUsername.toLowerCase() &&
        profile.username !== searchedUsername;

    return (
        <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-4">
                <img 
                    src={profile.avatar || 'https://www.chess.com/images/chess-themes/pieces/neo/150/wp.png'} 
                    alt={`${profile.username}'s avatar`}
                    className="h-16 w-16 rounded-md bg-slate-700 object-cover"
                />
                <div>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        <h3 className="text-xl font-bold text-white">{profile.name || profile.username}</h3>
                    </a>
                    <p className="text-sm text-slate-400">
                        {profile.title && <span className="font-bold text-amber-400">{profile.title}</span>} {profile.username}
                    </p>
                    {showSearchedUsername && (
                        <p className="text-xs text-slate-500 italic mt-1">
                            (Searched for: {searchedUsername})
                        </p>
                    )}
                    {profile.country && (
                         <p className="text-sm text-slate-400 flex items-center mt-1">
                            <img src={`https://www.chess.com/images/flags/${profile.country.split('/').pop()?.toLowerCase()}.svg`} alt="country flag" className="h-4 w-4 mr-1.5" />
                            {profile.location || 'Location not specified'}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800 p-2 rounded-md text-center">
                    <p className="font-semibold text-slate-300">Rapid Rating</p>
                    <p className="text-lg font-bold text-sky-400">{stats?.chess_rapid?.last.rating ?? 'N/A'}</p>
                </div>
                 <div className="bg-slate-800 p-2 rounded-md text-center">
                    <p className="font-semibold text-slate-300">Blitz Rating</p>
                    <p className="text-lg font-bold text-sky-400">{stats?.chess_blitz?.last.rating ?? 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;