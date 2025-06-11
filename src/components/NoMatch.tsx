import { useI18nContext } from "../i18n/i18n-react"

const NoMatch = () => {
  const { LL } = useI18nContext()
  return (
    <>
      <h3 className="border-secondary-border border-b-[1px] text-2xl">404</h3>
      <p className="pt-4 pb-8">{LL["This page doesn't exist"]()}</p>
    </>
  )
}

export default NoMatch
