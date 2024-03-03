import { toast } from "react-hot-toast";
import { Achievement } from "../achievements";
import { TranslationFunctions } from "../i18n/i18n-types";

export const achievementToast = (achievement: Achievement, LL: TranslationFunctions) => {
  toast(
    (t) => {
      // @ts-expect-error dynamic key generation
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const achievementTitle = LL[achievement.id]?.title();

      return (
        <div
          onClick={() => {
            toast.dismiss(t.id);
          }}
          className="flex min-w-[350px] max-w-[350px] animate-drawerSlideInRight cursor-pointer items-center gap-4 rounded-lg bg-primary-blue p-4 text-white shadow-lg  shadow-slate-950/25 dark:shadow-slate-50/25 sm:min-w-[150px] sm:max-w-[150px]"
        >
          <img
            className="h-[82px] w-[82px] rounded-md  object-cover sm:h-[32px] sm:w-[32px]"
            src={achievement.imgUrl ?? "/trophy.svg"}
            alt={achievement.imgAlt ?? LL["Prize trophy"]()}
          />
          <div className="flex flex-col gap-1">
            <p className="text-lg  dark:text-[#f8f8f8]">{LL["Achievement unlocked"]()}</p>
            <p className="font-semibold dark:text-[#f8f8f8]">{achievementTitle}</p>
          </div>
        </div>
      );
    },
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
