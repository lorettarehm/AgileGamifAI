import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-blue-800",
        secondary: "bg-teal-100 text-teal-800",
        purple: "bg-purple-100 text-purple-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-red-100 text-red-800",
        outline: "border border-gray-200 text-gray-700 bg-transparent"
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
  return (
    <div className={`${badgeVariants({ variant })} ${className}`} {...props} />
  );
};

export { Badge, badgeVariants };