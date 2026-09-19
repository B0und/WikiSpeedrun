import { toast } from "react-hot-toast";
import type { Achievement } from "../achievements";
type AchievementToastText = {
  title: string;
  imageAlt: string;
  unlocked: string;
};

export const achievementToast = (achievement: Achievement, text: AchievementToastText) => {
  toast(
    (toastInstance) => {
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
          className="flex max-w-[350px] min-w-[350px] animate-drawerSlideInRight cursor-pointer items-center gap-4 rounded-lg bg-primary-blue p-4 text-white shadow-lg shadow-slate-950/25 sm:max-w-[250px] sm:min-w-[250px] dark:shadow-slate-50/25"
        >
          <img
            className="h-[82px] w-[82px] rounded-md object-cover sm:h-[32px] sm:w-[32px]"
            src={achievement.imgUrl ?? "/trophy.svg"}
            alt={text.imageAlt}
          />
          <div className="min-w-0 flex-1 break-words">
            <p className="text-lg dark:text-[#f8f8f8]">{text.unlocked}</p>
            <p className="font-semibold dark:text-[#f8f8f8]">{text.title}</p>
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
