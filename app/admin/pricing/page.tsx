"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminApi, UpdatePricingDto } from '@/lib/api/admin.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminPricingPage() {
  const [ngnConfig, setNgnConfig] = useState({ productId: '', amount: 80000, interval: 'month', active: true });
  const [usdConfig, setUsdConfig] = useState({ productId: '', amount: 199, interval: 'month', active: true });

  const updateMutation = useMutation({
    mutationFn: (dto: UpdatePricingDto) => adminApi.updatePricing(dto),
    onSuccess: () => toast.success('Pricing updated successfully'),
    onError: () => toast.error('Failed to update pricing'),
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Pricing Configuration</h1>
        <p className="text-zinc-500 mt-1">Manage Dodo Product IDs and amounts.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 mb-4">Pro — Nigerian Naira (NGN)</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-700">Dodo Product ID</label>
              <Input 
                value={ngnConfig.productId} 
                onChange={e => setNgnConfig({...ngnConfig, productId: e.target.value})} 
                placeholder="e.g. prod_123"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Amount (kobo) = ₦{ngnConfig.amount / 100}</label>
                <Input 
                  type="number"
                  value={ngnConfig.amount} 
                  onChange={e => setNgnConfig({...ngnConfig, amount: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Interval</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  value={ngnConfig.interval}
                  onChange={e => setNgnConfig({...ngnConfig, interval: e.target.value})}
                >
                  <option value="month">Monthly</option>
                  <option value="year">Annually</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                onClick={() => updateMutation.mutate({ ...ngnConfig, currency: 'NGN' } as any)}
                disabled={updateMutation.isPending}
              >
                Save NGN changes
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-200 my-6" />

        <div>
          <h2 className="text-lg font-medium text-zinc-900 mb-4">Pro — US Dollar (USD)</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-700">Dodo Product ID</label>
              <Input 
                value={usdConfig.productId} 
                onChange={e => setUsdConfig({...usdConfig, productId: e.target.value})} 
                placeholder="e.g. prod_456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Amount (cents) = ${usdConfig.amount / 100}</label>
                <Input 
                  type="number"
                  value={usdConfig.amount} 
                  onChange={e => setUsdConfig({...usdConfig, amount: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Interval</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  value={usdConfig.interval}
                  onChange={e => setUsdConfig({...usdConfig, interval: e.target.value})}
                >
                  <option value="month">Monthly</option>
                  <option value="year">Annually</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                onClick={() => updateMutation.mutate({ ...usdConfig, currency: 'USD' } as any)}
                disabled={updateMutation.isPending}
              >
                Save USD changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
