'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Copy, ExternalLink, Loader2, ScanSearch, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useBulkDeleteFiles, useDuplicates, useTriggerDuplicateScan } from '@/hooks/use-files';
import { formatBytes } from '@/lib/utils/bytes';
import { formatRelative } from '@/lib/utils/dates';
import { getFileTypeInfo } from '@/lib/utils/file-type';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { FeatureGate } from '@/components/billing/feature-gate';
import { LockedFeaturePrompt } from '@/components/billing/locked-feature-prompt';

export default function DuplicatesPage() {
  const { data, isLoading } = useDuplicates();
  const scan = useTriggerDuplicateScan();
  const bulkDelete = useBulkDeleteFiles();
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  const selectedFiles = useMemo(() => {
    const files: Array<{ accountId: string; driveFileId: string }> = [];
    data?.groups.forEach((group) => {
      const groupSelected = selected[group.id];
      if (!groupSelected) return;
      group.files.forEach((file) => {
        if (groupSelected.has(file.id)) files.push({ accountId: file.accountId || file.account.id, driveFileId: file.driveFileId });
      });
    });
    return files;
  }, [data?.groups, selected]);

  const toggleFile = (groupId: string, fileId: string, groupSize: number) => {
    setSelected((current) => {
      const next = new Set(current[groupId] ?? []);
      if (next.has(fileId)) next.delete(fileId);
      else if (next.size < groupSize - 1) next.add(fileId);
      else toast.error('Keep at least one copy in each group');
      return { ...current, [groupId]: next };
    });
  };

  const deleteSelected = () => {
    bulkDelete.mutate({ files: selectedFiles }, {
      onSuccess: () => {
        toast.success(`${selectedFiles.length} duplicate file${selectedFiles.length === 1 ? '' : 's'} moved to trash`);
        setSelected({});
      },
    });
  };

  return (
    <FeatureGate
      feature="duplicate_detector"
      fallback={
        <div className="mx-auto max-w-6xl pb-24">
          <PageHeader title="Duplicates" subtitle="Review repeated files across connected accounts" />
          <div className="mt-8">
            <LockedFeaturePrompt
              feature="duplicate_detector"
              title="Duplicate Detector"
              description="Find identical files across all your accounts and free up storage with one click."
            />
          </div>
        </div>
      }
    >
    <div className="mx-auto max-w-6xl pb-24">
      <PageHeader
        title="Duplicates"
        subtitle="Review repeated files across connected accounts"
        count={data?.summary.groups}
      >
        <Button onClick={() => scan.mutate()} disabled={scan.isPending} className="gap-2 bg-text-primary text-white hover:bg-text-primary/90">
          {scan.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
          Scan now
        </Button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Summary label="Groups" value={String(data?.summary.groups ?? 0)} />
        <Summary label="Duplicate files" value={String(data?.summary.duplicateFiles ?? 0)} />
        <Summary label="Recoverable" value={formatBytes(data?.summary.recoverableBytes ?? '0')} />
      </div>

      {data?.summary.lastScannedAt && (
        <p className="mb-4 text-[12px] text-text-tertiary">Last scanned {formatRelative(data.summary.lastScannedAt)}</p>
      )}

      {isLoading ? (
        <div className="h-80 rounded-xl border border-border bg-surface animate-pulse" />
      ) : !data || data.groups.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
          <h2 className="text-lg font-semibold text-text-primary">No duplicates found</h2>
          <p className="mt-2 text-[13px] text-text-secondary">All your files across accounts are unique.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.groups.map((group) => {
            const info = getFileTypeInfo(group.files[0]?.mimeType || '');
            const groupSelected = selected[group.id] ?? new Set<string>();
            return (
              <div key={group.id} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-border bg-[#101114] px-5 py-4 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <info.icon className="h-4 w-4" style={{ color: info.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold">{group.name}</h3>
                    <p className="text-[12px] text-zinc-400">{formatBytes(group.sizeBytes)} per copy · {group.files.length} copies</p>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {group.files.map((file) => {
                    const checked = groupSelected.has(file.id);
                    const disabled = !checked && groupSelected.size >= group.files.length - 1;
                    return (
                      <div key={file.id} className={cn('grid grid-cols-[1fr_auto] gap-3 px-5 py-3 transition-colors', checked && 'bg-danger-subtle/60')}>
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-text-primary">{file.account.googleEmail}</div>
                          <div className="text-[12px] text-text-tertiary">Modified {formatRelative(file.driveModifiedAt)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.webViewLink && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(file.webViewLink!, '_blank', 'noopener,noreferrer')} aria-label="Open in Drive">
                              <ExternalLink className="h-4 w-4 text-text-secondary" />
                            </Button>
                          )}
                          <Button
                            variant={checked ? 'destructive' : 'outline'}
                            size="sm"
                            disabled={disabled}
                            onClick={() => toggleFile(group.id, file.id, group.files.length)}
                          >
                            {checked ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                            {checked ? 'Selected' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-[90] flex w-[min(620px,calc(100vw-32px))] -translate-x-1/2 items-center gap-3 rounded-xl border border-[#1f2937] bg-[#101114] px-4 py-3 text-white shadow-2xl">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold">{selectedFiles.length} duplicate{selectedFiles.length === 1 ? '' : 's'} selected</p>
            <p className="text-[11px] text-zinc-400">Will free approximately {formatBytes(BigInt(selectedFiles.length) * BigInt(data?.groups[0]?.sizeBytes ?? '0'))}</p>
          </div>
          <Button variant="ghost" onClick={() => setSelected({})} className="text-white hover:bg-white/10">Cancel</Button>
          <Button variant="destructive" onClick={deleteSelected} disabled={bulkDelete.isPending}>
            {bulkDelete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete selected
          </Button>
        </div>
      )}
    </div>
    </FeatureGate>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="text-[12px] font-medium text-text-secondary">{label}</div>
      <div className="mt-2 font-mono text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
    </div>
  );
}
