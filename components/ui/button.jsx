import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { createTouchOptimizedHandler, getPerformanceSettings } from "@/lib/mobileOptimization"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const [performanceSettings, setPerformanceSettings] = React.useState(null);
  
  // Initialize performance settings
  React.useEffect(() => {
    setPerformanceSettings(getPerformanceSettings());
  }, []);
  
  // Touch-optimized click handler
  const handleClick = React.useMemo(() => {
    if (!onClick) return undefined;
    
    return createTouchOptimizedHandler((event) => {
      try {
        onClick(event);
      } catch (error) {
        console.error('Button click error:', error);
      }
    }, { 
      debounce: performanceSettings?.touchOptimization ? 100 : 50 
    });
  }, [onClick, performanceSettings]);

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      onClick={handleClick}
      style={{
        // Optimize for better interaction performance
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        // Prevent layout shifts during interactions
        willChange: 'auto',
        ...props.style
      }}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants } 