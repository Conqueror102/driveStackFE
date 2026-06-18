'use client';

import { RotateCcw, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useBulkRestoreFiles, useTrashFiles } from '@/hooks/use-files';
import { formatBytes } from '@/lib/utils/bytes';
import { formatRelative } from '@/lib/utils/dates';
import { getFileTypeInfo } from '@/lib/utils/file-type';

export default function TrashPage() {
  const { data, isLoading } = useTrashFiles();
  const restore = useBulkRestoreFiles();
  const files = data?.data ?? [];

  const restoreFile = (file: any) => {
    restore.mutate({ files: [{ accountId: file.account.id, driveFileId: file.driveFileId }] });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Trash" subtitle="Files moved to Drive trash from DriveStack" count={data?.meta?.total ?? files.length} />

      {isLoading ? (
        <div className="h-80 rounded-xl border border-border bg-surface animate-pulse" />
      ) : files.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white text-center">
          <Trash2 className="mb-4 h-12 w-12 text-text-tertiary" />
          <h2 className="text-lg font-semibold text-text-primary">Trash is empty</h2>
          <p className="mt-2 text-[13px] text-text-secondary">Bulk delete and duplicate cleanup move files here first.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_120px_120px_110px] gap-4 border-b border-border bg-surface px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            <div>Name</div>
            <div>Size</div>
            <div>Deleted</div>
            <div className="text-right">Action</div>
          </div>
          {files.map((file: any) => {
            const info = getFileTypeInfo(file.mimeType);
            return (
              <div key={file.id} className="grid grid-cols-[1fr_120px_120px_110px] items-center gap-4 border-b border-border px-5 py-3 last:border-b-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface">
                    <info.icon className="h-4 w-4" style={{ color: info.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-text-primary">{file.name}</div>
                    <div className="truncate text-[12px] text-text-tertiary">{file.account.googleEmail}</div>
                  </div>
                </div>
                <div className="font-mono text-[12px] text-text-secondary">{formatBytes(file.sizeBytes)}</div>
                <div className="text-[12px] text-text-tertiary">{formatRelative(file.trashedAt || file.cachedAt || file.driveModifiedAt)}</div>
                <div className="text-right">
                  <Button variant="outline" size="sm" className="bg-white" onClick={() => restoreFile(file)} disabled={restore.isPending}>
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
