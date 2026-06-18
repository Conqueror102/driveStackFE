import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileRecord } from '@/types/file.types';
import { Download, ExternalLink, MoveRight, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDeleteFile } from '@/hooks/use-files';
import { filesApi } from '@/lib/api/files.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { ProBadge } from '@/components/billing/pro-badge';
import { useUpgradeModal } from '@/components/billing/upgrade-modal-context';
import { cn } from '@/lib/utils';

export function FileActionsMenu({
  file,
  trigger,
  onMove,
  onPreview,
}: {
  file: FileRecord;
  trigger: React.ReactNode;
  onMove?: (file: FileRecord) => void;
  onPreview?: (file: FileRecord) => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: deleteFile, isPending } = useDeleteFile();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canAccess = useSubscriptionStore((state) => state.canAccess);
  const { openUpgradeModal } = useUpgradeModal();

  const openDownload = async () => {
    try {
      const links = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.files.links(file.account.id, file.driveFileId),
        queryFn: () => filesApi.links(file.account.id, file.driveFileId),
        staleTime: 60 * 1000,
      });

      const exportUrl = links.exportLinks?.['application/pdf'] || Object.values(links.exportLinks ?? {})[0];
      const url = links.webContentLink || exportUrl || links.webViewLink;

      if (!url) {
        toast.error('No downloadable link is available for this file');
        return;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      toast.error(error?.message || 'Unable to load file links');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onPreview?.(file)} className="gap-2">
            <ExternalLink className="w-4 h-4" /> Preview
          </DropdownMenuItem>
          {file.webViewLink && (
            <DropdownMenuItem onClick={() => window.open(file.webViewLink!, '_blank', 'noopener,noreferrer')} className="gap-2">
              <ExternalLink className="w-4 h-4" /> Open in Drive
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              if (!canAccess('move_files')) {
                openUpgradeModal('move_files');
                return;
              }
              onMove?.(file);
            }}
            className={cn('gap-2', !canAccess('move_files') && 'opacity-50')}
          >
            <MoveRight className="w-4 h-4" /> Move account
            {!canAccess('move_files') && <ProBadge className="ml-auto" />}
          </DropdownMenuItem>
          {!file.isFolder && (
            <DropdownMenuItem onClick={openDownload} className="gap-2">
              <Download className="w-4 h-4" /> Download/export
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setConfirmOpen(true)}
            className="text-danger focus:bg-danger-subtle focus:text-danger gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Drive file"
        description={`This will move "${file.name}" to trash in Google Drive.`}
        confirmText={isPending ? 'Moving...' : 'Move to trash'}
        destructive
        onConfirm={() => deleteFile({ accountId: file.account.id, fileId: file.driveFileId })}
      />
    </>
  );
}
