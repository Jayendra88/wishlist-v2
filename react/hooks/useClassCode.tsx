import { useProduct } from 'vtex.product-context'

const VALID_CODES = ['A', 'B', 'C', 'D', 'E', 'X'] as const
const DEFAULT_CODE = 'X'

type ClassCode = typeof VALID_CODES[number]

const useClassCode = (): ClassCode => {
  const productContextValue = useProduct()

  const productSpecABC = productContextValue?.product?.properties.find(
    (property) => property.name === 'ABCClassCode'
  )

  const ABCClassCode =
    productSpecABC?.values[0].toLocaleUpperCase() as ClassCode

  if (VALID_CODES.includes(ABCClassCode)) {
    return ABCClassCode
  }

  return DEFAULT_CODE as ClassCode
}

export default useClassCode
