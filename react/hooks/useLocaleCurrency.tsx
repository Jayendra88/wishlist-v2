import { useRuntime } from 'vtex.render-runtime'

const useLocaleCurrency = () => {
  const runtime = useRuntime()

  return `${runtime.culture.customCurrencySymbol ?? '$'}`
}

export default useLocaleCurrency
