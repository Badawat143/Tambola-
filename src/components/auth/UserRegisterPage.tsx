import React, { useState, useEffect } from 'react';
import { useTambola } from '../../context/TambolaContext';
import { captureReferralCodeFromUrl } from '../../services/authService';
import {
  Sparkles,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Copy,
  Share2,
  Gift,
} from 'lucide-react';

interface UserRegisterPageProps {
  onNavigate: (path: string) => void;
}

export const UserRegisterPage: React.FC<UserRegisterPageProps> = ({ onNavigate }) => {
  const { registerUser, allUsers } = useTambola();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralId, setReferralId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fromUrl =
        params.get('ref') ||
        params.get('referral') ||
        params.get('r') ||
        params.get('sponsor') ||
        params.get('code') ||
        params.get('refcode') ||
        params.get('refCode') ||
        params.get('referralCode');
      if (fromUrl && fromUrl.trim().length > 0) {
        return fromUrl.trim().toUpperCase();
      }
    }
    return captureReferralCodeFromUrl() || '';
  });
  const [stateOfResidence, setStateOfResidence] = useState('Maharashtra');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredUserData, setRegisteredUserData] = useState<{
    id: string;
    name: string;
    phone: string;
    email: string;
    sponsorId: string;
    sponsorName: string;
    referralLink: string;
  } | null>(null);

  const [verifiedSponsor, setVerifiedSponsor] = useState<{ name: string; id: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Automatically capture and prefill referral ID from URL or storage
  useEffect(() => {
    const captured = captureReferralCodeFromUrl();
    if (captured && !referralId) {
      setReferralId(captured.toUpperCase());
    }
  }, [referralId]);

  // Check sponsor name dynamically from backend and allUsers
  useEffect(() => {
    const code = referralId.trim().toUpperCase();
    if (!code) {
      setVerifiedSponsor(null);
      return;
    }

    const cleanDigits = code.replace(/[^0-9]/g, '');
    const localMatch = allUsers.find((u) => {
      const uId = (u.id || '').toUpperCase();
      const uCode = (u.referralCode || u.id || '').toUpperCase();
      const uPhoneDigits = (u.phone || '').replace(/[^0-9]/g, '');
      const uEmail = (u.email || '').toLowerCase();
      return (
        uId === code ||
        uCode === code ||
        (cleanDigits.length >= 10 && uPhoneDigits.length >= 10 && uPhoneDigits.slice(-10) === cleanDigits.slice(-10)) ||
        (cleanDigits.length >= 4 && uId.replace(/[^0-9]/g, '').endsWith(cleanDigits)) ||
        uEmail === code.toLowerCase()
      );
    });
    if (localMatch) {
      setVerifiedSponsor({ name: localMatch.name, id: localMatch.id });
      return;
    }

    let isMounted = true;
    fetch(`/api/auth/sponsor/${encodeURIComponent(code)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.sponsor) {
          setVerifiedSponsor({ name: data.sponsor.name, id: data.sponsor.id });
        } else if (isMounted) {
          setVerifiedSponsor(null);
        }
      })
      .catch(() => {
        if (isMounted) setVerifiedSponsor(null);
      });

    return () => {
      isMounted = false;
    };
  }, [referralId, allUsers]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms & Conditions and 18+ declaration.');
      return;
    }

    setIsLoading(true);

    try {
      // Call Context Register Method
      const sponsorCode = referralId.trim().toUpperCase();
      const res = await registerUser(
        fullName.trim(),
        cleanPhone,
        email.trim().toLowerCase(),
        sponsorCode || undefined,
        stateOfResidence,
        password
      );

      if (res.success && res.user) {
        const origin = window.location.origin;
        const refLink = `${origin}/register?ref=${res.user.referralCode || res.user.id}`;
        setRegisteredUserData({
          id: res.user.id,
          name: res.user.name,
          phone: res.user.phone,
          email: res.user.email,
          sponsorId: res.user.referredBy || sponsorCode || 'Direct',
          sponsorName: verifiedSponsor?.name || (sponsorCode ? 'Sponsor Verified' : 'Direct Registration'),
          referralLink: refLink,
        });
        setSuccessMessage(`Account created successfully! User ID: ${res.user.id}`);
      } else {
        setErrorMessage(res.message || 'Registration failed. Please check your details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!registeredUserData?.referralLink) return;
    navigator.clipboard.writeText(registeredUserData.referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!registeredUserData) return;
    const msg = `🎉 Play Apna Tambola with me and get ₹10 Free Withdrawal Bonus! Register here: ${registeredUserData.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-[#070817] via-[#0d0f2b] to-[#070817]">
      <div className="w-full max-w-xl">
        {/* Top Branding Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSTANT ₹10 WITHDRAWAL BONUS ON REGISTRATION</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit']">
            CREATE YOUR APNA TAMBOLA ACCOUNT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Play live 90-ball Tambola tournaments, win verified cash prizes, and earn up to 8 levels of referral income.
          </p>
        </div>

        {/* Success Modal / Screen */}
        {registeredUserData ? (
          <div className="bg-[#0e102d]/95 backdrop-blur-xl border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative overflow-hidden space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl font-black">
                ✓
              </div>
              <h2 className="text-2xl font-black text-white">WELCOME TO APNA TAMBOLA!</h2>
              <p className="text-xs text-emerald-400 font-bold">Your Account is Active & ₹10 Withdrawal Bonus Credited</p>
            </div>

            {/* Account Details Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">User ID:</span>
                <span className="font-mono text-base font-black text-amber-300">{registeredUserData.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Name:</span>
                <span className="font-bold text-white">{registeredUserData.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Registered Mobile:</span>
                <span className="font-mono text-slate-200">{registeredUserData.phone}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Sponsor:</span>
                <span className="font-mono text-pink-300 font-bold">
                  {registeredUserData.sponsorName} ({registeredUserData.sponsorId})
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-emerald-400 font-bold">
                <span>Registration Bonus Credited:</span>
                <span>₹10 (Instant Withdrawal Wallet)</span>
              </div>
            </div>

            {/* Referral Sharing Box */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Gift className="w-4 h-4 text-pink-400" />
                <span>Your Permanent Referral Link (8-Level Earnings):</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-300 break-all">
                {registeredUserData.referralLink}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <span>GO TO DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-[#0e102d]/95 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 relative overflow-hidden">
            {/* Subtle Corner Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Feedback Banners */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="text-xs font-bold text-slate-400 mr-1">+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Referral Code / ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Referral ID / Sponsor ID
                  </label>
                  {verifiedSponsor && (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sponsor: {verifiedSponsor.name} ({verifiedSponsor.id})
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. AT10001"
                    value={referralId}
                    onChange={(e) => setReferralId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 placeholder-purple-400/50 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-purple-400 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Captured automatically from invite link or enter sponsor ID directly (e.g. AT10001).
                </p>
              </div>

              {/* State of Residence */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  State of Residence
                </label>
                <select
                  value={stateOfResidence}
                  onChange={(e) => setStateOfResidence(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121438] border border-white/10 text-white text-sm font-medium focus:outline-none focus:border-pink-500"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Other">Other Permitted State</option>
                </select>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I confirm that I am <strong className="text-white">18 years or older</strong>, a resident of an eligible Indian state, and agree to the{' '}
                    <span className="text-pink-400 hover:underline">Terms of Service</span>, Privacy Policy & Responsible Gaming rules.
                  </span>
                </label>
              </div>

              {/* Primary Action Button: CREATE ACCOUNT */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>CREATE ACCOUNT & CLAIM ₹10 WITHDRAWAL BONUS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Secondary Action: ALREADY HAVE AN ACCOUNT? LOGIN */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400 mb-3">Already have an account registered?</p>
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>ALREADY HAVE AN ACCOUNT? LOGIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Trust Badges Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Legal Skill Gaming
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> 256-Bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" /> Instant UPI Settlements
          </span>
        </div>
      </div>
    </div>
  );
};
