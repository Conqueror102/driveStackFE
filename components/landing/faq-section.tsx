"use client";

import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How is DriveStack different from Google Drive?",
    a: "Google Drive manages one account at a time. DriveStack connects multiple Google accounts and gives you a single interface to manage all of them together."
  },
  {
    q: "Is my data safe?",
    a: "DriveStack never stores your files. We only store the metadata — file names, sizes, and account information. Your files stay in Google Drive. Always."
  },
  {
    q: "Do I need to pay Google for this to work?",
    a: "No. DriveStack works with free Google accounts. You do not need a Google One subscription."
  },
  {
    q: "Can I connect accounts from different people?",
    a: "DriveStack is designed for accounts you personally own and control. Connecting someone else's account without permission is against our Terms of Service."
  },
  {
    q: "What happens if I cancel my Pro subscription?",
    a: "Your account reverts to the free tier — 2 accounts maximum. Your files are never deleted. They stay in Google Drive."
  },
  {
    q: "How does the referral programme work?",
    a: "Share your unique referral link. When someone you refer upgrades to Pro, you earn one permanent bonus account slot. Free users can earn up to 3 bonus slots through referrals."
  },
  {
    q: "Which countries can use DriveStack?",
    a: "DriveStack works globally. Nigerian users pay in Naira via Squad. International users pay in USD via our international payment partner."
  }
];

export function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // State for tracking which accordion is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq"
      className="bg-ds-off-white py-32 px-6"
      ref={ref}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-16 md:gap-8">
          
          {/* Left Column (Sticky) */}
          <div className={cn("w-full md:w-4/12 relative reveal", isInView && "is-visible")}>
            <div className="md:sticky md:top-32">
              <span className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-8 block">
                FAQ
              </span>
              
              <h2 className="flex flex-col mb-6">
                <span className="font-bold text-[40px] md:text-[48px] text-ds-dark-text tracking-[-0.02em] leading-[1.05]">
                  Questions,
                </span>
                <span className="font-serif italic text-[40px] md:text-[48px] text-ds-dark-text tracking-[-0.02em] leading-[1.05]">
                  answered.
                </span>
              </h2>

              <p className="text-[14px] text-ds-mid-grey">
                Still have questions? Reach us at<br/>
                <a href="mailto:hello@drivestack.app" className="text-ds-dark-text hover:underline underline-offset-4">hello@drivestack.app</a>
              </p>
            </div>
          </div>

          {/* Right Column (Accordion) */}
          <div className={cn("w-full md:w-8/12 flex flex-col stagger", isInView && "is-visible")}>
            <div className="border-t border-ds-light-border">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                
                return (
                  <div key={idx} className="border-b border-ds-light-border">
                    <button 
                      onClick={() => toggleOpen(idx)}
                      className="w-full flex items-center justify-between py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-light-grey rounded-sm"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[15px] font-semibold text-ds-dark-text pr-8">
                        {faq.q}
                      </span>
                      <span className="text-[20px] font-light text-ds-mid-grey shrink-0">
                        {isOpen ? "—" : "+"}
                      </span>
                    </button>
                    
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen ? "max-h-[500px] opacity-100 pb-8" : "max-h-0 opacity-0 pb-0"
                      )}
                    >
                      <p className="text-[14px] font-normal text-ds-mid-grey leading-[1.75] max-w-[600px]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
