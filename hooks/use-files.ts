import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '@/lib/api/files.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { ListFilesParams } from '@/types/query.types';
import { toast } from 'sonner';

export function useFiles(params: ListFilesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.files.list(params),
    queryFn: () => filesApi.list(params),
  });
}

export function useFileLinks(accountId: string, fileId: string, enabled = false) {
  return useQuery({
    queryKey: QUERY_KEYS.files.links(accountId, fileId),
    queryFn: () => filesApi.links(accountId, fileId),
    enabled,
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, fileId }: { accountId: string; fileId: string }) =>
      filesApi.delete(accountId, fileId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.files.root() });
      
      const previousFiles = queryClient.getQueriesData({ queryKey: QUERY_KEYS.files.root() });
      
      queryClient.setQueriesData({ queryKey: QUERY_KEYS.files.root() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((f: any) => f.driveFileId !== variables.fileId),
        };
      });
      
      return { previousFiles };
    },
    onError: (err, variables, context) => {
      if (context?.previousFiles) {
        context.previousFiles.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to delete file');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.root() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
    },
    onSuccess: () => {
      toast.success('File deleted');
    }
  });
}

export function useFilePreview(accountId: string, fileId: string, enabled = false) {
  return useQuery({
    queryKey: QUERY_KEYS.files.preview(accountId, fileId),
    queryFn: () => filesApi.preview(accountId, fileId),
    enabled,
  });
}

export function useDuplicates() {
  return useQuery({
    queryKey: QUERY_KEYS.files.duplicates(),
    queryFn: filesApi.duplicates,
  });
}

export function useDuplicateCount() {
  return useQuery({
    queryKey: QUERY_KEYS.files.duplicateCount(),
    queryFn: filesApi.duplicateCount,
    staleTime: 60 * 1000,
  });
}

export function useTriggerDuplicateScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.triggerDuplicateScan,
    onSuccess: () => {
      toast.success('Duplicate scan queued');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.duplicates() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.duplicateCount() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activity.recent() });
    },
    onError: (error: any) => toast.error(error?.message || 'Unable to start scan'),
  });
}

export function useBulkDeleteFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.root() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.trash() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.duplicates() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.list() });
    },
    onError: (error: any) => toast.error(error?.message || 'Bulk delete failed'),
  });
}

export function useBulkRestoreFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.bulkRestore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.root() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.trash() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
    },
  });
}

export function useTrashFiles() {
  return useQuery({
    queryKey: QUERY_KEYS.files.trash(),
    queryFn: filesApi.trash,
  });
}

export function useBulkMoveFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.bulkMove,
    onSuccess: () => {
      toast.success('Move operations queued');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.moveHistory() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activity.recent() });
    },
    onError: (error: any) => toast.error(error?.message || 'Bulk move failed'),
  });
}

export function useUploadFromUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.uploadFromUrl,
    onSuccess: (_, variables) => {
      toast.success(`${variables.fileName || 'File'} saved`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.root() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activity.recent() });
    },
    onError: (error: any) => toast.error(error?.message || 'Upload from URL failed'),
  });
}

export function useMoveFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.move,
    onSuccess: (result) => {
      toast.success('Move queued');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.moveStatus(result.operationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.moveHistory() });
    },
    onError: (error: any) => toast.error(error?.message || 'Unable to move file'),
  });
}
