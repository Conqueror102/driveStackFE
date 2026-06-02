import { FileRecord } from '@/types/file.types';
import { FileRow } from './file-row';

interface FileListProps {
  files: FileRecord[];
  accountColorMap?: Map<string, { bg: string; text: string; dot: string }>;
  onOpenFolder?: (folderId: string) => void;
}

export function FileList({ files, accountColorMap, onOpenFolder }: FileListProps) {
  return (
    <div className="flex flex-col gap-1 pb-20 stagger-children">
      {/* Header */}
      <div className="grid grid-cols-[1fr_120px_80px_100px_40px] gap-4 px-5 py-2 items-center text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1 mx-1">
        <div>Name</div>
        <div>Account</div>
        <div>Size</div>
        <div>Modified</div>
        <div className="text-right pr-2">Actions</div>
      </div>
      
      {/* Rows */}
      {files.map((file, index) => {
        // Simple logic for demonstrating duplicate UI:
        // If the previous file in the sorted list has the same name, mark this one as duplicate
        const isDuplicate = index > 0 && files[index - 1].name === file.name;
        const color = accountColorMap?.get(file.account.id);
        
        return (
          <FileRow 
            key={file.id} 
            file={file} 
            isDuplicate={isDuplicate}
            accountColor={color}
            onOpenFolder={onOpenFolder}
          />
        );
      })}
    </div>
  );
}
