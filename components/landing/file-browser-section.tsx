"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function FileBrowserSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="bg-ds-true-white py-32 px-6"
      ref={ref}
    >
      <div className="container mx-auto max-w-[1000px] flex flex-col items-center">
        
        <div className={cn("reveal flex flex-col items-center text-center mb-16", isInView && "is-visible")}>
          <span className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-6">
            UNIFIED BROWSER
          </span>
          <h2 className="flex flex-col mb-4">
            <span className="font-bold text-[36px] md:text-[48px] text-ds-dark-text tracking-[-0.02em] leading-[1.1]">
              Every file. Every account.
            </span>
            <span className="font-serif italic text-[36px] md:text-[48px] text-ds-dark-text tracking-[-0.02em] leading-[1.1]">
              One clean list.
            </span>
          </h2>
          <p className="text-[16px] text-ds-mid-grey max-w-[600px] leading-relaxed">
            Stop switching tabs. DriveStack gives you a native-feeling file browser 
            that merges all your Google Drives into a single, searchable view.
          </p>
        </div>

        <div className={cn("w-full reveal-scale relative rounded-[16px] overflow-hidden border border-ds-light-border shadow-[0_20px_40px_rgba(0,0,0,0.08)]", isInView && "is-visible")}>
          <img 
            src="/assets/file_browser_screenshot.png" 
            alt="Unified File Browser" 
            className="w-full h-auto object-cover bg-ds-pure-black"
          />
        </div>

      </div>
    </section>
  );
}
