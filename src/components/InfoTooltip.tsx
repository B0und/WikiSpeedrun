import { AlertCircle } from "react-feather";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { useTranslation } from "../lingui";

interface InfoTooltipProps {
  children: React.ReactNode;
}
export const InfoTooltip = ({ children }: InfoTooltipProps) => {
  const t = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-3">
        {children}
        <AlertCircle className="text-primary-blue" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[400px] bg-white text-base shadow-lg dark:bg-dark-surface-secondary dark:text-dark-primary dark:shadow-dark-primary/10">
        <p>{t("All of the information is stored locally in your browser (because servers cost money)")}</p>
        <p>{t("If you clear your browser data or switch to another browser all of your data will be gone")}</p>
      </TooltipContent>
    </Tooltip>
  );
};
