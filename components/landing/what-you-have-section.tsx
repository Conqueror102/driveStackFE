"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { HardDrive } from "lucide-react";

export function WhatYouHaveSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();

  const mathRows = [
    { accounts: "1 Google account", gb: "5 GB", delay: 0.8, percentage: 25 },
    { accounts: "2 Google accounts", gb: "10 GB", delay: 0.9, percentage: 50 },
    { accounts: "3 Google accounts", gb: "15 GB", delay: 1.0, percentage: 75 },
    { accounts: "4 Google accounts", gb: "20 GB", delay: 1.1, percentage: 100 },
  ];

  return (
    <section 
      id="what-you-have" 
      className="bg-[#000000] py-[140px] w-full relative overflow-hidden" 
      ref={ref}
    >
      {/* Advanced Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-[800px] flex flex-col items-center text-center relative z-10">
        
        {/* Section label */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
          <span className="text-[11px] uppercase font-mono font-medium tracking-[0.12em] text-white/50">
            What you already have
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2 
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={isInView ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col mb-6"
        >
          <span className="font-bold text-[40px] md:text-[56px] text-white tracking-[-0.03em] leading-[1.05]">
            You probably have more storage
          </span>
          <span className="font-serif italic text-[40px] md:text-[56px] text-white/80 tracking-[-0.02em] leading-[1.05]">
            than you think.
          </span>
        </motion.h2>

        {/* Sub-headline */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={isInView ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-[16px] md:text-[18px] font-normal text-white/45 leading-[1.6] max-w-[500px] mx-auto"
        >
          Most people have more than one Google account.<br className="hidden sm:block" />
          DriveStack helps you use all of them.
        </motion.p>

        {/* The Advanced Calculator Widget */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }) : {}}
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-[64px] w-full max-w-[640px] relative group"
        >
          {/* Animated border glow */}
          <div className="absolute -inset-[1px] rounded-[24px] bg-gradient-to-b from-white/[0.15] to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative w-full bg-[#050505] border border-white/[0.08] rounded-[24px] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Widget Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
                </div>
              </div>
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                Storage_Aggregation_Model
              </div>
            </div>

            {/* Widget Body */}
            <div className="p-6 md:p-10 flex flex-col gap-2 relative">
              {/* Subtle background element inside widget */}
              <div className="absolute right-0 top-0 w-[250px] h-[250px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none" />

              {mathRows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10, filter: "blur(4px)" }}
                  animate={isInView ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }) : {}}
                  transition={{ duration: shouldReduceMotion ? 0.3 : 0.5, ease: "easeOut", delay: shouldReduceMotion ? 0 : row.delay }}
                  className="flex items-center justify-between p-3 md:p-4 rounded-[16px] hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/[0.05] relative z-10"
                >
                  {/* Left: Accounts */}
                  <div className="flex items-center gap-4 w-[200px]">
                    <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                      <HardDrive className="w-4 h-4 text-white/50" />
                    </div>
                    <span className="font-mono text-[13px] md:text-[14px] text-white/70">
                      {row.accounts}
                    </span>
                  </div>

                  {/* Middle: Connection */}
                  <div className="flex-1 flex items-center justify-center px-4 hidden sm:flex">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
                    <div className="px-3 font-mono text-white/30 text-[12px]">=</div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
                  </div>

                  {/* Right: GB with capacity bar */}
                  <div className="w-[120px] flex flex-col items-end gap-1.5">
                    <div className="font-mono text-[16px] md:text-[18px] font-bold text-white tracking-tight">
                      {row.gb}
                    </div>
                    {/* Capacity progress bar */}
                    <div className="w-[80px] h-[2px] bg-white/[0.06] rounded-full overflow-hidden flex justify-start">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${row.percentage}%` } : {}}
                        transition={{ duration: 1, ease: "easeOut", delay: shouldReduceMotion ? 0 : row.delay + 0.3 }}
                        className="h-full bg-white/[0.8] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Divider & Final Conclusion */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={isInView ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
                transition={{ duration: shouldReduceMotion ? 0.3 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : 1.6 }}
                className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-center relative z-10"
              >
                <div className="font-sans text-[13px] md:text-[14px] font-medium text-white/50 tracking-wider text-center flex items-center gap-3 md:gap-5">
                  <span>All of it.</span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span>One place.</span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white font-semibold">DriveStack.</span>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
