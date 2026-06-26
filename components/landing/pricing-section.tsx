"use client";

import { useState, useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { paymentsApi } from "@/lib/api/payments.api";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { usePricing } from "@/hooks/use-pricing";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const user = useAuthStore((state) => state.user);
  const { data: pricing, isLoading: isPricingLoading } = usePricing();

  const isNg = (user as any)?.country === 'NG';
  const currency = isNg ? 'NGN' : 'USD';
  const activePlan = pricing?.plans?.find(p => p.currency === currency) || { amount: isNg ? 1500 : 2, currency };

  const formatter = new Intl.NumberFormat(isNg ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: isNg ? 0 : 2,
  });

  const monthlyPrice = formatter.format(activePlan.amount);
  const annualMonthlyPrice = formatter.format(Math.round(activePlan.amount * 0.67));

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const data = await paymentsApi.createCheckout({ isAnnual });
      window.location.href = data.checkoutUrl;
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section 
      id="pricing"
      className="bg-ds-true-white py-32 px-6"
      ref={ref}
    >
      <div className="container mx-auto max-w-[900px] flex flex-col items-center">
        
        <div className={cn("reveal flex flex-col items-center text-center mb-16", isInView && "is-visible")}>
          <span className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-8">
            PRICING
          </span>
          
          <h2 className="flex items-center justify-center gap-6 mb-6">
            <span className="font-bold text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-none">Simple.</span>
            <div className="w-[1px] h-10 bg-ds-light-border hidden sm:block" />
            <span className="font-bold text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-none">Honest.</span>
            <div className="w-[1px] h-10 bg-ds-light-border hidden sm:block" />
            <span className="font-bold text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-none">Yours.</span>
          </h2>

          <p className="text-[16px] font-normal text-ds-mid-grey leading-[1.5] max-w-[600px]">
            One plan. Everything included. Pay monthly or save with annual.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className={cn("reveal flex items-center justify-center mb-12", isInView && "is-visible")}>
          <div className="relative flex items-center bg-ds-off-white p-1 rounded-full border border-ds-light-border">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "relative z-10 px-6 py-2 text-[14px] font-medium rounded-full transition-colors duration-200",
                !isAnnual ? "text-ds-dark-text bg-ds-true-white shadow-sm border border-ds-light-border/50" : "text-ds-mid-grey hover:text-ds-dark-text"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "relative z-10 px-6 py-2 text-[14px] font-medium rounded-full transition-colors duration-200 flex items-center gap-2",
                isAnnual ? "text-ds-dark-text bg-ds-true-white shadow-sm border border-ds-light-border/50" : "text-ds-mid-grey hover:text-ds-dark-text"
              )}
            >
              Annual
              <span className="bg-ds-pure-black text-ds-true-white text-[10px] px-2 py-0.5 rounded-[4px] uppercase tracking-wider font-bold">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className={cn("w-full flex flex-col md:flex-row items-stretch gap-6 stagger", isInView && "is-visible")}>
          
          {/* Mobile optimization: Reverse order on small screens */}
          <div className="contents flex-col-reverse md:flex-row">
            
            {/* Free Card */}
            <div className="flex-1 bg-ds-true-white border border-ds-light-border rounded-[16px] p-8 md:p-10 flex flex-col order-2 md:order-1">
              <h3 className="text-[14px] font-bold tracking-wider uppercase text-ds-mid-grey mb-6">
                FREE
              </h3>
              <div className="w-full h-[1px] bg-ds-light-border mb-6" />
              <div className="mb-8">
                <div className="text-[32px] font-bold text-ds-dark-text leading-none mb-2">
                  $0 <span className="text-[16px] font-normal text-ds-mid-grey">/ free forever</span>
                </div>
              </div>
              
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> 2 Google accounts
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Full file browser
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Upload with account picker
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Smart upload recommendation
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Default account setting
                </li>
              </ul>

              <button className="w-full bg-transparent border border-ds-light-border text-ds-dark-text font-medium text-[14px] h-12 rounded-[8px] hover:bg-ds-off-white transition-colors">
                Get started
              </button>
            </div>

            {/* Pro Card */}
            <div className="flex-1 bg-ds-true-white border-[2px] border-ds-pure-black rounded-[16px] p-8 md:p-10 flex flex-col relative order-1 md:order-2 shadow-sm">
              <div className="absolute top-8 right-8 bg-ds-pure-black text-ds-true-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-[4px]">
                MOST POPULAR
              </div>
              
              <h3 className="text-[14px] font-bold tracking-wider uppercase text-ds-dark-text mb-6">
                PRO
              </h3>
              <div className="w-full h-[1px] bg-ds-light-border mb-6" />
              
              <div className="mb-4">
                <div className="flex flex-col h-[50px] justify-center overflow-hidden">
                  {/* Subtle animation wrapper for price change */}
                  <div 
                    className="flex flex-col transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateY(${isAnnual ? '-50px' : '0'})` }}
                  >
                    <div className="h-[50px] flex items-end">
                      {isPricingLoading ? (
                        <div className="h-8 w-24 bg-ds-light-border animate-pulse rounded"></div>
                      ) : (
                        <>
                          <span className="text-[32px] font-bold text-ds-dark-text leading-none">{monthlyPrice}</span>
                          <span className="text-[16px] font-normal text-ds-mid-grey ml-2 pb-1">/ month</span>
                        </>
                      )}
                    </div>
                    <div className="h-[50px] flex items-end">
                      {isPricingLoading ? (
                        <div className="h-8 w-24 bg-ds-light-border animate-pulse rounded"></div>
                      ) : (
                        <>
                          <span className="text-[32px] font-bold text-ds-dark-text leading-none">{annualMonthlyPrice}</span>
                          <span className="text-[16px] font-normal text-ds-mid-grey ml-2 pb-1">/ month</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-[14px] text-ds-mid-grey mt-2 h-5">
                  {isPricingLoading ? null : isNg ? "$2.00 / month for others" : "₦1,500 / month for others"}
                </div>
              </div>
              
              <div className="text-[13px] text-ds-mid-grey mb-6">
                {isAnnual ? "Billed annually. Cancel anytime." : "Billed monthly. Cancel anytime."}
              </div>

              <div className="w-full h-[1px] bg-ds-light-border mb-6" />
              
              <div className="text-[14px] font-semibold text-ds-dark-text mb-4">
                Everything in Free, plus:
              </div>

              <ul className="flex flex-col gap-4 mb-10 flex-1">
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Unlimited Google accounts
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Move files between accounts
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Duplicate file detector
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Bulk operations
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Storage alerts + notifications
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> File preview
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Storage history chart
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Upload from URL
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Priority support
                </li>
                <li className="flex items-start text-[14px] text-ds-dark-text leading-[1.9]">
                  <span className="mr-3 font-mono text-ds-light-grey">&mdash;</span> Referral programme access
                </li>
              </ul>

              <button
                className="w-full bg-ds-pure-black text-ds-true-white font-medium text-[14px] h-12 rounded-[8px] hover:bg-ds-off-black hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                onClick={handleUpgrade}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {checkoutLoading ? 'Starting checkout...' : 'Upgrade to Pro →'}
              </button>
            </div>
            
          </div>
        </div>

        {/* Trust Signals */}
        <div className={cn("mt-12 flex flex-wrap justify-center items-center gap-3 text-[13px] text-ds-mid-grey reveal", isInView && "is-visible")}>
          <span>Cancel anytime</span>
          <span>&middot;</span>
          <span>Secure payments via Dodo</span>
          <span>&middot;</span>
          <span className="text-center">Nigerian &amp; international cards accepted</span>
        </div>

      </div>
    </section>
  );
}
