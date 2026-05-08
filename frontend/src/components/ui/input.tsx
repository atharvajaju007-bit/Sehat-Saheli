import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-2 border-dusty-rose-200 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm transition-all duration-200",
          "placeholder:text-gray-400",
          "focus:border-dusty-rose-400 focus:outline-none focus:ring-2 focus:ring-dusty-rose-100",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
