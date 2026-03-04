import React, { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ── Firebase Email/Password ─────────────────────────────────
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Auth state listener in the router will redirect automatically
    } catch (err: any) {
      console.error('Email auth error', err);
      if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
      else if (err.code === 'auth/email-already-in-use') setError('An account with this email already exists.');
      else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');
      else setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Firebase Google Sign-In ─────────────────────────────────
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google sign-in error', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Zap className="size-6" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSignUp ? 'Create your account' : 'Log in to your account'}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>

        {/* ── Card ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 space-y-6">

          {/* Google sign-in button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background py-2.5 text-sm font-medium transition-all hover:bg-secondary active:bg-secondary/60 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#g-clip)">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112-0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414-0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
              </g>
              <defs><clipPath id="g-clip"><rect width="48" height="48" fill="white" /></clipPath></defs>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <span className="block h-px w-full bg-border"></span>
            <p className="absolute inset-x-0 -top-2.5 mx-auto inline-block w-fit bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
              Or continue with email
            </p>
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-destructive text-xs">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Forgot password */}
        <p className="text-center text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">
            Forgot password?
          </a>
        </p>
      </div>
    </main>
  );
}
