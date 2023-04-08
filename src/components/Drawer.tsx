import React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "react-feather";
import clsx from "clsx";

interface DialogContentBase {
  side?: "right" | "left";
  className?: string;
}
type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & DialogContentBase;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ children, side = "right", className, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className={clsx("fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-overlayShow")}
    />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={clsx(
        "fixed bottom-0 top-0 w-[250px] bg-white p-6 pt-8 shadow-2xl will-change-transform dark:bg-dark-surface-secondary dark:text-dark-primary",
        side === "right" && " right-0 data-[state=open]:animate-drawerSlideInRight",
        side === "left" && "left-0 data-[state=open]:animate-drawerSlideInLeft",
        className
      )}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-2 top-2" asChild>
        <button
          className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full "
          aria-label="Close"
        >
          <X />
        </button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DrawerContent.displayName = "DrawerContent";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerTitle = DialogPrimitive.Title;
const DrawerDescription = DialogPrimitive.Description;

export { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerTitle, DrawerDescription };
