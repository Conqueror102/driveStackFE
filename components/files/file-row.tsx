import { FileRecord } from '@/types/file.types';
import { getFileTypeInfo } from '@/lib/utils/file-type';
import { formatBytes } from '@/lib/utils/bytes';
import { formatRelative } from '@/lib/utils/dates';
import { Badge } from '@/components/ui/badge';
import { Check, MoreVertical } from 'lucide-react';
import { FileActionsMenu } from './file-actions-menu';
import { cn } from '@/lib/utils';

interface FileRowProps {
  file: FileRecord;
  isDuplicate: boolean;
  accountColor?: { bg: string; text: string; dot: string };
  onOpenFolder?: (folderId: string) => void;
  onPreview?: (file: FileRecord) => void;
  onMove?: (file: FileRecord) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelected?: (file: FileRecord) => void;
}

export function FileRow({ file, isDuplicate, accountColor, onOpenFolder, onPreview, onMove, selectionMode, selected, onToggleSelected }: FileRowProps) {
  const info = getFileTypeInfo(file.mimeType);
  const color = accountColor || { bg: '#EEF2FF', text: '#3730A3', dot: '#6366F1' };

  return (
    <div
      className="group grid grid-cols-[1fr_120px_80px_100px_40px] gap-4 px-4 py-2.5 items-center hover:bg-surface/80 transition-all duration-150 rounded-lg mx-1 relative"
      style={{ borderLeft: `3px solid ${color.dot}` }}
    >
      {/* Name */}
      <div className="flex items-center min-w-0 gap-3">
        <button
          type="button"
          onClick={() => onToggleSelected?.(file)}
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all',
            selectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            selected ? 'border-accent bg-accent text-white' : 'border-border bg-white text-transparent hover:border-accent'
          )}
          aria-label={`Select ${file.name}`}
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
          <info.icon className="w-4 h-4" style={{ color: info.color }} />
        </div>
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => file.isFolder ? onOpenFolder?.(file.driveFileId) : onPreview?.(file)}
            className={cn(
              'text-[13px] font-medium text-text-primary truncate block text-left max-w-full',
              'hover:text-accent'
            )}
          >
            {file.name}
          </button>
          {isDuplicate && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[9px] bg-amber-50 text-amber-700 border-0 mt-0.5">
              Duplicate
            </Badge>
          )}
        </div>
      </div>
      
      {/* Account */}
      <div className="flex items-center min-w-0">
        <div
          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium max-w-full truncate"
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          <span className="truncate">{file.account.googleEmail.split('@')[0]}</span>
        </div>
      </div>

      {/* Size */}
      <div className="text-[12px] text-text-secondary font-mono tabular-nums">{formatBytes(file.sizeBytes)}</div>
      
      {/* Modified */}
      <div className="text-[12px] text-text-tertiary truncate">{formatRelative(file.driveModifiedAt)}</div>
      
      {/* Actions */}
      <div className="flex justify-end">
        <FileActionsMenu
          file={file}
          onMove={onMove}
          onPreview={onPreview}
          trigger={
            <div
              role="button"
              tabIndex={0}
              className="p-1 rounded-md text-text-tertiary hover:bg-white hover:text-text-primary opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Actions for ${file.name}`}
            >
              <MoreVertical className="w-4 h-4" />
            </div>
          }
        />
      </div>
    </div>
  );
}
