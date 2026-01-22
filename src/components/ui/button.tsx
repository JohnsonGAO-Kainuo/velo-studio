import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* 
 * Velo Studio Button Component
 * Design inspired by Cap.so - Clean, modern, professional
 * Features: Rounded corners (22px), subtle shadows, smooth transitions
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary dark button - main CTAs
        default:
          "bg-[#202020] text-[#cfcfcf] border border-[#353535] rounded-[22px] shadow-sm hover:bg-[#2a2a2a] hover:shadow-md active:scale-[0.98]",
        // Destructive - for delete/stop actions  
        destructive:
          "bg-destructive text-destructive-foreground rounded-[22px] shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
        // Outline - secondary actions
        outline:
          "border border-[#e3e3e3] bg-white text-[#5c5c5c] rounded-[22px] shadow-sm hover:bg-[#f8f8f8] hover:border-[#d0d0d0] active:scale-[0.98]",
        // Secondary - subtle actions
        secondary:
          "bg-[#e7e7e7] text-[#5c5c5c] rounded-[18px] hover:bg-[#dcdcdc] active:scale-[0.98]",
        // Ghost - minimal style
        ghost: 
          "text-[#5c5c5c] hover:bg-[#f0f0f0] rounded-lg active:scale-[0.98]",
        // Link style
        link: 
          "text-[#5c5c5c] underline-offset-4 hover:underline hover:text-[#3a3a3a]",
        // Success/Accent - for positive actions
        accent:
          "bg-[#34B27B] text-white border border-[#2a9a6a] rounded-[22px] shadow-sm hover:bg-[#2da06e] active:scale-[0.98]",
        // Recording state - red (no pulse animation for a calmer UX)
        recording:
          "bg-[#ef4444] text-white border border-[#dc2626] rounded-[22px] shadow-sm hover:bg-[#dc2626] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs rounded-[16px]",
        lg: "h-12 px-8 text-base rounded-[22px]",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
