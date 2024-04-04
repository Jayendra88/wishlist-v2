import { useProduct } from 'vtex.product-context'

const useBundleMinQuantity = (): number | undefined => {
  const productContextValue = useProduct()

  const productBundleMinQty = productContextValue?.product?.properties.find(
    (property) => property.name === 'UnitMultiplier'
  )?.values[0]

  const productBundleMinQtyNumber = productBundleMinQty
    ? Number(productBundleMinQty)
    : undefined

  return productBundleMinQtyNumber
}

export default useBundleMinQuantity
