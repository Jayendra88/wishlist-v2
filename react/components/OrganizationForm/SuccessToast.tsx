import React from 'react'
import { Icon } from 'vtex.store-icons'

import styles from '../../styles.css'

export default function SuccessToast() {
  return (
    <div className={styles['success-container']}>
      <div className={styles['success-header']}>
        <div className={styles['success-header__image']}>
          <Icon id="sti-instock" />
        </div>
        <h3 className={styles['success-header__title']}>Success!</h3>
      </div>
      <div className={styles['success-container__message']}>
        You have been successfully added to the organization. You will be able
        to add items to the cart and complete orders on checkout. You are
        required to log in again to access the organization account.
      </div>
    </div>
  )
}
