"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function FinalCtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="relative bg-ds-pure-black min-h-[560px] flex items-center justify-center overflow-hidden py-32 px-6"
      ref={ref}
    >
      {/* Giant ghost text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden md:flex">
        <span className="text-[220px] font-extrabold text-ds-true-white opacity-[0.03] select-none tracking-tighter whitespace-nowrap">
          TAKE CONTROL
        </span>
      </div>

      <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
        
        <div className={cn("reveal flex flex-col items-center", isInView && "is-visible")}>
          <span className="text-[11px] font-medium text-ds-true-white/40 tracking-[0.12em] uppercase mb-8">
            START TODAY
          </span>
          
          <h2 className="flex flex-col mb-8">
            <span className="font-extrabold text-[64px] md:text-[96px] lg:text-[120px] text-ds-true-white tracking-[-0.04em] leading-[1.0]">
              Your Drive.
            </span>
            <span className="font-serif italic text-[64px] md:text-[96px] lg:text-[120px] text-ds-true-white tracking-[-0.04em] leading-[1.0]">
              Your rules.
            </span>
          </h2>

          <p className="text-[18px] text-ds-true-white/45 max-w-[500px] mb-12">
            Connect your first account in 30 seconds. No card required.
          </p>

          <Link
            href="/register"
            className="group bg-ds-true-white text-ds-pure-black text-[15px] font-semibold h-[56px] px-12 rounded-[10px] flex items-center justify-center border border-transparent hover:bg-ds-pure-black hover:text-ds-true-white hover:border-ds-true-white transition-all duration-200 ease-out mb-8"
          >
            Get started free 
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-[4px] ml-2">
              &rarr;
            </span>
          </Link>

          <div className="text-[12px] text-ds-true-white/30 flex flex-wrap justify-center items-center gap-3">
            <span>Free forever</span>
            <span>&middot;</span>
            <span>No credit card</span>
            <span>&middot;</span>
            <span>Cancel Pro anytime</span>
          </div>
        </div>

      </div>
    </section>
  );
}
