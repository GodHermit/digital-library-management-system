import { Spinner } from '@heroui/react';
import { ReactNode } from 'react';

interface IWidgetCardProps {
  label: ReactNode;
  value: ReactNode;
  valueIcon?: ReactNode;
  isLoading?: boolean;
}

export function WidgetCard({
  label,
  value,
  valueIcon,
  isLoading,
}: IWidgetCardProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-medium bg-default-100 p-3 transition-colors">
      <span className="flex gap-2 text-small font-medium text-default-500 transition-colors">
        {label}
      </span>
      <div className="flex items-center gap-x-3">
        {valueIcon}
        <span className="text-3xl font-bold text-foreground">
          {isLoading && <Spinner size="sm" />}
          {!isLoading && value}
        </span>
      </div>
    </div>
  );
}
