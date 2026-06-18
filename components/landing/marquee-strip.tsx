"use client";

const features = [
  "UNIFIED FILE BROWSER",
  "MOVE FILES BETWEEN ACCOUNTS",
  "DUPLICATE DETECTOR",
  "STORAGE ALERTS",
  "BULK OPERATIONS",
  "SMART UPLOAD ROUTING",
  "FILE PREVIEW",
  "STORAGE HISTORY",
  "QUICK URL UPLOAD",
  "DEFAULT ACCOUNT",
  "REAL-TIME PROGRESS"
];

// Duplicate to ensure smooth infinite scroll
const stripContent = [...features, ...features, ...features];

export function MarqueeStrip() {
  return (
    <div className="w-full h-12 bg-ds-dark-surface overflow-hidden flex items-center border-y border-white/5 relative z-10">
      <div 
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {stripContent.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="font-mono text-[10px] md:text-[12px] uppercase text-ds-true-white/50 tracking-wider">
              {item}
            </span>
            <span className="text-[10px] text-ds-true-white/30 mx-4 md:mx-6">
              ◆
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
