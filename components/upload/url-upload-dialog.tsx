'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link2, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AccountPicker } from './account-picker';
import { useAccounts } from '@/hooks/use-accounts';
import { useUploadFromUrl } from '@/hooks/use-files';

function filenameFromUrl(value: string) {
  try {
    const url = new URL(value);
    const last = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '');
    return last || 'download';
  } catch {
    return '';
  }
}

export function UrlUploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: accounts = [] } = useAccounts();
  const upload = useUploadFromUrl();
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [accountId, setAccountId] = useState<string | null>(null);
  const parsedName = useMemo(() => filenameFromUrl(url), [url]);

  useEffect(() => {
    if (!fileName && parsedName) setFileName(parsedName);
  }, [fileName, parsedName]);

  useEffect(() => {
    if (open && !accountId) {
      const sorted = [...accounts].sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));
      setAccountId(sorted[0]?.id ?? null);
    }
  }, [accountId, accounts, open]);

  const canSubmit = Boolean(url && accountId && fileName && !upload.isPending);

  const submit = () => {
    if (!canSubmit || !accountId) return;
    upload.mutate({ url, fileName, accountId }, {
      onSuccess: () => {
        setUrl('');
        setFileName('');
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[140] sm:max-w-xl p-0 overflow-hidden">
        <DialogHeader className="border-b border-border bg-[#101114] px-5 py-4 text-white">
          <DialogTitle className="flex items-center gap-2 text-white">
            <Link2 className="h-4 w-4 text-blue-300" />
            Upload from URL
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Paste a direct file link and DriveStack will save it server-side.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-5 py-5">
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-text-secondary">File URL</label>
            <Input
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setFileName(filenameFromUrl(event.target.value));
              }}
              placeholder="https://example.com/report.pdf"
              className="h-10"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-text-secondary">Filename</label>
            <Input value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="report.pdf" className="h-10" />
          </div>
          <div>
            <label className="mb-3 block text-[12px] font-semibold uppercase tracking-wide text-text-secondary">Upload to</label>
            <AccountPicker accounts={accounts} selectedId={accountId} onSelect={setAccountId} />
          </div>
        </div>
        <DialogFooter className="px-5">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!canSubmit} className="bg-text-primary text-white hover:bg-text-primary/90">
            {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Upload from URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
