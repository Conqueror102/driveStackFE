import { useUploadStore } from '@/stores/upload.store';
import { useAccounts } from '@/hooks/use-accounts';
import { useState, useRef, useEffect } from 'react';
import { AccountPicker } from './account-picker';
import { Button } from '@/components/ui/button';
import { X, File as FileIcon, Upload } from 'lucide-react';
import { formatBytes } from '@/lib/utils/bytes';
import { AnimatePresence, motion } from 'motion/react';
import { ConnectAccountButton } from '../accounts/connect-account-button';
import { useUpload } from '@/hooks/use-upload';

export function UploadStagingBar() {
  const { stagedFiles, stageFiles, clearStaged, isOpen, setIsOpen } = useUploadStore();
  const { uploadFiles } = useUpload();
  const { data: accounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When opening, reset state
  useEffect(() => {
    if (isOpen) {
      setSelectedAccountId(null);
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      stageFiles([...stagedFiles, ...Array.from(e.target.files)]);
    }
    // Reset input so the same files can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = () => {
    if (!selectedAccountId) return;
    const account = accounts?.find(a => a.id === selectedAccountId);
    if (!account) return;

    uploadFiles(stagedFiles, selectedAccountId, account.googleEmail);
    clearStaged();
  };

  const handleClose = () => {
    setIsOpen(false);
    clearStaged();
  };

  if (!isOpen) return null;

  const totalSize = stagedFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: '100%', scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: '100%', scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[101] p-4 pointer-events-none flex justify-center"
      >
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface/50">
            <div>
              <h3 className="text-[16px] font-semibold text-text-primary">Upload Files</h3>
              <p className="text-[13px] text-text-secondary mt-0.5">Select files and choose where to route them</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 text-text-tertiary hover:bg-white hover:text-text-primary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {/* Step 1: Files */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-text-primary uppercase tracking-wide">1. Files to upload</span>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-8 text-[12px]">
                  Add more files
                </Button>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </div>

              {stagedFiles.length === 0 ? (
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent-subtle transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-3" />
                  <p className="text-[14px] font-medium text-text-primary mb-1">Click to browse or drop files here</p>
                  <p className="text-[13px] text-text-secondary">Support for any file type</p>
                </div>
              ) : (
                <div className="bg-surface rounded-xl border border-border overflow-hidden">
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar divide-y divide-border">
                    {stagedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-white">
                        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                          <FileIcon className="w-4 h-4 text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-text-primary truncate">{file.name}</p>
                          <p className="text-[11px] text-text-tertiary font-mono">{formatBytes(file.size)}</p>
                        </div>
                        <button 
                          onClick={() => stageFiles(stagedFiles.filter((_, index) => index !== i))}
                          className="p-1.5 text-text-tertiary hover:text-danger hover:bg-danger-subtle rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="bg-surface px-4 py-2 border-t border-border flex justify-between items-center">
                    <span className="text-[12px] text-text-secondary">{stagedFiles.length} file(s)</span>
                    <span className="text-[12px] font-semibold text-text-primary font-mono tabular-nums">Total: {formatBytes(totalSize)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Account */}
            <AnimatePresence>
              {stagedFiles.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <span className="block text-[13px] font-semibold text-text-primary uppercase tracking-wide mb-3">
                    2. Route to account
                  </span>
                  
                  {!accounts || accounts.length === 0 ? (
                    <div className="border border-dashed border-border rounded-xl p-6 text-center bg-surface">
                      <p className="text-[14px] font-medium text-text-primary mb-1">No accounts connected</p>
                      <p className="text-[13px] text-text-secondary mb-4">You need to connect at least one Google Drive account to upload files.</p>
                      <div className="flex justify-center">
                        <ConnectAccountButton size="sm" />
                      </div>
                    </div>
                  ) : (
                    <AccountPicker 
                      accounts={accounts} 
                      selectedId={selectedAccountId} 
                      onSelect={setSelectedAccountId} 
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer actions */}
          <div className="px-5 py-4 border-t border-border bg-surface/50 flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleUpload} 
              disabled={stagedFiles.length === 0 || !selectedAccountId}
              className="gap-2 bg-accent text-white hover:bg-accent-hover transition-all active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              Upload {stagedFiles.length} file{stagedFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
