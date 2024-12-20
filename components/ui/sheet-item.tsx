"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface SheetItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuItem> {
  children: React.ReactNode;
  triggerChildren: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export const SheetItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  SheetItemProps
>(({ triggerChildren, children, side = "right", ...props }, ref) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem
          {...props}
          ref={ref}
          onSelect={(event) => {
            // event.preventDefault();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent side={side} className="sm:max-w-md">
        {children}
      </SheetContent>
    </Sheet>
  );
});

SheetItem.displayName = "SheetItem";
