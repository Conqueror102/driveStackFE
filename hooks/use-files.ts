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
