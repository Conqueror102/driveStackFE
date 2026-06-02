import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileRecord } from '@/types/file.types';
import { Download, ExternalLink, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDeleteFile } from '@/hooks/use-files';
import { filesApi } from '@/lib/api/files.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { ConfirmDialog } from '@/components/common/confirm-dialog';

export function FileActionsMenu({ file, trigger }: { file: FileRecord; trigger: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { mutate: deleteFile, isPending } = useDeleteFile();
  const [confirmOpen, setConfirmOpen] = useState(false);

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
          {file.webViewLink && (
            <DropdownMenuItem onClick={() => window.open(file.webViewLink!, '_blank', 'noopener,noreferrer')} className="gap-2">
              <ExternalLink className="w-4 h-4" /> Open in Drive
            </DropdownMenuItem>
          )}
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
        description={`This will permanently delete "${file.name}" from Google Drive. This action cannot be undone from DriveStack.`}
        confirmText={isPending ? 'Deleting...' : 'Delete file'}
        destructive
        onConfirm={() => deleteFile({ accountId: file.account.id, fileId: file.driveFileId })}
      />
    </>
  );
}
