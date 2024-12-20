"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { type ForwardRefRenderFunction } from "react";

interface DialogItemProps {
  children: React.ReactNode;
  triggerChildren: React.ReactNode;
}

export const DialogItem = React.forwardRef(
  (
    { triggerChildren, children, ...props }: DialogItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...props}
            ref={ref}
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  }
) as React.ForwardRefExoticComponent<DialogItemProps>;

DialogItem.displayName = "DialogItem";
