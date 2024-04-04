import React from 'react'

import styles from './SkeletonLoader.css'

interface SkeletonProps {
  height?: number
}

const Skeleton: StorefrontFunctionComponent<SkeletonProps> = ({ height }) => {
  return (
    <div
      className={styles['container-loader']}
      aria-label="component loading"
      style={{ height: `${height ?? 300}px` }}
    />
  )
}

export default Skeleton
