"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminAuditPage() {
  const [emailSearch, setEmailSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.auditLog({ email: emailSearch }),
    queryFn: () => adminApi.getAuditLog({ email: emailSearch }),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Audit Log</h1>
        <p className="text-zinc-500 mt-1">Review admin and system actions.</p>
      </div>

      <div className="flex items-center gap-4">
        <Input 
          placeholder="Search by user email..." 
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          className="max-w-sm bg-white"
        />
        <Button variant="outline">Action filter</Button>
        <Button variant="outline">Date range</Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-zinc-600">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Entity</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
            ) : !data || data.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No logs found.</td></tr>
            ) : (
              data.map((log: any) => (
                <tr key={log.id} className="hover:bg-zinc-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{log.userEmail}</td>
                  <td className="px-6 py-4">{log.action}</td>
                  <td className="px-6 py-4">{log.entity}</td>
                  <td className="px-6 py-4 text-zinc-400">Click to expand</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
