import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home, LogIn } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('APNA TAMBOLA — React Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#021b36] via-[#062c52] to-[#031a33] text-white flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#090b1c]/95 border-2 border-amber-500/40 shadow-2xl backdrop-blur-xl text-center">
            {/* Colorful Animated Logo / Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px] shadow-lg shadow-pink-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#080a1c] rounded-[14px] flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              APNA TAMBOLA
            </div>

            <p className="text-sm font-bold text-amber-300 mt-1 uppercase tracking-wider">
              {this.props.fallbackTitle || 'Something went wrong.'}
            </p>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              We encountered a temporary rendering issue. Please retry loading or return to the main dashboard.
            </p>

            {this.state.error && (
              <div className="mt-4 p-3 rounded-xl bg-black/50 border border-white/10 text-left overflow-hidden">
                <p className="text-[11px] font-mono text-rose-300 truncate">
                  Error: {this.state.error.message || 'Component execution failure'}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleRetry}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Home className="w-4 h-4" />
                <span>HOME</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
