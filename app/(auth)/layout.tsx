'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle2, Quote } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push('/overview');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel — Brand & Value Prop */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-[#0F0F12] text-white">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-transparent animate-gradient-shift" />
        
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-[15px]">DS</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">DriveStack</span>
          </div>

          <div className="mt-auto mb-20 space-y-10 animate-fade-in-up">
            <h1 className="text-[40px] leading-[1.1] font-semibold tracking-tight max-w-[480px]">
              Unify your Google Drive storage.
            </h1>
            
            <div className="space-y-4 text-zinc-300">
              {[
                "Connect unlimited accounts in one view",
                "Real-time quota tracking across drives",
                "Smart upload routing to free space",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span className="text-[15px]">{feature}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="pt-10 border-t border-white/10 mt-10">
              <Quote className="w-6 h-6 text-white/20 mb-4" />
              <p className="text-[15px] leading-relaxed text-zinc-300 max-w-[400px] mb-4">
                "Finally, a storage manager that feels like it belongs in 2026. Fast, beautiful, and completely solves my scattered drive problem."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-medium text-zinc-300">VO</div>
                <div className="text-[13px] font-medium text-zinc-400">Victor O. — Beta Tester</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative animate-fade-in-up">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-[12px]">DS</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-text-primary">DriveStack</span>
        </div>

        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  );
}
