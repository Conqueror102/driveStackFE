"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Layers, ArrowLeftRight, CopyMinus, BellRing, DatabaseBackup, Route, LineChart, Link as LinkIcon } from "lucide-react";

const features = [
  {
    title: "Unified file browser",
    desc: "See every file from every account in one list. Filter, sort, search — across all of them at once.",
    icon: Layers
  },
  {
    title: "Move between accounts",
    desc: "Drag files from one Drive to another in seconds. No downloading. No re-uploading. No broken links.",
    icon: ArrowLeftRight
  },
  {
    title: "Duplicate detector",
    desc: "Finds identical files hiding across your accounts. Delete the copies. Recover the space.",
    icon: CopyMinus
  },
  {
    title: "Storage alerts",
    desc: "Get notified before any account runs out of space. Set thresholds. DriveStack watches for you.",
    icon: BellRing
  },
  {
    title: "Bulk operations",
    desc: "Select dozens of files. Move or delete them all. In one action. Not one by one.",
    icon: DatabaseBackup
  },
  {
    title: "Smart upload routing",
    desc: "DriveStack recommends the best account for each upload based on available space.",
    icon: Route
  },
  {
    title: "Storage history",
    desc: "Track how your usage grows over time. Per account. Per week. Per month.",
    icon: LineChart
  },
  {
    title: "Upload from URL",
    desc: "Paste any link. DriveStack saves the file directly to your chosen Drive account.",
    icon: LinkIcon
  }
];

export function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="features"
      className="bg-ds-off-white py-32 px-6"
      ref={ref}
    >
      <div className="container mx-auto max-w-7xl">
        
        {/* Header - Two Column */}
        <div className={cn("flex flex-col md:flex-row md:items-start gap-8 md:gap-0 mb-20 reveal", isInView && "is-visible")}>
          <div className="w-full md:w-5/12 flex flex-col">
            <span className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-6">
              WHAT IT DOES
            </span>
            <h2 className="flex flex-col">
              <span className="font-bold text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-[1.05]">
                Everything you need
              </span>
              <span className="font-bold text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-[1.05]">
                to manage your Drive
              </span>
              <span className="font-serif italic text-[40px] md:text-[56px] text-ds-dark-text tracking-[-0.02em] leading-[1.05]">
                intelligently.
              </span>
            </h2>
          </div>
          <div className="w-full md:w-7/12 md:pl-12 flex items-end pb-2">
            <p className="text-[18px] font-normal text-ds-mid-grey leading-[1.8] max-w-[480px]">
              Connect your accounts once. DriveStack handles the rest &mdash;
              organising, alerting, moving, and showing you exactly where
              your storage stands at all times.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div 
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 stagger",
            isInView && "is-visible"
          )}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-ds-true-white border border-ds-light-border rounded-[12px] p-[28px] group transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ds-pale-grey hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-ds-off-white rounded-lg mb-6 text-ds-dark-text border border-ds-light-border">
                  <Icon strokeWidth={1.5} size={24} className="opacity-80" />
                </div>
                <h3 className="text-[16px] font-semibold text-ds-dark-text mb-3">
                  {feat.title}
                </h3>
                <p className="text-[14px] font-normal text-ds-mid-grey leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
