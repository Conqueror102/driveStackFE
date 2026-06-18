import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ds-pure-black pt-20 pb-8 px-6 border-t border-white/[0.06]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          
          {/* Column 1 - Brand */}
          <div className="flex flex-col">
            <Link href="/" className="text-[15px] font-semibold text-ds-true-white tracking-tight mb-4">
              DriveStack
            </Link>
            <p className="text-[13px] text-ds-true-white/35 leading-relaxed max-w-[240px] mb-6">
              Unified Google Drive management for professionals who need control.
            </p>
            <div className="flex items-center gap-4">
              {/* Social Placeholders */}
              <a href="#" className="w-5 h-5 bg-white/40 hover:bg-white transition-colors" style={{ maskImage: "url('/twitter.svg')", maskSize: "cover", WebkitMaskImage: "url('/twitter.svg')", WebkitMaskSize: "cover", borderRadius: "50%" }} aria-label="Twitter"></a>
              <a href="#" className="w-5 h-5 bg-white/40 hover:bg-white transition-colors" style={{ maskImage: "url('/github.svg')", maskSize: "cover", WebkitMaskImage: "url('/github.svg')", WebkitMaskSize: "cover", borderRadius: "50%" }} aria-label="GitHub"></a>
            </div>
          </div>

          {/* Column 2 - Product */}
          <div className="flex flex-col">
            <h4 className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-6">
              PRODUCT
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#features" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Changelog</Link></li>
              <li><Link href="#" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div className="flex flex-col">
            <h4 className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-6">
              COMPANY
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Blog</Link></li>
              <li><Link href="/privacy" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4 - Connect */}
          <div className="flex flex-col">
            <h4 className="text-[11px] font-medium text-ds-mid-grey tracking-[0.1em] uppercase mb-6">
              CONNECT
            </h4>
            <ul className="flex flex-col gap-4">
              <li><a href="mailto:hello@drivestack.app" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">hello@drivestack.app</a></li>
              <li><a href="#" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">Twitter / X</a></li>
              <li><a href="#" className="text-[14px] text-ds-true-white/60 hover:text-ds-true-white transition-colors">GitHub</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="w-full border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <p className="text-[12px] text-ds-true-white/25">
            &copy; {new Date().getFullYear()} DriveStack. All rights reserved.
          </p>
          <p className="text-[12px] text-ds-true-white/25 font-medium">
            Built in Lagos. Used everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
