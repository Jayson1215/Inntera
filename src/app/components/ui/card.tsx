import * as React from "react"

import { cn } from "@/app/components/ui/utils"

// ===== COLOR CONFIGURATION =====
// Easily adjust these colors to change the entire card theme
const CARD_COLORS = {
  // Main card background
  bgLight: "bg-white",
  bgDark: "dark:bg-emerald-950",
  
  // Borders
  borderLight: "border-slate-200",
  borderDark: "dark:border-emerald-700",
  
  // Header background - Professional teal/emerald
  headerBgLight: "bg-emerald-50",
  headerBgDark: "dark:bg-emerald-900",
  
  // Title text - Professional teal/emerald
  titleColorLight: "text-emerald-700",
  titleColorDark: "dark:text-emerald-300",
  
  // Description text
  descColorLight: "text-slate-600",
  descColorDark: "dark:text-slate-300",
  
  // Shadow
  shadow: "shadow-md hover:shadow-lg transition-shadow",
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `rounded-lg border ${CARD_COLORS.borderLight} ${CARD_COLORS.bgLight} text-slate-950 ${CARD_COLORS.shadow} ${CARD_COLORS.bgDark} ${CARD_COLORS.borderDark} dark:text-slate-50`,
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`flex flex-col space-y-1.5 p-6 ${CARD_COLORS.headerBgLight} ${CARD_COLORS.headerBgDark} border-b ${CARD_COLORS.borderLight} ${CARD_COLORS.borderDark}`, className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      `text-2xl font-bold leading-none tracking-tight ${CARD_COLORS.titleColorLight} ${CARD_COLORS.titleColorDark}`,
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(`text-sm ${CARD_COLORS.descColorLight} ${CARD_COLORS.descColorDark}`, className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`flex items-center p-6 pt-0 border-t ${CARD_COLORS.borderLight} ${CARD_COLORS.borderDark}`, className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

