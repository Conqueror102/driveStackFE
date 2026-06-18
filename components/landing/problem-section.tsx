"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const problems = [
  {
    num: "01",
    title: "You can't see everything",
    desc: "Files spread across accounts with no single view."
  },
  {
    num: "02",
    title: "Storage warnings appear suddenly",
    desc: "No early warning. No visibility. Just full."
  },
  {
    num: "03",
    title: "Moving files is painful",
    desc: "Download. Re-upload. Hope nothing breaks."
  }
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="bg-ds-true-white py-32 px-6"
      ref={ref}
    >
      <div className="container mx-auto max-w-[760px] text-center">
        
        <div className={cn("reveal flex flex-col items-center", isInView && "is-visible")}>
          <span className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-8">
            THE PROBLEM
          </span>
          
          <h2 className="flex flex-col mb-8">
            <span className="font-bold text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-[1.1]">
              Your files are everywhere.
            </span>
            <span className="font-serif italic text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-[1.1]">
              You just don't know where.
            </span>
          </h2>

          <p className="text-[18px] font-normal text-ds-mid-grey leading-[1.8] max-w-[600px] mb-20 mx-auto">
            You have a work account, a personal account, maybe an old
            one from university still sitting somewhere. Files are
            scattered. Storage warnings appear at the worst times.
            And you never quite know what is where.
          </p>
        </div>

        <div 
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-left stagger",
            isInView && "is-visible"
          )}
        >
          {problems.map((prob) => (
            <div key={prob.num} className="flex flex-col items-start bg-transparent border-0 p-0 m-0">
              <span className="font-mono text-[32px] md:text-[40px] font-bold text-ds-light-grey mb-4 leading-none">
                {prob.num}
              </span>
              <h3 className="text-[16px] font-semibold text-ds-dark-text mb-2 leading-snug">
                {prob.title}
              </h3>
              <p className="text-[14px] text-ds-mid-grey leading-relaxed">
                {prob.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
