import { toast } from "react-hot-toast";
import { Achievement } from "../achievements";

export const achievementToast = (achievement: Achievement) => {
  toast(
    (t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        className="flex min-w-[350px] max-w-[350px] animate-drawerSlideInRight cursor-pointer items-center gap-4 rounded-lg bg-secondary-blue p-4 shadow-lg dark:shadow-slate-50/25 sm:min-w-[150px] sm:max-w-[150px]"
      >
        <img
          className="h-[82px] w-[82px] rounded-md  object-cover sm:h-[32px] sm:w-[32px]"
          src="/trophy.svg"
          alt="" // TODO i18n
        />
        <div className="flex flex-col gap-1">
          {/* // TODO i18n */}
          <p className="text-lg  dark:text-[#f8f8f8]">Achievement unlocked</p>
          <p className="font-semibold dark:text-[#f8f8f8]">{achievement.title}</p>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "bottom-right",
      style: {
        border: "none",
        padding: 0,
        background: "transparent",
        boxShadow: "none",
        maxWidth: "unset",
      },
    }
  );
};
