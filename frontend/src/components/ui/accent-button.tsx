import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "./button"

// Special Supervity branded buttons using exact brand colors

export const AccentButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "bg-supervity-lime text-supervity-black hover:bg-supervity-light-lime",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
AccentButton.displayName = "AccentButton"

export const NavyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "bg-supervity-navy text-supervity-white hover:bg-supervity-soft-blue",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
NavyButton.displayName = "NavyButton"

export const CoralButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "bg-supervity-coral-orange text-supervity-white hover:bg-supervity-light-pink",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
CoralButton.displayName = "CoralButton"
