import { useEffect, useState } from 'react';
import { FileRecord } from '@/types/file.types';
import { getFileTypeInfo } from '@/lib/utils/file-type';
import { formatBytes } from '@/lib/utils/bytes';
import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import { FileActionsMenu } from './file-actions-menu';

interface FileGridProps {
  files: FileRecord[];
  accountColorMap?: Map<string, { bg: string; text: string; dot: string }>;
  onOpenFolder?: (folderId: string) => void;
  onPreview?: (file: FileRecord) => void;
  onMove?: (file: FileRecord) => void;
  selectedIds?: Set<string>;
  selectionMode?: boolean;
  onToggleSelected?: (file: FileRecord) => void;
}

function FilePreview({ file }: { file: FileRecord }) {
  const initialSource = file.thumbnailLink ? 'direct' : file.thumbnailProxyUrl ? 'proxy' : 'icon';
  const [thumbnailSource, setThumbnailSource] = useState<'direct' | 'proxy' | 'icon'>(initialSource);
  const info = getFileTypeInfo(file.mimeType);

  useEffect(() => {
    setThumbnailSource(file.thumbnailLink ? 'direct' : file.thumbnailProxyUrl ? 'proxy' : 'icon');
  }, [file.thumbnailLink, file.thumbnailProxyUrl]);

  const imageSrc =
    thumbnailSource === 'direct'
      ? file.thumbnailLink
      : thumbnailSource === 'proxy'
        ? file.thumbnailProxyUrl
        : null;

  const handleImageError = () => {
    if (thumbnailSource === 'direct' && file.thumbnailProxyUrl && file.thumbnailProxyUrl !== file.thumbnailLink) {
      setThumbnailSource('proxy');
      return;
    }

    setThumbnailSource('icon');
  };

  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={file.name}
        fill
        unoptimized
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        referrerPolicy="no-referrer"
        onError={handleImageError}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
        <info.icon className="w-6 h-6" style={{ color: info.color }} />
      </div>
      <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">{info.label}</span>
    </div>
  );
}

export function FileGrid({ files, accountColorMap, onOpenFolder, onPreview, onMove, selectedIds, selectionMode, onToggleSelected }: FileGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20 stagger-children">
      {files.map(file => {
        const color = accountColorMap?.get(file.account.id) || { bg: '#EEF2FF', text: '#3730A3', dot: '#6366F1' };

        return (
          <div key={file.id} className="group relative border border-border rounded-xl bg-white overflow-hidden card-hover">
            {/* Thumbnail / Icon area */}
            <div className="aspect-[4/3] bg-surface relative flex items-center justify-center">
              <FilePreview file={file} />

              {/* Account color indicator */}
              <div
                className="absolute top-2 left-2 w-2 h-2 rounded-full ring-2 ring-white/80"
                style={{ backgroundColor: color.dot }}
              />
              <button
                type="button"
                onClick={() => onToggleSelected?.(file)}
                className={`absolute left-2 top-7 flex h-5 w-5 items-center justify-center rounded-md border bg-white transition-all ${selectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${selectedIds?.has(file.id) ? 'border-accent bg-accent text-white' : 'border-border text-transparent'}`}
                aria-label={`Select ${file.name}`}
              >
                <span className="h-2 w-2 rounded-sm bg-current" />
              </button>

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute top-2 right-2">
                <FileActionsMenu
                  file={file}
                  onMove={onMove}
                  onPreview={onPreview}
                  trigger={
                    <div
                      role="button"
                      tabIndex={0}
                      className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-text-secondary hover:text-text-primary opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all shadow-sm focus:outline-none"
                      aria-label={`Actions for ${file.name}`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </div>
                  }
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <button
                type="button"
                onClick={() => file.isFolder ? onOpenFolder?.(file.driveFileId) : onPreview?.(file)}
                className="text-[13px] font-medium text-text-primary truncate mb-1.5 max-w-full text-left hover:text-accent"
                title={file.name}
              >
                {file.name}
              </button>
              <div className="flex items-center justify-between">
                <div
                  className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium"
                  style={{ backgroundColor: color.bg, color: color.text }}
                  title={file.account.googleEmail}
                >
                  <span className="truncate max-w-[60px]">{file.account.googleEmail.split('@')[0]}</span>
                </div>
                <span className="text-[11px] text-text-tertiary font-mono tabular-nums">{formatBytes(file.sizeBytes)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
