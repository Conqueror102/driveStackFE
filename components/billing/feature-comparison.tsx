import { Check, Minus } from "lucide-react";

export function FeatureComparison() {
  const rows = [
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
  ];

  return (
    <div className="w-full bg-white">
      <div className="grid grid-cols-3 bg-slate-50 border-b border-border p-4 sm:px-6">
        <div className="col-span-1 font-medium text-text-secondary text-[12px] uppercase tracking-wider">Feature</div>
        <div className="col-span-1 text-center font-medium text-text-secondary text-[12px] uppercase tracking-wider">Free</div>
        <div className="col-span-1 text-center font-medium text-text-secondary text-[12px] uppercase tracking-wider">Pro</div>
      </div>
      
      <div className="divide-y divide-border">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 p-4 sm:px-6 hover:bg-slate-50/50 transition-colors">
            <div className="col-span-1 text-[13px] text-text-primary flex items-center">{row.name}</div>
            <div className="col-span-1 flex items-center justify-center text-[13px]">
              {typeof row.free === "boolean" ? (
                row.free ? <Check size={16} className="text-text-primary" /> : <Minus size={16} className="text-text-tertiary" />
              ) : (
                <span className="text-text-secondary">{row.free}</span>
              )}
            </div>
            <div className="col-span-1 flex items-center justify-center text-[13px]">
              {typeof row.pro === "boolean" ? (
                row.pro ? <Check size={16} className="text-text-primary" /> : <Minus size={16} className="text-text-tertiary" />
              ) : (
                <span className="text-text-primary font-medium">{row.pro}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
