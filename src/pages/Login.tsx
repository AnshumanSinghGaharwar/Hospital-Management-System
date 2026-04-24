import { useAuth } from '../contexts/AuthContext';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const { signIn, user } = useAuth();

  if (user) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl flex overflow-hidden border border-slate-100">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 p-16 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8">
              <Activity className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Hospital Management <br /> Simplified.
            </h1>
            <p className="text-blue-100 text-xl font-medium max-w-md">
              A comprehensive solution for healthcare professionals to manage patients, schedules, and operations with precision.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-12 text-blue-100">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">100%</span>
              <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Secure Data</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">24/7</span>
              <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Syncing</span>
            </div>
          </div>

          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium tracking-tight">Access the VitalPulse HMS dashboard</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">Standard Security</p>
                  <p className="text-xs text-slate-500">Firebase-powered authentication</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">User Centric</p>
                  <p className="text-xs text-slate-500">Designed for medical staff</p>
                </div>
              </div>
            </div>

            <button 
              onClick={signIn}
              className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
            
            <p className="text-center text-slate-400 text-sm font-medium pt-4">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
