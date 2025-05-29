"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number[]
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseInt(e.target.value)
      onValueChange?.([newValue])
    }

    const percentage = (((value[0] || 0) - (min || 0)) / ((max || 100) - (min || 0))) * 100

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <div className="absolute h-full bg-primary" style={{ width: `${percentage}%` }} />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          {...props}
        />
        <div
          className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    )
  },
)
Slider.displayName = "Slider"

export { Slider }
