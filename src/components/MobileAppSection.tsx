import React from 'react';
import { useTambola } from '../context/TambolaContext';
import { Smartphone, Play, User, Zap, Sparkles, Shield, Wifi } from 'lucide-react';

export const MobileAppSection: React.FC = () => {
  const { setActiveModal } = useTambola();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/80 via-purple-950/80 to-pink-950/80 border-2 border-indigo-500/30 p-8 sm:p-12 shadow-2xl">
        {/* Background glow elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>CROSS-PLATFORM GAMING</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              📱 PLAY APNA TAMBOLA ANYTIME
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Enjoy a smooth Tambola experience on your mobile, tablet and desktop. Instant load times, low data usage, and real-time multiplayer excitement wherever you are!
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-center lg:justify-start">
                  <Zap className="w-4 h-4 text-amber-400" /> Fast PWA App
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">No Heavy Downloads</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-center lg:justify-start">
                  <Wifi className="w-4 h-4 text-emerald-400" /> Low Latency
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">2G / 3G / 4G / 5G / WiFi</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-xl col-span-2 sm:col-span-1">
                <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-center lg:justify-start">
                  <Shield className="w-4 h-4 text-purple-400" /> Battery Friendly
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Ultra Lightweight</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="btn-mobile-play-now"
                onClick={() => setActiveModal('playLive')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold text-base shadow-xl shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>PLAY NOW</span>
              </button>

              <button
                id="btn-mobile-my-account"
                onClick={() => setActiveModal('userSwitcher')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-base hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5 text-purple-400" />
                <span>MY ACCOUNT</span>
              </button>
            </div>
          </div>

          {/* Right Smartphone Mockup Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-64 sm:w-72 rounded-[40px] bg-[#0c0d24] border-4 border-slate-700/80 p-3 shadow-2xl relative shadow-purple-500/30">
              {/* Speaker notch */}
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>

              {/* Screen Content */}
              <div className="rounded-[28px] bg-gradient-to-b from-[#14163d] to-[#0d0e28] p-4 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">APNA TAMBOLA</span>
                  <span className="text-[10px] px-2 py-0.5 bg-red-500 text-white font-bold rounded-full">
                    LIVE
                  </span>
                </div>

                <div className="bg-black/50 p-2.5 rounded-xl text-center border border-white/10">
                  <p className="text-[10px] text-slate-400">Current Calling Number</p>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white text-xl font-black flex items-center justify-center mx-auto my-1 shadow-lg shadow-pink-500/50">
                    24
                  </div>
                  <p className="text-[10px] text-pink-300 font-semibold">Two Dozen!</p>
                </div>

                <div className="bg-white/5 p-2 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-emerald-400">₹25,000 Full House Pending</p>
                </div>

                <button
                  onClick={() => setActiveModal('playLive')}
                  className="w-full py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer"
                >
                  Join Live Stream
                </button>
              </div>

              {/* Bottom bar */}
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
