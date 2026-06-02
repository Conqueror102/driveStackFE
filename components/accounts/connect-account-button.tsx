import { useConnectAccount } from '@/hooks/use-accounts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectAccountButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ConnectAccountButton({ className, variant = "default", size = "default" }: ConnectAccountButtonProps) {
  const { mutate: connect, isPending } = useConnectAccount();

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
