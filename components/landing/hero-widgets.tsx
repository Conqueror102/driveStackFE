import { motion } from "motion/react";
import { Cloud, HardDrive, Server, Copy, CheckCircle2, Search, Zap, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AggregatorWidget({ isInView }: { isInView: boolean }) {
  return (
    <div className="w-full h-full bg-[#050505] border border-white/[0.08] rounded-[24px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-mono text-white/30">
          Unified_Core
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-8 flex flex-col gap-8 relative">
        <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-white/[0.02] blur-[60px] rounded-full pointer-events-none" />

        {/* Total Quota Section */}
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[12px] text-white/40 font-mono uppercase tracking-wider mb-1">Aggregated Storage</span>
              <span className="text-[36px] font-bold text-white tracking-tight leading-none">165.2 <span className="text-[18px] text-white/40">GB</span></span>
            </div>
            <div className="text-[13px] font-mono text-white/50 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.05]">
              74% USED
            </div>
          </div>

          <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden flex relative mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={isInView ? { width: "74%" } : {}}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-full bg-white/[0.9] rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
            </motion.div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-white/[0.05]" />

        {/* Connected Drives */}
        <div className="flex flex-col gap-3 relative z-10">
          <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider mb-2">Connected Origins</span>
          
          {[
            { label: "personal@gmail.com", used: "12.5 GB", icon: Cloud },
            { label: "work@company.com", used: "85.0 GB", icon: Server },
            { label: "client-shared@gmail.com", used: "67.7 GB", icon: HardDrive }
          ].map((drive, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + (i * 0.15) }}
              className="flex items-center justify-between p-3.5 rounded-[12px] border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                  <drive.icon className="w-4 h-4 text-white/60" />
                </div>
                <span className="font-mono text-[13px] md:text-[14px] text-white/70">{drive.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] md:text-[14px] font-medium text-white">{drive.used}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DuplicateScannerWidget({ isInView }: { isInView: boolean }) {
  return (
    <div className="w-full h-full bg-[#050505] border border-white/[0.08] rounded-[24px] overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-mono text-amber-500/80 flex items-center gap-1.5">
          <Search className="w-3 h-3" /> Duplicate_Scanner
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/[0.02] blur-[80px] rounded-full pointer-events-none" />

        <div className="flex flex-col gap-2 relative z-10 text-center items-center mt-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
            <Copy className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[28px] font-bold text-white tracking-tight leading-none">45.2 GB</span>
          <span className="text-[12px] text-white/40 font-mono uppercase tracking-wider">Duplicate Space Recoverable</span>
        </div>

        <div className="flex flex-col gap-3 relative z-10 mt-4">
          {[
            { name: "Project_Final_v2.mp4", size: "2.4 GB", locations: ["personal", "work"] },
            { name: "2023_Archive.zip", size: "1.8 GB", locations: ["work", "client-shared"] },
            { name: "Raw_Footage_01.mov", size: "8.5 GB", locations: ["personal", "client-shared"] }
          ].map((file, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
              className="flex flex-col gap-2 p-3.5 rounded-[12px] border border-white/[0.03] bg-white/[0.01]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-white/90 font-medium truncate max-w-[200px]">{file.name}</span>
                <span className="text-[13px] text-white/50 font-mono">{file.size}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-white/40 uppercase">Found in:</span>
                <div className="flex gap-1">
                  {file.locations.map(loc => (
                    <span key={loc} className="text-[10px] bg-white/[0.05] border border-white/[0.05] px-2 py-0.5 rounded-full text-white/60">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-auto w-full py-3.5 bg-amber-500 text-amber-950 font-medium rounded-xl text-[14px] hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" /> Resolve Duplicates
        </motion.button>
      </div>
    </div>
  );
}

export function BulkCommanderWidget({ isInView }: { isInView: boolean }) {
  return (
    <div className="w-full h-full bg-[#050505] border border-white/[0.08] rounded-[24px] overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]"/>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-mono text-blue-500/80 flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3" /> Bulk_Commander
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6 relative">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-blue-500/[0.02] blur-[70px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center relative z-10 bg-blue-500/10 border border-blue-500/20 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-[13px] text-blue-100 font-medium">42 files selected</span>
          </div>
          <span className="text-[12px] font-mono text-blue-200/50">across 3 drives</span>
        </div>

        <div className="flex flex-col gap-2 relative z-10">
          {[
            { name: "Client_Assets_2024", type: "Folder", drive: "personal" },
            { name: "Tax_Returns_Q3.pdf", type: "PDF", drive: "work" },
            { name: "Design_System_v4.fig", type: "Figma", drive: "client-shared" },
            { name: "Marketing_Drafts", type: "Folder", drive: "personal" },
          ].map((file, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 + (i * 0.05) }}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:bg-white/[0.02]"
            >
              <div className="w-3.5 h-3.5 rounded border border-blue-500 bg-blue-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
              </div>
              <span className="text-[13px] text-white/80">{file.name}</span>
              <span className="ml-auto text-[10px] text-white/30 uppercase font-mono">{file.drive}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto flex gap-3 relative z-10">
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="flex-1 py-3 bg-white text-black font-medium rounded-xl text-[13px] hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            Move <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="flex-1 py-3 bg-[#1A1A1A] border border-white/10 text-white font-medium rounded-xl text-[13px] hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" /> Delete
          </motion.button>
        </div>
      </div>
    </div>
  );
}
