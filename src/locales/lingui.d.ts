import type { MessageId } from "./messages";

declare module "@lingui/core" {
  interface Register {
    messageIds: MessageId;
  }
}
