import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUploadStore } from '@/stores/upload.store';
import { filesApi } from '@/lib/api/files.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

type GoogleUploadResponse = {
  id: string;
  name?: string;
  mimeType?: string;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uploadToGoogle(
  sessionUri: string,
  file: File,
  onProgress: (progress: number) => void
) {
  return new Promise<GoogleUploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', sessionUri);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.responseType = 'text';

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const googleFile = xhr.responseText ? JSON.parse(xhr.responseText) : null;

          if (!googleFile?.id) {
            reject(new Error('Google upload succeeded but did not return a file id'));
            return;
          }

          resolve(googleFile);
        } catch {
          reject(new Error('Google upload response was not valid JSON'));
        }
        return;
      }

      reject(new Error(`Google upload failed with status ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('Google upload failed'));
    xhr.send(file);
  });
}

export function useUpload() {
  const queryClient = useQueryClient();
  const { addToQueue, updateProgress, setStatus } = useUploadStore();

  const pollUploadCompletion = useCallback(async (sessionId: string) => {
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const session = await filesApi.getUploadSession(sessionId);
      if (session.status === 'COMPLETED') return session;
      if (session.status === 'FAILED' || session.status === 'EXPIRED') {
        throw new Error(`Upload ${session.status.toLowerCase()}`);
      }
      await wait(2500);
    }

    throw new Error('Upload verification timed out');
  }, []);

  const uploadOne = useCallback(
    async (file: File, accountId: string, accountEmail: string, parentId?: string) => {
      const queueId = crypto.randomUUID();

      try {
        const session = await filesApi.createSession({
          accountId,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          fileSize: file.size,
          parentId,
        });

        addToQueue([
          {
            id: queueId,
            sessionId: session.id,
            file,
            accountId,
            accountEmail,
            progress: 0,
            status: 'pending',
          },
        ]);

        setStatus(queueId, 'uploading');
        const googleFile = await uploadToGoogle(session.sessionUri, file, (progress) => {
          updateProgress(queueId, progress);
        });

        updateProgress(queueId, 100);
        setStatus(queueId, 'verifying');

        const completion = await filesApi.completeUpload(session.id, {
          driveFileId: googleFile.id,
          bytesUploaded: String(file.size),
        });

        if (completion.queued) {
          await pollUploadCompletion(session.id);
        }

        setStatus(queueId, 'complete');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.root() });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.list() });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        setStatus(queueId, 'error', message);
        toast.error(message);
      }
    },
    [addToQueue, pollUploadCompletion, queryClient, setStatus, updateProgress]
  );

  const uploadFiles = useCallback(
    async (files: File[], accountId: string, accountEmail: string, parentId?: string) => {
      await Promise.all(files.map((file) => uploadOne(file, accountId, accountEmail, parentId)));
    },
    [uploadOne]
  );

  return { uploadFiles };
}
