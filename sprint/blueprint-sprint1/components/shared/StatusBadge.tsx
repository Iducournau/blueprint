import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  icon?: LucideIcon;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ 
  label, 
  color = 'text-gray-700', 
  bgColor = 'bg-gray-100',
  icon: Icon,
  size = 'sm',
  className,
}: StatusBadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        color,
        bgColor,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      {label}
    </span>
  );
}
