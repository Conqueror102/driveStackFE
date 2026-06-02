import { useDragDrop } from '@/hooks/use-drag-drop';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

export function UploadZone() {
  const { isDragging } = useDragDrop();

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-6 sm:p-12 bg-white/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.05 }}
            className="w-full h-full max-h-[600px] border-2 border-dashed border-accent bg-accent/5 rounded-3xl flex flex-col items-center justify-center text-accent"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20 mb-6">
              <UploadCloud className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-semibold mb-3 tracking-tight">Drop files to upload</h2>
            <p className="text-[15px] font-medium opacity-80">We'll ask which account to route them to next.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
