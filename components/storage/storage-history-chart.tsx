'use client';

import { useMemo, useState } from 'react';
import { AreaChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStorageHistory } from '@/hooks/use-storage';
import { formatBytes } from '@/lib/utils/bytes';

const WIDTH = 760;
const HEIGHT = 260;
const PAD = 34;

export function StorageHistoryChart() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const { data, isLoading } = useStorageHistory(days);

  const chart = useMemo(() => {
    const snapshots = data?.snapshots ?? [];
    const accounts = data?.accounts ?? [];
    const dates = Array.from(new Set(snapshots.map((snapshot) => snapshot.takenAt.slice(0, 10)))).sort();
    const max = Math.max(1, ...snapshots.map((snapshot) => Number(snapshot.usedBytes)));
    const colors = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];

    const lines = accounts.map((account, accountIndex) => {
      const points = dates.map((date, index) => {
        const hit = snapshots.find((snapshot) => snapshot.accountId === account.accountId && snapshot.takenAt.startsWith(date));
        const x = PAD + (dates.length <= 1 ? 0 : (index / (dates.length - 1)) * (WIDTH - PAD * 2));
        const y = HEIGHT - PAD - ((Number(hit?.usedBytes ?? 0) / max) * (HEIGHT - PAD * 2));
        return { x, y, value: Number(hit?.usedBytes ?? 0), date };
      });
      return {
        account,
        color: colors[accountIndex % colors.length],
        d: points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' '),
        points,
      };
    });

    return { accounts, dates, lines, max };
  }, [data]);

  const hasEnoughData = chart.dates.length >= 2;

  return (
    <div className="mt-8 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-text-primary">Storage history</h2>
          <p className="mt-1 text-[12px] text-text-secondary">Daily used storage by account</p>
        </div>
        <div className="flex rounded-lg border border-border bg-surface p-0.5">
          {([7, 30, 90] as const).map((value) => (
            <Button
              key={value}
              variant={days === value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setDays(value)}
              className="h-7 px-3"
            >
              {value}d
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[260px] rounded-lg bg-surface animate-pulse" />
      ) : !hasEnoughData ? (
        <div className="flex h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/60 text-center">
          <AreaChart className="mb-3 h-10 w-10 text-text-tertiary" />
          <p className="text-[14px] font-semibold text-text-primary">Storage history builds over time.</p>
          <p className="mt-1 text-[12px] text-text-secondary">Check back tomorrow for your first trend line.</p>
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[260px] min-w-[720px] w-full">
            <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} stroke="#E8E8E5" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} stroke="#E8E8E5" />
            {[0.25, 0.5, 0.75, 1].map((tick) => {
              const y = HEIGHT - PAD - tick * (HEIGHT - PAD * 2);
              return (
                <g key={tick}>
                  <line x1={PAD} y1={y} x2={WIDTH - PAD} y2={y} stroke="#F1F1EF" />
                  <text x={6} y={y + 4} className="fill-text-tertiary text-[10px]">{formatBytes(chart.max * tick, 0)}</text>
                </g>
              );
            })}
            {chart.lines.map((line) => (
              <g key={line.account.accountId}>
                <path d={line.d} fill="none" stroke={line.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {line.points.map((point) => (
                  <circle key={`${line.account.accountId}-${point.date}`} cx={point.x} cy={point.y} r="3" fill={line.color}>
                    <title>{`${point.date} · ${line.account.googleEmail} · ${formatBytes(point.value)}`}</title>
                  </circle>
                ))}
              </g>
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap gap-4">
            {chart.lines.map((line) => (
              <div key={line.account.accountId} className="flex items-center gap-2 text-[12px] text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
                <span>{line.account.googleEmail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
