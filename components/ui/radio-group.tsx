"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div ref={ref} className={cn("grid gap-2", className)} {...props} />
      </RadioGroupContext.Provider>
    )
  },
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    const { value: groupValue, onValueChange } = React.useContext(RadioGroupContext)

    return (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="radio"
          id={id}
          value={value}
          checked={value === groupValue}
          onChange={() => onValueChange?.(value)}
          className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <div className="flex items-center justify-center">
          {value === groupValue && <div className="h-2.5 w-2.5 rounded-full bg-current" />}
        </div>
      </div>
    )
  },
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
