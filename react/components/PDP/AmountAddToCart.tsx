import React, { useState, useEffect } from 'react'
import { NumericStepper, Button } from 'vtex.styleguide'
import { AddToCartButton } from 'vtex.add-to-cart-button'

import styles from './AmountAddToCart.css'
import useClassCode from '../../hooks/useClassCode'
import useBundleMinQuantity from '../../hooks/useBundleMinQuantity'

interface AmountAddToCartProps {
  ABCClassCode?: string
  qtyPerBundle?: any
  isLoading: boolean
  quantity?: number
  skuId?: string
  addToCartText?: string
  isSlimSize?: boolean
}

const AmountAddToCart: StorefrontFunctionComponent<AmountAddToCartProps> = ({
  ABCClassCode,
  qtyPerBundle,
  isLoading = true,
  quantity = 1,
  skuId,
  addToCartText = 'Add to cart',
  isSlimSize = false,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity ?? 1)
  const productSpecABC = useClassCode()
  const bundleMinQuantity = useBundleMinQuantity() ?? qtyPerBundle ?? 1

  const handleNumericStepperChange = (e: any) => {
    setCurrentQuantity(e.value)
  }

  useEffect(() => {
    setCurrentQuantity(quantity)
  }, [quantity])

  // in case getting product on a Grid
  const isButtonDisabled: boolean = ABCClassCode
    ? ABCClassCode === 'X'
    : productSpecABC === 'X'

  const currentItem = {
    seller: '1',
    quantity: currentQuantity * bundleMinQuantity,
    id: skuId,
  }

  // check if button is displayed on a admin grid, in order to display disabled buttons without an option to add to cart, which is not needed inside admin grid
  const isAdminGrid = window.location.href.includes('admin/app/grids')

  // check if we are on wishlist, layout is different
  const isWishlistPage = window.location.hash.includes('wishlist')

  return (
    <div
      className={
        isSlimSize
          ? styles.priceSelectorQuantityContainerSlim
          : isWishlistPage
          ? styles['priceSelectorQuantityContainer--wishlist']
          : styles.priceSelectorQuantityContainer
      }
    >
      {isAdminGrid ? (
        isButtonDisabled ? (
          <Button variation="tertiary" disabled>
            Not Available
          </Button>
        ) : (
          <Button variation="primary" disabled>
            Available
          </Button>
        )
      ) : (
        <>
          <div className={styles.priceSelectorStepper}>
            {isLoading ? (
              <div className={styles.priceSelectorQuantityLoading} />
            ) : (
              <NumericStepper
                value={currentQuantity}
                minValue={1}
                readOnly={isButtonDisabled}
                unitMultiplier={bundleMinQuantity}
                onChange={handleNumericStepperChange}
              />
            )}
          </div>
          <AddToCartButton
            skuItems={[currentItem as any]}
            isOneClickBuy={false}
            available={!isButtonDisabled}
            isLoading={isLoading}
            disabled={isLoading || isButtonDisabled}
            allSkuVariationsSelected
            onClickBehavior="add-to-cart"
            text={addToCartText}
            unavailableText="Not Available"
            multipleAvailableSKUs={false}
            showToast={() => {}}
            productLink={{
              linkText: addToCartText,
              productId: skuId,
            }}
            onClickEventPropagation="disabled"
          />
        </>
      )}
    </div>
  )
}

export default AmountAddToCart
