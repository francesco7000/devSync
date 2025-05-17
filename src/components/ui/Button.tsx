import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          // Variants
          variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
          variant === 'secondary' && 'bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-600',
          variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
          variant === 'outline' && 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
          variant === 'ghost' && 'hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs rounded-md',
          size === 'md' && 'h-10 px-4 py-2 text-sm rounded-md',
          size === 'lg' && 'h-12 px-6 py-3 text-base rounded-md',
          size === 'icon' && 'h-10 w-10 rounded-md',
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';