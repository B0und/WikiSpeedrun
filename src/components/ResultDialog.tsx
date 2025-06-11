import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"

import {
  useCheatingAttempts,
  useClicks,
  useEndingArticle,
  useHistory,
  useIsWin,
  useStartingArticle,
} from "../stores/GameStore"

import { StopwatchDisplay } from "./StopwatchDisplay"
import { useResetGame } from "../hooks/useResetGame"
import { useI18nContext } from "../i18n/i18n-react"
import { toast } from "react-hot-toast"
import { ModalContent, ModalDescription, ModalRoot, ModalTitle, ModalTrigger } from "./Modal"
import { StartArrowEnd } from "./StartArrowEnd"

import * as Portal from "@radix-ui/react-portal"
import { VictoryConfetti } from "./VictoryConfetti"

export const ResultDialog = () => {
  const { LL } = useI18nContext()
  const [open, setOpen] = useState(false)
  const resetGame = useResetGame()

  const startingArticle = useStartingArticle()
  const endingArticle = useEndingArticle()
  const history = useHistory()
  const lastArticle = history.length > 0 ? history.slice(-1)[0] : undefined
  const clicks = useClicks()
  const isWin = useIsWin()
  const cheatingAttempts = useCheatingAttempts()
  const missedWins = history.slice(0, -2).reduce((acc, el) => acc + el.winningLinks, 0)

  const copyNotification = () =>
    toast.success(LL["Copied to clipboard"](), { position: "top-center" })

  useEffect(() => {
    setOpen(isWin)
  }, [isWin])

  const resultStats = [
    { name: LL["Article clicks"](), value: clicks },
    { name: LL["Cheating attempts"](), value: cheatingAttempts },
    { name: LL["Missed wins"](), value: missedWins },
  ]

  return (
    <>
      <ModalRoot open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          {isWin && <button className="p-4 hover:text-primary-blue sm:p-2">{LL.Results()}</button>}
        </ModalTrigger>
        <ModalContent>
          <>
            <ModalTitle className="m-0 border-b-[1px] border-b-secondary-border font-medium text-lg">
              {LL.Results()}
            </ModalTitle>
            <ModalDescription asChild>
              <StartArrowEnd
                className="mt-[10px] mb-5"
                startText={startingArticle.title}
                endText={endingArticle.title}
              />
            </ModalDescription>
            <table className="mb-5 w-full table-auto">
              <tbody>
                {resultStats.map((stat) => (
                  <tr
                    key={stat.name}
                    className="even:bg-gray-200 dark:even:bg-dark-surface-secondary"
                  >
                    <td className="py-2 pr-4">{stat.name}</td>
                    <td className="py-2 pr-4">{stat.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex-1 border-t-[1px] border-b-secondary-border pt-2 text-right">
              <StopwatchDisplay
                min={lastArticle?.time.min ?? ""}
                sec={lastArticle?.time.sec ?? ""}
                ms={lastArticle?.time.ms ?? ""}
              />
            </div>
            <div className="mt-9 flex flex-wrap justify-end gap-8">
              <button
                className="border-b-[1px] border-b-transparent hover:border-b-primary-blue focus-visible:border-b-primary-blue"
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href)
                  copyNotification()
                }}
              >
                {LL["Share Result"]()}
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-sm bg-secondary-blue px-5 py-3 hover:bg-primary-blue focus-visible:bg-primary-blue"
                >
                  {LL["Play again"]()}
                </button>
              </Dialog.Close>
            </div>
          </>
        </ModalContent>
      </ModalRoot>
      {open && (
        <Portal.Root className="pointer-events-none fixed top-0 left-0 z-50 grid h-full w-full place-items-center">
          <VictoryConfetti />
        </Portal.Root>
      )}
    </>
  )
}
