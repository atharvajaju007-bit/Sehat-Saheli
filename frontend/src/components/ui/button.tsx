import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-dusty-rose-500 text-white shadow-md hover:bg-dusty-rose-600 focus-visible:ring-dusty-rose-400",
        secondary: "bg-lavender-100 text-lavender-800 hover:bg-lavender-200 focus-visible:ring-lavender-400",
        outline: "border-2 border-dusty-rose-300 text-dusty-rose-600 hover:bg-dusty-rose-50 focus-visible:ring-dusty-rose-400",
        ghost: "text-dusty-rose-600 hover:bg-dusty-rose-50 focus-visible:ring-dusty-rose-400",
        sage: "bg-sage-500 text-white shadow-md hover:bg-sage-600 focus-visible:ring-sage-400",
        peach: "bg-warm-peach-400 text-warm-peach-900 shadow-md hover:bg-warm-peach-500 focus-visible:ring-warm-peach-400",
        destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
