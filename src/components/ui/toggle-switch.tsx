import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 3D Toggle Switch Component
 * Inspired by Uiverse.io design with elevated thumb
 * Features: Smooth animation, shadow effect, raised thumb on hover
 */

export interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  activeColor?: string;
  inactiveColor?: string;
}

const sizeConfig = {
  sm: {
    width: "2em",
    height: "1em",
    fontSize: "14px",
  },
  md: {
    width: "2em",
    height: "1em",
    fontSize: "17px",
  },
  lg: {
    width: "2.2em",
    height: "1.1em",
    fontSize: "20px",
  },
};

const ToggleSwitch = React.forwardRef<HTMLLabelElement, ToggleSwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      className,
      size = "md",
      activeColor = "#888",
      inactiveColor = "#e8e8e8",
    },
    ref
  ) => {
    const config = sizeConfig[size];
    const outlineColor = "#000";
    const thumbColor = "#e8e8e8";

    return (
      <label
        ref={ref}
        className={cn(
          "relative inline-block",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        style={{
          width: config.width,
          height: config.height,
          fontSize: config.fontSize,
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="opacity-0 w-0 h-0"
        />
        <span
          className={cn(
            "absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-150",
            "box-border"
          )}
          style={{
            border: `2px solid ${outlineColor}`,
            backgroundColor: checked ? activeColor : inactiveColor,
            borderRadius: config.height,
          }}
        >
          <span
            className={cn(
              "absolute transition-all duration-150",
              "box-border",
              !disabled && checked && "hover:-translate-y-[0.3em]",
              !disabled && !checked && "hover:-translate-y-[0.3em]"
            )}
            style={{
              height: config.height,
              width: config.height,
              left: "-2px",
              bottom: "-2px",
              border: `2px solid ${outlineColor}`,
              borderRadius: "100%",
              backgroundColor: thumbColor,
              transform: checked
                ? `translateX(calc(${config.width} - ${config.height})) translateY(-0.2em)`
                : "translateY(-0.2em)",
              boxShadow: checked
                ? `0 0.2em 0 ${outlineColor}`
                : `0 0.2em 0 ${outlineColor}`,
            }}
          />
        </span>
      </label>
    );
  }
);

ToggleSwitch.displayName = "ToggleSwitch";

export { ToggleSwitch };
