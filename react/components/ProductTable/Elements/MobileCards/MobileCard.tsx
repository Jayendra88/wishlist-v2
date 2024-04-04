import React, { useState } from 'react'

import AmountAddToCart from '../../../PDP/AmountAddToCart'
import styles from './MobileCard.css'
import useLocaleCurrency from '../../../../hooks/useLocaleCurrency'

interface SingleProductProps {
  singleCard: any // every object is flattened, so comes different for different products
  orderFormId: any
}

const SingleProductCard: StorefrontFunctionComponent<SingleProductProps> = ({
  singleCard,
}) => {
  const [isActive, setActive] = useState(false)

  const handleToggle = () => {
    setActive(!isActive)
  }

  const currency = useLocaleCurrency()
  const unitOfMeasure = singleCard.UOM ?? 'Item'

  const removeDuplicateWords = (str: string): string => {
    const words: string[] = str.split(' ')
    const uniqueWords: Set<string> = new Set(words)
    const name: string = [...uniqueWords].join(' ')

    return name
  }

  const productName = removeDuplicateWords(singleCard.name)

  return (
    <li className={styles['product-card']}>
      <div className={styles['description-add-to-cart']}>
        <a href={singleCard.link}>
          <img src={singleCard.image} alt={productName} />
        </a>
        <div className={styles['product-card__text-add-to-cart']}>
          <h5>
            <a href={singleCard.link}>{productName}</a>
          </h5>
          <div className={styles['add-to-cart-wrapper']}>
            <a href={singleCard.link}> Part# {singleCard.reference}</a>
            <AmountAddToCart
              ABCClassCode={singleCard.ABCClassCode}
              isLoading={false}
              skuId={singleCard.productId}
              addToCartText="Add"
              qtyPerBundle={singleCard.unitMultiplier}
              isSlimSize
            />
          </div>
        </div>
      </div>
      <div className={styles['price-table']}>
        <button onClick={handleToggle} aria-label="Show\Hide Price Table">
          Price per {unitOfMeasure} {currency} ▾
        </button>
        <table className={isActive ? '' : styles.hidden}>
          <thead>
            <tr>
              {singleCard.fixedPricing.map((price: any, index: number) => (
                <th key={index}>{price.minQuantity}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {singleCard.fixedPricing.map((price: any, index: number) => (
                <td key={index}>{price.value.toFixed(2)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </li>
  )
}

export default SingleProductCard
