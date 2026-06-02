import { useUploadStore } from '@/stores/upload.store';
import { cn } from '@/lib/utils';
import { X, File, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export function UploadQueue() {
  const { queue, dismiss } = useUploadStore();

  const activeItems = queue.filter((item) => item.status !== 'complete' && item.status !== 'error');
  const finishedItems = queue.filter((item) => item.status === 'complete' || item.status === 'error');

  // Auto-dismiss completed items after 3s
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    finishedItems.forEach(item => {
      if (item.status === 'complete') {
        const t = setTimeout(() => dismiss(item.id), 3000);
        timeouts.push(t);
      }
    });
    return () => timeouts.forEach(clearTimeout);
  }, [finishedItems, dismiss]);

  if (queue.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[320px] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {queue.map((item) => (
          <motion.div 
            key={item.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="w-full bg-white border border-border shadow-xl rounded-xl p-4 pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 bg-surface rounded-full p-1.5">
                {item.status === 'complete' ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : item.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-danger" />
                ) : item.status === 'verifying' ? (
                  <ShieldCheck className="w-4 h-4 text-accent" />
                ) : (
                  <File className="w-4 h-4 text-text-tertiary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[13px] font-medium text-text-primary truncate pr-2">{item.file.name}</p>
                  {(item.status === 'complete' || item.status === 'error') && (
                    <button onClick={() => dismiss(item.id)} className="text-text-tertiary hover:text-text-primary -mt-1 -mr-1 p-1 rounded-md transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                <div className="flex justify-between text-[11px] mb-2.5">
                  <span className="text-text-tertiary truncate max-w-[150px]">{item.accountEmail}</span>
                  {item.status === 'uploading' && (
                    <span className="text-accent font-medium font-mono tabular-nums">{item.progress}%</span>
                  )}
                  {item.status === 'verifying' && (
                    <span className="text-accent font-medium">Verifying</span>
                  )}
                </div>

                {item.status === 'uploading' || item.status === 'pending' || item.status === 'verifying' ? (
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                ) : null}

                {item.status === 'error' && (
                  <p className="text-[11px] text-danger bg-danger-subtle px-2 py-1 rounded mt-1.5">{item.error}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
