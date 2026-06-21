import type { Metadata } from 'next';
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import Providers from '@/providers/providers';
import { Toaster } from 'sonner';

const sansFont = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-geist-mono', weight: ['400', '500', '700'] });
const serifFont = Instrument_Serif({ subsets: ['latin'], variable: '--font-serif', style: ['italic', 'normal'], weight: ['400'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://drivestack.io'),
  title: {
    template: '%s | DriveStack',
    default: 'DriveStack — Unified Google Drive Management',
  },
  description: 'Connect multiple Google accounts, discover duplicates, and manage all your Drive storage from one unified command centre.',
  keywords: ['Google Drive', 'Storage Management', 'File Aggregator', 'Duplicate Finder', 'Cloud Storage'],
  authors: [{ name: 'DriveStack Team' }],
  creator: 'DriveStack',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'DriveStack — Unified Google Drive Management',
    description: 'Connect multiple Google accounts, discover duplicates, and manage all your Drive storage from one unified command centre.',
    siteName: 'DriveStack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DriveStack — Unified Google Drive Management',
    description: 'Connect multiple Google accounts, discover duplicates, and manage all your Drive storage from one unified command centre.',
    creator: '@drivestack',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", sansFont.variable, mono.variable, serifFont.variable)}>
      <body className="bg-background text-text-primary antialiased min-h-screen">
        <Providers>
          {children}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                borderRadius: '10px',
                fontSize: '13px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
