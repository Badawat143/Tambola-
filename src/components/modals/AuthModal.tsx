import React, { useState, useEffect } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { X, UserPlus, LogIn, Sparkles, ShieldCheck, Gift, AlertCircle, Cloud, Key, CheckCircle, ArrowRight } from 'lucide-react';
import { captureReferralCodeFromUrl, getCachedReferralCode } from '../../services/authService';
import {
  appwriteRegister,
  appwriteLogin,
  appwriteAnonymousLogin,
  appwriteLoginOAuth,
  APPWRITE_PROJECT_ID,
  APPWRITE_ENDPOINT,
} from '../../services/appwrite';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, registerUser, loginUser } = useTambola();

  const [mode, setMode] = useState<'login' | 'register' | 'appwrite'>(
    activeModal === 'register' ? 'register' : 'login'
  );

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(() => getCachedReferralCode() || '');
  const [stateOfResidence, setStateOfResidence] = useState('Maharashtra');
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [loginInput, setLoginInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Check URL referral parameter
  useEffect(() => {
    const captured = captureReferralCodeFromUrl();
    if (captured) {
      setReferralCode(captured);
      setMode('register');
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!ageConfirmed) {
      setErrorMsg('You must be 18 years of age or older to participate.');
      return;
    }

    // State jurisdiction check
    const restrictedStates = ['Assam', 'Odisha', 'Telangana', 'Andhra Pradesh', 'Nagaland'];
    if (restrictedStates.includes(stateOfResidence)) {
      setErrorMsg(
        `Notice: Real-money contests are restricted in ${stateOfResidence} under state regulations. You may participate in free practice games only.`
      );
      return;
    }

    setLoading(true);

    // Try Appwrite register if password provided
    if (password && password.length >= 8) {
      try {
        await appwriteRegister(email, password, name);
      } catch (err) {
        console.warn('Appwrite registration sync optional:', err);
      }
    }

    const res = await registerUser(name, phone, email, referralCode, stateOfResidence, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setActiveModal(null);
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginInput.trim()) {
      setErrorMsg('Please enter your mobile number, email, or referral code.');
      return;
    }

    const res = loginUser(loginInput);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setActiveModal(null);
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleAppwriteAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please provide both email and password for Appwrite Authentication.');
      return;
    }

    setLoading(true);
    const result = await appwriteLogin(email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg(`Welcome! Authenticated via Appwrite Cloud (${result.user?.name || email})`);
      loginUser(email);
      setTimeout(() => {
        setActiveModal(null);
      }, 1500);
    } else {
      setErrorMsg(result.error || 'Appwrite Auth login failed');
    }
  };

  const handleAppwriteGuest = async () => {
    setLoading(true);
    setErrorMsg('');
    const result = await appwriteAnonymousLogin();
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Logged in via Appwrite Guest Session!');
      loginUser('AT1001'); // link to primary demo player
      setTimeout(() => {
        setActiveModal(null);
      }, 1500);
    } else {
      setErrorMsg(result.error || 'Appwrite Anonymous session failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-md w-full rounded-3xl border-2 border-pink-500/40 bg-[#0c0d26] shadow-2xl p-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black bg-gradient-to-r from-amber-300 to-pink-400 bg-clip-text text-transparent">
              APNA TAMBOLA
            </span>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Login / Register / Appwrite Cloud */}
        <div className="grid grid-cols-3 gap-1.5 my-4 p-1 bg-black/40 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register (+₹10 Bonus)
          </button>
          <button
            onClick={() => {
              setMode('appwrite');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'appwrite'
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow'
                : 'text-rose-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3 h-3" />
            <span>Appwrite</span>
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-bold animate-pulse">
            <Gift className="w-4 h-4 flex-shrink-0 text-yellow-300" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Password (Appwrite Cloud Sync)
              </label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-amber-300 flex items-center justify-between mb-1">
                <span>Referral Code (Optional)</span>
                <span className="text-[10px] text-slate-400">Join a friend's team</span>
              </label>
              <input
                type="text"
                placeholder="e.g. APNA100"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="w-full bg-[#080918] border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono placeholder:text-slate-500 focus:border-pink-500 uppercase"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">State of Residence</label>
              <select
                value={stateOfResidence}
                onChange={(e) => setStateOfResidence(e.target.value)}
                className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {[
                  'Maharashtra',
                  'Delhi',
                  'Karnataka',
                  'Gujarat',
                  'Uttar Pradesh',
                  'Punjab',
                  'Rajasthan',
                  'West Bengal',
                  'Tamil Nadu',
                  'Haryana',
                  'Madhya Pradesh',
                  'Assam',
                  'Odisha',
                  'Telangana',
                  'Andhra Pradesh',
                  'Nagaland',
                ].map((st) => (
                  <option key={st} value={st} className="bg-[#0c0d26]">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="age-check"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-pink-500"
              />
              <label htmlFor="age-check" className="text-[10px] text-slate-300 leading-tight">
                I certify that I am <strong>18 years of age or older</strong> and agree to the Terms of Service &amp; Responsible Gaming policies.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-pink-500/25 mt-3 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT & GET ₹10 WITHDRAWAL BONUS'}
            </button>
          </form>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Mobile Number, Email or Referral Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9876543210 or APNA100 or USR-101"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full bg-[#080918] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 cursor-pointer uppercase tracking-wider"
            >
              LOGIN TO ACCOUNT
            </button>
          </form>
        )}

        {/* Appwrite Cloud Auth Form */}
        {mode === 'appwrite' && (
          <div className="space-y-3.5">
            <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-pink-400" />
                <div>
                  <p className="font-bold text-white">Appwrite Cloud Auth</p>
                  <p className="text-[10px] text-pink-300 font-mono">Project: {APPWRITE_PROJECT_ID}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Online
              </span>
            </div>

            <form onSubmit={handleAppwriteAuth} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Appwrite Email</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Appwrite account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080918] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{loading ? 'AUTHENTICATING...' : 'LOGIN VIA APPWRITE'}</span>
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or instant session</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              onClick={handleAppwriteGuest}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5 text-pink-400" />
              <span>Instant Appwrite Guest Session</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
