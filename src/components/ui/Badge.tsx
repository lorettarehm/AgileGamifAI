import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "bg-teal-100 text-teal-800 hover:bg-teal-200",
        secondary: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        purple: "bg-purple-200 text-purple-900 hover:bg-purple-300",
        success: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        warning: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        danger: "bg-rose-100 text-rose-800 hover:bg-rose-200",
        outline: "border border-teal-200 text-teal-700 bg-transparent hover:bg-teal-50"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className = "", variant, ...props }: BadgeProps) => {
  const isInteractive = props.onClick || props.onKeyDown;
  const tabIndex = isInteractive ? (props.tabIndex ?? 0) : undefined;
  const role = isInteractive ? (props.role ?? 'button') : undefined;
  
  return (
    <div 
      className={`${badgeVariants({ variant })} ${className} ${isInteractive ? 'cursor-pointer' : ''}`} 
      tabIndex={tabIndex}
      role={role}
      {...props} 
    />
  );
};

export { Badge, badgeVariants };