'use client';

import { PageHeader } from '@/components/common/page-header';
import { ConnectAccountButton } from '@/components/accounts/connect-account-button';
import { AccountsList } from '@/components/accounts/accounts-list';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAccounts } from '@/hooks/use-accounts';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

export default function AccountsPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: accounts } = useAccounts();

  useEffect(() => {
    if (searchParams.get('connected') === 'true') {
      toast.success('Account connected successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
      window.history.replaceState({}, '', '/accounts');
    }

    if (searchParams.get('error') === 'oauth_failed') {
      toast.error('Google connection failed. Please try again.');
      window.history.replaceState({}, '', '/accounts');
    }
  }, [queryClient, searchParams]);

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in-up">
      <PageHeader 
        title="Accounts" 
        subtitle="Manage your connected Google accounts"
        count={accounts?.length}
      >
        <ConnectAccountButton />
      </PageHeader>
      
      <div className="mt-4">
        <AccountsList />
      </div>
    </div>
  );
}
