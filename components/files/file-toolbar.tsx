'use client';

import { Search, List, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileType } from '@/types/file.types';
import type { ConnectedAccount } from '@/types/account.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortValue = 'modifiedAt:desc' | 'modifiedAt:asc' | 'name:asc' | 'name:desc' | 'size:desc' | 'size:asc';

interface FileToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  accounts: ConnectedAccount[];
  selectedAccountId: string;
  onAccountChange: (id: string) => void;
  selectedType: FileType | 'ALL';
  onTypeChange: (type: FileType | 'ALL') => void;
  sortValue: SortValue;
  onSortChange: (sort: SortValue) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export function FileToolbar(props: FileToolbarProps) {
  const types: { label: string; value: FileType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Folders', value: 'FOLDER' },
    { label: 'Docs', value: 'DOCUMENT' },
    { label: 'PDFs', value: 'PDF' },
    { label: 'Images', value: 'IMAGE' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Other', value: 'OTHER' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search files..."
            className={cn(
              'w-full h-9 pl-9 pr-4 text-[13px] bg-white border border-border rounded-lg',
              'placeholder:text-text-tertiary text-text-primary',
              'focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10',
              'transition-all duration-200'
            )}
            value={props.search}
            onChange={(e) => props.onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <Select value={props.selectedAccountId} onValueChange={(value) => value && props.onAccountChange(value)}>
            <SelectTrigger className="w-[170px] bg-white h-9 text-[13px] border-border">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {props.accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.googleEmail}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={props.sortValue} onValueChange={(value) => props.onSortChange(value as SortValue)}>
            <SelectTrigger className="w-[145px] bg-white h-9 text-[13px] border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modifiedAt:desc">Newest</SelectItem>
              <SelectItem value="modifiedAt:asc">Oldest</SelectItem>
              <SelectItem value="name:asc">Name A-Z</SelectItem>
              <SelectItem value="name:desc">Name Z-A</SelectItem>
              <SelectItem value="size:desc">Largest</SelectItem>
              <SelectItem value="size:asc">Smallest</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden lg:flex items-center border border-border rounded-lg bg-white p-0.5 h-9 shrink-0">
            <button
              onClick={() => props.onViewModeChange('list')}
              className={cn(
                'p-1.5 rounded-md transition-all duration-150',
                props.viewMode === 'list' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => props.onViewModeChange('grid')}
              className={cn(
                'p-1.5 rounded-md transition-all duration-150',
                props.viewMode === 'grid' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => props.onTypeChange(type.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap',
              props.selectedType === type.value
                ? 'bg-text-primary text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { SortValue };
