import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils/bytes';
import { Check, Sparkles } from 'lucide-react';

interface AccountPickerProps {
  accounts: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  recommendedId?: string | null;
  requiredBytes?: number;
}

export function AccountPicker({ accounts, selectedId, onSelect, recommendedId, requiredBytes = 0 }: AccountPickerProps) {
  if (accounts.length === 0) {
    return <div className="text-sm text-text-tertiary text-center py-6">No accounts connected.</div>;
  }

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a.id === recommendedId) return -1;
    if (b.id === recommendedId) return 1;
    return Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault));
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {sortedAccounts.map((acc) => {
        const isSelected = selectedId === acc.id;
        const freeSpace = BigInt(acc.storageLimit) > BigInt(acc.storageUsed)
          ? BigInt(acc.storageLimit) - BigInt(acc.storageUsed)
          : BigInt(0);
        const fits = requiredBytes === 0 || freeSpace >= BigInt(requiredBytes);
        const isUsable = acc.status === 'ACTIVE' && fits;
        const labels = [
          acc.isDefault ? 'Default' : null,
          acc.id === recommendedId ? 'Recommended' : null,
        ].filter(Boolean).join(' · ');

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
                {isUsable ? `${formatBytes(freeSpace)} free` : !fits ? 'Not enough space' : acc.status.replaceAll('_', ' ').toLowerCase()}
              </div>
              {labels && (
                <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-text-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {acc.id === recommendedId && <Sparkles className="h-2.5 w-2.5" />}
                  {labels}
                </div>
              )}
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
