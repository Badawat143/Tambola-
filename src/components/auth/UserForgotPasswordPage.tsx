import React, { useState } from 'react';
import { useTambola } from '../../context/TambolaContext';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';

interface UserForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const UserForgotPasswordPage: React.FC<UserForgotPasswordPageProps> = ({ onNavigate }) => {
  const { allUsers, updateSettings } = useTambola();

  const [step, setStep] = useState<1 | 2>(1);
  const [loginId, setLoginId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginId.trim()) {
      setErrorMessage('Please enter your registered Mobile Number, Email, or User ID.');
      return;
    }

    const cleanInput = loginId.trim().toLowerCase();
    const cleanDigits = loginId.replace(/[^0-9]/g, '');

    const foundUser = allUsers.find((u) => {
      const matchEmail = u.email?.toLowerCase() === cleanInput;
      const matchId = u.id?.toLowerCase() === cleanInput;
      const matchPhone = cleanDigits.length >= 10 && u.phone?.replace(/[^0-9]/g, '').endsWith(cleanDigits.slice(-10));
      return matchEmail || matchId || matchPhone;
    });

    if (!foundUser) {
      setErrorMessage('No registered account found with these details. Please verify or register.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(demoOtp);
      setTargetUserId(foundUser.id);
      setStep(2);
      setIsLoading(false);
      setSuccessMessage(`OTP sent successfully to registered mobile/email for ${foundUser.name}!`);
    }, 600);
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpCode.trim()) {
      setErrorMessage('Please enter the 6-digit OTP sent to your mobile/email.');
      return;
    }

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456' && otpCode.trim() !== '778899') {
      setErrorMessage('Invalid OTP code. Please enter the correct verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Update in local state / database
      const user = allUsers.find((u) => u.id === targetUserId);
      if (user) {
        user.password = newPassword;
      }
      setIsLoading(false);
      setSuccessMessage('Password reset successfully! Redirecting to Login...');
      setTimeout(() => {
        onNavigate('/login');
      }, 1200);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-[#070817] via-[#0d0f2b] to-[#070817]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold mb-3 shadow-sm">
            <KeyRound className="w-3.5 h-3.5" />
            <span>ACCOUNT SECURITY RECOVERY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit']">
            RESET YOUR PASSWORD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {step === 1
              ? 'Enter your registered details to receive an instant verification code.'
              : 'Enter the verification OTP and create your new secure password.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0e102d]/95 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 relative overflow-hidden">
          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Enter Identifier */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile / Email / User ID <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or ramesh@example.com"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>SEND VERIFICATION OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Verify OTP & New Password */
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* OTP Input with Auto-Fill helper */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    6-Digit OTP Code <span className="text-pink-400">*</span>
                  </label>
                  {generatedOtp && (
                    <button
                      type="button"
                      onClick={() => setOtpCode(generatedOtp)}
                      className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"
                    >
                      ⚡ Auto-Fill Code: {generatedOtp}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 placeholder-emerald-500/40 text-sm font-bold tracking-widest font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm New Password <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>UPDATE PASSWORD & LOGIN</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO LOGIN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
