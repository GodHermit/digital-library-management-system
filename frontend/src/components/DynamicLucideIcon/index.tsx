import { FileWarningIcon, icons, LucideProps } from 'lucide-react';

interface LucideIconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons | string;
}

export function DynamicLucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = icons[name as keyof typeof icons] || FileWarningIcon;

  return <Icon {...props} />;
}
