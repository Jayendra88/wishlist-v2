import React from 'react'

import useUnitOfMeasure from '../../hooks/useUnitOfMeasure'
import styles from '../../styles.css'

export default function Price() {
  const uom = useUnitOfMeasure()

  return <p className={styles.pricePer}>/{uom}</p>
}
