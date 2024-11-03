import { cn } from "../utils/cn";

interface Props {
  startText: string;
  endText: string;
  className?: string;
}
export const StartArrowEnd = ({ endText, startText, className }: Props) => {
  return (
    <p className={cn("flex items-center gap-2 text-lg font-bold", className)}>
      <span>{startText}</span> <RightArrow /> <span>{endText}</span>
    </p>
  );
};

const RightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5 translate-y-[2px]"
  >
    <path
      fillRule="evenodd"
      d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z"
      clipRule="evenodd"
    />
  </svg>
);
