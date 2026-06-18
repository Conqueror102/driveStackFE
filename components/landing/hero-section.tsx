"use client";

import { useInView, motion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { HardDrive, Cloud, Server } from "lucide-react";

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-ds-pure-black"
      ref={ref}
    >
      {/* Background massive "DRIVE" watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold text-white/[0.02] tracking-tighter pointer-events-none select-none z-0">
        DRIVE
      </div>

      <div className="container mx-auto px-6 relative z-10 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Copy */}
          <div className="flex flex-col items-start max-w-[600px]">
            <div className={cn("reveal flex flex-col mb-8", isInView && "is-visible")}>
              <span className="text-[11px] font-medium text-white/40 tracking-[0.1em] uppercase mb-8">
                Google Drive Management
              </span>
              <h1 className="flex flex-col">
                <span className="font-bold text-[56px] md:text-[72px] lg:text-[80px] text-white tracking-[-0.03em] leading-[1.05]">
                  All your Drive.
                </span>
                <span className="font-serif italic text-[56px] md:text-[72px] lg:text-[80px] text-white/90 tracking-[-0.02em] leading-[1.05]">
                  One workspace.
                </span>
              </h1>
            </div>

            <p className={cn("reveal text-[18px] md:text-[20px] text-white/50 leading-[1.6] mb-10 max-w-[480px]", isInView && "is-visible")} style={{ transitionDelay: "150ms" }}>
              Connect every Google account you own. See every file, 
              manage every gigabyte, from one clean interface.
            </p>

            <div className={cn("reveal flex flex-col sm:flex-row items-start sm:items-center gap-6", isInView && "is-visible")} style={{ transitionDelay: "300ms" }}>
              <div className="flex items-center gap-4">
                <a href="/signup" className="bg-white text-black font-medium px-6 py-3.5 rounded-[12px] hover:bg-white/90 transition-colors flex items-center gap-2">
                  Start for free <span className="text-[14px]">→</span>
                </a>
                <a href="#demo" className="text-white/70 hover:text-white font-medium px-6 py-3.5 border border-white/10 rounded-[12px] transition-colors">
                  See it in action
                </a>
              </div>
            </div>

            <div className={cn("reveal mt-8 flex flex-col gap-2", isInView && "is-visible")} style={{ transitionDelay: "450ms" }}>
              <div className="flex items-center gap-3 text-[13px] text-white/40 font-mono">
                <span>No credit card required</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Connect in 30 seconds</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hand-coded CSS UI Widget replacing the AI image */}
          <div className={cn("reveal-scale flex justify-center lg:justify-end items-center relative", isInView && "is-visible")} style={{ transitionDelay: "300ms" }}>
            
            {/* The UI Widget Container */}
            <div className="w-full max-w-[520px] bg-[#050505] border border-white/[0.08] rounded-[24px] shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden relative">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-white/30">
                  Unified_Core
                </div>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col gap-8 relative">
                {/* Decorative glow */}
                <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-white/[0.02] blur-[60px] rounded-full pointer-events-none" />

                {/* Total Quota Section */}
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-white/40 font-mono uppercase tracking-wider mb-1">Aggregated Storage</span>
                      <span className="text-[36px] font-bold text-white tracking-tight leading-none">165.2 <span className="text-[18px] text-white/40">GB</span></span>
                    </div>
                    <div className="text-[13px] font-mono text-white/50 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.05]">
                      74% USED
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden flex relative mt-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={isInView ? { width: "74%" } : {}}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                      className="h-full bg-white/[0.9] rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </motion.div>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-white/[0.05]" />

                {/* Connected Drives */}
                <div className="flex flex-col gap-3 relative z-10">
                  <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider mb-2">Connected Origins</span>
                  
                  {[
                    { label: "personal@gmail.com", used: "12.5 GB", icon: Cloud },
                    { label: "work@company.com", used: "85.0 GB", icon: Server },
                    { label: "client-shared@gmail.com", used: "67.7 GB", icon: HardDrive }
                  ].map((drive, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + (i * 0.15) }}
                      className="flex items-center justify-between p-3.5 rounded-[12px] border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                          <drive.icon className="w-4 h-4 text-white/60" />
                        </div>
                        <span className="font-mono text-[13px] md:text-[14px] text-white/70">{drive.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[13px] md:text-[14px] font-medium text-white">{drive.used}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </div>

            {/* Floating label */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="absolute -left-6 bottom-12 bg-[#0A0A0A] border border-white/[0.1] px-4 py-2 rounded-full shadow-xl flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[11px] text-white/60 uppercase tracking-wider">Live Syncing</span>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
