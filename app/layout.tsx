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
  title: {
    template: '%s | DriveStack',
    default: 'DriveStack — Unified Google Drive Management',
  },
  description: 'Connect multiple Google accounts and manage all your Drive storage from one unified command centre.',
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
