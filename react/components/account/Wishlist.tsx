import React from 'react'

import styles from '../../styles.css'

const Wishlist = () => {
  return (
    <a className={styles['wishlist-link']} href="/account#/my-wishlists">
      <div className={styles['wishlist-text']}>Favourites</div>
    </a>
  )
}

export default Wishlist
