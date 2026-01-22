import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 3D Push Button Component
 * Clean, compact design with subtle depth effect
 */

export interface PushButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles = {
  default: {
    bg: "#f5f5f5",
    border: "#d4d4d4",
    shadow: "#a3a3a3",
    text: "#171717",
  },
  accent: {
    bg: "#34B27B",
    border: "#22945f",
    shadow: "#1a5d3f",
    text: "#ffffff",
  },
  danger: {
    bg: "#ef4444",
    border: "#dc2626",
    shadow: "#b91c1c",
    text: "#ffffff",
  },
  ghost: {
    bg: "#fafafa",
    border: "#e5e5e5",
    shadow: "#d4d4d4",
    text: "#171717",
  },
};

const sizeStyles = {
  sm: {
    fontSize: "12px",
    padding: "6px 12px",
    borderRadius: "8px",
  },
  md: {
    fontSize: "13px",
    padding: "8px 16px",
    borderRadius: "10px",
  },
  lg: {
    fontSize: "14px",
    padding: "10px 20px",
    borderRadius: "12px",
  },
};

const PushButton = React.forwardRef<HTMLButtonElement, PushButtonProps>(
  ({ className, variant = "default", size = "md", children, disabled, style, ...props }, ref) => {
    const colors = variantStyles[variant];
    const sizing = sizeStyles[size];

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold cursor-pointer transition-all duration-100 active:translate-y-[2px]",
          disabled && "opacity-50 cursor-not-allowed active:translate-y-0",
          className
        )}
        style={{
          fontSize: sizing.fontSize,
          padding: sizing.padding,
          borderRadius: sizing.borderRadius,
          background: colors.bg,
          color: colors.text,
          border: `1.5px solid ${colors.border}`,
          boxShadow: `0 3px 0 0 ${colors.shadow}`,
          ...style,
        }}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PushButton.displayName = "PushButton";

export { PushButton };
