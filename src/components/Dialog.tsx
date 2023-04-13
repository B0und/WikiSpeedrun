import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "react-feather";
import { Dispatch, SetStateAction } from "react";

interface ModalDisplayProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  triggerNode?: React.ReactNode;
  descriptionNode: React.ReactNode;
  contentNode?: React.ReactNode;
  title: string;
}


TODO fix this awful modal api
extract parts into exports and use them
export const ModalDisplay = (props: ModalDisplayProps) => {
  const { triggerNode, descriptionNode, title, contentNode, defaultOpen, onOpenChange, open } =
    props;
  props.open;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {triggerNode}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className=" fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]  flex-col   rounded-md bg-neutral-50 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:animate-contentShow dark:bg-dark-surface dark:text-dark-primary">
          <Dialog.Title className="m-0 border-b-[1px] border-b-secondary-border text-lg font-medium">
            {title}
          </Dialog.Title>

          <Dialog.Description className="mb-5 mt-[10px] text-sm leading-normal" asChild>
            {descriptionNode}
          </Dialog.Description>

          {contentNode}

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
    </Dialog.Root>
  );
};
