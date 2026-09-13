import { toast } from "react-hot-toast";
import type { Achievement } from "../achievements";
import type { Translate } from "../lingui";

export const achievementToast = (achievement: Achievement, translate: Translate) => {
  toast(
    (toastInstance) => {
      const achievementTitle = translate(`${achievement.id}.title`);

      return (
        <button
          type="button"
          onClick={() => {
            toast.dismiss(toastInstance.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toast.dismiss(toastInstance.id);
            }
          }}
          className="flex min-w-[350px] max-w-[350px] animate-drawerSlideInRight cursor-pointer items-center gap-4 rounded-lg bg-primary-blue p-4 text-white shadow-lg shadow-slate-950/25 sm:min-w-[150px] sm:max-w-[150px] dark:shadow-slate-50/25"
        >
          <img
            className="h-[82px] w-[82px] rounded-md object-cover sm:h-[32px] sm:w-[32px]"
            src={achievement.imgUrl ?? "/trophy.svg"}
            alt={achievement.imgAlt ?? translate("Prize trophy")}
          />
          <div className="flex flex-col gap-1">
            <p className="text-lg dark:text-[#f8f8f8]">{translate("Achievement unlocked")}</p>
            <p className="font-semibold dark:text-[#f8f8f8]">{achievementTitle}</p>
          </div>
        </button>
      );
    },
    {
      duration: 10000,
      position: "bottom-right",
      style: {
        border: "none",
        padding: 0,
        background: "transparent",
        boxShadow: "none",
        maxWidth: "unset",
      },
    },
  );
};
