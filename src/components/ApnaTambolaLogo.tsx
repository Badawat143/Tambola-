import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
    '2xl': { logoSize: 'w-36 h-36', textClass: 'text-4xl', subText: 'text-base' },
  };

  const { logoSize, textClass, subText } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95' : ''} ${className}`}
    >
      {/* 3D Round Luxury Badge Logo */}
      <div className={`relative ${logoSize} shrink-0`}>
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_10px_25px_rgba(245,158,11,0.45)]">
          <defs>
            {/* Rich Metallic Gold Gradients */}
            <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF7B2" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FDE047" />
              <stop offset="75%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#EAB308" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>

            <radialGradient id="blueBackground" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="45%" stopColor="#1E3A8A" />
              <stop offset="85%" stopColor="#0B1120" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Glossy 3D Balls */}
            <radialGradient id="redBall3D" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFA4A4" />
              <stop offset="25%" stopColor="#EF4444" />
              <stop offset="65%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#450A0A" />
            </radialGradient>

            <radialGradient id="cyanBall3D" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="25%" stopColor="#0284C7" />
              <stop offset="65%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </radialGradient>

            <radialGradient id="purpleBall3D" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="25%" stopColor="#A855F7" />
              <stop offset="65%" stopColor="#7E22CE" />
              <stop offset="100%" stopColor="#3B0764" />
            </radialGradient>

            <radialGradient id="greenBall3D" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#BBF7D0" />
              <stop offset="25%" stopColor="#22C55E" />
              <stop offset="65%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#052E16" />
            </radialGradient>

            {/* Banner & Text 3D Gradients */}
            <linearGradient id="tambolaGoldText" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FEF08A" />
              <stop offset="55%" stopColor="#FACC15" />
              <stop offset="85%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>

            <linearGradient id="redRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#881337" />
              <stop offset="20%" stopColor="#E11D48" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="80%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>

            <linearGradient id="apnaPlaqueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Outer Ornate Gold Frame with Bevel */}
          <circle cx="120" cy="120" r="114" fill="url(#goldRimGrad)" />
          <circle cx="120" cy="120" r="106" fill="#0B132B" stroke="#FDE047" strokeWidth="2" />
          <circle cx="120" cy="120" r="102" fill="url(#blueBackground)" />

          {/* Golden Laurel Branches in background */}
          <g fill="#FBBF24" opacity="0.95">
            {/* Left Laurel */}
            <path d="M42 90 C34 70, 52 50, 62 62 C54 78, 45 86, 42 90 Z" />
            <path d="M36 110 C26 92, 42 78, 52 88 C46 102, 38 108, 36 110 Z" />
            <path d="M48 65 C40 46, 56 36, 68 48 C58 60, 50 64, 48 65 Z" />
            {/* Right Laurel */}
            <path d="M198 90 C206 70, 188 50, 178 62 C186 78, 195 86, 198 90 Z" />
            <path d="M204 110 C214 92, 198 78, 188 88 C194 102, 202 108, 204 110 Z" />
            <path d="M192 65 C200 46, 184 36, 172 48 C182 60, 190 64, 192 65 Z" />
          </g>

          {/* Golden Star accents */}
          <polygon points="76,68 79,62 84,67 79,70 81,76 76,72 71,76 73,70 68,67 73,62" fill="#FDE047" />
          <polygon points="164,68 167,62 172,67 167,70 169,76 164,72 159,76 161,70 156,67 161,62" fill="#FDE047" />

          {/* Royal Golden & Ruby Crown on Top */}
          <g transform="translate(80, 10)">
            {/* Crown Red Velvet Cushion */}
            <path d="M12 36 C12 18, 68 18, 68 36 Z" fill="#991B1B" />
            {/* Crown Gold Frame */}
            <path
              d="M4 36 L16 12 L40 24 L64 12 L76 36 C56 42, 24 42, 4 36 Z"
              fill="url(#goldCrownGrad)"
              stroke="#78350F"
              strokeWidth="1.2"
            />
            {/* Ruby & Diamond Gemstones */}
            <circle cx="16" cy="12" r="4.5" fill="#EF4444" stroke="#FFF" strokeWidth="1" />
            <circle cx="40" cy="24" r="5.5" fill="#3B82F6" stroke="#FFF" strokeWidth="1.2" />
            <circle cx="64" cy="12" r="4.5" fill="#10B981" stroke="#FFF" strokeWidth="1" />
            <circle cx="40" cy="8" r="4" fill="#EAB308" stroke="#FFF" strokeWidth="0.8" />
            <polygon points="40,3 41.5,6 44,6 42,8 43,11 40,9 37,11 38,8 36,6 38.5,6" fill="#FFF" />
          </g>

          {/* Left Mini Blue Tambola Ticket */}
          <g transform="translate(16, 52) rotate(-16)">
            <rect width="40" height="54" rx="4" fill="#1D4ED8" stroke="url(#goldRimGrad)" strokeWidth="1.8" />
            <rect x="2" y="2" width="36" height="10" fill="#2563EB" rx="2" />
            <text x="20" y="9.5" fill="#FFF" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
              TAMBOLA
            </text>
            {/* Grid numbers */}
            <g transform="translate(3, 14)" fontSize="4.8" fontWeight="900" textAnchor="middle">
              <rect x="0" y="0" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="5" y="6.5" fill="#1E3A8A">4</text>
              <rect x="12" y="0" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="17" y="6.5" fill="#854D0E">23</text>
              <rect x="24" y="0" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="29" y="6.5" fill="#1E3A8A">47</text>

              <rect x="0" y="11" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="5" y="17.5" fill="#854D0E">12</text>
              <rect x="12" y="11" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="17" y="17.5" fill="#1E3A8A">38</text>
              <rect x="24" y="11" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="29" y="17.5" fill="#854D0E">71</text>

              <rect x="0" y="22" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="5" y="28.5" fill="#1E3A8A">7</text>
              <rect x="12" y="22" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="17" y="28.5" fill="#854D0E">49</text>
              <rect x="24" y="22" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="29" y="28.5" fill="#1E3A8A">83</text>
            </g>
          </g>

          {/* Right Mini Red Tambola Ticket */}
          <g transform="translate(184, 52) rotate(16)">
            <rect width="40" height="54" rx="4" fill="#BE123C" stroke="url(#goldRimGrad)" strokeWidth="1.8" />
            <rect x="2" y="2" width="36" height="10" fill="#E11D48" rx="2" />
            <text x="20" y="9.5" fill="#FFF" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
              TAMBOLA
            </text>
            {/* Grid numbers */}
            <g transform="translate(3, 14)" fontSize="4.8" fontWeight="900" textAnchor="middle">
              <rect x="0" y="0" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="5" y="6.5" fill="#991B1B">4</text>
              <rect x="12" y="0" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="17" y="6.5" fill="#854D0E">23</text>
              <rect x="24" y="0" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="29" y="6.5" fill="#991B1B">85</text>

              <rect x="0" y="11" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="5" y="17.5" fill="#854D0E">12</text>
              <rect x="12" y="11" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="17" y="17.5" fill="#854D0E">38</text>
              <rect x="24" y="11" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="29" y="17.5" fill="#991B1B">90</text>

              <rect x="0" y="22" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="5" y="28.5" fill="#991B1B">7</text>
              <rect x="12" y="22" width="10" height="9" fill="#FDE047" rx="1.5" />
              <text x="17" y="28.5" fill="#854D0E">29</text>
              <rect x="24" y="22" width="10" height="9" fill="#FFF" rx="1.5" />
              <text x="29" y="28.5" fill="#991B1B">83</text>
            </g>
          </g>

          {/* Background Numbered Lottery Balls: 90 (Green), 47 (Cyan), 63 (Purple) */}
          {/* Green Ball 90 */}
          <circle cx="48" cy="116" r="22" fill="url(#greenBall3D)" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="48" cy="116" r="14" fill="#FFFFFF" />
          <text x="48" y="122" fill="#000" fontSize="13" fontWeight="900" textAnchor="middle">
            90
          </text>

          {/* Cyan Ball 47 */}
          <circle cx="82" cy="100" r="26" fill="url(#cyanBall3D)" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="82" cy="100" r="16" fill="#FFFFFF" />
          <text x="82" y="106" fill="#000" fontSize="15" fontWeight="900" textAnchor="middle">
            47
          </text>

          {/* Purple Ball 63 */}
          <circle cx="160" cy="100" r="26" fill="url(#purpleBall3D)" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="160" cy="100" r="16" fill="#FFFFFF" />
          <text x="160" y="106" fill="#000" fontSize="15" fontWeight="900" textAnchor="middle">
            63
          </text>

          {/* Large Center Red Ball 24 */}
          <circle cx="120" cy="90" r="35" fill="url(#redBall3D)" stroke="#FFF" strokeWidth="2.5" />
          <circle cx="120" cy="90" r="22" fill="#FFFFFF" />
          <text x="120" y="98.5" fill="#000" fontSize="23" fontWeight="900" textAnchor="middle">
            24
          </text>

          {/* Center Royal Blue Plaque with "APNA" */}
          <g transform="translate(16, 110)">
            <path
              d="M0 20 L24 0 L184 0 L208 20 L194 45 L14 45 Z"
              fill="url(#apnaPlaqueGrad)"
              stroke="url(#goldRimGrad)"
              strokeWidth="3.2"
            />
            {/* 3D Gold Star Left */}
            <polygon
              points="18,22 21,15 27,22 21,26 23,33 18,28 13,33 15,26 9,22 15,15"
              fill="#FDE047"
              stroke="#B45309"
              strokeWidth="0.8"
            />
            {/* Bold 3D Silver-White "APNA" */}
            <text
              x="104"
              y="33"
              fill="#FFFFFF"
              fontSize="28"
              fontWeight="900"
              letterSpacing="2"
              textAnchor="middle"
              stroke="#0F172A"
              strokeWidth="1.5"
            >
              APNA
            </text>
            {/* 3D Gold Star Right */}
            <polygon
              points="190,22 193,15 199,22 193,26 195,33 190,28 185,33 187,26 181,22 187,15"
              fill="#FDE047"
              stroke="#B45309"
              strokeWidth="0.8"
            />
          </g>

          {/* Crimson Ribbon with 3D Gold "TAMBOLA" */}
          <g transform="translate(6, 146)">
            {/* Left Ribbon Tail */}
            <path d="M0 12 L18 0 L18 30 L0 18 Z" fill="#4C0519" stroke="#E11D48" strokeWidth="0.8" />
            {/* Main Center Curved Banner */}
            <path
              d="M12 4 C60 18, 168 18, 216 4 L212 40 C164 54, 64 54, 16 40 Z"
              fill="url(#redRibbonGrad)"
              stroke="#FEF08A"
              strokeWidth="2"
            />
            {/* 3D Gold "TAMBOLA" */}
            <text
              x="114"
              y="33"
              fill="url(#tambolaGoldText)"
              fontSize="29"
              fontWeight="900"
              letterSpacing="1"
              textAnchor="middle"
              stroke="#78350F"
              strokeWidth="1.6"
            >
              TAMBOLA
            </text>
            {/* Right Ribbon Tail */}
            <path d="M228 12 L210 0 L210 30 L228 18 Z" fill="#4C0519" stroke="#E11D48" strokeWidth="0.8" />
          </g>

          {/* Bottom Pill: "LIVE FUN • LIVE WIN" */}
          <g transform="translate(50, 190)">
            <rect x="0" y="0" width="140" height="22" rx="11" fill="#C026D3" stroke="#FDE047" strokeWidth="1.8" />
            <text x="70" y="15" fill="#FFFFFF" fontSize="10.5" fontWeight="900" letterSpacing="0.8" textAnchor="middle">
              LIVE FUN <tspan fill="#FACC15">•</tspan> <tspan fill="#FEF08A">LIVE WIN</tspan>
            </text>
          </g>

          {/* Miniature Bottom Colored Balls (24, 47, 63, 90) + Crown in center */}
          <g transform="translate(68, 206)">
            {/* Ball 24 Green */}
            <circle cx="6" cy="14" r="8" fill="url(#greenBall3D)" stroke="#FFF" strokeWidth="0.8" />
            <text x="6" y="17.5" fill="#000" fontSize="6.5" fontWeight="bold" textAnchor="middle">24</text>

            {/* Ball 47 Red */}
            <circle cx="28" cy="17" r="9" fill="url(#redBall3D)" stroke="#FFF" strokeWidth="0.8" />
            <text x="28" y="20.5" fill="#000" fontSize="6.5" fontWeight="bold" textAnchor="middle">47</text>

            {/* Mini Center Crown */}
            <g transform="translate(45, 10)">
              <polygon points="2,12 5,4 9,8 13,4 16,12" fill="#FACC15" stroke="#78350F" strokeWidth="0.5" />
            </g>

            {/* Ball 63 Blue */}
            <circle cx="76" cy="17" r="9" fill="url(#cyanBall3D)" stroke="#FFF" strokeWidth="0.8" />
            <text x="76" y="20.5" fill="#000" fontSize="6.5" fontWeight="bold" textAnchor="middle">63</text>

            {/* Ball 90 Purple */}
            <circle cx="98" cy="14" r="8" fill="url(#purpleBall3D)" stroke="#FFF" strokeWidth="0.8" />
            <text x="98" y="17.5" fill="#000" fontSize="6.5" fontWeight="bold" textAnchor="middle">90</text>
          </g>
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
