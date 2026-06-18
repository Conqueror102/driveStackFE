"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ShowcaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="showcase"
      className="bg-ds-off-black py-32 overflow-hidden"
      ref={ref}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className={cn("reveal flex flex-col items-start mb-16", isInView && "is-visible")}>
          <h2 className="flex flex-col mb-6">
            <span className="font-bold text-[48px] md:text-[64px] text-ds-true-white tracking-[-0.03em] leading-[1.05]">
              The interface your
            </span>
            <span className="font-serif italic text-[48px] md:text-[64px] text-ds-true-white tracking-[-0.02em] leading-[1.05]">
              Drive deserves.
            </span>
          </h2>
          
          <p className="text-[16px] text-ds-true-white/50 max-w-[520px] leading-relaxed">
            Beautifully precise visualisations of your storage usage across 
            all accounts. Spot large files, track quotas, and reclaim space seamlessly.
          </p>
        </div>
      </div>

      <div className={cn("w-full reveal-scale mb-20", isInView && "is-visible")}>
        {/* Full bleed screenshot */}
        <div className="w-full relative shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <img 
            src="/assets/storage_showcase.png" 
            alt="DriveStack Storage Management Showcase" 
            className="w-full h-auto object-cover object-top border-y border-white/10"
          />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl">
        <div 
          className={cn(
            "flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 stagger",
            isInView && "is-visible"
          )}
        >
          <div className="flex flex-col items-center flex-1">
            <span className="font-mono text-[36px] font-bold text-ds-true-white mb-2 leading-none">
              &infin;
            </span>
            <span className="text-[12px] uppercase text-ds-mid-grey tracking-wider font-medium">
              accounts
            </span>
          </div>

          <div className="hidden md:block w-[1px] h-16 bg-white/10" />

          <div className="flex flex-col items-center flex-1">
            <span className="font-mono text-[36px] font-bold text-ds-true-white mb-2 leading-none">
              100%
            </span>
            <span className="text-[12px] uppercase text-ds-mid-grey tracking-wider font-medium">
              browser-based
            </span>
          </div>

          <div className="hidden md:block w-[1px] h-16 bg-white/10" />

          <div className="flex flex-col items-center flex-1">
            <span className="font-mono text-[36px] font-bold text-ds-true-white mb-2 leading-none">
              0
            </span>
            <span className="text-[12px] uppercase text-ds-mid-grey tracking-wider font-medium">
              files left behind
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
