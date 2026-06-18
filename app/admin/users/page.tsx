"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [upgradeNote, setUpgradeNote] = useState('');
  
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.users(),
    queryFn: () => adminApi.getUsers(),
  });

  const upgradeMutation = useMutation({
    mutationFn: (userId: string) => adminApi.manualUpgrade(userId, upgradeNote),
    onSuccess: () => {
      toast.success('User upgraded successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
      setSelectedUser(null);
      setUpgradeNote('');
    },
    onError: () => toast.error('Failed to upgrade user'),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Users</h1>
        <p className="text-zinc-500 mt-1">Manage users and manual upgrades.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-zinc-600">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Accounts</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
            ) : !data || data.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No users found.</td></tr>
            ) : (
              data.map((user: any) => (
                <tr key={user.id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4 font-medium text-zinc-900">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.plan === 'PRO' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-800'}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.status}</td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{user.accountCount}</td>
                  <td className="px-6 py-4">
                    {user.plan !== 'PRO' && (
                      <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                        Upgrade manually
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manually upgrade user</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason / note:</label>
              <Input 
                value={upgradeNote} 
                onChange={(e) => setUpgradeNote(e.target.value)} 
                placeholder="e.g. VIP client, support issue compensation"
              />
            </div>
            <p className="text-sm text-zinc-500">This grants 30 days of Pro access.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
            <Button 
              onClick={() => upgradeMutation.mutate(selectedUser.id)} 
              disabled={!upgradeNote.trim() || upgradeMutation.isPending}
            >
              {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
