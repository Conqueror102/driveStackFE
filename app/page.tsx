'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Github, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    number: '01',
    title: 'Connect Gmail accounts',
    body: 'Add the Google accounts you already own. DriveStack treats each quota as part of one stack without changing where files live.',
    visual: 'quota',
  },
  {
    number: '02',
    title: 'See every file once',
    body: 'Browse, filter, and search across accounts from one list. Account badges keep the source clear without forcing you to switch contexts.',
    visual: 'files',
  },
  {
    number: '03',
    title: 'Upload with intent',
    body: 'Pick an account manually or let DriveStack suggest the account with the most available space before the upload starts.',
    visual: 'picker',
  },
];

const detailRows = [
  {
    label: 'FILES',
    title: 'One list, every account.',
    body: 'Stop opening tabs to remember where a file lives. DriveStack gives you one operating surface for connected Google Drive accounts.',
    items: [
      ['Unified search.', 'Search by name, type, account, and recent changes.'],
      ['Account context.', 'Color badges show exactly which Drive owns each file.'],
      ['Duplicate signals.', 'Repeated files are surfaced before they become clutter.'],
    ],
    image: 'files',
  },
  {
    label: 'STORAGE',
    title: 'Quota math you can read.',
    body: 'The storage overview turns scattered 15 GB limits into one readable capacity model, with each account still visible.',
    items: [
      ['Combined capacity.', 'See used, free, and total storage across the stack.'],
      ['Per-account health.', 'Spot accounts close to their limit before uploads fail.'],
      ['Refresh on demand.', 'Pull the latest quota when you need certainty.'],
    ],
    image: 'storage',
  },
  {
    label: 'UPLOADS',
    title: 'Files go where they should.',
    body: 'Upload decisions happen before bytes move. You choose the destination account with clear quota context.',
    items: [
      ['Direct upload.', 'Files go straight to Google Drive through your account.'],
      ['Smart default.', 'The account with the most free space is suggested first.'],
      ['Queue visibility.', 'Every upload stays visible until it completes.'],
    ],
    image: 'upload',
  },
];

const testimonials = [
  {
    quote: 'I stopped treating old Gmail accounts like junk drawers. DriveStack made the free storage feel intentional again.',
    name: 'Maya Chen',
    role: 'Product designer',
    initials: 'MC',
  },
  {
    quote: 'The useful part is not the math. It is seeing the math at the exact moment I need to upload something large.',
    name: 'Elliot Park',
    role: 'Founder, studio operator',
    initials: 'EP',
  },
  {
    quote: 'It feels like a control surface for Google Drive, not another file manager asking me to change habits.',
    name: 'Nora Adebayo',
    role: 'Frontend engineer',
    initials: 'NA',
  },
];

const faqs = [
  ['Do I need a paid Google plan?', 'No. DriveStack is designed around the free storage attached to Gmail accounts you already own.'],
  ['Does DriveStack store my files?', 'No. Files remain in Google Drive. DriveStack gives you a unified management layer over connected accounts.'],
  ['Can I choose where uploads go?', 'Yes. You can pick the destination account yourself or use the account picker suggestion.'],
  ['What happens when an account is full?', 'DriveStack marks the account as constrained and suggests another connected account with more room.'],
  ['Is there a free plan?', 'Yes. The free plan is meant to let you connect accounts and validate the workflow before upgrading.'],
  ['Can teams use it?', 'The current product is account-first. Team-oriented controls belong in the Pro tier roadmap.'],
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useRevealAnimations();

  const navLinks = useMemo(() => [
    ['Features', '#features'],
    ['Pricing', '#pricing'],
    ['FAQ', '#faq'],
  ], []);

  return (
    <main className="min-h-screen bg-white text-[#000000]">
      <header className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="DriveStack home">
            <span className="grid h-7 w-7 grid-cols-1 gap-0.5">
              <span className="block h-1.5 rounded-[2px] bg-black" />
              <span className="block h-1.5 rounded-[2px] bg-[#6B6B6B]" />
              <span className="block h-1.5 rounded-[2px] bg-black" />
            </span>
            <span className="text-[15px] font-semibold">DriveStack</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-[#6B6B6B] transition-colors duration-150 hover:text-black">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <Link href="/login" className="text-sm text-[#6B6B6B] transition-colors duration-150 hover:text-black">
              Sign in
            </Link>
            <Link href="/register" className="h-9 rounded-md bg-black px-4 text-sm font-medium leading-9 text-white transition-colors hover:bg-[#1A1A1A]">
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E5E5] md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-4 py-6 sm:px-6 md:py-9 lg:grid-cols-12 lg:px-10">
          <div className="reveal lg:col-span-7">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]">Storage management - rethought</p>
            <h1 className="max-w-[760px] text-[44px] font-extrabold leading-[0.98] md:text-[68px] lg:text-[78px] xl:text-[84px]">
              Connect every account.
              <span className="block font-serif italic font-normal">Own your storage.</span>
            </h1>
            <p className="mt-7 max-w-[520px] text-lg leading-[1.7] text-[#6B6B6B]">
              Manage multiple Google Drive accounts from one clean storage surface.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ArrowButton href="/register" dark>
                Start for free
              </ArrowButton>
              <Link href="#features" className="inline-flex h-12 items-center justify-center rounded-md border border-black bg-white px-7 text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5]">
                See how it works
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-[#6B6B6B]">
              <span>No credit card required</span>
              <span className="h-4 w-px bg-[#E5E5E5]" />
              <span>Works with any Gmail account</span>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-5">
            <p className="mb-3 font-mono text-[11px] text-[#6B6B6B]">Actual product direction</p>
            <ProductWindow variant="files" className="mx-auto w-full max-w-[520px] -rotate-2 hover:rotate-0 lg:ml-auto" />
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5E5E5] bg-[#F5F5F5] py-12">
        <div className="stagger mx-auto grid max-w-[1180px] grid-cols-1 divide-y divide-[#E5E5E5] px-4 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-6">
          {[
            ['15 GB', 'per Gmail account'],
            ['x3', 'accounts you can connect'],
            ['45 GB', 'unified storage surface'],
          ].map(([stat, label]) => (
            <div key={label} className="py-7 first:pt-0 last:pb-0 md:px-10 md:py-0 md:first:pl-0 md:last:pr-0">
              <div className="text-4xl font-bold leading-none">{stat}</div>
              <div className="mt-3 text-xs font-medium uppercase tracking-[0.06em] text-[#6B6B6B]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-4 py-20 text-white md:py-28">
        <div className="reveal relative z-10 mx-auto max-w-[720px] text-center">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#A3A3A3]">The problem</p>
          <h2 className="text-[44px] font-bold leading-[1.05] md:text-[64px]">Fifteen gigabytes was never going to be enough.</h2>
          <p className="mx-auto mt-7 max-w-[560px] text-lg leading-[1.8] text-[#A3A3A3]">
            Google Drive fills slowly, then all at once. Photos, client exports, old decks, and shared folders compete with the files you actually need today.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[120px] font-extrabold leading-none text-white opacity-[0.06] md:text-[200px]">
          15 GB
        </div>
      </section>

      <section id="features" className="bg-white px-4 py-16 md:py-24 lg:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="reveal max-w-[760px]">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B6B6B]">How it works</p>
            <h2 className="text-[42px] font-bold leading-[1.05] md:text-[56px]">Your free storage stops feeling fragmented.</h2>
          </div>
          <div className="stagger mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="group">
                <FeatureVisual type={feature.visual} />
                <p className="mt-8 font-mono text-[11px] uppercase text-[#6B6B6B]">{feature.number}</p>
                <h3 className="mt-4 text-[22px] font-semibold">{feature.title}</h3>
                <p className="mt-3 max-w-[360px] text-[15px] leading-[1.7] text-[#6B6B6B]">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="reveal-scale mx-auto mt-16 max-w-[1280px] px-0">
          <ProductWindow variant="storage" wide />
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-4 py-16 lg:px-6">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="reveal lg:col-span-2">
            <h2 className="max-w-[420px] text-[40px] font-bold leading-[1.1]">People who've connected their accounts</h2>
          </div>
          <div className="stagger space-y-6 lg:col-span-3">
            {testimonials.map((item) => (
              <article key={item.name} className="transition-transform duration-200 hover:-translate-y-0.5">
                <p className="text-lg leading-[1.7] text-black">{item.quote}</p>
                <div className="mt-6 border-t border-[#E5E5E5] pt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">{item.initials}</span>
                    <span className="text-[13px] font-medium text-black">{item.name}</span>
                    <span className="text-[13px] text-[#6B6B6B]">{item.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-24 lg:px-6">
        <div className="mx-auto max-w-[1180px] space-y-16">
          {detailRows.map((row, index) => (
            <div key={row.title} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className={cn('reveal-scale', index % 2 === 1 && 'lg:order-2')}>
                <ProductWindow variant={row.image as ProductVariant} className={cn(index % 2 === 0 ? 'rotate-1 hover:rotate-0' : '-rotate-1 hover:rotate-0')} />
              </div>
              <div className="reveal max-w-[520px]">
                <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B6B6B]">{row.label}</p>
                <h2 className="text-[32px] font-bold leading-[1.12]">{row.title}</h2>
                <p className="mt-5 text-base leading-[1.75] text-[#6B6B6B]">{row.body}</p>
                <div className="mt-8 space-y-5">
                  {row.items.map(([lead, text]) => (
                    <p key={lead} className="text-sm leading-[1.7] text-[#6B6B6B]">
                      <span className="font-semibold text-black">{lead}</span> {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-black px-4 py-16 text-white md:py-24 lg:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="reveal">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.06em] text-[#A3A3A3]">Pricing</p>
            <h2 className="grid grid-cols-1 gap-5 text-[48px] font-bold leading-none md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:text-[64px]">
              <span>Simple.</span>
              <span className="hidden h-16 w-px bg-[#1A1A1A] md:block" />
              <span>Honest.</span>
              <span className="hidden h-16 w-px bg-[#1A1A1A] md:block" />
              <span>Flat.</span>
            </h2>
          </div>
          <div className="stagger mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            <PricingCard plan="Free" price="$0" period="forever" cta="Start free" features={['Connect up to 3 accounts', 'Unified files view', 'Storage overview', 'Manual account picker', 'Community support']} />
            <PricingCard plan="Pro" price="$8" period="per month" cta="Get Pro" popular features={['Unlimited accounts', 'Smart upload suggestions', 'Duplicate detection', 'Advanced filters', 'Priority support']} />
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-4 py-16 md:py-24 lg:px-6">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <h2 className="text-[56px] font-bold leading-none">Answers.</h2>
            <p className="mt-6 max-w-[360px] text-base leading-[1.7] text-[#6B6B6B]">The short version: DriveStack organizes the storage you already have.</p>
          </div>
          <div className="reveal lg:col-span-7">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <div key={question} className="border-b border-[#E5E5E5]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-semibold"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{question}</span>
                    <span className={cn('text-2xl font-light transition-transform duration-200', isOpen && 'rotate-180')}>{isOpen ? '-' : '+'}</span>
                  </button>
                  <div className={cn('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                    <div className="overflow-hidden">
                      <p className="pb-6 text-[15px] leading-[1.7] text-[#6B6B6B]">{answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-20 text-center text-white md:py-32">
        <div className="reveal mx-auto max-w-[980px]">
          <h2 className="text-[72px] font-extrabold leading-[0.95] md:text-[112px]">Own your<br />storage.</h2>
          <p className="mx-auto mt-8 max-w-[560px] text-lg leading-[1.7] text-[#A3A3A3]">
            Connect your accounts and turn scattered free space into one usable system.
          </p>
          <Link href="/register" className="mt-10 inline-flex h-14 items-center justify-center rounded-lg border border-white bg-white px-10 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white">
            Start for free
          </Link>
          <p className="mt-5 text-[13px] text-[#6B6B6B]">Takes 30 seconds to connect your first account</p>
        </div>
      </section>

      <footer className="bg-[#0A0A0A] px-5 py-14 text-white lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <div className="text-[15px] font-semibold">DriveStack</div>
              <p className="mt-3 max-w-[260px] text-[13px] leading-[1.7] text-[#6B6B6B]">Unified storage management for every Google Drive account you own.</p>
              <div className="mt-6 flex gap-4 text-white/50">
                <a href="#" aria-label="GitHub" className="transition-colors hover:text-white"><Github className="h-5 w-5" /></a>
                <a href="#" aria-label="X" className="font-semibold transition-colors hover:text-white">X</a>
              </div>
            </div>
            <FooterLinks title="Product" links={['Features', 'Pricing', 'FAQ']} />
            <FooterLinks title="Account" links={['Sign in', 'Create account', 'Storage']} />
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-[#1A1A1A] pt-6 text-xs text-[#4B4B4B] md:flex-row md:items-center md:justify-between">
            <span>Copyright 2026 DriveStack.</span>
            <span>Made with intention</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function useRevealAnimations() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .reveal-scale, .stagger'));
    if (!elements.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(reduced ? 'is-visible-reduced' : 'is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -20% 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black px-6 py-6 text-white md:hidden">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold">DriveStack</span>
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-20 flex flex-col gap-7 text-[40px] font-bold leading-none">
        <a href="#features" onClick={onClose}>Features</a>
        <a href="#pricing" onClick={onClose}>Pricing</a>
        <a href="#faq" onClick={onClose}>FAQ</a>
      </nav>
      <div className="absolute inset-x-6 bottom-8 grid gap-3">
        <Link href="/register" className="h-12 rounded-md bg-white text-center text-sm font-semibold leading-[48px] text-black">Get started</Link>
        <Link href="/login" className="h-12 rounded-md border border-white/25 text-center text-sm font-semibold leading-[48px] text-white">Sign in</Link>
      </div>
    </div>
  );
}

function ArrowButton({ href, dark, children }: { href: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-12 items-center justify-center rounded-md px-7 text-sm font-medium transition-colors',
        dark ? 'bg-black text-white hover:bg-[#1A1A1A]' : 'bg-white text-black'
      )}
    >
      <span>{children}</span>
      <span className="ml-2 transition-transform duration-150 group-hover:translate-x-1">-&gt;</span>
    </Link>
  );
}

type ProductVariant = 'files' | 'storage' | 'upload';

function ProductWindow({ variant, className, wide }: { variant: ProductVariant; className?: string; wide?: boolean }) {
  return (
    <div className={cn('overflow-hidden rounded-[10px] bg-white shadow-[0_32px_64px_rgba(0,0,0,0.12)] transition-transform duration-300', className)}>
      <div className="border-b border-[#E5E5E5] bg-white px-4 py-3">
        <div className="grid grid-cols-[160px_1fr_auto] items-center gap-4">
          <div className="text-[13px] font-semibold text-black">DriveStack</div>
          <div className="hidden h-8 items-center rounded-md bg-[#F5F5F5] px-3 text-[12px] text-[#6B6B6B] md:flex">Search every connected account</div>
          <div className="h-8 rounded-md bg-black px-3 text-[12px] font-medium leading-8 text-white">Upload</div>
        </div>
      </div>
      <div className={cn('grid bg-[#FAFAF8]', wide ? 'min-h-[460px] grid-cols-1 md:grid-cols-[220px_1fr]' : 'min-h-[410px] grid-cols-[92px_1fr] md:grid-cols-[150px_1fr]')}>
        <aside className="border-r border-[#E5E5E5] bg-white p-4">
          {['Overview', 'Files', 'Storage', 'Accounts'].map((item, index) => (
            <div key={item} className={cn('mb-2 rounded-md px-3 py-2 text-[12px]', index === 1 ? 'bg-black text-white' : 'text-[#6B6B6B]')}>
              {item}
            </div>
          ))}
        </aside>
        <div className="p-5 md:p-7">
          {variant === 'files' && <FilesMock />}
          {variant === 'storage' && <StorageMock />}
          {variant === 'upload' && <UploadMock />}
        </div>
      </div>
    </div>
  );
}

function FilesMock() {
  const files = [
    ['Investor update', 'PDF', 'victor', '8.4 MB', '#2563EB'],
    ['Homepage export', 'WEBP', 'design', '14.1 MB', '#DC2626'],
    ['Sprint notes', 'MD', 'work', '62 KB', '#16A34A'],
    ['Archive', 'ZIP', 'personal', '1.2 GB', '#D97706'],
    ['Launch plan', 'DOCX', 'victor', '2.8 MB', '#7C3AED'],
    ['Invoices', 'XLS', 'studio', '940 KB', '#0A0A0A'],
  ];

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h3 className="text-xl font-semibold">Files</h3>
          <p className="mt-1 text-[12px] text-[#6B6B6B]">All files across your accounts</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <span className="rounded-md bg-black px-3 py-1.5 text-[11px] text-white">Grid</span>
          <span className="rounded-md border border-[#E5E5E5] px-3 py-1.5 text-[11px] text-[#6B6B6B]">Recent</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {files.map(([name, ext, account, size, color]) => (
          <div key={name} className="aspect-square rounded-xl border border-[#E5E5E5] bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: color }}>
                {ext}
              </span>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            </div>
            <div className="mt-6 min-w-0">
              <p className="truncate text-[12px] font-semibold">{name}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate text-[10px] text-[#6B6B6B]">{account}</span>
                <span className="shrink-0 font-mono text-[10px] text-[#6B6B6B]">{size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorageMock() {
  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h3 className="text-[28px] font-semibold">31.2 GB <span className="text-lg font-normal text-[#6B6B6B]">used of 45 GB</span></h3>
          <p className="mt-1 text-[12px] text-[#6B6B6B]">Combined storage across 3 accounts</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-lg font-semibold">13.8 GB free</p>
          <p className="text-[12px] text-[#6B6B6B]">Available now</p>
        </div>
      </div>
      <div className="flex h-4 overflow-hidden rounded-full bg-[#E5E5E5]">
        <span className="h-full w-[31%] bg-[#2563EB]" />
        <span className="h-full w-[22%] bg-[#16A34A]" />
        <span className="h-full w-[16%] bg-[#D97706]" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          ['victor@gmail.com', '12.9 GB used', '#2563EB'],
          ['studio@gmail.com', '9.7 GB used', '#16A34A'],
          ['archive@gmail.com', '8.6 GB used', '#D97706'],
        ].map(([email, used, color]) => (
          <div key={email} className="rounded-lg border border-[#E5E5E5] bg-white p-4">
            <span className="mb-4 block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <p className="truncate text-[12px] font-medium">{email}</p>
            <p className="mt-1 text-[12px] text-[#6B6B6B]">{used}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadMock() {
  return (
    <div className="mx-auto max-w-[520px] rounded-xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Choose destination</h3>
      <p className="mt-1 text-[12px] text-[#6B6B6B]">3 files ready to upload</p>
      <div className="mt-5 space-y-3">
        {[
          ['victor@gmail.com', '13.8 GB free', '#2563EB', true],
          ['studio@gmail.com', '5.3 GB free', '#16A34A', false],
          ['archive@gmail.com', '1.1 GB free', '#D97706', false],
        ].map(([email, free, color, active]) => (
          <div key={email as string} className={cn('flex items-center justify-between rounded-lg border p-3', active ? 'border-black' : 'border-[#E5E5E5]')}>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color as string }} />
              <div>
                <p className="text-[13px] font-medium">{email}</p>
                <p className="text-[11px] text-[#6B6B6B]">{free}</p>
              </div>
            </div>
            {active && <span className="rounded bg-black px-2 py-1 text-[10px] font-medium uppercase text-white">Suggested</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureVisual({ type }: { type: string }) {
  return (
    <div className="h-[190px] overflow-hidden rounded-[10px] bg-white p-4 shadow-[0_20px_45px_rgba(0,0,0,0.10)] transition-transform duration-200 group-hover:-translate-y-0.5">
      {type === 'quota' && <QuotaFragment />}
      {type === 'files' && <FilesFragment />}
      {type === 'picker' && <PickerFragment />}
    </div>
  );
}

function QuotaFragment() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[28px] font-bold leading-none">31.2 <span className="text-base font-medium">GB</span></p>
          <p className="mt-2 text-[11px] text-[#6B6B6B]">used of 45 GB</p>
        </div>
        <div className="text-right">
          <p className="text-[15px] font-semibold">13.8 GB free</p>
          <p className="mt-2 text-[11px] text-[#6B6B6B]">available now</p>
        </div>
      </div>
      <div>
        <div className="flex h-4 overflow-hidden rounded-full bg-[#E5E5E5]">
          <span className="h-full w-[32%] bg-[#2563EB]" />
          <span className="h-full w-[22%] bg-[#16A34A]" />
          <span className="h-full w-[17%] bg-[#D97706]" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            ['V', '12.9 GB', '#2563EB'],
            ['S', '9.7 GB', '#16A34A'],
            ['A', '8.6 GB', '#D97706'],
          ].map(([initial, used, color]) => (
            <div key={initial} className="rounded-md border border-[#E5E5E5] p-3">
              <span className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              <p className="mt-3 text-[11px] font-medium">{initial}@gmail</p>
              <p className="mt-1 text-[10px] text-[#6B6B6B]">{used}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilesFragment() {
  const files = [
    ['Investor', 'PDF', 'victor', '#2563EB'],
    ['Homepage', 'WEBP', 'design', '#DC2626'],
    ['Sprint', 'MD', 'work', '#16A34A'],
    ['Archive', 'ZIP', 'personal', '#D97706'],
  ];

  return (
    <div className="h-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-[20px] font-semibold leading-none">Files</h3>
          <p className="mt-2 text-[11px] text-[#6B6B6B]">All accounts</p>
        </div>
        <span className="rounded-md bg-black px-3 py-1.5 text-[11px] text-white">Grid</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {files.map(([name, ext, account, color]) => (
          <div key={name} className="aspect-square rounded-lg border border-[#E5E5E5] bg-white p-2">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-md text-[8px] font-bold text-white" style={{ backgroundColor: color }}>
                {ext}
              </span>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            </div>
            <p className="mt-4 truncate text-[10px] font-semibold">{name}</p>
            <p className="mt-1 truncate text-[9px] text-[#6B6B6B]">{account}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PickerFragment() {
  return (
    <div className="h-full rounded-lg border border-[#E5E5E5] p-4">
      <h3 className="text-[18px] font-semibold leading-none">Choose destination</h3>
      <p className="mt-2 text-[11px] text-[#6B6B6B]">3 files ready to upload</p>
      <div className="mt-4 space-y-2">
        {[
          ['victor@gmail.com', '13.8 GB free', '#2563EB', true],
          ['studio@gmail.com', '5.3 GB free', '#16A34A', false],
          ['archive@gmail.com', '1.1 GB free', '#D97706', false],
        ].map(([email, free, color, active]) => (
          <div key={email as string} className={cn('flex items-center justify-between rounded-lg border px-3 py-2.5', active ? 'border-black' : 'border-[#E5E5E5]')}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color as string }} />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium">{email}</p>
                <p className="text-[10px] text-[#6B6B6B]">{free}</p>
              </div>
            </div>
            {active && <span className="ml-2 rounded bg-black px-2 py-1 text-[9px] font-semibold uppercase text-white">Suggested</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingCard({ plan, price, period, features, cta, popular }: { plan: string; price: string; period: string; features: string[]; cta: string; popular?: boolean }) {
  return (
    <article className="rounded-2xl bg-white p-8 text-black md:p-10">
      {popular && <span className="mb-4 inline-flex rounded bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-white">Most popular</span>}
      <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#6B6B6B]">{plan}</p>
      <div className="mt-5 flex items-end gap-3">
        <span className="text-[64px] font-extrabold leading-none">{price}</span>
        <span className="pb-2 text-[15px] text-[#6B6B6B]">{period}</span>
      </div>
      <div className="mt-8 space-y-3">
        {features.map((feature) => (
          <p key={feature} className="text-sm text-black">- {feature}</p>
        ))}
      </div>
      <Link href="/register" className="mt-9 flex h-12 w-full items-center justify-center rounded-md bg-black text-sm font-semibold text-white transition-colors hover:bg-[#1A1A1A]">
        {cta}
      </Link>
    </article>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B6B6B]">{title}</h3>
      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <a key={link} href="#" className="text-sm text-[#A3A3A3] transition-colors hover:text-white">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
