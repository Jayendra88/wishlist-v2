import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'

import fixedPrices from '../../graphql/fixedPrices.graphql'
import useUnitOfMeasure from '../../hooks/useUnitOfMeasure'
import styles from '../../styles.css'
import AmountAddToCart from './AmountAddToCart'
import type { FixedPrice } from '../../typings/product'

const PriceSelector: StorefrontFunctionComponent = () => {
  const productContextValue = useProduct()
  const uom = useUnitOfMeasure()

  const [prices, setPrices] = useState<FixedPrice[]>([])
  const [quantityValue, setQuantityValue] = useState(1)
  const [currentPrice, setCurrentPrice] = useState(
    productContextValue?.product?.priceRange.sellingPrice.highPrice
  )

  const {
    data: pricesData,
    loading: pricesLoading,
    error: pricesError,
  } = useQuery(fixedPrices, {
    variables: {
      ids: [productContextValue?.selectedItem?.itemId],
    },
    ssr: false,
  })

  const unitMultiplierFromProperties =
    Number(
      productContextValue?.product?.properties.find(
        (property) => property.name === 'UnitMultiplier'
      )?.values[0]
    ) || 1

  useEffect(() => {
    setPrices(pricesData?.fixedPrices[0].fixedPrices)
  }, [pricesData?.fixedPrices])

  if (pricesLoading) {
    return null
  }

  if (pricesError) {
    console.error(pricesError)

    return null
  }

  const handlePriceChange = (price: FixedPrice) => {
    if (!prices?.length) return
    const priceToValue =
      (price?.minQuantity ?? 1) / unitMultiplierFromProperties

    setQuantityValue(priceToValue < 1 ? 1 : priceToValue)
    setCurrentPrice(price.value)
  }

  return (
    <div className={styles.priceSelector}>
      <div className={styles.priceSelectorContainer}>
        {prices?.map((price, index: number) => {
          return (
            <div
              role="button"
              tabIndex={index}
              onClick={() => {
                handlePriceChange(price)
              }}
              onKeyDown={() => {
                handlePriceChange(price)
              }}
              className={styles.priceSelectorInput}
              key={`price${index}`}
            >
              <div>{price.minQuantity}</div>
              <div>${price.value.toFixed(2)}</div>
            </div>
          )
        })}
      </div>
      <div className={styles.priceSelectorPrice}>
        ${currentPrice} /Price Per {uom}
      </div>
      <AmountAddToCart
        isLoading={pricesLoading}
        quantity={quantityValue}
        qtyPerBundle={unitMultiplierFromProperties ?? 1}
        skuId={productContextValue?.selectedItem?.itemId}
      />
    </div>
  )
}

export default PriceSelector
