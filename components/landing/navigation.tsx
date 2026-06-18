"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[900px] transition-all duration-300 rounded-full",
        scrolled 
          ? "bg-[#0A0A0A]/95 backdrop-blur-lg border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.5)] py-3" 
          : "bg-[#0A0A0A]/70 backdrop-blur-md border border-white/[0.06] shadow-xl py-3.5"
      )}
    >
      <div className="px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[18px] tracking-tight text-white">DriveStack</span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[14px] text-white/60 hover:text-white transition-colors">Features</a>
          <a href="/pricing" className="text-[14px] text-white/60 hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="text-[14px] text-white/60 hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-[14px] font-medium text-white/80 hover:text-white transition-colors">Sign in</a>
          <a href="/signup" className="text-[14px] font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-colors flex items-center gap-2">
            Get started <span className="text-[12px]">→</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/[0.08] rounded-[20px] p-6 flex flex-col gap-6 shadow-2xl md:hidden">
          <a href="#features" className="text-[16px] text-white/80">Features</a>
          <a href="/pricing" className="text-[16px] text-white/80">Pricing</a>
          <a href="#faq" className="text-[16px] text-white/80">FAQ</a>
          <hr className="border-white/[0.08]" />
          <a href="/login" className="text-[16px] text-white/80">Sign in</a>
          <a href="/signup" className="text-[16px] font-medium bg-white text-black px-4 py-3 rounded-full text-center">Get started</a>
        </div>
      )}
    </header>
  );
}
