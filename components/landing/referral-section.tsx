"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ReferralSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="bg-ds-pure-black py-32 px-6 overflow-hidden"
      ref={ref}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Left Column (5/12) */}
          <div className={cn("w-full md:w-5/12 flex flex-col mb-20 md:mb-0 reveal", isInView && "is-visible")}>
            <span className="text-[11px] font-medium text-ds-true-white tracking-[0.1em] uppercase mb-8">
              GROW TOGETHER
            </span>
            
            <h2 className="flex flex-col mb-8">
              <span className="font-bold text-[40px] md:text-[48px] text-ds-true-white tracking-[-0.02em] leading-[1.1]">
                Share DriveStack.
              </span>
              <span className="font-serif italic text-[40px] md:text-[48px] text-ds-true-white tracking-[-0.02em] leading-[1.1]">
                Earn more accounts.
              </span>
            </h2>

            <p className="text-[16px] font-normal text-ds-true-white/55 leading-[1.75] max-w-[420px] mb-12">
              Every time someone you refer upgrades to Pro,
              you get an extra account slot &mdash; permanently.
              No expiry. No strings. Yours to keep.
            </p>

            <div className="flex flex-col gap-6 w-full max-w-[420px] mb-8">
              <div className="flex flex-col pb-6 border-b border-white/10">
                <h4 className="text-[14px] font-medium text-ds-true-white mb-1">Share your personal link</h4>
                <p className="text-[13px] text-ds-true-white/45">Your unique referral URL. Share it anywhere.</p>
              </div>
              <div className="flex flex-col pb-6 border-b border-white/10">
                <h4 className="text-[14px] font-medium text-ds-true-white mb-1">They sign up and upgrade</h4>
                <p className="text-[13px] text-ds-true-white/45">Your link tracks the referral automatically.</p>
              </div>
              <div className="flex flex-col pb-6">
                <h4 className="text-[14px] font-medium text-ds-true-white mb-1">You get +1 account slot</h4>
                <p className="text-[13px] text-ds-true-white/45">Instantly added to your account. Forever.</p>
              </div>
            </div>

            <p className="text-[12px] text-ds-true-white/30 mb-8 max-w-[420px]">
              Free users can earn up to 3 bonus slots through referrals.
            </p>

            <div>
              <button className="bg-ds-true-white text-ds-pure-black text-[14px] font-medium h-[44px] px-6 rounded-[8px] flex items-center justify-center hover:bg-ds-light-surface transition-colors duration-150">
                Start referring &rarr;
              </button>
            </div>
          </div>

          {/* Right Column (7/12) - Visual */}
          <div className={cn("w-full md:w-7/12 md:pl-16 flex justify-center reveal-scale", isInView && "is-visible")}>
            
            {/* Mock Referral Card Component */}
            <div className="w-full max-w-[440px] bg-ds-true-white rounded-[16px] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.5)] rotate-[1.5deg] border border-ds-true-white">
              <h3 className="text-[14px] font-semibold text-ds-dark-text mb-4">Your referral link</h3>
              
              <div className="flex items-center justify-between border-b border-ds-light-border pb-4 mb-8">
                <span className="text-[14px] font-mono text-ds-dark-text">
                  drivestack.app/r/VICTOR123
                </span>
                <button className="text-[13px] font-medium text-ds-mid-grey hover:text-ds-dark-text">
                  Copy
                </button>
              </div>

              <h3 className="text-[14px] font-semibold text-ds-dark-text mb-4">Referrals</h3>
              <div className="flex flex-col gap-3 border-b border-ds-light-border pb-6 mb-6">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-ds-dark-text font-medium">&bull; sarah@gmail.com</span>
                  <div className="flex gap-4">
                    <span className="text-ds-mid-grey">Converted</span>
                    <span className="text-ds-dark-text font-bold">+1</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-ds-dark-text font-medium">&bull; james@gmail.com</span>
                  <div className="flex gap-4">
                    <span className="text-ds-mid-grey">Pending</span>
                    <span className="text-ds-light-grey w-4 text-center">&mdash;</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-ds-dark-text font-medium">&bull; tunde@gmail.com</span>
                  <div className="flex gap-4">
                    <span className="text-ds-mid-grey">Converted</span>
                    <span className="text-ds-dark-text font-bold">+1</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-ds-mid-grey">Bonus slots earned: 2 of 3</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 font-mono text-[14px] text-ds-dark-text tracking-[-0.1em] overflow-hidden">
                  ████████████░░░░
                </div>
                <span className="text-[13px] font-mono font-medium text-ds-dark-text">67%</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
