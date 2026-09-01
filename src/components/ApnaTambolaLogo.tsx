import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
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
    '2xl': { logoSize: 'w-40 h-40', textClass: 'text-4xl', subText: 'text-base' },
    '3xl': { logoSize: 'w-56 h-56', textClass: 'text-5xl', subText: 'text-lg' },
  };

  const { logoSize, textClass, subText } = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
    >
      {/* 👑 Official APNA TAMBOLA 3D Circular Logo Emblem */}
      <div className={`relative ${logoSize} shrink-0`}>
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_10px_25px_rgba(234,179,8,0.45)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 🌟 Rich 3D Gold Gradients */}
            <linearGradient id="goldRimGradOfficial" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="15%" stopColor="#FDE047" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="55%" stopColor="#FFF7B2" />
              <stop offset="75%" stopColor="#D97706" />
              <stop offset="90%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="goldBevelLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="80%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="goldCrownSolid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="30%" stopColor="#FACC15" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="85%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>

            {/* Deep Royal Midnight Blue Background */}
            <radialGradient id="royalBlueEmblemBg" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="40%" stopColor="#1D4ED8" />
              <stop offset="70%" stopColor="#172554" />
              <stop offset="95%" stopColor="#0A0F29" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>

            {/* Glossy 3D Bingo Balls */}
            <radialGradient id="ball90Red" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFA4A4" />
              <stop offset="25%" stopColor="#EF4444" />
              <stop offset="65%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#450A0A" />
            </radialGradient>

            <radialGradient id="ball47Orange" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="25%" stopColor="#F97316" />
              <stop offset="65%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </radialGradient>

            <radialGradient id="ball63Blue" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#BFDBFE" />
              <stop offset="25%" stopColor="#3B82F6" />
              <stop offset="65%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>

            <radialGradient id="ball24Green" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#BBF7D0" />
              <stop offset="25%" stopColor="#22C55E" />
              <stop offset="65%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>

            <radialGradient id="ball12Purple" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="25%" stopColor="#A855F7" />
              <stop offset="65%" stopColor="#7E22CE" />
              <stop offset="100%" stopColor="#3B0764" />
            </radialGradient>

            {/* Text 3D Gradients */}
            <linearGradient id="apnaGoldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FEF08A" />
              <stop offset="55%" stopColor="#FACC15" />
              <stop offset="85%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="tambolaSilverWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="90%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="redRibbonBannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7F1D1D" />
              <stop offset="15%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="85%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>

            {/* Coin Stack Gold Gradient */}
            <linearGradient id="coinGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#FACC15" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>
          </defs>

          {/* 🌟 1. Outer Gold Beveled Ring */}
          <circle cx="250" cy="250" r="238" fill="url(#goldRimGradOfficial)" />
          <circle cx="250" cy="250" r="226" fill="#0A0F29" stroke="#FDE047" strokeWidth="3" />
          <circle cx="250" cy="250" r="218" fill="url(#royalBlueEmblemBg)" />

          {/* Radial Light Rays / Flare in Blue Background */}
          <g opacity="0.35" stroke="#60A5FA" strokeWidth="2.5">
            <line x1="250" y1="250" x2="250" y2="40" />
            <line x1="250" y1="250" x2="390" y2="110" />
            <line x1="250" y1="250" x2="110" y2="110" />
            <line x1="250" y1="250" x2="450" y2="250" />
            <line x1="250" y1="250" x2="50" y2="250" />
          </g>

          {/* 🌟 Sparkle Stars around Outer Ring */}
          <g fill="#FFF" opacity="0.9">
            <polygon points="58,180 61,168 67,178 79,180 67,184 61,194 58,184 46,180" fill="#FDE047" />
            <polygon points="440,180 443,168 449,178 461,180 449,184 443,194 440,184 428,180" fill="#FDE047" />
            <polygon points="250,30 252,20 257,28 267,30 257,33 252,42 250,33 240,30" fill="#FFF" />
          </g>

          {/* 👑 2. Top Royal Gold Crown with Red Velvet & Sapphire */}
          <g transform="translate(170, 18)">
            {/* Crown Red Velvet Dome Interior */}
            <path d="M25 80 C25 35, 135 35, 135 80 Z" fill="#991B1B" />
            <path d="M35 80 C35 45, 125 45, 125 80 Z" fill="#DC2626" opacity="0.6" />

            {/* Golden Arches & Spikes */}
            <path
              d="M10 82 L35 30 L80 55 L125 30 L150 82 C115 95, 45 95, 10 82 Z"
              fill="url(#goldCrownSolid)"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            {/* Crown Rim Band */}
            <path d="M12 76 C50 88, 110 88, 148 76 L146 88 C110 98, 50 98, 14 88 Z" fill="#CA8A04" />

            {/* Gemstones: Central Blue Sapphire + Rubies */}
            <circle cx="80" cy="55" r="11" fill="#1D4ED8" stroke="#FEF08A" strokeWidth="2.5" />
            <ellipse cx="78" cy="52" rx="3" ry="5" fill="#93C5FD" />
            <circle cx="35" cy="30" r="9" fill="#DC2626" stroke="#FEF08A" strokeWidth="2" />
            <circle cx="125" cy="30" r="9" fill="#DC2626" stroke="#FEF08A" strokeWidth="2" />
            {/* Crown Top Cross/Star */}
            <polygon points="80,10 83,18 92,18 85,24 88,32 80,27 72,32 75,24 68,18 77,18" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          </g>

          {/* 🎟️ 3. Top Left: 3 Stacked Tambola Tickets */}
          <g transform="translate(42, 70)">
            {/* Ticket 1 (Back Maroon/Purple) */}
            <g transform="translate(85, 20) rotate(14)">
              <rect width="65" height="95" rx="5" fill="#701A75" stroke="#FDE047" strokeWidth="2" />
              <rect x="3" y="3" width="59" height="15" fill="#86198F" rx="3" />
              <text x="32" y="14" fill="#FFF" fontSize="6.5" fontWeight="900" textAnchor="middle">TAMBOLA TICKET</text>
            </g>

            {/* Ticket 2 (Middle Red) */}
            <g transform="translate(42, 6) rotate(-8)">
              <rect width="72" height="100" rx="5" fill="#B91C1C" stroke="#FDE047" strokeWidth="2" />
              <rect x="4" y="4" width="64" height="16" fill="#DC2626" rx="3" />
              <text x="36" y="15" fill="#FFF" fontSize="7" fontWeight="900" textAnchor="middle">TAMBOLA TICKET</text>
              {/* Grid Lines */}
              <g transform="translate(6, 25)" fill="#FFF" fontSize="6" fontWeight="bold" textAnchor="middle">
                <rect x="0" y="0" width="18" height="18" fill="#FFF" rx="2" /><text x="9" y="12" fill="#B91C1C">63</text>
                <rect x="22" y="0" width="18" height="18" fill="#FFF" rx="2" /><text x="31" y="12" fill="#B91C1C">71</text>
                <rect x="0" y="22" width="18" height="18" fill="#FFF" rx="2" /><text x="9" y="34" fill="#B91C1C">78</text>
                <rect x="22" y="22" width="18" height="18" fill="#FFF" rx="2" /><text x="31" y="34" fill="#B91C1C">84</text>
              </g>
            </g>

            {/* Ticket 3 (Front Royal Blue) */}
            <g transform="translate(0, 30) rotate(-16)">
              <rect width="84" height="114" rx="6" fill="#1E40AF" stroke="#FDE047" strokeWidth="2.5" />
              <rect x="4" y="4" width="76" height="18" fill="#2563EB" rx="3" />
              <text x="42" y="16" fill="#FFF" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="0.5">TAMBOLA TICKET</text>
              {/* Number Grid */}
              <g transform="translate(6, 28)" fontSize="7" fontWeight="900" textAnchor="middle">
                <rect x="0" y="0" width="13" height="15" fill="#FFF" rx="2" /><text x="6.5" y="11" fill="#1E3A8A">12</text>
                <rect x="15" y="0" width="13" height="15" fill="#FFF" rx="2" /><text x="21.5" y="11" fill="#1E3A8A">24</text>
                <rect x="30" y="0" width="13" height="15" fill="#FFF" rx="2" /><text x="36.5" y="11" fill="#1E3A8A">47</text>
                <rect x="45" y="0" width="13" height="15" fill="#FFF" rx="2" /><text x="51.5" y="11" fill="#1E3A8A">63</text>
                <rect x="60" y="0" width="13" height="15" fill="#FFF" rx="2" /><text x="66.5" y="11" fill="#1E3A8A">71</text>

                <rect x="0" y="18" width="13" height="15" fill="#FFF" rx="2" /><text x="6.5" y="29" fill="#1E3A8A">18</text>
                <rect x="15" y="18" width="13" height="15" fill="#FFF" rx="2" /><text x="21.5" y="29" fill="#1E3A8A">35</text>
                <rect x="30" y="18" width="13" height="15" fill="#FFF" rx="2" /><text x="36.5" y="29" fill="#1E3A8A">52</text>
                <rect x="45" y="18" width="13" height="15" fill="#FFF" rx="2" /><text x="51.5" y="29" fill="#1E3A8A">78</text>
                <rect x="60" y="18" width="13" height="15" fill="#FFF" rx="2" /><text x="66.5" y="29" fill="#1E3A8A">84</text>

                <rect x="0" y="36" width="13" height="15" fill="#FFF" rx="2" /><text x="6.5" y="47" fill="#1E3A8A">5</text>
                <rect x="15" y="36" width="13" height="15" fill="#FFF" rx="2" /><text x="21.5" y="47" fill="#1E3A8A">29</text>
                <rect x="30" y="36" width="13" height="15" fill="#FFF" rx="2" /><text x="36.5" y="47" fill="#1E3A8A">39</text>
                <rect x="45" y="36" width="13" height="15" fill="#FFF" rx="2" /><text x="51.5" y="47" fill="#1E3A8A">68</text>
                <rect x="60" y="36" width="13" height="15" fill="#FFF" rx="2" /><text x="66.5" y="47" fill="#1E3A8A">90</text>
              </g>
            </g>
          </g>

          {/* 🎡 4. Top Right: Golden 3D Bingo Cage Lottery Machine */}
          <g transform="translate(325, 68)">
            {/* Stand & Crank Handle */}
            <path d="M60 110 L85 140 L10 140 L35 110 Z" fill="url(#goldCrownSolid)" stroke="#78350F" strokeWidth="1.5" />
            <rect x="40" y="55" width="60" height="12" rx="4" fill="#CA8A04" transform="rotate(25, 40, 55)" />
            <circle cx="95" cy="80" r="8" fill="#1E293B" />
            
            {/* 3D Wireframe Spherical Cage */}
            <circle cx="50" cy="55" r="50" fill="none" stroke="url(#goldRimGradOfficial)" strokeWidth="6" />
            <ellipse cx="50" cy="55" rx="48" ry="24" fill="none" stroke="#FDE047" strokeWidth="3" />
            <ellipse cx="50" cy="55" rx="48" ry="40" fill="none" stroke="#FDE047" strokeWidth="2" />
            <ellipse cx="50" cy="55" rx="24" ry="48" fill="none" stroke="#FDE047" strokeWidth="3" />
            <line x1="50" y1="5" x2="50" y2="105" stroke="#FDE047" strokeWidth="3" />
            <line x1="5" y1="55" x2="95" y2="55" stroke="#FDE047" strokeWidth="3" />

            {/* Colorful Mini Balls inside cage */}
            <circle cx="42" cy="55" r="8" fill="#EF4444" />
            <circle cx="56" cy="45" r="8" fill="#FBBF24" />
            <circle cx="35" cy="65" r="7" fill="#3B82F6" />
            <circle cx="65" cy="60" r="7" fill="#22C55E" />
            <circle cx="52" cy="72" r="8" fill="#A855F7" />
          </g>

          {/* 🎱 5. Mid Row Glossy 3D Numbered Balls: 24, 47, 90, 63, 12 */}
          {/* Green Ball 24 */}
          <circle cx="150" cy="180" r="28" fill="url(#ball24Green)" stroke="#FFF" strokeWidth="2" />
          <circle cx="150" cy="180" r="17" fill="#FFF" />
          <text x="150" y="187" fill="#000" fontSize="18" fontWeight="900" textAnchor="middle">24</text>

          {/* Orange Ball 47 */}
          <circle cx="196" cy="155" r="26" fill="url(#ball47Orange)" stroke="#FFF" strokeWidth="2" />
          <circle cx="196" cy="155" r="16" fill="#FFF" />
          <text x="196" y="161" fill="#000" fontSize="17" fontWeight="900" textAnchor="middle">47</text>

          {/* Blue Ball 63 */}
          <circle cx="312" cy="155" r="26" fill="url(#ball63Blue)" stroke="#FFF" strokeWidth="2" />
          <circle cx="312" cy="155" r="16" fill="#FFF" />
          <text x="312" y="161" fill="#000" fontSize="17" fontWeight="900" textAnchor="middle">63</text>

          {/* Purple Ball 12 */}
          <circle cx="350" cy="180" r="27" fill="url(#ball12Purple)" stroke="#FFF" strokeWidth="2" />
          <circle cx="350" cy="180" r="16" fill="#FFF" />
          <text x="350" y="186" fill="#000" fontSize="17" fontWeight="900" textAnchor="middle">12</text>

          {/* Central Top Leader Ball 90 (Red) */}
          <circle cx="250" cy="130" r="38" fill="url(#ball90Red)" stroke="#FFF" strokeWidth="3" />
          <circle cx="250" cy="130" r="23" fill="#FFF" />
          <text x="250" y="139" fill="#000" fontSize="26" fontWeight="900" textAnchor="middle">90</text>

          {/* Golden Stars beneath center balls */}
          <polygon points="250,170 254,158 266,158 256,166 260,178 250,171 240,178 244,166 234,158 246,158" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
          <polygon points="208,188 211,180 219,180 213,185 215,193 208,188 201,193 203,185 197,180 205,180" fill="#FDE047" />
          <polygon points="292,188 295,180 303,180 297,185 299,193 292,188 285,193 287,185 281,180 289,180" fill="#FDE047" />

          {/* 🌟 6. Main Plaque: "APNA" on Royal Blue Shield */}
          <g transform="translate(30, 200)">
            {/* Arched Royal Blue Plaque Background */}
            <path
              d="M30 40 C140 10, 300 10, 410 40 L440 95 C310 70, 130 70, 0 95 Z"
              fill="#1E3A8A"
              stroke="url(#goldRimGradOfficial)"
              strokeWidth="5"
            />
            {/* Inner Border */}
            <path
              d="M35 44 C140 16, 300 16, 405 44 L432 90 C310 66, 130 66, 8 90 Z"
              fill="#172554"
            />

            {/* Mini Gold Crown on APNA */}
            <g transform="translate(205, 12)">
              <polygon points="2,16 6,5 14,11 22,5 26,16" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            </g>

            {/* Left 3D Star */}
            <polygon points="45,65 49,52 61,52 51,60 55,73 45,66 35,73 39,60 29,52 41,52" fill="#FDE047" stroke="#92400E" strokeWidth="1.2" />

            {/* 3D Golden "APNA" Text */}
            <text
              x="220"
              y="74"
              fill="url(#apnaGoldTextGrad)"
              fontSize="78"
              fontWeight="900"
              letterSpacing="6"
              textAnchor="middle"
              stroke="#78350F"
              strokeWidth="4"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))' }}
            >
              APNA
            </text>

            {/* Right 3D Star */}
            <polygon points="395,65 399,52 411,52 401,60 405,73 395,66 385,73 389,60 379,52 391,52" fill="#FDE047" stroke="#92400E" strokeWidth="1.2" />
          </g>

          {/* 🌟 7. Main Title: "TAMBOLA" (3D Silver-White with Royal Blue & Gold Border) */}
          <g transform="translate(20, 272)">
            {/* 3D Deep Blue Bevel Underlay */}
            <text
              x="230"
              y="68"
              fill="#0F172A"
              fontSize="84"
              fontWeight="900"
              letterSpacing="3"
              textAnchor="middle"
              stroke="#1E3A8A"
              strokeWidth="18"
            >
              TAMBOLA
            </text>

            {/* Gold Outer Outline */}
            <text
              x="230"
              y="65"
              fill="#1E40AF"
              fontSize="84"
              fontWeight="900"
              letterSpacing="3"
              textAnchor="middle"
              stroke="#FDE047"
              strokeWidth="8"
            >
              TAMBOLA
            </text>

            {/* Crisp Silver-White Face */}
            <text
              x="230"
              y="62"
              fill="url(#tambolaSilverWhiteGrad)"
              fontSize="84"
              fontWeight="900"
              letterSpacing="3"
              textAnchor="middle"
              stroke="#475569"
              strokeWidth="1.5"
            >
              TAMBOLA
            </text>
          </g>

          {/* 🎗️ 8. Bottom Crimson Ribbon: "Play • Enjoy • Win" */}
          <g transform="translate(45, 365)">
            {/* Ribbon Left Tail */}
            <path d="M10 25 L45 0 L45 42 L10 58 L24 40 Z" fill="#581C87" stroke="#DC2626" strokeWidth="1.5" />
            
            {/* Ribbon Right Tail */}
            <path d="M400 25 L365 0 L365 42 L400 58 L386 40 Z" fill="#581C87" stroke="#DC2626" strokeWidth="1.5" />

            {/* Main Center Arched Red Ribbon */}
            <path
              d="M35 15 C150 35, 260 35, 375 15 L365 62 C260 82, 150 82, 45 62 Z"
              fill="url(#redRibbonBannerGrad)"
              stroke="#FEF08A"
              strokeWidth="3.5"
            />

            {/* White Bold Ribbon Text */}
            <text
              x="205"
              y="52"
              fill="#FFFFFF"
              fontSize="28"
              fontWeight="900"
              letterSpacing="1.5"
              textAnchor="middle"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }}
            >
              Play <tspan fill="#FDE047">•</tspan> Enjoy <tspan fill="#FDE047">•</tspan> Win
            </text>
          </g>

          {/* 🏆 9. Bottom Center Medallion (Trophy & Laurel) + Stacks of Gold Coins */}
          <g transform="translate(115, 410)">
            {/* Left Gold Coin Stack */}
            <g transform="translate(10, 10)">
              <ellipse cx="40" cy="50" rx="26" ry="10" fill="#CA8A04" stroke="#FEF08A" strokeWidth="1.5" />
              <ellipse cx="40" cy="42" rx="26" ry="10" fill="#EAB308" stroke="#FEF08A" strokeWidth="1.5" />
              <ellipse cx="40" cy="34" rx="26" ry="10" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
              <ellipse cx="40" cy="26" rx="26" ry="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
              <polygon points="40,20 42,24 47,24 43,27 45,31 40,28 35,31 37,27 33,24 38,24" fill="#92400E" />
            </g>

            {/* Right Gold Coin Stack */}
            <g transform="translate(180, 10)">
              <ellipse cx="40" cy="50" rx="26" ry="10" fill="#CA8A04" stroke="#FEF08A" strokeWidth="1.5" />
              <ellipse cx="40" cy="42" rx="26" ry="10" fill="#EAB308" stroke="#FEF08A" strokeWidth="1.5" />
              <ellipse cx="40" cy="34" rx="26" ry="10" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
              <ellipse cx="40" cy="26" rx="26" ry="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
              <polygon points="40,20 42,24 47,24 43,27 45,31 40,28 35,31 37,27 33,24 38,24" fill="#92400E" />
            </g>

            {/* Center Gold Trophy Medal */}
            <g transform="translate(95, 0)">
              <circle cx="40" cy="40" r="38" fill="url(#coinGoldGrad)" stroke="#78350F" strokeWidth="2.5" />
              <circle cx="40" cy="40" r="33" fill="#CA8A04" stroke="#FEF08A" strokeWidth="1.5" />

              {/* Laurel Wreath */}
              <path d="M18 42 C18 26, 32 20, 40 20 C48 20, 62 26, 62 42 C62 56, 48 60, 40 60 C32 60, 18 56, 18 42 Z" fill="none" stroke="#FEF08A" strokeWidth="2" />

              {/* Trophy Cup Icon in Center */}
              <path
                d="M28 26 L52 26 L50 40 C48 47, 44 50, 40 50 C36 50, 32 47, 30 40 Z"
                fill="#FEF08A"
                stroke="#78350F"
                strokeWidth="1.2"
              />
              <path d="M28 28 C22 28, 22 36, 29 36" fill="none" stroke="#FEF08A" strokeWidth="2" />
              <path d="M52 28 C58 28, 58 36, 51 36" fill="none" stroke="#FEF08A" strokeWidth="2" />
              <rect x="36" y="50" width="8" height="6" fill="#FEF08A" />
              <rect x="30" y="56" width="20" height="4" rx="1.5" fill="#FEF08A" />
            </g>

            {/* Sparkles on Coins */}
            <polygon points="50,15 52,9 56,14 62,15 56,17 52,22 50,17 44,15" fill="#FFF" />
            <polygon points="220,15 222,9 226,14 232,15 226,17 222,22 220,17 214,15" fill="#FFF" />
          </g>
        </svg>
      </div>

      {/* 🏷️ Optional Brand Typography Beside Logo */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-['Outfit'] drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)] ${textClass}`}>
              APNA TAMBOLA
            </span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 shadow-md">
              LIVE
            </span>
          </div>
          <p className={`font-bold tracking-wider uppercase text-amber-300/90 mt-1 font-mono ${subText}`}>
            PLAY • ENJOY • WIN • 8-LEVEL MLM
          </p>
        </div>
      )}
    </div>
  );
};
