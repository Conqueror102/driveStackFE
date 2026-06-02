'use client';

import { FileBrowser } from '@/components/files/file-browser';

export default function FilesPage() {
  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto min-h-[calc(100vh-8rem)]">
      <div className="flex-1 min-h-0">
        <FileBrowser />
      </div>
    </div>
  );
}
