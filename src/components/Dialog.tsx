import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'react-feather';
import { Dispatch, SetStateAction } from 'react';

interface DialogDisplayProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  triggerNode: React.ReactNode;
  descriptionNode: React.ReactNode;
  contentNode: React.ReactNode;
  title: string;
}
export const DialogDisplay = (props: DialogDisplayProps) => {
  const { onOpenChange, open, triggerNode, descriptionNode, title, contentNode } = props;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {triggerNode}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className=" fixed top-[50%] left-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]  flex-col   rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:animate-contentShow dark:bg-dark-surface dark:text-dark-primary">
          <Dialog.Title className="m-0 border-b-[1px] border-b-secondary-border text-xl font-medium">
            {title}
          </Dialog.Title>

          <Dialog.Description className="mt-[10px] mb-5 text-sm leading-normal">
            {descriptionNode}
          </Dialog.Description>

          {contentNode}

          <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full "
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
