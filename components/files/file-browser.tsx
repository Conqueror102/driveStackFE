import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Trash2, Upload, X } from 'lucide-react';
import { useBulkDeleteFiles, useBulkMoveFiles, useBulkRestoreFiles, useFiles } from '@/hooks/use-files';
import { useAccounts } from '@/hooks/use-accounts';
import { FileToolbar } from './file-toolbar';
import { FileList } from './file-list';
import { FileGrid } from './file-grid';
import { FileEmptyState } from './file-empty-state';
import { FileSkeleton } from './file-skeleton';
import type { FileType } from '@/types/file.types';
import { PageHeader } from '../common/page-header';
import { Button } from '@/components/ui/button';
import { useUploadStore } from '@/stores/upload.store';
import type { SortValue } from './file-toolbar';
import type { FileRecord } from '@/types/file.types';
import { FilePreviewPanel } from './file-preview-panel';
import { MoveFileSheet } from './move-file-sheet';
import { toast } from 'sonner';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { useUpgradeModal } from '@/components/billing/upgrade-modal-context';
import { ProBadge } from '@/components/billing/pro-badge';

export function FileBrowser() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [selectedType, setSelectedType] = useState<FileType | 'ALL'>('ALL');
  const [sortValue, setSortValue] = useState<SortValue>('modifiedAt:desc');
  const [parentId, setParentId] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<FileRecord[]>([]);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [moveFile, setMoveFile] = useState<FileRecord | null>(null);
  const { setIsOpen } = useUploadStore();
  const bulkDelete = useBulkDeleteFiles();
  const bulkRestore = useBulkRestoreFiles();
  const bulkMove = useBulkMoveFiles();
  const [sortBy, sortOrder] = sortValue.split(':') as ['name' | 'size' | 'modifiedAt', 'asc' | 'desc'];

  const canAccess = useSubscriptionStore((state) => state.canAccess);
  const { openUpgradeModal } = useUpgradeModal();

  const { data: accounts } = useAccounts();
  const { data: filesData, isLoading } = useFiles({
    search,
    accountId: selectedAccountId === 'all' ? undefined : selectedAccountId,
    fileType: selectedType === 'ALL' ? undefined : selectedType,
    parentId,
    sortBy,
    sortOrder,
    page,
    limit: 50,
  });

  const files = filesData?.data || [];
  const selectedIds = useMemo(() => new Set(selectedFiles.map((file) => file.id)), [selectedFiles]);
  const meta = filesData?.meta;
  const canGoBack = (meta?.page ?? page) > 1;
  const canGoForward = meta ? meta.page < meta.lastPage : false;

  const accountColorMap = useMemo(() => {
    const map = new Map<string, { bg: string; text: string; dot: string }>();
    accounts?.forEach((account) => {
      if (account.colorInfo) map.set(account.id, account.colorInfo);
    });
    return map;
  }, [accounts]);

  const openFolder = (folderId: string) => {
    setParentId(folderId);
    setPage(1);
    setSelectedFiles([]);
  };

  const toggleSelected = (file: FileRecord) => {
    setSelectedFiles((current) =>
      current.some((item) => item.id === file.id)
        ? current.filter((item) => item.id !== file.id)
        : [...current, file]
    );
  };

  const deleteSelected = () => {
    const filesToDelete = selectedFiles.map((file) => ({ accountId: file.account.id, driveFileId: file.driveFileId }));
    bulkDelete.mutate({ files: filesToDelete }, {
      onSuccess: () => {
        toast.success(`${filesToDelete.length} file${filesToDelete.length === 1 ? '' : 's'} moved to trash`, {
          action: {
            label: 'Undo',
            onClick: () => bulkRestore.mutate({ files: filesToDelete }),
          },
        });
        setSelectedFiles([]);
      },
    });
  };

  const moveSelected = (destinationAccountId: string) => {
    bulkMove.mutate({
      destinationAccountId,
      files: selectedFiles.map((file) => ({ sourceAccountId: file.account.id, driveFileId: file.driveFileId })),
    }, {
      onSuccess: () => setSelectedFiles([]),
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader
        title="Files"
        subtitle="All files across your accounts"
        count={filesData?.meta?.total}
      >
        <Button onClick={() => setIsOpen(true)} className="gap-2 bg-text-primary text-white hover:bg-text-primary/90 h-9">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
      </PageHeader>

      <FileToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        accounts={accounts || []}
        selectedAccountId={selectedAccountId}
        onAccountChange={(id) => {
          setSelectedAccountId(id);
          setPage(1);
        }}
        selectedType={selectedType}
        onTypeChange={(type) => {
          setSelectedType(type);
          setPage(1);
        }}
        sortValue={sortValue}
        onSortChange={(value) => {
          setSortValue(value);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {parentId && (
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setParentId(undefined);
              setPage(1);
            }}
            className="gap-2 bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to root
          </Button>
        </div>
      )}

      <div className="flex-1 min-h-0 relative mt-4">
        {isLoading ? (
          <FileSkeleton viewMode={viewMode} />
        ) : files.length === 0 ? (
          <FileEmptyState />
        ) : viewMode === 'list' ? (
          <FileList
            files={files}
            accountColorMap={accountColorMap}
            onOpenFolder={openFolder}
            onPreview={setPreviewFile}
            onMove={setMoveFile}
            selectionMode={selectedFiles.length > 0}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
          />
        ) : (
          <FileGrid
            files={files}
            accountColorMap={accountColorMap}
            onOpenFolder={openFolder}
            onPreview={setPreviewFile}
            onMove={setMoveFile}
            selectionMode={selectedFiles.length > 0}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
          />
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-[90] flex w-[min(680px,calc(100vw-32px))] -translate-x-1/2 items-center gap-3 rounded-xl border border-[#1f2937] bg-[#101114] px-4 py-3 text-white shadow-2xl">
          <button className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10" onClick={() => setSelectedFiles([])} aria-label="Cancel selection">
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold">{selectedFiles.length} selected</p>
            <p className="truncate text-[11px] text-zinc-400">Bulk operations use trash and can be undone.</p>
          </div>
          {!canAccess('bulk_operations') ? (
            <Button onClick={() => openUpgradeModal('bulk_operations')} className="bg-white text-black hover:bg-zinc-200">
              Unlock Bulk Operations <ProBadge className="ml-2" />
            </Button>
          ) : (
            <>
              <select
                className="h-8 rounded-lg border border-white/10 bg-white/10 px-2 text-[12px] text-white outline-none"
                defaultValue=""
                onChange={(event) => {
                  if (event.target.value) moveSelected(event.target.value);
                  event.currentTarget.value = '';
                }}
                disabled={bulkMove.isPending}
              >
                <option value="" className="text-black">Move to...</option>
                {(accounts || []).map((account) => (
                  <option key={account.id} value={account.id} className="text-black">{account.googleEmail}</option>
                ))}
              </select>
              <Button variant="destructive" onClick={deleteSelected} disabled={bulkDelete.isPending}>
                {bulkDelete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </Button>
            </>
          )}
        </div>
      )}

      {meta && meta.lastPage > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-[12px] text-text-secondary">
            Page {meta.page} of {meta.lastPage} - {meta.total} files
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canGoBack}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="gap-1.5 bg-white"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canGoForward}
              onClick={() => setPage((current) => current + 1)}
              className="gap-1.5 bg-white"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      <FilePreviewPanel file={previewFile} onClose={() => setPreviewFile(null)} onMove={setMoveFile} />
      {moveFile && (
        <MoveFileSheet file={moveFile} open={Boolean(moveFile)} onOpenChange={(open) => !open && setMoveFile(null)} />
      )}
    </div>
  );
}
