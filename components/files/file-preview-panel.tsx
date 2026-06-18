'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Download, ExternalLink, FileQuestion, Loader2, MoveRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilePreview } from '@/hooks/use-files';
import { filesApi } from '@/lib/api/files.api';
import { formatBytes } from '@/lib/utils/bytes';
import { formatRelative } from '@/lib/utils/dates';
import { getFileTypeInfo } from '@/lib/utils/file-type';
import type { FileRecord } from '@/types/file.types';

export function FilePreviewPanel({
  file,
  onClose,
  onMove,
}: {
  file: FileRecord | null;
  onClose: () => void;
  onMove: (file: FileRecord) => void;
}) {
  const preview = useFilePreview(file?.account.id ?? '', file?.driveFileId ?? '', Boolean(file));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key.toLowerCase() === 'd' && file?.webViewLink) window.open(file.webViewLink, '_blank', 'noopener,noreferrer');
    };
    if (file) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [file, onClose]);

  if (!file) return null;

  const info = getFileTypeInfo(file.mimeType);
  const streamUrl = filesApi.streamUrl(file.account.id, file.driveFileId);
  const mime = preview.data?.mimeType || file.mimeType;
  const src = preview.data?.type === 'stream' ? streamUrl : preview.data?.previewUrl;

  return (
    <aside className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-[520px] flex-col border-l border-border bg-white shadow-2xl">
      <div className="flex items-start gap-3 border-b border-border px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
          <info.icon className="h-5 w-5" style={{ color: info.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-text-primary">{file.name}</h3>
          <p className="mt-0.5 text-[12px] text-text-tertiary">{info.label}</p>
        </div>
        <div className="flex items-center gap-1">
          {file.webViewLink && (
            <Button variant="ghost" size="icon-sm" onClick={() => window.open(file.webViewLink!, '_blank', 'noopener,noreferrer')} aria-label="Open in Drive">
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => onMove(file)} aria-label="Move file">
            <MoveRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close preview">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#111214] p-4">
        {preview.isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-white/70" />
        ) : src && mime.startsWith('image/') ? (
          <Image src={src} alt={file.name} width={1200} height={900} unoptimized className="max-h-full max-w-full object-contain" />
        ) : src && mime.startsWith('video/') ? (
          <video src={src} controls className="max-h-full max-w-full" />
        ) : src && mime.startsWith('audio/') ? (
          <audio src={src} controls className="w-full" />
        ) : src && (mime.includes('pdf') || (preview.data?.type === 'embed' && !mime.startsWith('application/vnd.google-apps.'))) ? (
          <iframe src={src} title={file.name} className="h-full min-h-[520px] w-full rounded-lg border-0 bg-white" />
        ) : (
          <div className="text-center text-white">
            <FileQuestion className="mx-auto mb-4 h-12 w-12 text-white/50" />
            <p className="text-[14px] font-semibold">Preview unavailable</p>
            <p className="mt-1 text-[12px] text-white/60">Open the file in Drive or download it.</p>
            {file.webViewLink && (
              <Button className="mt-5 bg-white text-black hover:bg-white/90" onClick={() => window.open(file.webViewLink!, '_blank', 'noopener,noreferrer')}>
                <Download className="h-4 w-4" />
                Open file
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-border bg-surface/60 p-5 text-[12px]">
        <Meta label="Size" value={formatBytes(file.sizeBytes)} />
        <Meta label="Type" value={info.label} />
        <Meta label="Account" value={file.account.googleEmail} />
        <Meta label="Modified" value={formatRelative(file.driveModifiedAt)} />
      </div>
    </aside>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-white px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-text-tertiary">{label}</div>
      <div className="mt-1 truncate font-medium text-text-primary">{value}</div>
    </div>
  );
}
