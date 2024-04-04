import React from 'react'
import { Icon } from 'vtex.store-icons'

import styles from './InventoryStatus.css'
import useClassCode from '../../hooks/useClassCode'

const InventoryStatus: StorefrontFunctionComponent = () => {
  const inventoryStatusCode = useClassCode()

  const inventoryCodeData = {
    A: {
      img: <Icon id="sti-instock" />,
      message: 'In Stock',
      class: 'in-stock',
    },
    B: {
      img: <Icon id="sti-instock" />,
      message: 'Limited Stock',
      class: 'in-stock',
    },
    C: {
      img: <Icon id="sti-available" />,
      message: 'Ships in 1-3 Days',
      class: 'available',
    },
    D: {
      img: <Icon id="sti-available" />,
      message: 'Ships in 4-10 Days',
      class: 'available',
    },
    E: {
      img: <Icon id="sti-limited" />,
      message: 'Contact Customer Service for Ship Date',
      class: 'limited',
    },
    X: {
      img: <Icon id="sti-unavailable" />,
      message: 'Unavailable',
      class: 'unavailable',
    },
  }

  return (
    <div>
      <div className={styles.inventoryStatusContainer}>
        {inventoryCodeData[inventoryStatusCode].img}
        <p
          className={`${styles.inventoryStatusText} ${
            styles[`${inventoryCodeData[inventoryStatusCode].class}`]
          }`}
        >
          {inventoryCodeData[inventoryStatusCode].message}
        </p>
      </div>
    </div>
  )
}

export default InventoryStatus
