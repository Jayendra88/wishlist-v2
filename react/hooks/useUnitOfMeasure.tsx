import { useProduct } from 'vtex.product-context'

const useUnitOfMeasure = () => {
  const productContextValue = useProduct()

  const uomFromProperties =
    productContextValue?.product?.properties.find(
      (property) => property.name === 'UOM'
    )?.values[0] ?? 'item'

  return uomFromProperties
}

export default useUnitOfMeasure
