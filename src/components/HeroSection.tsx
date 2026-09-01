import React, { useState, useEffect } from 'react';
import { useTambola } from '../context/TambolaContext';
import { ApnaTambolaLogo } from './ApnaTambolaLogo';
import { Sparkles, Trophy, Flame, Play, Ticket, Zap, ShieldCheck, Clock, ArrowRight, Users, HelpCircle, Crown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    settings,
    setActiveModal,
    openUserDashboard,
  } = useTambola();

  const scrollToHowToPlay = () => {
    const el = document.getElementById('how-to-play');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20">
      {/* Background Decorative Gradients & Glow Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/25 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-400/25 rounded-full blur-[130px] pointer-events-none -z-10"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/25 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headings & Big Pill Action Buttons */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            {/* Top Pill Badge & Official Logo */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <ApnaTambolaLogo size="xl" showText={false} className="hover:scale-105 transition-transform" />
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black shadow-md">
                  <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>INDIA'S #1 PREMIER LIVE TAMBOLA</span>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="text-xs font-bold text-amber-400 tracking-widest uppercase flex items-center justify-center lg:justify-start gap-1">
                  <span>PLAY</span>
                  <span>•</span>
                  <span>ENJOY</span>
                  <span>•</span>
                  <span>WIN</span>
                </div>
              </div>
            </div>

            {/* Main Heading: WELCOME TO APNA TAMBOLA */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] text-white font-['Outfit']">
                WELCOME TO
              </h1>
              <h2 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(251,191,36,0.35)] font-['Outfit']">
                APNA TAMBOLA
              </h2>
            </div>

            {/* Subtitle: Play Tambola • Enjoy the Game • Experience the Excitement */}
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Play Tambola • Enjoy the Game • Experience the Excitement
            </p>

            {/* Action Buttons: 🟢 PLAY NOW & 🔵 HOW TO PLAY */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* 🟢 PLAY NOW (Emerald Green Rounded-Full Pill) */}
              <button
                id="btn-hero-play-now"
                onClick={() => setActiveModal('playLive')}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-base sm:text-lg shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 border border-emerald-400/40 group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-current text-white" />
                </div>
                <span>PLAY NOW</span>
              </button>

              {/* 🔵 HOW TO PLAY (Royal Blue Rounded-Full Pill) */}
              <button
                id="btn-hero-how-to-play"
                onClick={scrollToHowToPlay}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 border border-blue-400/40 group"
              >
                <HelpCircle className="w-5 h-5 text-sky-300 group-hover:rotate-12 transition-transform" />
                <span>HOW TO PLAY</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3 Standing 3D Tickets + Floating 3D Tambola Balls */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6 sm:py-10">
            
            {/* Floating 3D Tambola Balls (7 Yellow, 45 Green, 33 Pink, 56 Blue, 35 Purple, 90 Orange, 0 Cyan) */}
            
            {/* Ball 7 (Yellow/Orange - Top Center Left) */}
            <div className="absolute -top-4 left-1/4 z-20 animate-float" style={{ animationDuration: '4s' }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-[2px] shadow-xl shadow-amber-500/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-yellow-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1.5 left-2.5 w-4 h-2 bg-white/60 rounded-full rotate-[-30deg]"></div>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="font-black text-sm text-slate-950 font-['Space_Grotesk']">7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ball 45 (Green - Top Right) */}
            <div className="absolute -top-2 right-10 z-20 animate-float-reverse" style={{ animationDuration: '4.5s' }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-green-700 p-[2px] shadow-xl shadow-emerald-500/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-green-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1.5 left-2.5 w-4 h-2 bg-white/60 rounded-full rotate-[-30deg]"></div>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="font-black text-sm text-slate-950 font-['Space_Grotesk']">45</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ball 33 (Pink/Magenta - Mid Left) */}
            <div className="absolute top-1/3 -left-4 z-20 animate-float" style={{ animationDuration: '5s' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-300 via-pink-500 to-rose-600 p-[2px] shadow-xl shadow-pink-500/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-rose-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/60 rounded-full rotate-[-30deg]"></div>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="font-black text-xs text-slate-950 font-['Space_Grotesk']">33</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ball 56 (Royal Blue - Bottom Left) */}
            <div className="absolute -bottom-4 left-6 z-20 animate-float-reverse" style={{ animationDuration: '4.2s' }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-300 via-blue-600 to-indigo-800 p-[2px] shadow-xl shadow-blue-500/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1.5 left-2.5 w-4 h-2 bg-white/60 rounded-full rotate-[-30deg]"></div>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="font-black text-sm text-slate-950 font-['Space_Grotesk']">56</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ball 35 (Purple - Bottom Center) */}
            <div className="absolute -bottom-2 left-1/3 z-20 animate-float" style={{ animationDuration: '5.2s' }}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 via-purple-600 to-indigo-900 p-[2px] shadow-xl shadow-purple-500/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-indigo-950 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/60 rounded-full rotate-[-30deg]"></div>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="font-black text-xs text-slate-950 font-['Space_Grotesk']">35</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ball 90 (Orange - Bottom Right) */}
            <div className="absolute bottom-2 -right-4 z-20 animate-float-reverse" style={{ animationDuration: '4.8s' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-300 via-orange-500 to-amber-700 p-[2px] shadow-xl shadow-orange-500/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-amber-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/60 rounded-full rotate-[-30deg]"></div>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="font-black text-xs text-slate-950 font-['Space_Grotesk']">90</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Standing 3D Colorful Tambola Tickets (Green, Blue, Orange) */}
            <div className="relative flex items-center justify-center gap-2 sm:gap-4 perspective-1000 py-4">
              
              {/* Ticket 1: 🟢 Green Ticket (Slanted Left) */}
              <div className="w-36 sm:w-44 bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-2xl p-2 sm:p-2.5 shadow-2xl shadow-emerald-950/80 border-2 border-emerald-300/40 transform -rotate-12 hover:rotate-0 transition-transform duration-300 hover:z-30">
                <div className="text-center pb-1.5 border-b border-emerald-400/40">
                  <p className="text-[10px] sm:text-xs font-black text-white tracking-wider uppercase font-['Outfit']">
                    APNA TAMBOLA
                  </p>
                </div>
                {/* 3x5 Grid */}
                <div className="grid grid-cols-5 gap-1 mt-1.5 text-center font-mono">
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">5</div>
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">12</div>
                  <div className="bg-emerald-900/40 py-1 rounded"></div>
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">34</div>
                  <div className="bg-emerald-900/40 py-1 rounded"></div>
                  
                  <div className="bg-emerald-900/40 py-1 rounded"></div>
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">19</div>
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">24</div>
                  <div className="bg-emerald-900/40 py-1 rounded"></div>
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">63</div>

                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">8</div>
                  <div className="bg-emerald-900/40 py-1 rounded"></div>
                  <div className="bg-emerald-900/40 py-1 rounded"></div>
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">38</div>
                  <div className="bg-emerald-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">90</div>
                </div>
              </div>

              {/* Ticket 2: 🔵 Blue Ticket (Center - Standing Tall) */}
              <div className="w-40 sm:w-48 bg-gradient-to-b from-blue-600 to-indigo-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-blue-950/80 border-2 border-blue-300/50 z-10 transform hover:scale-105 transition-transform duration-300">
                <div className="text-center pb-2 border-b border-blue-400/40">
                  <p className="text-xs sm:text-sm font-black text-white tracking-wider uppercase font-['Outfit']">
                    APNA TAMBOLA
                  </p>
                </div>
                {/* 3x5 Grid */}
                <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mt-2 text-center font-mono">
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">3</div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">17</div>
                  <div className="bg-blue-900/40 py-1.5 rounded"></div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">41</div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">73</div>
                  
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">8</div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">22</div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">34</div>
                  <div className="bg-blue-900/40 py-1.5 rounded"></div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">66</div>

                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">12</div>
                  <div className="bg-blue-900/40 py-1.5 rounded"></div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">36</div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">59</div>
                  <div className="bg-blue-950/90 text-white text-[11px] sm:text-sm font-black py-1.5 rounded">78</div>
                </div>
              </div>

              {/* Ticket 3: 🟠 Orange Ticket (Slanted Right) */}
              <div className="w-36 sm:w-44 bg-gradient-to-b from-orange-500 to-rose-700 rounded-2xl p-2 sm:p-2.5 shadow-2xl shadow-orange-950/80 border-2 border-orange-300/40 transform rotate-12 hover:rotate-0 transition-transform duration-300 hover:z-30">
                <div className="text-center pb-1.5 border-b border-orange-400/40">
                  <p className="text-[10px] sm:text-xs font-black text-white tracking-wider uppercase font-['Outfit']">
                    APNA TAMBOLA
                  </p>
                </div>
                {/* 3x5 Grid */}
                <div className="grid grid-cols-5 gap-1 mt-1.5 text-center font-mono">
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">2</div>
                  <div className="bg-orange-900/40 py-1 rounded"></div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">28</div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">55</div>
                  <div className="bg-orange-900/40 py-1 rounded"></div>
                  
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">11</div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">30</div>
                  <div className="bg-orange-900/40 py-1 rounded"></div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">68</div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">85</div>

                  <div className="bg-orange-900/40 py-1 rounded"></div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">39</div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">49</div>
                  <div className="bg-orange-900/40 py-1 rounded"></div>
                  <div className="bg-orange-950/80 text-white text-[10px] sm:text-xs font-black py-1 rounded">90</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

