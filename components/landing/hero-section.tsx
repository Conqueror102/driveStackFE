"use client";

import { useInView, motion, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AggregatorWidget, DuplicateScannerWidget, BulkCommanderWidget, FileBrowserWidget } from "./hero-widgets";

const WIDGETS = [AggregatorWidget, DuplicateScannerWidget, BulkCommanderWidget, FileBrowserWidget];

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % WIDGETS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isInView]);

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
                <a href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-[15px] font-medium text-black transition-colors hover:bg-white/90">
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
            {/* The UI Widget Container Carousel */}
            <div className="w-full max-w-[520px] h-[520px] lg:h-[480px] relative perspective-1000">
              <AnimatePresence mode="wait">
                {WIDGETS.map((Widget, i) => (
                  i === activeIndex && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, rotateX: 10, y: 20 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      exit={{ opacity: 0, rotateX: -10, y: -20 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 shadow-[0_20px_80px_rgba(0,0,0,0.8)] rounded-[24px]"
                    >
                      <Widget isInView={isInView} />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Floating label */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="absolute -left-6 bottom-12 bg-[#0A0A0A] border border-white/[0.1] px-4 py-2 rounded-full shadow-xl flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[11px] text-white/60 uppercase tracking-wider">
                {activeIndex === 0 ? "Live Syncing" : activeIndex === 1 ? "Auto Scanning" : activeIndex === 2 ? "Action Ready" : "File Explorer"}
              </span>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
