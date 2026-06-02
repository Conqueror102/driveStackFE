import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { useFiles } from '@/hooks/use-files';
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

export function FileBrowser() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [selectedType, setSelectedType] = useState<FileType | 'ALL'>('ALL');
  const [sortValue, setSortValue] = useState<SortValue>('modifiedAt:desc');
  const [parentId, setParentId] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const { setIsOpen } = useUploadStore();
  const [sortBy, sortOrder] = sortValue.split(':') as ['name' | 'size' | 'modifiedAt', 'asc' | 'desc'];

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
          <FileList files={files} accountColorMap={accountColorMap} onOpenFolder={openFolder} />
        ) : (
          <FileGrid files={files} accountColorMap={accountColorMap} onOpenFolder={openFolder} />
        )}
      </div>

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
    </div>
  );
}
