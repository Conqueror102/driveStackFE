'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hooks/use-accounts';
import { useMoveFile } from '@/hooks/use-files';
import { formatBytes } from '@/lib/utils/bytes';
import { cn } from '@/lib/utils';
import type { FileRecord } from '@/types/file.types';

export function MoveFileSheet({
  file,
  open,
  onOpenChange,
}: {
  file: FileRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: accounts = [] } = useAccounts();
  const moveFile = useMoveFile();
  const [destinationAccountId, setDestinationAccountId] = useState<string | null>(null);
  const fileSize = BigInt(file.sizeBytes || '0');

  const destinations = useMemo(
    () => accounts.filter((account) => account.id !== file.account.id),
    [accounts, file.account.id]
  );

  if (!open) return null;

  const submit = () => {
    if (!destinationAccountId) return;
    moveFile.mutate(
      {
        driveFileId: file.driveFileId,
        sourceAccountId: file.account.id,
        destinationAccountId,
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <div className="fixed inset-0 z-[120]">
      <button className="absolute inset-0 bg-black/20 backdrop-blur-sm" aria-label="Close move sheet" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl rounded-t-2xl border border-border bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-[16px] font-semibold text-text-primary">Move to another account</h3>
            <p className="mt-1 max-w-md truncate text-[13px] text-text-secondary">{file.name}</p>
          </div>
          <button className="rounded-lg p-2 text-text-tertiary hover:bg-surface hover:text-text-primary" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[50vh] space-y-2 overflow-y-auto p-5 custom-scrollbar">
          {destinations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-[13px] text-text-secondary">
              Connect another account before moving files.
            </div>
          ) : (
            destinations.map((account) => {
              const free = BigInt(account.storageLimit) > BigInt(account.storageUsed)
                ? BigInt(account.storageLimit) - BigInt(account.storageUsed)
                : BigInt(0);
              const fits = file.isFolder || free >= fileSize;
              const selected = destinationAccountId === account.id;
              return (
                <button
                  key={account.id}
                  type="button"
                  disabled={!fits || moveFile.isPending}
                  onClick={() => setDestinationAccountId(account.id)}
                  className={cn(
                    'grid w-full grid-cols-[36px_1fr_auto] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                    selected ? 'border-accent bg-accent-subtle ring-1 ring-accent/20' : 'border-border bg-white hover:border-border-strong hover:bg-surface',
                    !fits && 'cursor-not-allowed opacity-60'
                  )}
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: account.colorInfo?.dot }} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-text-primary">{account.googleEmail}</span>
                    <span className={cn('text-[12px]', fits ? 'text-text-secondary' : 'text-warning')}>
                      {fits ? `${formatBytes(free)} free` : 'Not enough space'}
                    </span>
                  </span>
                  <span className={cn('flex h-6 w-6 items-center justify-center rounded-full', selected ? 'bg-accent text-white' : 'bg-surface text-transparent')}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-border bg-surface/60 px-5 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!destinationAccountId || moveFile.isPending} onClick={submit} className="bg-text-primary text-white hover:bg-text-primary/90">
            {moveFile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Move file
          </Button>
        </div>
      </div>
    </div>
  );
}
