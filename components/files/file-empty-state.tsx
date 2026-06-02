import { Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUploadStore } from '@/stores/upload.store';

export function FileEmptyState() {
  const router = useRouter();
  const { setIsOpen } = useUploadStore();

  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center animate-scale-in">
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-sm">
        <FolderOpen className="w-10 h-10 text-text-tertiary stroke-[1.5px]" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">No files found</h3>
      <p className="text-[13px] text-text-secondary max-w-sm mx-auto mb-8">
        Upload your first file or connect another Google account to see more files here.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => setIsOpen(true)} className="gap-2 bg-text-primary text-white hover:bg-text-primary/90 shadow-sm transition-all active:scale-95">
          <Upload className="w-4 h-4" />
          Upload a file
        </Button>
        <Button onClick={() => router.push('/accounts')} variant="outline" className="gap-2 bg-white text-text-primary border-border hover:bg-surface transition-all active:scale-95">
          Connect an account
        </Button>
      </div>
    </div>
  );
}
