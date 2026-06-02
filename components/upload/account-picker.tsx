import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils/bytes';
import { Check } from 'lucide-react';

interface AccountPickerProps {
  accounts: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AccountPicker({ accounts, selectedId, onSelect }: AccountPickerProps) {
  if (accounts.length === 0) {
    return <div className="text-sm text-text-tertiary text-center py-6">No accounts connected.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {accounts.map((acc) => {
        const isSelected = selectedId === acc.id;
        const freeSpace = BigInt(acc.storageLimit) > BigInt(acc.storageUsed)
          ? BigInt(acc.storageLimit) - BigInt(acc.storageUsed)
          : BigInt(0);
        const isUsable = acc.status === 'ACTIVE';

        return (
          <button
            key={acc.id}
            onClick={() => isUsable && onSelect(acc.id)}
            disabled={!isUsable}
            className={cn(
              "flex items-center p-4 rounded-xl border text-left transition-all duration-200 relative group outline-none",
              isSelected 
                ? "border-accent bg-accent-subtle shadow-sm ring-1 ring-accent/20" 
                : "border-border bg-white hover:border-border-strong hover:shadow-sm",
              !isUsable && "opacity-60 cursor-not-allowed hover:shadow-none"
            )}
          >
            <div 
              className="w-4 h-4 rounded-full shrink-0 mr-3 ring-4 ring-white"
              style={{ backgroundColor: acc.colorInfo.dot }}
            />
            <div className="min-w-0 flex-1 pr-6">
              <div className={cn(
                "text-[14px] font-medium truncate mb-0.5 transition-colors",
                isSelected ? "text-accent" : "text-text-primary"
              )}>
                {acc.googleEmail}
              </div>
              <div className={cn(
                "text-[12px] transition-colors",
                isSelected ? "text-accent/70" : "text-text-secondary"
              )}>
                {isUsable ? `${formatBytes(freeSpace)} free` : acc.status.replaceAll('_', ' ').toLowerCase()}
              </div>
            </div>
            
            {/* Checkmark icon */}
            <div className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 scale-0 opacity-0",
              isSelected && "scale-100 opacity-100 bg-accent text-white"
            )}>
              <Check className="w-3 h-3" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
