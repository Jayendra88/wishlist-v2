import React from 'react'

import useLocaleCurrency from '../../hooks/useLocaleCurrency'
import useUnitOfMeasure from '../../hooks/useUnitOfMeasure'
import styles from '../../styles.css'

export default function Price() {
  const currency = useLocaleCurrency()
  const uom = useUnitOfMeasure()

  return (
    <p className={styles.pricePer}>
      Price Per {uom} ({currency})
    </p>
  )
}
