import { Navigation } from "@/components/landing/navigation";
import { PricingSection } from "@/components/landing/pricing-section";
import { Footer } from "@/components/landing/footer";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-ds-true-white selection:bg-ds-pure-black selection:text-ds-true-white">
      <Navigation />

      <PricingSection />

      {/* Feature Comparison Table */}
      <section className="bg-ds-true-white pb-32 px-6">
        <div className="container mx-auto max-w-[900px]">
          <h3 className="text-[24px] font-semibold text-ds-dark-text mb-12 text-center">
            Compare plans in detail
          </h3>

          <div className="w-full border border-ds-light-border rounded-[16px] overflow-hidden bg-ds-true-white">
            <div className="grid grid-cols-3 bg-ds-off-white border-b border-ds-light-border p-4 sm:p-6">
              <div className="col-span-1 font-semibold text-ds-dark-text text-[14px]">Features</div>
              <div className="col-span-1 text-center font-bold text-ds-dark-text text-[14px] uppercase tracking-wider">Free</div>
              <div className="col-span-1 text-center font-bold text-ds-dark-text text-[14px] uppercase tracking-wider">Pro</div>
            </div>
            
            {/* Table Rows */}
            <div className="divide-y divide-ds-light-border">
              {[
                { name: "Google accounts", free: "2", pro: "Unlimited" },
                { name: "Unified file browser", free: true, pro: true },
                { name: "Upload with account picker", free: true, pro: true },
                { name: "Smart upload recommendation", free: true, pro: true },
                { name: "Default account setting", free: true, pro: true },
                { name: "Move files between accounts", free: false, pro: true },
                { name: "Duplicate file detector", free: false, pro: true },
                { name: "Bulk operations", free: false, pro: true },
                { name: "Storage alerts + notifications", free: false, pro: true },
                { name: "File preview", free: false, pro: true },
                { name: "Storage history chart", free: false, pro: true },
                { name: "Upload from URL", free: false, pro: true },
                { name: "Priority support", free: false, pro: true },
                { name: "Referral programme access", free: false, pro: true },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 p-4 sm:px-6 sm:py-5 hover:bg-ds-off-white/50 transition-colors">
                  <div className="col-span-1 text-[14px] text-ds-dark-text flex items-center">{row.name}</div>
                  <div className="col-span-1 flex items-center justify-center text-[14px]">
                    {typeof row.free === "boolean" ? (
                      row.free ? <Check size={18} className="text-ds-dark-text" /> : <Minus size={18} className="text-ds-light-grey" />
                    ) : (
                      <span className="text-ds-mid-grey font-medium">{row.free}</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-[14px]">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? <Check size={18} className="text-ds-dark-text" /> : <Minus size={18} className="text-ds-light-grey" />
                    ) : (
                      <span className="text-ds-dark-text font-semibold">{row.pro}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
