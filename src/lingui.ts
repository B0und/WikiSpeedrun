import { i18n } from "@lingui/core";
import { messages } from "./locales/en/messages.po";

i18n.loadAndActivate({ locale: "en", messages });

export { i18n };
