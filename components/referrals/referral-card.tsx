'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function ReferralCard() {
  const user = useAuthStore((state) => state.user);
  const [copied, setCopied] = useState(false);

  // Generate referral code from user id or display name
  const referralCode = user?.displayName
    ? user.displayName.replace(/\s+/g, '').toUpperCase().slice(0, 10) + user.id.slice(0, 4).toUpperCase()
    : user?.id?.slice(0, 8).toUpperCase() ?? 'CODE';

  const referralUrl = `https://drivestack.app/r/${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`I'm using DriveStack to manage all my Google Drive accounts in one place. Sign up here: ${referralUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`I'm using DriveStack to manage all my Google Drive accounts in one place. Check it out: ${referralUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <h3 className="text-[15px] font-semibold text-text-primary mb-4">Your referral link</h3>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-surface rounded-lg px-4 py-2.5 text-[14px] text-text-primary font-mono border border-border truncate">
          {referralUrl}
        </div>
        <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
      </div>

      <p className="text-[13px] text-text-secondary mb-5">
        Share this link. When someone upgrades to Pro, you earn +1 account slot permanently.
      </p>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleWhatsAppShare}>
          <Share2 className="h-3.5 w-3.5" />
          Share on WhatsApp
        </Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleTwitterShare}>
          <Share2 className="h-3.5 w-3.5" />
          Share on Twitter
        </Button>
      </div>
    </div>
  );
}
