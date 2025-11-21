import React from 'react';

const iconProps = {
  className: "h-5 w-5",
  strokeWidth: 2,
};

const pieceIconProps = {
    className: "h-5 w-5",
    viewBox: "0 0 45 45",
    strokeWidth: 1.5,
    stroke: "currentColor",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
} as const;

export const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const BrainCircuitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
    <path d="M12 5a3 3 0 1 0-5.993.129"></path>
    <path d="M12 5a3 3 0 1 0 5.993.129"></path>
    <path d="M15 13a3 3 0 1 0-5.993.129"></path>
    <path d="M12 19a3 3 0 1 0-5.993.129"></path>
    <path d="M12 19a3 3 0 1 0 5.993.129"></path>
    <path d="M21 13a3 3 0 1 0-5.993.129"></path>
    <path d="M9 13a3 3 0 1 0-5.993.129"></path>
    <path d="M17.595 14.331A2.992 2.992 0 0 0 18 13a3 3 0 1 0-3-3"></path>
    <path d="M6.405 14.331A2.992 2.992 0 0 0 6 13a3 3 0 1 0-3-3"></path>
    <path d="M12 5a3 3 0 0 0-3 3v2"></path>
    <path d="M12 5a3 3 0 0 1 3 3v2"></path>
    <path d="M12 19a3 3 0 0 1-3-3v-2"></path>
    <path d="M12 19a3 3 0 0 0 3-3v-2"></path>
    <path d="M9 13a3 3 0 0 0-3 3v1"></path>
    <path d="M15 13a3 3 0 0 1 3 3v1"></path>
  </svg>
);

export const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export const ChevronsLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
    <polyline points="11 17 6 12 11 6"></polyline>
    <polyline points="18 17 13 12 18 6"></polyline>
  </svg>
);

export const ChevronsRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
    <polyline points="13 17 18 12 13 6"></polyline>
    <polyline points="6 17 11 12 6 6"></polyline>
  </svg>
);

export const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"></path>
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
    </svg>
);

export const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const FlipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...iconProps}>
        <path d="M3 2v6h6"></path>
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
        <path d="M21 22v-6h-6"></path>
        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
    </svg>
);

// Captured Piece Icons
// FIX: Explicitly type as React.FC and destructure children to fix type inference issue.
const WhitePiece: React.FC<{children: React.ReactNode}> = ({children}) => <g fill="none" stroke="#e2e8f0" {...pieceIconProps}>{children}</g>;
// FIX: Explicitly type as React.FC and destructure children to fix type inference issue.
const BlackPiece: React.FC<{children: React.ReactNode}> = ({children}) => <g fill="#334155" stroke="#334155" {...pieceIconProps}>{children}</g>;

export const WhitePawnIcon = () => <svg {...pieceIconProps}><WhitePiece><path d="M22.5 36c-3.34 0-6.03-2.68-6.03-6s2.68-6 6.03-6 6.03 2.68 6.03 6-2.68 6-6.03 6zm0-10.5c-2.5 0-4.52 2-4.52 4.5s2.02 4.5 4.52 4.5 4.52-2 4.52-4.5-2.02-4.5-4.52-4.5zM22.5 24c-1.38 0-2.5-1.12-2.5-2.5S21.12 19 22.5 19s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></WhitePiece></svg>;
export const WhiteKnightIcon = () => <svg {...pieceIconProps}><WhitePiece><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 L 15,36 C 15,36 25,36 25,31 C 25,26 25,26 10,26 C 10,24 12,20 12,20 C 12,20 10.7,16.5 13,13 C 13,13 14,11.4 14,10 C 14,10 12.5,10 11,11 C 11,11 10,12 10,13 C 10,13 10,13 11,12 C 11,12 13,10 13,10 C 13,10 14.2,8.5 16,8 C 16,8 18,8 20,9 C 20,9 22,9 22,10" /></WhitePiece></svg>;
export const WhiteBishopIcon = () => <svg {...pieceIconProps}><WhitePiece><g><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65-5.57 0-8-3.06-4.43-13.5-3.5-13.5-3.5-1.12 5.07-5.71 7.37-13.5 11.5z" /><path d="M15.5 34.5c3.52-.98 10.52.42 14-2-3.52-2.42-10.52-1.02-14 2z" /><path d="M17.5 26.5c-3.33-4.67-3.33-10.17 0-14.5-3.33.33-5.67 3.33-5.67 7.17 0 3.83 2.34 6.83 5.67 7.33z" /><path d="M27.5 26.5c3.33-4.67 3.33-10.17 0-14.5 3.33.33 5.67 3.33 5.67 7.17 0 3.83-2.34 6.83-5.67 7.33z" /><circle cx="22.5" cy="10" r="2" /></g></WhitePiece></svg>;
export const WhiteRookIcon = () => <svg {...pieceIconProps}><WhitePiece><path d="M9 39h27v-3H9v3zM12 36h21v-4H12v4zM11 14V9h4v2h5V9h5v2h5V9h4v5" /><path d="M34 14l-3 3H14l-3-3" /><path d="M31 17v12.5H14V17" /><path d="M31 29.5l1.5 2.5h-20l1.5-2.5" /><path d="M14 17h17" /></WhitePiece></svg>;
export const WhiteQueenIcon = () => <svg {...pieceIconProps}><WhitePiece><path d="M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm-6 4a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm-12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" /><path d="M8 12s-1.5-3-4.5-3.5C3.5 8.5 6 5 6 5s3 1.5 4 0c1-1.5 4 0 4 0s2.5 3.5 2.5 3.5c-3 .5-4.5 3.5-4.5 3.5z" /><path d="m20 12s-1.5-3-4.5-3.5C15.5 8.5 18 5 18 5s3 1.5 4 0c1-1.5 4 0 4 0s2.5 3.5 2.5 3.5c-3 .5-4.5 3.5-4.5 3.5z" /><path d="m32 12s-1.5-3-4.5-3.5C27.5 8.5 30 5 30 5s3 1.5 4 0c1-1.5 4 0 4 0s2.5 3.5 2.5 3.5c-3 .5-4.5 3.5-4.5 3.5z" /><path d="M9 26c8.5-1.5 21-1.5 27 0l-2.5 11.5s-3.5-1-11-1-11 1-11 1L9 26z" /><path d="M9 26c0 2 1.5 3 1.5 3s4.5-1 12-1 12 1 12 1 1.5-1 1.5-3" /><path d="M11.5 37.5s3.5-1 11-1 11 1 11 1" /></WhitePiece></svg>;
export const WhiteKingIcon = () => <svg {...pieceIconProps}><WhitePiece><path d="M22.5 11.63V6M20 8h5" /><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" /><path d="M12.5 37l5-15.5-3-4.5-3 4.5-5 15.5" /><path d="M12.5 37h20" /><path d="M32.5 37l-5-15.5 3-4.5 3 4.5 5 15.5" /></WhitePiece></svg>;

export const BlackPawnIcon = () => <svg {...pieceIconProps}><BlackPiece><path d="M22.5 36c-3.34 0-6.03-2.68-6.03-6s2.68-6 6.03-6 6.03 2.68 6.03 6-2.68 6-6.03 6zm0-10.5c-2.5 0-4.52 2-4.52 4.5s2.02 4.5 4.52 4.5 4.52-2 4.52-4.5-2.02-4.5-4.52-4.5zM22.5 24c-1.38 0-2.5-1.12-2.5-2.5S21.12 19 22.5 19s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></BlackPiece></svg>;
export const BlackKnightIcon = () => <svg {...pieceIconProps}><BlackPiece><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 L 15,36 C 15,36 25,36 25,31 C 25,26 25,26 10,26 C 10,24 12,20 12,20 C 12,20 10.7,16.5 13,13 C 13,13 14,11.4 14,10 C 14,10 12.5,10 11,11 C 11,11 10,12 10,13 C 10,13 10,13 11,12 C 11,12 13,10 13,10 C 13,10 14.2,8.5 16,8 C 16,8 18,8 20,9 C 20,9 22,9 22,10" /></BlackPiece></svg>;
export const BlackBishopIcon = () => <svg {...pieceIconProps}><BlackPiece><g><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65-5.57 0-8-3.06-4.43-13.5-3.5-13.5-3.5-1.12 5.07-5.71 7.37-13.5 11.5z" /><path d="M15.5 34.5c3.52-.98 10.52.42 14-2-3.52-2.42-10.52-1.02-14 2z" /><path d="M17.5 26.5c-3.33-4.67-3.33-10.17 0-14.5-3.33.33-5.67 3.33-5.67 7.17 0 3.83 2.34 6.83 5.67 7.33z" /><path d="M27.5 26.5c3.33-4.67 3.33-10.17 0-14.5 3.33.33 5.67 3.33 5.67 7.17 0 3.83-2.34 6.83-5.67 7.33z" /><circle cx="22.5" cy="10" r="2" /></g></BlackPiece></svg>;
export const BlackRookIcon = () => <svg {...pieceIconProps}><BlackPiece><path d="M9 39h27v-3H9v3zM12 36h21v-4H12v4zM11 14V9h4v2h5V9h5v2h5V9h4v5" /><path d="M34 14l-3 3H14l-3-3" /><path d="M31 17v12.5H14V17" /><path d="M31 29.5l1.5 2.5h-20l1.5-2.5" /><path d="M14 17h17" /></BlackPiece></svg>;
export const BlackQueenIcon = () => <svg {...pieceIconProps}><BlackPiece><path d="M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm-6 4a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm-12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" /><path d="M8 12s-1.5-3-4.5-3.5C3.5 8.5 6 5 6 5s3 1.5 4 0c1-1.5 4 0 4 0s2.5 3.5 2.5 3.5c-3 .5-4.5 3.5-4.5 3.5z" /><path d="m20 12s-1.5-3-4.5-3.5C15.5 8.5 18 5 18 5s3 1.5 4 0c1-1.5 4 0 4 0s2.5 3.5 2.5 3.5c-3 .5-4.5 3.5-4.5 3.5z" /><path d="m32 12s-1.5-3-4.5-3.5C27.5 8.5 30 5 30 5s3 1.5 4 0c1-1.5 4 0 4 0s2.5 3.5 2.5 3.5c-3 .5-4.5 3.5-4.5 3.5z" /><path d="M9 26c8.5-1.5 21-1.5 27 0l-2.5 11.5s-3.5-1-11-1-11 1-11 1L9 26z" /><path d="M9 26c0 2 1.5 3 1.5 3s4.5-1 12-1 12 1 12 1 1.5-1 1.5-3" /><path d="M11.5 37.5s3.5-1 11-1 11 1 11 1" /></BlackPiece></svg>;
export const BlackKingIcon = () => <svg {...pieceIconProps}><BlackPiece><path d="M22.5 11.63V6M20 8h5" /><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" /><path d="M12.5 37l5-15.5-3-4.5-3 4.5-5 15.5" /><path d="M12.5 37h20" /><path d="M32.5 37l-5-15.5 3-4.5 3 4.5 5 15.5" /></BlackPiece></svg>;