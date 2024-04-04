import React from 'react'
import { useProduct } from 'vtex.product-context'

const DetailsTabRenderer: StorefrontFunctionComponent = ({ children }) => {
  const productContextValue = useProduct()

  const childrenComp = children

  return (
    <>
      {!!productContextValue?.product?.description &&
      productContextValue?.product?.description.length > 0 ? (
        <>{childrenComp}</>
      ) : null}
    </>
  )
}

export default DetailsTabRenderer
