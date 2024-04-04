import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

import MobileCard from './MobileCard'
import styles from './MobileCardList.css'

interface ProductListProps {
  productData: any
  orderFormId?: any
}

const ProductList: StorefrontFunctionComponent<ProductListProps> = ({
  productData,
  orderFormId,
}) => {
  //! AmountAddToCart setup, need to get orderFordId to pass to AmountAddToCart
  const [orderFormIdLocal, setId] = useState(orderFormId)

  const configOrderForm = {
    url: `/api/checkout/pub/orderForm/`,
  }

  const getOrderForm = async (): Promise<any> => {
    const { data } = await axios.request(configOrderForm)

    return data
  }

  const mounted: any = useRef()

  useEffect(() => {
    if (mounted.current) {
      return
    }

    getOrderForm().then((res) => {
      setId(res.orderFormId)
    })
    mounted.current = true
  })
  //! End AmountAddToCart setup

  return (
    <ul className={styles['mobile-list-view']}>
      {productData.map((product: any, index: number) => (
        <MobileCard
          orderFormId={orderFormIdLocal}
          singleCard={product}
          key={index}
        />
      ))}
    </ul>
  )
}

export default ProductList
