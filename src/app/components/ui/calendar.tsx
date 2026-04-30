"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        month_caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-[11px] font-black text-stone-900 tracking-widest uppercase",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-6 w-6 bg-stone-50 p-0 opacity-100 hover:bg-stone-100 absolute left-1 z-20 border-stone-200 text-stone-900 rounded-md"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-6 w-6 bg-stone-50 p-0 opacity-100 hover:bg-stone-100 absolute right-1 z-20 border-stone-200 text-stone-900 rounded-md"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7 mb-1",
        weekday: "text-stone-400 font-bold text-[0.6rem] uppercase tracking-widest text-center h-8 flex items-center justify-center",
        week: "grid grid-cols-7 w-full mt-0.5",
        day: "h-8 w-8 text-center text-[11px] p-0 relative flex items-center justify-center",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 font-bold text-stone-800 hover:bg-emerald-600 hover:text-white transition-all rounded-lg aria-selected:opacity-100"
        ),
        selected: "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white focus:bg-emerald-600 focus:text-white rounded-lg shadow-md shadow-emerald-500/20",
        today: "bg-stone-100 text-emerald-600 font-black",
        outside: "day-outside text-stone-300 opacity-40 aria-selected:bg-stone-100/30 aria-selected:text-stone-400",
        disabled: "text-stone-200 opacity-30 cursor-not-allowed",
        range_middle: "aria-selected:bg-stone-50 aria-selected:text-stone-900",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("h-3 w-3", className)} {...props} />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };

