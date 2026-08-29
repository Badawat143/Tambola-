import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ApnaTambolaLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: { logoSize: 'w-8 h-8', textClass: 'text-sm', subText: 'text-[8px]' },
    sm: { logoSize: 'w-10 h-10', textClass: 'text-base', subText: 'text-[9px]' },
    md: { logoSize: 'w-14 h-14', textClass: 'text-xl', subText: 'text-[10px]' },
    lg: { logoSize: 'w-20 h-20', textClass: 'text-2xl', subText: 'text-xs' },
    xl: { logoSize: 'w-28 h-28', textClass: 'text-3xl', subText: 'text-sm' },
  };

  const { logoSize, textClass, subText } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95' : ''} ${className}`}
    >
      {/* 3D Round Badge Logo */}
      <div className={`relative ${logoSize} shrink-0`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_8px_16px_rgba(245,158,11,0.35)]">
          <defs>
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="30%" stopColor="#EAB308" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="blueDome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <radialGradient id="redBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FF7170" />
              <stop offset="40%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>

            <radialGradient id="cyanBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="40%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </radialGradient>

            <radialGradient id="purpleBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#D8B4FE" />
              <stop offset="40%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#581C87" />
            </radialGradient>

            <radialGradient id="greenBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="40%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>

            <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>

            <linearGradient id="redBannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#991B1B" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>

          {/* Outer Gold Medallion Rim */}
          <circle cx="100" cy="100" r="96" fill="url(#goldRim)" />
          <circle cx="100" cy="100" r="88" fill="#0c0e29" stroke="#EAB308" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="84" fill="url(#blueDome)" />

          {/* Background Golden Laurel Leaves */}
          <path d="M40 70 C35 50, 48 35, 55 45 C50 60, 42 68, 40 70 Z" fill="#EAB308" opacity="0.9" />
          <path d="M160 70 C165 50, 152 35, 145 45 C150 60, 158 68, 160 70 Z" fill="#EAB308" opacity="0.9" />

          {/* Royal Gold Crown at Top */}
          <g transform="translate(68, 18)">
            <path
              d="M0 26 L12 8 L32 20 L52 8 L64 26 C50 30, 14 30, 0 26 Z"
              fill="url(#goldRim)"
              stroke="#78350F"
              strokeWidth="1"
            />
            {/* Jewels on Crown */}
            <circle cx="12" cy="8" r="3.5" fill="#EF4444" stroke="#FFF" strokeWidth="0.8" />
            <circle cx="32" cy="20" r="4" fill="#3B82F6" stroke="#FFF" strokeWidth="0.8" />
            <circle cx="52" cy="8" r="3.5" fill="#10B981" stroke="#FFF" strokeWidth="0.8" />
            <circle cx="32" cy="10" r="2.5" fill="#FFF" />
          </g>

          {/* Left Mini Ticket */}
          <g transform="translate(18, 48) rotate(-14)">
            <rect width="32" height="42" rx="3" fill="#1E40AF" stroke="#EAB308" strokeWidth="1.5" />
            <rect x="2" y="2" width="28" height="8" fill="#3B82F6" rx="1.5" />
            <text x="16" y="8" fill="#FFF" fontSize="5" fontWeight="900" textAnchor="middle">TAMBOLA</text>
            <rect x="4" y="13" width="7" height="7" fill="#FFF" rx="1" />
            <text x="7.5" y="18" fill="#1E3A8A" fontSize="4.5" fontWeight="bold" textAnchor="middle">4</text>
            <rect x="13" y="13" width="7" height="7" fill="#FDE047" rx="1" />
            <text x="16.5" y="18" fill="#854D0E" fontSize="4.5" fontWeight="bold" textAnchor="middle">23</text>
            <rect x="22" y="13" width="7" height="7" fill="#FFF" rx="1" />
            <text x="25.5" y="18" fill="#1E3A8A" fontSize="4.5" fontWeight="bold" textAnchor="middle">47</text>
          </g>

          {/* Right Mini Ticket */}
          <g transform="translate(150, 48) rotate(14)">
            <rect width="32" height="42" rx="3" fill="#991B1B" stroke="#EAB308" strokeWidth="1.5" />
            <rect x="2" y="2" width="28" height="8" fill="#DC2626" rx="1.5" />
            <text x="16" y="8" fill="#FFF" fontSize="5" fontWeight="900" textAnchor="middle">TAMBOLA</text>
            <rect x="4" y="13" width="7" height="7" fill="#FDE047" rx="1" />
            <text x="7.5" y="18" fill="#854D0E" fontSize="4.5" fontWeight="bold" textAnchor="middle">4</text>
            <rect x="13" y="13" width="7" height="7" fill="#FFF" rx="1" />
            <text x="16.5" y="18" fill="#991B1B" fontSize="4.5" fontWeight="bold" textAnchor="middle">23</text>
            <rect x="22" y="13" width="7" height="7" fill="#FDE047" rx="1" />
            <text x="25.5" y="18" fill="#854D0E" fontSize="4.5" fontWeight="bold" textAnchor="middle">85</text>
          </g>

          {/* Background Balls: 90 (Green), 47 (Cyan), 63 (Purple) */}
          {/* Green Ball 90 */}
          <circle cx="48" cy="100" r="18" fill="url(#greenBall)" stroke="#FFF" strokeWidth="1" />
          <circle cx="48" cy="100" r="11" fill="#FFF" />
          <text x="48" y="104.5" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">90</text>

          {/* Cyan Ball 47 */}
          <circle cx="70" cy="88" r="21" fill="url(#cyanBall)" stroke="#FFF" strokeWidth="1.2" />
          <circle cx="70" cy="88" r="13" fill="#FFF" />
          <text x="70" y="93" fill="#000" fontSize="12" fontWeight="900" textAnchor="middle">47</text>

          {/* Purple Ball 63 */}
          <circle cx="132" cy="88" r="21" fill="url(#purpleBall)" stroke="#FFF" strokeWidth="1.2" />
          <circle cx="132" cy="88" r="13" fill="#FFF" />
          <text x="132" y="93" fill="#000" fontSize="12" fontWeight="900" textAnchor="middle">63</text>

          {/* Foreground Large Red Center Ball 24 */}
          <circle cx="100" cy="80" r="29" fill="url(#redBall)" stroke="#FFF" strokeWidth="2" />
          <circle cx="100" cy="80" r="18" fill="#FFF" />
          <text x="100" y="87" fill="#000" fontSize="19" fontWeight="900" textAnchor="middle">24</text>

          {/* Center Royal Blue Banner for "APNA" */}
          <g transform="translate(18, 96)">
            <path
              d="M0 16 L20 0 L144 0 L164 16 L154 36 L10 36 Z"
              fill="#1E3A8A"
              stroke="url(#goldRim)"
              strokeWidth="2.5"
            />
            {/* Gold Star Left */}
            <polygon points="14,18 16.5,13 21,18 16.5,21 18,26 14,22 10,26 11.5,21 7,18 11.5,13" fill="#FBBF24" />
            {/* APNA Bold Text */}
            <text x="82" y="27" fill="#FFFFFF" fontSize="23" fontWeight="900" letterSpacing="1" textAnchor="middle" stroke="#0F172A" strokeWidth="1">
              APNA
            </text>
            {/* Gold Star Right */}
            <polygon points="150,18 152.5,13 157,18 152.5,21 154,26 150,22 146,26 147.5,21 143,18 147.5,13" fill="#FBBF24" />
          </g>

          {/* Red Ribbon for "TAMBOLA" */}
          <g transform="translate(10, 126)">
            {/* Ribbon Tail Left */}
            <path d="M0 10 L15 0 L15 24 L0 14 Z" fill="#7F1D1D" />
            {/* Main Curved Banner */}
            <path
              d="M10 2 C50 14, 130 14, 170 2 L166 32 C126 44, 54 44, 14 32 Z"
              fill="url(#redBannerGrad)"
              stroke="#FDE047"
              strokeWidth="1.5"
            />
            {/* TAMBOLA 3D Gold Text */}
            <text
              x="90"
              y="27"
              fill="url(#goldTextGrad)"
              fontSize="24"
              fontWeight="900"
              letterSpacing="0.8"
              textAnchor="middle"
              stroke="#78350F"
              strokeWidth="1.2"
            >
              TAMBOLA
            </text>
            {/* Ribbon Tail Right */}
            <path d="M180 10 L165 0 L165 24 L180 14 Z" fill="#7F1D1D" />
          </g>

          {/* Bottom Pill: "LIVE FUN • LIVE WIN" */}
          <g transform="translate(42, 162)">
            <rect x="0" y="0" width="116" height="18" rx="9" fill="#D946EF" stroke="#FDE047" strokeWidth="1.5" />
            <text x="58" y="12.5" fill="#FFFFFF" fontSize="8.5" fontWeight="900" letterSpacing="0.5" textAnchor="middle">
              LIVE FUN • <tspan fill="#FEF08A">LIVE WIN</tspan>
            </text>
          </g>

          {/* Mini Bottom Colored Balls (24, 47, 63, 90) */}
          <circle cx="68" cy="188" r="7" fill="url(#greenBall)" stroke="#FFF" strokeWidth="0.7" />
          <text x="68" y="191" fill="#000" fontSize="5.5" fontWeight="bold" textAnchor="middle">24</text>

          <circle cx="88" cy="190" r="7.5" fill="url(#redBall)" stroke="#FFF" strokeWidth="0.7" />
          <text x="88" y="193" fill="#000" fontSize="5.5" fontWeight="bold" textAnchor="middle">47</text>

          <circle cx="112" cy="190" r="7.5" fill="url(#cyanBall)" stroke="#FFF" strokeWidth="0.7" />
          <text x="112" y="193" fill="#000" fontSize="5.5" fontWeight="bold" textAnchor="middle">63</text>

          <circle cx="132" cy="188" r="7" fill="url(#purpleBall)" stroke="#FFF" strokeWidth="0.7" />
          <text x="132" y="191" fill="#000" fontSize="5.5" fontWeight="bold" textAnchor="middle">90</text>
        </svg>
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent font-['Outfit'] ${textClass}`}>
              APNA TAMBOLA
            </span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 shadow-md">
              LIVE
            </span>
          </div>
          <p className={`font-bold tracking-widest uppercase text-amber-300/90 mt-1 font-mono ${subText}`}>
            MLM EARNINGS • 8-LEVEL TEAM • 70% PRIZE POOL
          </p>
        </div>
      )}
    </div>
  );
};
