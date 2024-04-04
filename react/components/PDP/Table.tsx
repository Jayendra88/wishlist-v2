import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'

import type { FixedPrice } from '../../typings/product'
import fixedPrices from '../../graphql/fixedPrices.graphql'
import styles from './Table.css'
import useLocaleCurrency from '../../hooks/useLocaleCurrency'

const Table: StorefrontFunctionComponent = () => {
  const productContextValue = useProduct()
  const currency = useLocaleCurrency()

  const { data, error } = useQuery(fixedPrices, {
    variables: {
      ids: [productContextValue?.selectedItem?.itemId],
    },
    ssr: false,
  })

  const [prices, setPrices] = useState<FixedPrice[]>([])

  useEffect(() => {
    setPrices(data?.fixedPrices[0].fixedPrices)
  }, [data?.fixedPrices])

  if (error) {
    console.error(error)

    return null
  }

  return (
    <div>
      <table className={styles['price-table']}>
        <tbody>
          <tr>
            {prices?.map((price) => {
              return <td key={`${price.minQuantity}$`}>{price.minQuantity}</td>
            })}
          </tr>
          <tr>
            {prices?.map((price) => (
              <td key={`${price.minQuantity}$1`}>
                {currency}
                {price.value.toFixed(2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Table
