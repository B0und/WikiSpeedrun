import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "react-feather";



type DrawerContentProps = React.ComponentProps<typeof Dialog.Content>;

const ModalContent = React.forwardRef<React.ElementRef<typeof Dialog.Content>, DrawerContentProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2  flex-col   rounded-md bg-neutral-50 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:animate-contentShow dark:bg-dark-surface dark:text-dark-primary"
          {...props}
          ref={forwardedRef}
        >
          {children}

          <Dialog.Close asChild>
            <button
              className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full "
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    );
  }
);

ModalContent.displayName = "ModalContent";

const ModalRoot = Dialog.Root;
const ModalTitle = Dialog.Title;
const ModalDescription = Dialog.Description;
const ModalTrigger = Dialog.Trigger;
const ModalClose = Dialog.Close;

export { ModalContent, ModalRoot, ModalClose, ModalTrigger, ModalDescription, ModalTitle };
