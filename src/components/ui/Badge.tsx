import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-teal-100 text-teal-800',
        secondary: 'bg-purple-100 text-purple-800',
        purple: 'bg-purple-200 text-purple-900',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        danger: 'bg-rose-100 text-rose-800',
        outline: 'border border-teal-200 text-teal-700 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className = '', variant, ...props }: BadgeProps) => {
  return <div className={`${badgeVariants({ variant })} ${className}`} {...props} />;
};

export { Badge, badgeVariants };
