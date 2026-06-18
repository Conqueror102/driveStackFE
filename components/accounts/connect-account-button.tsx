import { useConnectAccount, useAccounts } from '@/hooks/use-accounts';
import { Button } from '@/components/ui/button';
import { Lock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useUpgradeModal } from '@/components/billing/upgrade-modal-context';

const FREE_ACCOUNT_LIMIT = 2;

interface ConnectAccountButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ConnectAccountButton({ className, variant = "default", size = "default" }: ConnectAccountButtonProps) {
  const { mutate: connect, isPending } = useConnectAccount();
  const { data: accounts } = useAccounts();
  const isPro = useSubscriptionStore((state) => state.isPro);
  const { openUpgradeModal } = useUpgradeModal();

  const isAtLimit = !isPro() && (accounts?.length ?? 0) >= FREE_ACCOUNT_LIMIT;

  if (isAtLimit) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size={size}
              onClick={() => openUpgradeModal('connect_account_above_limit')}
              className={cn("gap-2 font-medium", className)}
            >
              <Lock className="w-4 h-4" />
              <span>Connect Account</span>
            </Button>
          }
        />
        <TooltipContent>Free plan: {FREE_ACCOUNT_LIMIT} accounts. Upgrade for unlimited.</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button 
      onClick={() => connect()} 
      disabled={isPending} 
      variant={variant}
      size={size}
      className={cn(
        variant === 'default' && "bg-text-primary text-white hover:bg-text-primary/90 active:scale-[0.98] transition-all",
        "gap-2 font-medium shadow-sm",
        className
      )}
    >
      <Plus className="w-4 h-4" />
      <span>Connect Account</span>
    </Button>
  );
}

