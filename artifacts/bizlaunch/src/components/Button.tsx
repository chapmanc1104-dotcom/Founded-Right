import { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-display font-semibold transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-[0_4px_14px_0_hsl(var(--primary)/30%)] hover:shadow-[0_6px_20px_0_hsl(var(--primary)/40%)] hover:-translate-y-0.5",
      secondary: "bg-secondary text-secondary-foreground shadow-[0_4px_14px_0_hsl(var(--secondary)/30%)] hover:shadow-[0_6px_20px_0_hsl(var(--secondary)/40%)] hover:-translate-y-0.5",
      outline: "border-2 border-primary/20 text-primary hover:border-primary/50 hover:bg-primary/5",
      ghost: "text-muted-foreground hover:text-primary hover:bg-primary/10",
    };

    const sizes = {
      sm: "h-9 px-4 rounded-lg text-sm",
      md: "h-12 px-6 rounded-xl text-base",
      lg: "h-14 px-8 rounded-2xl text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
