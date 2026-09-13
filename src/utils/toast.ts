import { toast } from "react-hot-toast";

export const errorToast = (text: string) => toast.error(text, { position: "bottom-center" });
export const copyNotification = (text: string) => toast.success(text, { position: "top-center" });
