import { FC, ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  children?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, count, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">{title}</h1>
          {count !== undefined && (
            <span className="inline-flex items-center h-5 px-2 rounded-md bg-surface text-[11px] font-medium text-text-secondary font-mono tabular-nums">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[13px] text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {children && <div className="shrink-0 flex items-center gap-2">{children}</div>}
    </div>
  );
};
