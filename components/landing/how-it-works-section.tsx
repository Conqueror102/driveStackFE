"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    num: "01",
    title: "Connect your accounts",
    desc: "Sign in with each Google account you own. DriveStack connects securely — you stay in control, you can disconnect at any time.",
    image: "/assets/auth_screenshot.png"
  },
  {
    num: "02",
    title: "See everything in one place",
    desc: "All your files, all your storage, one dashboard. Search and filter across every account simultaneously.",
    image: "/assets/files_screenshot.png"
  },
  {
    num: "03",
    title: "Manage with confidence",
    desc: "Move files, remove duplicates, set alerts. Your Drive, fully under control.",
    image: "/assets/manage_screenshot.png"
  }
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="bg-ds-true-white py-32 px-6"
      ref={ref}
    >
      <div className="container mx-auto max-w-[800px] flex flex-col items-center">
        
        <div className={cn("reveal flex flex-col items-center text-center mb-24", isInView && "is-visible")}>
          <span className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-8">
            HOW IT WORKS
          </span>
          <h2 className="flex flex-col">
            <span className="font-bold text-[40px] md:text-[48px] text-ds-dark-text tracking-[-0.02em] leading-[1.1]">
              Up and running
            </span>
            <span className="font-serif italic text-[40px] md:text-[48px] text-ds-dark-text tracking-[-0.02em] leading-[1.1]">
              in three steps.
            </span>
          </h2>
        </div>

        <div className="w-full relative">
          {/* Vertical line connecting steps */}
          <div className="absolute top-0 bottom-0 left-[20px] w-[1px] bg-ds-light-border hidden md:block" />

          <div className="flex flex-col gap-20">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className={cn("relative flex flex-col md:flex-row gap-6 md:gap-12 reveal", isInView && "is-visible")}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Number marker (Desktop) */}
                <div className="hidden md:flex relative z-10 w-10 h-10 rounded-full bg-ds-true-white border border-ds-light-border items-center justify-center font-mono text-[14px] font-semibold text-ds-dark-text shrink-0">
                  {step.num}
                  <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-ds-light-border -z-10" />
                </div>

                {/* Number marker (Mobile) */}
                <div className="md:hidden font-mono text-[24px] font-bold text-ds-light-grey mb-2">
                  {step.num}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-[16px] font-semibold text-ds-dark-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[15px] font-normal text-ds-mid-grey leading-[1.7] mb-8 max-w-[500px]">
                    {step.desc}
                  </p>
                  
                  {/* Small product screenshot inset */}
                  <div className="w-full max-w-[480px] rounded-lg border border-ds-light-border overflow-hidden shadow-sm grayscale opacity-90 transition-all duration-300 hover:grayscale-0 hover:opacity-100">
                    <img 
                      src={step.image} 
                      alt={`Step ${step.num}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
