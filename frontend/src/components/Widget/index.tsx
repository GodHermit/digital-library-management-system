import { ReactNode } from 'react';

interface IWidgetCardProps {
  label: ReactNode;
  value: ReactNode;
  valueIcon?: ReactNode;
}

export function WidgetCard({ label, value, valueIcon }: IWidgetCardProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-medium p-3 transition-colors bg-default-100">
      <span className="flex gap-2 text-small font-medium transition-colors text-default-500">
        {label}
      </span>
      <div className="flex items-center gap-x-3">
        {valueIcon}
        <span className="text-3xl font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}
